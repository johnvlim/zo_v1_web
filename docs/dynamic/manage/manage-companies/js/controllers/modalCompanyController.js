angular
.module('starter')
.controller(
		'modalCompanyController', 
		modalCompanyController
		);

modalCompanyController.$inject = [
                                  'API_BASE_URL', 
                                  '$uibModalInstance', 
                                  '$scope', 
                                  '$timeout', 
                                  'companyService', 
                                  'company', 
                                  'formMode', 
                                  'fromSignup', 
                                  'modalHiddenFields'
                                  ];

function modalCompanyController(
		API_BASE_URL, 
		$uibModalInstance, 
		$scope, 
		$timeout, 
		companyService, 
		company, 
		formMode, 
		fromSignup, 
		modalHiddenFields
		){
	const COMPANY_ADD_CATCH_MESSAGE = 'UNABLE TO ADD COMPANY, DB EXCEPTION ENCOUNTERED';
	const COMPANY_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE COMPANY, DB EXCEPTION ENCOUNTERED';
	const COMPANY_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE COMPANY, DATA IS EMPTY/UNCHANGED';
	const COMPANY_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE COMPANY, DB EXCEPTION ENCOUNTERED';
	const DOM_MODAL_COMPANY = '#modal_company';
	const DOM_MODAL_COMPANY_CONTAINER = '#modal_company-container';
	
	var vm = this;
	vm.formMode = formMode;
	vm.fromSignup = fromSignup;
	vm.company = company;
	vm.companySnapshot = JSON.parse(JSON.stringify(company));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			companyName: 'company_name', 
			companyDesc: 'company_desc', 
			companyCategory: 'company_category', 
			companyLogo: 'company_logo'
				};
	vm.dbColumn2Dom = {
			company_name: 'companyName', 
			company_desc: 'companyDesc', 
			company_category: 'companyCategory', 
			company_logo: 'companyLogo'
				};
	vm.dbColumn2DomIndex = {
			company_name: 0, 
			company_desc: 1, 
			company_category: 2, 
			company_logo: 3
			};
	vm.validationErr = {};
	vm.validationErrDB = {};
	vm.isValidationErrDBHidden = true;
	vm.isCompanyLogoImageHidden = true;
	
	//controller_method
	vm.initBootstrapValidator = initBootstrapValidator;
	//controller_method
	vm.initDom = initDom;
	//controller_method
	vm.doCancel = doCancel;
	//controller_method
	vm.uploadCompanyLogo = uploadCompanyLogo;
	
	function initBootstrapValidator(){
		$.fn.validator.Constructor.INPUT_SELECTOR = ':input:not(".ng-hide")';
		
		$(DOM_MODAL_COMPANY).validator();
		$(DOM_MODAL_COMPANY).validator().on(
				'submit', 
				doSubmit
				);
		
		$timeout(
				function(){	$(DOM_MODAL_COMPANY).validator('update');
				}
				);
		}
	
	function initDom(){
		const COMPANY_LOGO_BROWSE = '#company_logo_browse';
		
		$(COMPANY_LOGO_BROWSE).css(
				'display', 
				'none'
				);
		$(COMPANY_LOGO_BROWSE).on(
				'change', 
				companyLogoBrowseChangeCallback
				);
		
		function companyLogoBrowseChangeCallback(e){
			var eFiles = e.target.files;
			
			$timeout(
					function(){
						vm.company.companyLogo = eFiles[0].name;
						vm.isCompanyLogoImageHidden = true;
						}
					);
			}
		
		if('D' == vm.formMode){
			$('#modal_company-container input').prop(
					'disabled', 
					true
					);
			$('#modal_company-container textarea').prop(
					'disabled', 
					true
					);
			$('#modal_company-container select').prop(
					'disabled', 
					true
					);
			}
		}
	
	function doCancel(){	$uibModalInstance.close();
	}
	
	function uploadCompanyLogo(){
		const COMPANY_LOGO_BROWSE = '#company_logo_browse';
		
		var companyLogo = $(COMPANY_LOGO_BROWSE)[0].files[0];
		
		companyService.setCompanyName(vm.company.companyName);
		
		companyService.uploadCompanyLogo(companyLogo)
		.then(uploadCompanyLogoSuccessCallback)
		.catch(uploadCompanyLogoFailedCallback);
		
		showBootstrapLoader($(DOM_MODAL_COMPANY_CONTAINER));
		
		function uploadCompanyLogoSuccessCallback(response){
			var appQueryStr = '?timestamp=' + new Date().getTime();
			
			vm.company.companyLogo = response.config.url + appQueryStr;
			vm.isCompanyLogoImageHidden = false;
			
			hideBootstrapLoader($(DOM_MODAL_COMPANY_CONTAINER));
			}
		
		function uploadCompanyLogoFailedCallback(responseError){	hideBootstrapLoader($(DOM_MODAL_COMPANY_CONTAINER));
		}
		}
	
	function doSubmit(e){
		var data = [];
		
		data.push(doDom2DbColumn());
		
		hideBootstrapAlert();
		
		showBootstrapLoader($(DOM_MODAL_COMPANY_CONTAINER));
		
		if('I' == vm.formMode){
			if(vm.fromSignup){
				companyService.addCompanyValidate(data)
				.then(addCompanyValidateSuccessCallback)
				.catch(addCompanyValidateFailedCallback);
				
				function addCompanyValidateSuccessCallback(response){
					hideBootstrapLoader($(DOM_MODAL_COMPANY_CONTAINER));
					
					$uibModalInstance.close(data);
					}
				
				function addCompanyValidateFailedCallback(responseError){
					hideBootstrapLoader($(DOM_MODAL_COMPANY_CONTAINER));
					
					genValidationErrorFromResponse(responseError);
					}
				return;
				}
			
			companyService.addCompany(data)
			.then(addCompanySuccessCallback)
			.catch(addCompanyFailedCallback);
			
			function addCompanySuccessCallback(response){
				hideBootstrapLoader($(DOM_MODAL_COMPANY_CONTAINER));
				
				$uibModalInstance.close();
				}
			
			function addCompanyFailedCallback(responseError){
				hideBootstrapLoader($(DOM_MODAL_COMPANY_CONTAINER));
				
				try{
					JSON.parse(responseError.statusText);
					genValidationErrorFromResponse(responseError);
					} catch(e){	showBootstrapAlert(COMPANY_ADD_CATCH_MESSAGE);
					}
					}
			} else if('A' == vm.formMode){
				discardModalHiddenFields();
				discardModalUnchangedFields();
				
				if(0 == Object.keys(data[0]).length){
					hideBootstrapLoader($(DOM_MODAL_COMPANY_CONTAINER));
					
					showBootstrapAlert(COMPANY_UPDATE_CUSTOM_ERR_MESSAGE);
					
					return;
					}
				
				data[0].company_last_change_timestamp = moment(new Date()).format('YYYY-MM-DD h:mm:ss');
				
				companyService.setCompanyName(vm.companySnapshot.companyName);
				
				companyService.updateCompany(data)
				.then(updateCompanySuccessCallback)
				.catch(updateCompanyFailedCallback);
				
				function updateCompanySuccessCallback(response){
					hideBootstrapLoader($(DOM_MODAL_COMPANY_CONTAINER));
					
					$uibModalInstance.close();
					}
				
				function updateCompanyFailedCallback(responseError){
					hideBootstrapLoader($(DOM_MODAL_COMPANY_CONTAINER));
					
					try{
						JSON.parse(responseError.statusText);
						genValidationErrorFromResponse(responseError);
						} catch(e){	showBootstrapAlert(COMPANY_UPDATE_CATCH_MESSAGE);
						}
						}
				
				function discardModalHiddenFields(){
					Object.keys(modalHiddenFields).forEach(
							function(modalHiddenFieldsKey){	delete data[0][vm.dom2DbColumn[modalHiddenFieldsKey]];
							}
							);
					}
				
				function discardModalUnchangedFields(){
					var dataKeys = Object.keys(data[0]);
					
					dataKeys.forEach(
							function(dataKey){
								var dataValue = data[0][dataKey];
								var companySnapshotValue = vm.companySnapshot[vm.dbColumn2Dom[dataKey]];
								
								if(dataValue == companySnapshotValue){	delete data[0][dataKey];
								}
								}
							);
					}
				} else if('D' == vm.formMode){
					companyService.setCompanyName(vm.company.companyName);
					
					companyService.deleteCompany()
					.then(deleteCompanySuccessCallback)
					.catch(deleteCompanyFailedCallback);
					
					function deleteCompanySuccessCallback(response){
						hideBootstrapLoader($(DOM_MODAL_COMPANY_CONTAINER));
						
						$uibModalInstance.close();
						}
					
					function deleteCompanyFailedCallback(responseError){
						hideBootstrapLoader($(DOM_MODAL_COMPANY_CONTAINER));
						
						try{
							JSON.parse(responseError.statusText)
							genValidationErrorFromResponse(responseError);
							} catch(e){	showBootstrapAlert(COMPANY_DELETE_CATCH_MESSAGE);
							}
							}
					}
		vm.validationErr = {};
		vm.validationErrDB = {};
		}
	
	function doDom2DbColumn(){
		var data = {};
		
		Object.keys(company).forEach(
				function(companyKey){
					if(
							!(null == vm.dom2DbColumn[companyKey]) &&
							!(undefined == vm.dom2DbColumn[companyKey])
							){	data[vm.dom2DbColumn[companyKey]] = vm.company[companyKey];	}
					}
				);
		
		return data;
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
					var errorMessage = statusTextObj[statusTextKey][0];
					var formGroups = $(DOM_FORM_GROUP_CLASS);
					
					errorMessage = errorMessage.replace(statusTextKey, vm.dbColumn2Dom[dbColumnName]);
					
					vm.validationErr[parseInt(dbColumnIndex)] = errorMessage;
					
					formGroups.eq(parseInt(dbColumnIndex+1)).addClass(DOM_HAS_ERROR_CLASS);
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