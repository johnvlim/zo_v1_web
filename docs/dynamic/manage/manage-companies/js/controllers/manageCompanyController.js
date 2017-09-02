angular
.module('starter')
.controller(
		'manageCompanyController', 
		manageCompanyController
		);

manageCompanyController.$inject = [
                                   'API_BASE_URL', 
                                   'BROADCAST_MESSAGES', 
                                   'COMPANIES_DB_FIELDS', 
                                   'KEYS', 
                                   '$compile', 
                                   '$localStorage', 
                                   '$rootScope', 
                                   '$scope', 
                                   '$uibModal', 
                                   'DTColumnBuilder', 
                                   'DTOptionsBuilder', 
                                   'datatableService'
                                   ];

function manageCompanyController(
		API_BASE_URL, 
		BROADCAST_MESSAGES, 
		COMPANIES_DB_FIELDS, 
		KEYS, 
		$compile, 
		$localStorage, 
		$rootScope, 
		$scope, 
		$uibModal, 
		DTColumnBuilder, 
		DTOptionsBuilder, 
		datatableService
		){
	const DOM_COMPANY_TABLE = '#company_table';
	
	var vm = this;
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user= JSON.parse(vm.user);
		}
	vm.company = {};
	vm.controllerObjName = 'manageCompanyController';
	vm.dtInstance = dtInstanceCallback;
	vm.dtHiddenColumns = {};
	vm.dbColumnFields = COMPANIES_DB_FIELDS;
	vm.dbColumn2Colheader = {
			company_name: 'Name', 
			company_desc: 'Description', 
			company_category: 'Category', 
			company_logo: 'Logo', 
			company_last_change_timestamp: 'Last change timestamp'
				};
	vm.dbColumn2Dom = {
			company_name: 'companyName', 
			company_desc: 'companyDesc', 
			company_category: 'companyCategory', 
			company_logo: 'companyLogo'
				};
	if(!(null == vm.user.username)){	vm.restApiSource = API_BASE_URL + '/companies/customers/' + vm.user.username;
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
		
		var eSrc =$event.currentTarget.parentElement.parentElement;
		var eClassname = eSrc.className;
		var isRecHighlighted = datatableService.isRecHighlighted(
				$(DOM_ROWS), 
				eSrc._DT_RowIndex
				);
		
		$(DOM_TD_SELECT_CHECKBOX_CLASS).get(eSrc._DT_RowIndex).click();
		$event.stopPropagation();
		
		if(-1 == eClassname.indexOf('selected')){
			vm.company = data;
			
			if(isRecHighlighted){	return;
			}
			
			$rootScope.$broadcast(
					BROADCAST_MESSAGES.toggleBranch, 
					{	companyName: vm.company.company_name	}
					);
			$rootScope.$broadcast(
					BROADCAST_MESSAGES.toggleMenu, 
					{	companyName: vm.company.company_name	}
					);
			} else {
				vm.company = {};
				
				$rootScope.$broadcast(
						BROADCAST_MESSAGES.toggleBranch, 
						{	companyName: vm.company.company_name	}
						);
				$rootScope.$broadcast(
						BROADCAST_MESSAGES.toggleMenu, 
						{	companyName: vm.company.company_name	}
						);
				}
		}
	
	function addCompany(){
		var formMode = 'I';
		var fromSignup = false;
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-companies/modalCompany.html', 
					controller: 'modalCompanyController as modalCompanyController', 
					resolve: {
						company: function(){	return doDbColumn2Dom(formMode);
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
	
	function updateCompany(){
		var formMode = 'A';
		var fromSignup = false;
		
		if(0 == Object.keys(vm.company).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-companies/modalCompany.html', 
					controller: 'modalCompanyController as modalCompanyController', 
					resolve: {
						company: function(){	return doDbColumn2Dom(formMode);
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
	
	function deleteCompany(){
		var formMode = 'D';
		var fromSignup = false;
		
		if(0 == Object.keys(vm.company).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-companies/modalCompany.html', 
					controller: 'modalCompanyController as modalCompanyController', 
					resolve: {
						company: function(){	return doDbColumn2Dom(formMode);
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
					} else {	data[dataKey] = vm.company[dbColumn2ColheaderKey];
					}
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
		var formMode = vm.formMode;
		
		vm.dtInstance.reloadData();
		vm.company = {};
		
		if(0 == $('.dataTable tr.selected').length){	return;
		}
		
		$rootScope.$broadcast(
				BROADCAST_MESSAGES.toggleBranch, 
				{	companyName: vm.company.company_name	}
				);
		$rootScope.$broadcast(
				BROADCAST_MESSAGES.toggleMenu, 
				{	companyName: vm.company.company_name	}
				);
		}
	
	function genDtHiddenColumns(){
		var tableDt = $(DOM_COMPANY_TABLE).dataTable();
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
				BROADCAST_MESSAGES.addCompany, 
				BROADCAST_MESSAGES.updateCompany, 
				BROADCAST_MESSAGES.deleteCompany
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
			var companyTableDom = $(DOM_COMPANY_TABLE).DataTable();
			
			Object.keys(vm.dtHiddenColumns).forEach(
					function(dtHiddenColumnsKey){	companyTableDom.column(vm.dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
					}
					);
			}
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.addCompany, 
			addCompany
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.updateCompany, 
			updateCompany
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.deleteCompany, 
			deleteCompany
			);
	}