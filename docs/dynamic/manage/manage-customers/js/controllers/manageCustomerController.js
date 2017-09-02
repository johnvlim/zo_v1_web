angular
.module('starter')
.controller(
		'manageCustomerController', 
		manageCustomerController
		);

manageCustomerController.$inject = [
                                    'API_BASE_URL', 
                                    'BROADCAST_MESSAGES', 
                                    'CUSTOMERS_DB_FIELDS', 
                                    'KEYS', 
                                    '$compile', 
                                    '$localStorage', 
                                    '$scope', 
                                    '$uibModal', 
                                    'DTColumnBuilder', 
                                    'DTOptionsBuilder', 
                                    'datatableService'
                                    ];

function manageCustomerController(
		API_BASE_URL, 
		BROADCAST_MESSAGES, 
		CUSTOMERS_DB_FIELDS, 
		KEYS, 
		$compile, 
		$localStorage, 
		$scope, 
		$uibModal, 
		DTColumnBuilder, 
		DTOptionsBuilder, 
		datatableService
		){
	const DOM_CUSTOMER_TABLE = '#customer_table';
	
	var vm = this;
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user= JSON.parse(vm.user);
		}
	vm.customer = {};
	vm.controllerObjName = 'manageCustomerController';
	vm.dtInstance = dtInstanceCallback;
	vm.dtHiddenColumns = {};
	vm.dbColumnFields = CUSTOMERS_DB_FIELDS;
	vm.dbColumn2Colheader = {
			customer_username: 'Username', 
			customer_password: 'Password', 
			customer_name_fname: 'First name', 
			customer_name_mname: 'Middle name', 
			customer_name_lname: 'Last name', 
			customer_role: 'Role', 
			customer_gender: 'Gender', 
			customer_address_house_building: 'Address - house/building', 
			customer_address_street: 'Address - street', 
			customer_address_district: 'Address - district', 
			customer_address_city: 'Address - city', 
			customer_address_postalcode: 'Address - postalcode', 
			customer_address_country: 'Address - country', 
			customer_mobile: 'Mobile', 
			customer_email: 'Email', 
			customer_birthday_month: 'Birthday - month', 
			customer_birthday_date: 'Birthday - date', 
			customer_birthday_year: 'Birthday - year', 
			customer_last_change_timestamp: 'Last change timestamp'
				};
	vm.dbColumn2Dom = {
			customer_username: 'customerUsername', 
			customer_password: 'customerPassword', 
			customer_name_fname: 'customerNameFname', 
			customer_name_mname: 'customerNameMname', 
			customer_name_lname: 'customerNameLname', 
			customer_role: 'customerRole', 
			customer_gender: 'customerGender', 
			customer_address_house_building: 'customerAddressHouseBuilding', 
			customer_address_street: 'customerAddressStreet', 
			customer_address_district: 'customerAddressDistrict', 
			customer_address_city: 'customerAddressCity', 
			customer_address_postalcode: 'customerAddressPostalcode', 
			customer_address_country: 'customerAddressCountry', 
			customer_mobile: 'customerMobile', 
			customer_email: 'customerEmail', 
			customer_birthday_month: 'customerBirthdayMonth', 
			customer_birthday_date: 'customerBirthdayDate', 
			customer_birthday_year: 'customerBirthdayYear'
				};
	if(!(null == vm.user.company_name)){	vm.restApiSource = API_BASE_URL + '/customers/companies/' + vm.user.company_name;
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
		
		if(-1 == eClassname.indexOf('selected')){	vm.customer = data;
		} else {	vm.customer= {};
		}
		}
	
	function addCustomer(){
		var formMode = 'I';
		var fromSignup = false;
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-customers/modalCustomer.html', 
					controller: 'modalCustomerController as modalCustomerController', 
					resolve: {
						customer: function(){	return doDbColumn2Dom(formMode);
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
	
	function updateCustomer(){
		var formMode = 'A';
		var fromSignup = false;
		
		if(0 == Object.keys(vm.customer).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-customers/modalCustomer.html', 
					controller: 'modalCustomerController as modalCustomerController', 
					resolve: {
						customer: function(){	return doDbColumn2Dom(formMode);
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
	
	function deleteCustomer(){
		var formMode = 'D';
		var fromSignup = false;
		
		if(0 == Object.keys(vm.customer).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-customers/modalCustomer.html', 
					controller: 'modalCustomerController as modalCustomerController', 
					resolve: {
						customer: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return 'D';
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
					} else {	data[dataKey] = vm.customer[dbColumn2ColheaderKey];
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
		vm.dtInstance.reloadData();
		vm.customer = {};
		}
	
	function genDtHiddenColumns(){
		var tableDt = $(DOM_CUSTOMER_TABLE).dataTable();
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
				BROADCAST_MESSAGES.addCustomer, 
				BROADCAST_MESSAGES.updateCustomer, 
				BROADCAST_MESSAGES.deleteCustomer
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
			var customerTableDom = $(DOM_CUSTOMER_TABLE).DataTable();
			
			Object.keys(vm.dtHiddenColumns).forEach(
					function(dtHiddenColumnsKey){	customerTableDom.column(vm.dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
					}
					);
			}
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.addCustomer, 
			addCustomer
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.updateCustomer, 
			updateCustomer
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.deleteCustomer, 
			deleteCustomer
			);
	}