angular
.module('starter')
.controller(
		'modalBranchController', 
		modalBranchController
		);

modalBranchController.$inject = [
                                 '$uibModalInstance', 
                                 '$timeout', 
                                 'branchService', 
                                 'branch', 
                                 'formMode', 
                                 'fromSignup', 
                                 'modalHiddenFields'
                                 ];

function modalBranchController(
		$uibModalInstance, 
		$timeout, 
		branchService, 
		branch, 
		formMode, 
		fromSignup, 
		modalHiddenFields
		){
	const BRANCH_ADD_CATCH_MESSAGE = 'UNABLE TO ADD BRANCH, DB EXCEPTION ENCOUNTERED';
	const BRANCH_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE BRANCH, DB EXCEPTION ENCOUNTERED';
	const BRANCH_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE BRANCH, DATA IS EMPTY/UNCHANGED';
	const BRANCH_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE BRANCH, DB EXCEPTION ENCOUNTERED';
	const DOM_MODAL_BRANCH = '#modal_branch';
	const DOM_MODAL_BRANCH_CONTAINER = '#modal_branch-container';
	
	var vm = this;
	vm.formMode = formMode;
	vm.fromSignup = fromSignup;
	vm.branch = branch;
	vm.branchSnapshot = JSON.parse(JSON.stringify(branch));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			branchName: 'branch_name', 
			companyName: 'company_name', 
			branchAddressHouseBuilding: 'branch_address_house_building', 
			branchAddressStreet: 'branch_address_street', 
			branchAddressDistrict: 'branch_address_district', 
			branchAddressCity: 'branch_address_city', 
			branchAddressPostalcode: 'branch_address_postalcode', 
			branchAddressCountry: 'branch_address_country', 
			branchHotline: 'branch_hotline'
				};
	vm.dbColumn2Dom = {
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
	vm.dbColumn2DomIndex = {
			branch_name: 0, 
			company_name: 1, 
			branch_address_house_building: 2, 
			branch_address_street: 3, 
			branch_address_district: 4, 
			branch_address_city: 5, 
			branch_address_postalcode: 6, 
			branch_address_country: 7, 
			branch_hotline: 8
			};
	vm.validationErr = {};
	vm.validationErrDB = {};
	vm.isValidationErrDBHidden = true;
	
	//controller_method
	vm.initBootstrapValidator = initBootstrapValidator;
	//controller_method
	vm.initDom = initDom;
	//controller_method
	vm.doCancel = doCancel;
	
	function initBootstrapValidator(){
		$.fn.validator.Constructor.INPUT_SELECTOR = ':input:not(".ng-hide")';
		$(DOM_MODAL_BRANCH).validator();
		$(DOM_MODAL_BRANCH).validator().on(
				'submit', 
				doSubmit
				);
		
		$timeout(
				function(){	$(DOM_MODAL_BRANCH).validator('update');
				}
				);
		}
	
	function initDom(){
		if('D' == vm.formMode){
			$('#modal_branch-container input').prop(
					'disabled', 
					true
					);
			$('#modal_branch-container textarea').prop(
					'disabled', 
					true
					);
			$('#modal_branch-container select').prop(
					'disabled', 
					true
					);
			}
		}
	
	function doCancel(){	$uibModalInstance.close();
	}
	
	function doSubmit(e){
		var data = [];
		
		data.push(doDom2DbColumn());
		
		hideBootstrapAlert();
		
		showBootstrapLoader($(DOM_MODAL_BRANCH_CONTAINER));
		
		if('I' == vm.formMode){
			if(vm.fromSignup){
				hideBootstrapLoader($(DOM_MODAL_BRANCH_CONTAINER));
				
				$uibModalInstance.close(data);
				
				return;
				}
			
			branchService.setCompanyName(vm.branch.companyName);
			
			branchService.addBranch(data)
			.then(addBranchSuccessCallback)
			.catch(addBranchFailedCallback);
			
			function addBranchSuccessCallback(response){
				hideBootstrapLoader($(DOM_MODAL_BRANCH_CONTAINER));
				
				$uibModalInstance.close();
				}
			
			function addBranchFailedCallback(responseError){
				hideBootstrapLoader($(DOM_MODAL_BRANCH_CONTAINER));
				
				try{
					JSON.parse(responseError.statusText);
					genValidationErrorFromResponse(responseError);
					} catch(e){	showBootstrapAlert(BRANCH_ADD_CATCH_MESSAGE);
					}
					}
			} else if('A' == vm.formMode){
				discardModalHiddenFields();
				discardModalUnchangedFields();
				
				if(0 == Object.keys(data[0]).length){
					hideBootstrapLoader($(DOM_MODAL_BRANCH_CONTAINER));
					
					showBootstrapAlert(BRANCH_UPDATE_CUSTOM_ERR_MESSAGE);
					
					return;
					}
				
				data[0].branch_last_change_timestamp = moment(new Date()).format('YYYY-MM-DD h:mm:ss');
				
				branchService.setCompanyName(vm.branchSnapshot.companyName);
				branchService.setBranchName(vm.branchSnapshot.branchName);
				
				branchService.updateBranch(data)
				.then(updateBranchSuccessCallback)
				.catch(updateBranchFailedCallback);
				
				function updateBranchSuccessCallback(response){
					hideBootstrapLoader($(DOM_MODAL_BRANCH_CONTAINER));
					
					$uibModalInstance.close();
					}
				
				function updateBranchFailedCallback(responseError){
					hideBootstrapLoader($(DOM_MODAL_BRANCH_CONTAINER));
					
					try{
						JSON.parse(responseError.statusText);
						genValidationErrorFromResponse(responseError);
						} catch(e){	showBootstrapAlert(BRANCH_UPDATE_CATCH_MESSAGE);
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
								var branchSnapshotValue = vm.branchSnapshot[vm.dbColumn2Dom[dataKey]];
								
								if(dataValue == branchSnapshotValue){	delete data[0][dataKey];
								}
								}
							);
					}
				} else if('D' == vm.formMode){
					branchService.setCompanyName(vm.branch.companyName);
					branchService.setBranchName(vm.branch.branchName);
					
					branchService.deleteBranch()
					.then(deleteBranchSuccessCallback)
					.catch(deleteBranchFailedCallback);
					
					function deleteBranchSuccessCallback(response){
						hideBootstrapLoader($(DOM_MODAL_BRANCH_CONTAINER));
						
						$uibModalInstance.close();
						}
					
					function deleteBranchFailedCallback(responseError){
						hideBootstrapLoader($(DOM_MODAL_BRANCH_CONTAINER));
						
						try{
							JSON.parse(responseError.statusText);
							genValidationErrorFromResponse(responseError);
							} catch(e){	showBootstrapAlert(BRANCH_DELETE_CATCH_MESSAGE);
							}
							}
					}
		vm.validationErr = {};
		vm.validationErrDB = {};
		}
	
	function doDom2DbColumn(){
		var data = {};
		
		Object.keys(vm.branch).forEach(
				function(branchKey){
					if(
							!(null == vm.dom2DbColumn[branchKey]) &&
							!(undefined == vm.dom2DbColumn[branchKey])
							){	data[vm.dom2DbColumn[branchKey]] = vm.branch[branchKey];
							}
					}
				);
		
		return data;
		}
	
	function genValidationErrorFromResponse(responseError){
		const CLASS_FORM_GROUP = '.form-group';
		const CLASS_HAS_ERROR = 'has-error';
		
		var statusText = responseError.statusText;
		var statusTextObj = JSON.parse(statusText);
		var statusTextKeys = Object.keys(statusTextObj);
		
		statusTextKeys.forEach(
				function(statusTextKey){
					var dbColumnName = statusTextKey.split('.')[1];
					var dbColumnIndex = getDbColumnIndex(dbColumnName);
					var errorMessage = statusTextObj[statusTextKey][0];
					var formGroups = $(CLASS_FORM_GROUP);
					
					errorMessage = errorMessage.replace(statusTextKey, vm.dbColumn2Dom[dbColumnName]);
					
					vm.validationErr[parseInt(dbColumnIndex)] = errorMessage;
					
					formGroups.eq(parseInt(dbColumnIndex+1)).addClass(CLASS_HAS_ERROR);
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