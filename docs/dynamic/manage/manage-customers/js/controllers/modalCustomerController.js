angular
.module('starter')
.controller(
		'modalCustomerController', 
		modalCustomerController
		);

modalCustomerController.$inject = [
                                   'KEYS', 
                                   'USER_GENDERS', 
                                   'USER_ROLES', 
                                   '$uibModalInstance', 
                                   '$timeout', 
                                   'customerCompanyBranchService', 
                                   'customerService', 
                                   'customer', 
                                   'formMode', 
                                   'fromSignup', 
                                   'modalHiddenFields'
                                   ];

function modalCustomerController(
		KEYS, 
		USER_GENDERS, 
		USER_ROLES, 
		$uibModalInstance, 
		$timeout, 
		customerCompanyBranchService, 
		customerService, 
		customer, 
		formMode, 
		fromSignup, 
		modalHiddenFields
		){
	const CUSTOMER_ADD_CATCH_MESSAGE = 'UNABLE TO ADD CUSTOMER, DB EXCEPTION ENCOUNTERED';
	const CUSTOMER_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE CUSTOMER, DB EXCEPTION ENCOUNTERED';
	const CUSTOMER_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE CUSTOMER, DATA IS EMPTY/UNCHANGED';
	const CUSTOMER_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE CUSTOMER, DB EXCEPTION ENCOUNTERED';
	const DOM_MODAL_CUSTOMER = '#modal_customer';
	const DOM_MODAL_CUSTOMER_CONTAINER = '#modal_customer-container';
	
	var vm = this;
	vm.formMode = formMode;
	vm.fromSignup = fromSignup;
	vm.customer = customer;
	vm.customerCapture = JSON.parse(JSON.stringify(customer));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			customerUsername: 'customer_username', 
			customerPassword: 'customer_password', 
			customerNameFname: 'customer_name_fname', 
			customerNameMname: 'customer_name_mname', 
			customerNameLname: 'customer_name_lname', 
			customerRole: 'customer_role', 
			customerGender: 'customer_gender', 
			customerAddressHouseBuilding: 'customer_address_house_building', 
			customerAddressStreet: 'customer_address_street', 
			customerAddressDistrict: 'customer_address_district', 
			customerAddressCity: 'customer_address_city', 
			customerAddressPostalcode: 'customer_address_postalcode', 
			customerAddressCountry: 'customer_address_country', 
			customerMobile: 'customer_mobile', 
			customerEmail: 'customer_email', 
			customerBirthdayMonth: 'customer_birthday_month', 
			customerBirthdayDate: 'customer_birthday_date', 
			customerBirthdayYear: 'customer_birthday_year'
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
	vm.dbColumn2DomIndex = {
			customer_username: 0, 
			customer_password: 1, 
			customer_name_fname: 2, 
			customer_name_mname: 3, 
			customer_name_lname: 4, 
			customer_role: 5, 
			customer_gender: 6, 
			customer_address_house_building: 7, 
			customer_address_street: 8, 
			customer_address_district: 9, 
			customer_address_city: 10, 
			customer_address_postalcode: 11, 
			customer_address_country: 12, 
			customer_mobile: 13, 
			customer_email: 14
			};
	vm.customerRoleOptions = USER_ROLES;
	vm.customerGenderOptions = USER_GENDERS;
	vm.validationErr = {};
	vm.validationErrDB = {};
	vm.isValidationErrDBHidden = true;
	
	//controller_method
	vm.initBootstrapValidator = initBootstrapValidator;
	//controller_method
	vm.initBootstrapDatepicker = initBootstrapDatepicker;
	//controller_method
	vm.initDom = initDom;
	//controller_method
	vm.doCancel = doCancel;
	
	function initBootstrapValidator(){
		$.fn.validator.Constructor.INPUT_SELECTOR = ':input:not(".ng-hide")';
		
		$(DOM_MODAL_CUSTOMER).validator();
		$(DOM_MODAL_CUSTOMER).validator().on(
				'submit', 
				doSubmit
				);
		
		$timeout(
				function(){	$(DOM_MODAL_CUSTOMER).validator('update');
				}
				);
		}
	
	function initBootstrapDatepicker(){
		const DOM_CUSTOMER_BIRTHDATE = '#customer_birthdate';
		
		$(DOM_CUSTOMER_BIRTHDATE).datepicker(
				{
					onSelect: function(){
						var date = $(this).datepicker('getDate');
						var calendarMonths = [
						                      'Jan', 
						                      'Feb', 
						                      'Mar', 
						                      'Apr', 
						                      'May', 
						                      'Jun', 
						                      'Jul', 
						                      'Aug', 
						                      'Sep', 
						                      'Oct', 
						                      'Nov', 
						                      'Dec'
						                      ];
						
						$timeout(
								function(){
									vm.customer.customerBirthdayMonth = calendarMonths[date.getMonth()];
									vm.customer.customerBirthdayDate = date.getDate();
									vm.customer.customerBirthdayYear = date.getFullYear();
									}
								);
						}
				}
				);
		}
	
	function initDom(){
		if('D' == vm.formMode){
			$('#modal_customer-container input').prop(
					'disabled', 
					true
					);
			$('#modal_customer-container textarea').prop(
					'disabled', 
					true
					);
			$('#modal_customer-container select').prop(
					'disabled', 
					true
					);
			}
		
		if(!('I' == vm.formMode)){		vm.modalHiddenFields.customerPassword = true;
		}
		}
	
	function doCancel(){	$uibModalInstance.close();
	}
	
	function doSubmit(e){
		var user = localStorage.getItem(KEYS.User);
		user = JSON.parse(user);
		var data = [];
		
		data.push(doDom2DbColumn(vm.formMode));
		
		hideBootstrapAlert();
		
		showBootstrapLoader($(DOM_MODAL_CUSTOMER_CONTAINER));
		
		if(vm.fromSignup){
			customerService.addCustomerValidate(data)
			.then(addCustomerValidateSuccessCallback)
			.catch(addCustomerValidateFailedCallback);
			
			function addCustomerValidateSuccessCallback(response){
				hideBootstrapLoader($(DOM_MODAL_CUSTOMER_CONTAINER));
				
				$uibModalInstance.close(data);
				}
			
			function addCustomerValidateFailedCallback(responseError){
				hideBootstrapLoader($(DOM_MODAL_CUSTOMER_CONTAINER));
				
				genValidationErrorFromResponse(responseError);
				}
			return;
			}
		
		if('I' == vm.formMode){
			var customer = data[0];
			var customerCompanyBranch = {};
			var transParams = {};
			
			if(USER_ROLES.customer == customer.customer_role){	transParams.customer = customer;
			} else {
				customerCompanyBranch = {
						customer_username: customer.customer_username, 
						company_name: user.company_name, 
						branch_id: user.branch_id
						};
				transParams = {
						customer: customer, 
						customerCompanyBranch : customerCompanyBranch
						};
				}
			
			customerCompanyBranchService.addCustomerCompanyBranch([transParams])
			.then(addCustomerCompanyBranchSuccessCallback)
			.catch(addCustomerCompanyBranchFailedCallback);
			
			function addCustomerCompanyBranchSuccessCallback(response){
				hideBootstrapLoader($(DOM_MODAL_CUSTOMER_CONTAINER));
				
				$uibModalInstance.close();
				}
			
			function addCustomerCompanyBranchFailedCallback(responseError){
				hideBootstrapLoader($(DOM_MODAL_CUSTOMER_CONTAINER));
				
				try{
					JSON.parse(responseError.statusText);
					genValidationErrorFromResponse(responseError);
				} catch(e){	showBootstrapAlert(CUSTOMER_ADD_CATCH_MESSAGE);
				}
				}
			} else if('A' == vm.formMode){
				discardModalHiddenFields();
				discardModalUnchangedFields();
				
				if(0 == Object.keys(data[0]).length){
					hideBootstrapLoader($(DOM_MODAL_CUSTOMER_CONTAINER));
					
					showBootstrapAlert(CUSTOMER_UPDATE_CUSTOM_ERR_MESSAGE);
					
					return;
					}
				
				data[0].customer_last_change_timestamp = moment(new Date()).format('YYYY-MM-DD h:mm:ss');
				
				customerService.setCustomerUsername(vm.customerCapture.customerUsername);
				
				customerService.updateCustomer(data)
				.then(updateCustomerSuccessCallback)
				.catch(updateCustomerFailedCallback);
				
				function updateCustomerSuccessCallback(response){
					hideBootstrapLoader($(DOM_MODAL_CUSTOMER_CONTAINER));
					
					$uibModalInstance.close();
					}
				
				function updateCustomerFailedCallback(responseError){
					hideBootstrapLoader($(DOM_MODAL_CUSTOMER_CONTAINER));
					
					try{
						JSON.parse(responseError.statusText);
						genValidationErrorFromResponse(responseError);
						} catch(e){	showBootstrapAlert(CUSTOMER_UPDATE_CATCH_MESSAGE);
						}
						}
				
				function discardModalHiddenFields(){
					Object.keys(vm.modalHiddenFields).forEach(
							function(modalHiddenFieldsKey){	delete data[0][vm.dom2DbColumn[modalHiddenFieldsKey]];
							}
							);
					}
				
				function discardModalUnchangedFields(){
					var dataKeys = Object.keys(data[0]);
					
					dataKeys.forEach(
							function(dataKey){
								var dataValue = data[0][dataKey];
								var customerCaptureValue = vm.customerCapture[vm.dbColumn2Dom[dataKey]];
								
								if(dataValue == customerCaptureValue){	delete data[0][dataKey];
								}
								}
							);
					}
				} else if('D' == vm.formMode){
					customerService.setCustomerUsername(vm.customer.customerUsername);
					
					customerService.deleteCustomer()
					.then(deleteCustomerSuccessCallback)
					.catch(deleteCustomerFailedCallback);
					
					function deleteCustomerSuccessCallback(response){
						hideBootstrapLoader($(DOM_MODAL_CUSTOMER_CONTAINER));
						
						$uibModalInstance.close();
						}
					
					function deleteCustomerFailedCallback(responseError){
						hideBootstrapLoader($(DOM_MODAL_CUSTOMER_CONTAINER));
						
						try{
							JSON.parse(responseError.statusText);
							genValidationErrorFromResponse(responseError);
							} catch(e){	showBootstrapAlert(CUSTOMER_DELETE_CATCH_MESSAGE);
							}
							}
					}
		vm.validationErr = {};
		vm.validationErrDB = {};
		}
	
	function doDom2DbColumn(formMode){
		var data = {};
		
		Object.keys(customer).forEach(
				function(customerKey){
					if(
							!(null == vm.dom2DbColumn[customerKey]) &&
							!(undefined == vm.dom2DbColumn[customerKey])
							){	data[vm.dom2DbColumn[customerKey]] = vm.customer[customerKey];
							}
					}
				);
		
		return data
		}
	
	function genValidationErrorFromResponse(responseError){
		const DOM_FORM_GROUP_CLASS = '.form-group';
		const DOM_HAS_ERROR_CLASS = 'has-error';
		
		var statusText = responseError.statusText;
		var statusTextObj = JSON.parse(statusText);
		var statusTextKeys = Object.keys(statusTextObj);
		
		statusTextKeys.forEach(
				function(statusTextKey){
					var dbColumnName = statusTextKey.split('.')[1];
					var dbColumnIndex = getDbColumnIndex(dbColumnName);
					var dbColumnPasswordIndex = 1;
					var domOffset = 1;
					var errorMessage = statusTextObj[statusTextKey][0];
					var formGroups = $(DOM_FORM_GROUP_CLASS);
					
					errorMessage = errorMessage.replace(statusTextKey, vm.dbColumn2Dom[dbColumnName]);
					
					vm.validationErr[parseInt(dbColumnIndex)] = errorMessage;
					
					if(dbColumnPasswordIndex < dbColumnIndex){	domOffset = 2;
					} else {	domOffset = 1;
					}
					
					formGroups.eq(parseInt(dbColumnIndex+domOffset)).addClass(DOM_HAS_ERROR_CLASS);
					}
				);
		
		function getDbColumnIndex(dbColumnName){	return vm.dbColumn2DomIndex[dbColumnName];
		}
		}
	
	function showBootstrapLoader(target){	$(target).LoadingOverlay('show');
	}
	
	function hideBootstrapLoader(target){	$(target).LoadingOverlay('hide');
	}
	
	function showBootstrapAlert(validationErrDB){
		vm.validationErrDB = validationErrDB;
		vm.isValidationErrDBHidden = false;
		}
	
	function hideBootstrapAlert(){
		vm.validationErrDB = {};
		vm.isValidationErrDBHidden = true;
		}
	}