angular
.module('starter')
.controller(
		'manageReservationController', 
		manageReservationController
		);

manageReservationController.$inject = [
                                       'API_BASE_URL', 
                                       'BROADCAST_MESSAGES', 
                                       'KEYS', 
                                       'RESERVATIONS_DB_FIELDS', 
                                       '$compile', 
                                       '$scope', 
                                       '$stateParams', 
                                       '$uibModal', 
                                       'DTOptionsBuilder', 
                                       'DTColumnBuilder', 
                                       'datatableService'
                                       ];

function manageReservationController(
		API_BASE_URL, 
		BROADCAST_MESSAGES, 
		KEYS, 
		RESERVATIONS_DB_FIELDS, 
		$compile, 
		$scope, 
		$stateParams, 
		$uibModal, 
		DTOptionsBuilder, 
		DTColumnBuilder, 
		datatableService
		){
	const DOM_RESERVATION_TABLE = '#reservation_table';
	
	var vm = this;
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user = JSON.parse(vm.user);
		}
	if(
			!(null == $stateParams['companyName']) &&
			!(null == $stateParams['branchName']) &&
			!(null == $stateParams['tableNumber']) &&
			!(null == $stateParams['orderreferenceCode'])
			){
		vm.companyName = $stateParams['companyName'];
		vm.branchName = $stateParams['branchName'];
		vm.tableNumber = $stateParams['tableNumber'];
		vm.orderreferenceCode = $stateParams['orderreferenceCode'];
		} else {
			if(!(null == vm.user)){
				vm.companyName = vm.user.company_name;
				vm.branchName = vm.user.branch_name;
				}
			}
	vm.reservation = {};
	vm.controllerObjName = 'manageReservationController';
	vm.dtInstance = dtInstanceCallback;
	vm.dtHiddenColumns = {};
	vm.dbColumnFields = RESERVATIONS_DB_FIELDS;
	vm.dbColumn2Colheader = {
			reservation_id: 'Id', 
			reservation_code: 'Code', 
			customer_username: 'Customer username', 
			orderreference_code: 'Orderreference code', 
			reservation_diners_count: 'Diners count', 
			reservation_eta: 'Eta', 
			reservation_payment_mode: 'Payment mode', 
			reservation_service_time: 'Service time', 
			reservation_status: 'Status', 
			reservation_status_change_timestamp: 'Status change timestamp', 
			reservation_last_change_timestamp: 'Last change timestamp'
				};
	vm.dbColumn2Dom = {
			reservation_id: 'reservationId', 
			reservation_code: 'reservationCode', 
			customer_username: 'customerUsername', 
			orderreference_code: 'orderreferenceCode', 
			reservation_diners_count: 'reservationDinersCount', 
			reservation_eta: 'reservationEta', 
			reservation_payment_mode: 'reservationPaymentMode', 
			reservation_service_time: 'reservationServiceTime', 
			reservation_status: 'reservationStatus'
				};
	if(
			!(null == vm.tableNumber) &&
			!(null == vm.orderreferenceCode)
			){	vm.restApiSource = API_BASE_URL + '/companies/' + vm.companyName + '/branches/' + vm.branchName + '/tables/' + vm.tableNumber + '/orderreferences/' + vm.orderreferenceCode + '/reservations';
			} else {	vm.restApiSource = API_BASE_URL + '/companies/' + vm.companyName + '/branches/' + vm.branchName + '/reservations';
			}
	
	function dtInstanceCallback(dtInstance){	vm.dtInstance = dtInstance;
	}
	
	//controller_method
	vm.dtAssignOnSelect = dtAssignOnSelect;
	
	function dtAssignOnSelect(
			data, 
			$event
			){
		const DOM_TD_SELECT_CHECKBOX_CLASS = 'td.select-checkbox';
		const DOM_ROWS = 'table.dataTable tbody tr';
		
		var eSrc = $event.currentTarget.parentElement.parentElement;
		var eClassname = eSrc.className;
		var isRecHighlighted = datatableService.isRecHighlighted(
				$(DOM_ROWS), 
				eSrc._DT_RowIndex
				);
		
		$(DOM_TD_SELECT_CHECKBOX_CLASS).get(eSrc._DT_RowIndex).click();
		$event.stopPropagation();
		
		if(-1 == eClassname.indexOf('selected')){	vm.reservation = data;
		} else {	vm.reservation = {};
		}
		}
	
	function addReservation(){
		var formMode = 'I';
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-reservations/modalReservation.html', 
					controller: 'modalReservationController as modalReservationController', 
					resolve: {
						reservation: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return formMode;
						}, 
						modalHiddenFields: function(){	return genModalHiddenFields(formMode);
						}
						}
				}
				)
				.closed.then(uibModalClosedCallback);
		}
	
	function updateReservation(){
		var formMode = 'A';
		
		if(0 == Object.keys(vm.reservation).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-reservations/modalReservation.html', 
					controller: 'modalReservationController as modalReservationController', 
					resolve: {
						reservation: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return formMode;
						}, 
						modalHiddenFields: function(){	return genModalHiddenFields(formMode);
						}
						}
				}
				)
				.closed.then(uibModalClosedCallback);
		}
	
	function deleteReservation(){
		var formMode = 'D';
		
		if(0 == Object.keys(vm.reservation).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-reservations/modalReservation.html', 
					controller: 'modalReservationController as modalReservationController', 
					resolve: {
						reservation: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return formMode;
						}, 
						modalHiddenFields: function(){	return genModalHiddenFields(formMode);
						}
						}
				}
				)
				.closed.then(uibModalClosedCallback);
		}
	
	function doDbColumn2Dom(formMode){
		var data = {};
		
		Object.keys(vm.dbColumn2Colheader).forEach(
				function(dbColumn2ColheaderKey){
					var dataKey = vm.dbColumn2Dom[dbColumn2ColheaderKey];
					
					if('I' == formMode){	data[dataKey] = undefined;
					} else {	data[dataKey] = vm.reservation[dbColumn2ColheaderKey];
					}
					
					data['companyName'] = vm.companyName;
					data['branchName'] = vm.branchName;
					data['tableNumber'] = vm.tableNumber;
					data['orderreferenceCode'] = vm.orderreferencceCode;
				}
				);
		
		return data;
		}
	
	function genModalHiddenFields(formMode){
		var modalHiddenFields = {};
		
		genDtHiddenColumns();
		
		if('I' == formMode){	return null;
		}
		
		Object.keys(vm.dtHiddenColumns).forEach(
				function(dtHiddenColumnsKey){	modalHiddenFields[vm.dbColumn2Dom[dtHiddenColumnsKey]] = true;
				}
				);
		
		return modalHiddenFields;
		}
	
	function uibModalClosedCallback(){
		vm.dtInstance.reloadData();
		vm.reservation = {};
		}
	
	function genDtHiddenColumns(){
		var tableDt = $(DOM_RESERVATION_TABLE).dataTable();
		vm.dtHiddenColumns = {};
		
		$.each(
				tableDt.fnSettings().aoColumns, 
				function(aoColumn){
					var aoColumnsRunner = tableDt.fnSettings().aoColumns[aoColumn];
					var aoColumnsRunnerMdata = aoColumnsRunner.mData;
					
					if(!(null == aoColumnsRunnerMdata)){
						if(false == aoColumnsRunner.bVisible){	vm.dtHiddenColumns[aoColumnsRunnerMdata] = true;
						}
						}
					}
				);
		}
	
	dtInitialize();
	
	function dtInitialize(){
		datatableService.setDbColumnFields(vm.dbColumnFields);
		datatableService.setDbColumn2Colheader(vm.dbColumn2Colheader);
		datatableService.doDTInitOptions(
				DTOptionsBuilder, 
				vm.restApiSource, 
				BROADCAST_MESSAGES.addReservation, 
				BROADCAST_MESSAGES.updateReservation, 
				BROADCAST_MESSAGES.deleteReservation
				);
		datatableService.doDTInitColumns(
				DTColumnBuilder, 
				vm
				);
		
		vm.dtOptions = datatableService.getDtOptions();
		vm.dtColumns = datatableService.getDtColumns();
		vm.dtOptions
		.withOption(
				'createdRow', 
				createdRowCallback
				)
				.withOption(
						'initComplete', 
						initCompleteCallback
						);
		
		function createdRowCallback(row){	$compile(angular.element(row).contents())($scope);
		}
		
		function initCompleteCallback(row){
			var reservationTableDom = $(DOM_RESERVATION_TABLE).DataTable();
			
			Object.keys(vm.dtHiddenColumns).forEach(
					function(dtHiddenColumnsKey){	reservationTableDom(vm.dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
					}
					);
			}
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.addReservation, 
			addReservation
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.updateReservation, 
			updateReservation
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.deleteReservation, 
			deleteReservation
			);
	}