angular
.module('starter')
.controller(
		'manageBranchController', 
		manageBranchController
		);

manageBranchController.$inject = [
                                  'API_BASE_URL', 
                                  'BRANCHES_DB_FIELDS', 
                                  'BROADCAST_MESSAGES', 
                                  'KEYS', 
                                  '$compile', 
                                  '$rootScope', 
                                  '$scope', 
                                  '$stateParams', 
                                  '$uibModal', 
                                  'DTColumnBuilder', 
                                  'DTOptionsBuilder', 
                                  'datatableService'
                                  ];

function manageBranchController(
		API_BASE_URL, 
		BRANCHES_DB_FIELDS, 
		BROADCAST_MESSAGES, 
		KEYS, 
		$compile, 
		$rootScope, 
		$scope, 
		$stateParams, 
		$uibModal, 
		DTColumnBuilder, 
		DTOptionsBuilder, 
		datatableService
		){
	const DOM_BRANCH_TABLE = '#branch_table';
	
	var vm = this;
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user= JSON.parse(vm.user);
		}
	if(!(null == $stateParams['companyName'])){	vm.companyName = $stateParams['companyName'];
	} else {
		if(!(null == vm.user)){		vm.companyName = vm.user.company_name;
		}
		}
	vm.branch = {};
	vm.controllerObjName = 'manageBranchController';
	vm.dtInstance = dtInstanceCallback;
	vm.dtHiddenColumns = {};
	vm.dbColumnFields = BRANCHES_DB_FIELDS;
	vm.dbColumn2Colheader = {
			branch_id: 'Id', 
			branch_name: 'Name', 
			company_name: 'Company name', 
			branch_address_house_building: 'Address - house/building', 
			branch_address_street: 'Address - street', 
			branch_address_district: 'Address - district', 
			branch_address_city: 'Address - city', 
			branch_address_postalcode: 'Address - postalcode', 
			branch_address_country: 'Address - country', 
			branch_hotline: 'Hotline', 
			branch_last_change_timestamp: 'Last change timestamp'
				};
	vm.dbColumn2Dom = {
			branch_id: 'branchId', 
			branch_name: 'branchName', 
			company_name: 'companyName', 
			branch_address_house_building: 'branchAddressHouseBuilding', 
			branch_address_street: 'branchAddressStreet', 
			branch_address_district: 'branchAddressDistrict', 
			branch_address_city: 'branchAddressCity', 
			branch_address_postalcode: 'branchAddressPostalcode', 
			branch_address_country: 'branchAddressCountry', 
			branch_hotline: 'branchHotline'
				};
	vm.restApiSource = API_BASE_URL + '/companies/' + vm.companyName + '/branches';
	
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
		
		if(-1 == eClassname.indexOf('selected')){
			vm.branch = data;
			
			if(isRecHighlighted){	return;
			}
			
			$rootScope.$broadcast(
					BROADCAST_MESSAGES.toggleTable, 
					{
						companyName: vm.companyName, 
						branchName: vm.branch.branch_name
						}
					);
			} else {
				vm.branch= {};
				
				$rootScope.$broadcast(
						BROADCAST_MESSAGES.toggleTable, 
						{
							companyName: vm.companyName, 
							branchName: vm.branch.branch_name
							}
						);
				}
		}
	
	function addBranch(){
		var formMode = 'I';
		var fromSignup = false;
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-branches/modalBranch.html', 
					controller: 'modalBranchController as modalBranchController', 
					resolve: {
						branch: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return formMode;
						}, 
						fromSignup: function(){	return fromSignup;
						}, 
						modalHiddenFields: function(){	return genModalHiddenFields(formMode);
						}
						}
				}
				)
				.closed.then(uibModalClosedCallback);
		}
	
	function updateBranch(){
		var formMode = 'A';
		var fromSignup = false;
		
		if(0 == Object.keys(vm.branch).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-branches/modalBranch.html', 
					controller: 'modalBranchController as modalBranchController', 
					resolve: {
						branch: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return formMode;
						}, 
						fromSignup: function(){	return fromSignup;
						}, 
						modalHiddenFields: function(){	return genModalHiddenFields(formMode);
						}
						}
				}
				)
				.closed.then(uibModalClosedCallback);
		}
	
	function deleteBranch(){
		var formMode = 'D';
		var fromSignup = false;
		
		if(0 == Object.keys(vm.branch).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-branches/modalBranch.html', 
					controller: 'modalBranchController as modalBranchController', 
					resolve: {
						branch: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return formMode;
						}, 
						fromSignup: function(){	return fromSignup;
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
					} else {	data[dataKey] = vm.branch[dbColumn2ColheaderKey];
					}
					
					data['companyName'] = vm.companyName;
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
		vm.branch = {};
		
		if(0 == $('.dataTable tr.selected').length){	return;
		}
		
		$rootScope.$broadcast(
				BROADCAST_MESSAGES.toggleTable, 
				{
					companyName: vm.companyName, 
					branchName: vm.branch.branch_name
					}
				);
		}
	
	function genDtHiddenColumns(){
		var tableDt = $(DOM_BRANCH_TABLE).dataTable();
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
				BROADCAST_MESSAGES.addBranch, 
				BROADCAST_MESSAGES.updateBranch, 
				BROADCAST_MESSAGES.deleteBranch
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
			var branchTableDom = $(DOM_BRANCH_TABLE).DataTable();
			
			Object.keys(vm.dtHiddenColumns).forEach(
					function(dtHiddenColumnsKey){	branchTableDom.column(vm.dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
					}
					);
			}
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.addBranch, 
			addBranch
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.updateBranch, 
			updateBranch
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.deleteBranch, 
			deleteBranch
			);
	}