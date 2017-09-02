angular
.module('starter')
.controller(
		'manageOrderController', 
		manageOrderController
		);

manageOrderController.$inject = [
                                 'API_BASE_URL', 
                                 'BROADCAST_MESSAGES', 
                                 'KEYS', 
                                 'ORDERS_DB_FIELDS', 
                                 '$compile', 
                                 '$scope', 
                                 '$stateParams', 
                                 '$uibModal', 
                                 'DTOptionsBuilder', 
                                 'DTColumnBuilder', 
                                 'datatableService'
                                 ];

function manageOrderController(
		API_BASE_URL, 
		BROADCAST_MESSAGES, 
		KEYS, 
		ORDERS_DB_FIELDS, 
		$compile, 
		$scope, 
		$stateParams, 
		$uibModal, 
		DTOptionsBuilder, 
		DTColumnBuilder, 
		datatableService
		){
	const DOM_ORDER_TABLE = '#order_table';
	
	var vm = this;
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user= JSON.parse(vm.user);
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
	vm.order = {};
	vm.controllerObjName = 'manageOrderController';
	vm.dtInstance = dtInstanceCallback;
	vm.dtHiddenColumns = {};
	vm.dbColumnFields = ORDERS_DB_FIELDS;
	vm.dbColumn2Colheader = {
			order_id: 'Id', 
			menuitem_id: 'Menuitem id', 
			orderreference_code: 'Orderreference code', 
			order_status: 'Status', 
			order_status_change_timestamp: 'Status change timestamp', 
			order_last_change_timestamp: 'Last change timestamp'
				};
	vm.dbColumn2Dom = {
			order_id: 'orderId', 
			menuitem_id: 'menuitemId', 
			orderreference_code: 'orderreferenceCode', 
			order_status: 'orderStatus'
				};
	if(
			!(null == vm.tableNumber) &&
			!(null == vm.orderreferenceCode)
			){	vm.restApiSource = API_BASE_URL + '/companies/' + vm.companyName + '/branches/' + vm.branchName + '/tables/' + vm.tableNumber + '/orderreferences/' + vm.orderreferenceCode + '/orders';
			} else {	vm.restApiSource = API_BASE_URL + '/companies/' + vm.companyName + '/branches/' + vm.branchName + '/orders';
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
		
		if(-1 == eClassname.indexOf('selected')){	vm.order = data;
		} else {	vm.order= {};
		}
		}
	
	function addOrder(){
		var formMode = 'I';
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-orders/modalOrder.html', 
					controller: 'modalOrderController as modalOrderController', 
					resolve: {
						order: function(){	return doDbColumn2Dom(formMode);
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
	
	function updateOrder(){
		var formMode = 'A';
		
		if(0 == Object.keys(vm.order).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-orders/modalOrder.html', 
					controller: 'modalOrderController as modalOrderController', 
					resolve: {
						order: function(){	return doDbColumn2Dom(formMode);
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
	
	function deleteOrder(){
		var formMode = 'D';
		
		if(0 == Object.keys(vm.order).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-orders/modalOrder.html', 
					controller: 'modalOrderController as modalOrderController', 
					resolve: {
						order: function(){	return doDbColumn2Dom(formMode);
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
					} else {	data[dataKey] = vm.order[dbColumn2ColheaderKey];
					}
					
					data['companyName'] = vm.companyName;
					data['branchName'] = vm.branchName;
					data['tableNumber'] = vm.tableNumber;
					data['orderreferenceCode'] = vm.orderreferenceCode;
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
		vm.order = {};
		}
	
	function genDtHiddenColumns(){
		var tableDt = $(DOM_ORDER_TABLE).dataTable();
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
				BROADCAST_MESSAGES.addOrder, 
				BROADCAST_MESSAGES.updateOrder, 
				BROADCAST_MESSAGES.deleteOrder
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
			var orderTableDom = $(DOM_ORDER_TABLE).DataTable();
			
			Object.keys(vm.dtHiddenColumns).forEach(
					function(dtHiddenColumnsKey){	orderTableDom.column(vm.dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
					}
					);
			}
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.addOrder, 
			addOrder
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.updateOrder, 
			updateOrder
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.deleteOrder, 
			deleteOrder
			);
	}