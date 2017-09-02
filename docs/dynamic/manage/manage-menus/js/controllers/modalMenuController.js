angular
.module('starter')
.controller(
		'modalMenuController', 
		modalMenuController
		);

modalMenuController.$inject = [
                               'API_BASE_URL', 
                               '$uibModalInstance', 
                               '$timeout', 
                               'menuService', 
                               'menu', 
                               'formMode', 
                               'modalHiddenFields'
                               ];

function modalMenuController(
		API_BASE_URL, 
		$uibModalInstance, 
		$timeout, 
		menuService, 
		menu, 
		formMode, 
		modalHiddenFields
		){
	const MENU_ADD_CATCH_MESSAGE = 'UNABLE TO ADD MENU, DB EXCEPTION ENCOUNTERED';
	const MENU_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE MENU, DB EXCEPTION ENCOUNTERED';
	const MENU_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE MENU, DATA IS EMPTY/UNCHANGED';
	const MENU_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE MENU, DB EXCEPTION ENCOUNTERED';
	const DOM_MODAL_MENU = '#modal_menu';
	const DOM_MODAL_MENU_CONTAINER = 'modal_menu-container';
	
	var vm = this;
	vm.formMode = formMode;
	vm.menu = menu;
	vm.menuSnapshot = JSON.parse(JSON.stringify(menu));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			menuName: 'menu_name', 
			companyName: 'company_name', 
			menuDesc: 'menu_desc', 
			menuImage: 'menu_image'
				};
	vm.dbColumn2Dom = {
			menu_name: 'menuName', 
			company_name: 'companyName', 
			menu_desc: 'menuDesc', 
			menu_image: 'menuImage'
				};
	vm.dbColumn2DomIndex = {
			menu_name: 0, 
			company_name: 1, 
			menu_desc: 2, 
			menu_image: 3
			};
	vm.validationErr = {};
	vm.validationErrDB = {};
	vm.isValidationErrDBHidden = true;
	vm.isMenuImageImageHidden = true;
	
	//controller_method
	vm.initBootstrapValidator = initBootstrapValidator;
	//controller_method
	vm.initDom = initDom;
	//controller_method
	vm.doCancel = doCancel;
	//controller_method
	vm.uploadMenuImage = uploadMenuImage;
	
	function initBootstrapValidator(){
		$.fn.validator.Constructor.INPUT_SELECTOR = ':input:not(".ng-hide")';
		
		$(DOM_MODAL_MENU).validator();
		$(DOM_MODAL_MENU).validator().on(
				'submit', 
				doSubmit
				);
		
		$timeout(
				function(){	$(DOM_MODAL_MENU).validator('update');
				}
				);
		}
	
	function initDom(){
		const MENU_IMAGE_BROWSE = '#menu_image_browse';
		
		$(MENU_IMAGE_BROWSE).css(
				'display', 
				'none'
				);
		$(MENU_IMAGE_BROWSE).on(
				'change', 
				menuImageBrowseChangeCallback
				);
		
		function menuImageBrowseChangeCallback(e){
			var eFiles = e.target.files;
			
			$timeout(
					function(){
						vm.menu.menuImage = eFiles[0].name;
						vm.isMenuImageImageHidden = true;
						}
					);
			}
		
		if('D' == vm.formMode){
			$('#modal_menu-container input').prop(
					'disabled', 
					true
					);
			$('#modal_menu-container textarea').prop(
					'disabled', 
					true
					);
			$('#modal_menu-container select').prop(
					'disabled', 
					true
					);
			}
		}
	
	function doCancel(){	$uibModalInstance.close();
	}
	
	function uploadMenuImage(){
		const MENU_IMAGE_BROWSE = '#menu_image_browse';
		
		var menuImage = $(MENU_IMAGE_BROWSE)[0].files[0];
		
		menuService.setCompanyName(vm.menu.companyName);
		menuService.setMenuName(vm.menu.menuName);
		
		menuService.uploadMenuImage(menuImage)
		.then(uploadMenuImageSuccessCallback)
		.catch(uploadMenuImageFailedCallback);
		
		showBootstrapLoader($(DOM_MODAL_MENU_CONTAINER));
		
		function uploadMenuImageSuccessCallback(response){
			var appQueryStr = '?timestamp=' + new Date().getTime();
			
			vm.menu.menuImage = response.config.url + appQueryStr;
			vm.isMenuImageImageHidden = false;
			
			hideBootstrapLoader($(DOM_MODAL_MENU_CONTAINER));
			}
		
		function uploadMenuImageFailedCallback(responseError){	hideBootstrapLoader($(DOM_MODAL_MENU_CONTAINER));
		}
		}
	
	function doSubmit(e){
		var data = [];
		
		data.push(doDom2DbColumn());
		
		hideBootstrapAlert();
		
		showBootstrapLoader($(DOM_MODAL_MENU_CONTAINER));
		
		if('I' == vm.formMode){
			menuService.setCompanyName(vm.menu.companyName);
			
			menuService.addMenu(data)
			.then(addMenuSuccessCallback)
			.catch(addMenuFailedCallback);
			
			function addMenuSuccessCallback(response){
				hideBootstrapLoader($(DOM_MODAL_MENU_CONTAINER));
				
				$uibModalInstance.close();
				}
			
			function addMenuFailedCallback(responseError){
				hideBootstrapLoader($(DOM_MODAL_MENU_CONTAINER));
				
				try{
					JSON.parse(responseError.statusText);
					genValidationErrorFromResponse(responseError);
				} catch(e){	showBootstrapAlert(MENU_ADD_CATCH_MESSAGE);
				}
				}
			} else if('A' == vm.formMode){
				discardModalHiddenFields();
				discardModalUnchangedFields();
				
				if(0 == Object.keys(data[0]).length){
					hideBootstrapLoader($(DOM_MODAL_MENU_CONTAINER));
					
					showBootstrapAlert(MENU_UPDATE_CUSTOM_ERR_MESSAGE);
					
					return
					}
				
				data[0].menu_last_change_timestamp = moment(new Date()).format('YYYY-MM-DD h:mm:ss');
				
				menuService.setCompanyName(vm.menuSnapshot.companyName);
				menuService.setMenuName(vm.menuSnapshot.menuName);
				
				menuService.updateMenu(data)
				.then(updateMenuSuccessCallback)
				.catch(updateMenuFailedCallback);
				
				function updateMenuSuccessCallback(response){
					hideBootstrapLoader($(DOM_MODAL_MENU_CONTAINER));
					
					$uibModalInstance.close();
					}
				
				function updateMenuFailedCallback(responseError){
					hideBootstrapLoader($(DOM_MODAL_MENU_CONTAINER));
					
					try{
						JSON.parse(responseError.statusText);
						genValidationErrorFromResponse(responseError);
						} catch(e){	showBootstrapAlert(MENU_UPDATE_CATCH_MESSAGE);
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
					
					dataKeys.forEach(function(dataKey){
						var dataValue = data[0][dataKey];
						var menuSnapshotValue = vm.menuSnapshot[vm.dbColumn2Dom[dataKey]];
						if(dataValue == menuSnapshotValue){	delete data[0][dataKey];
						}
						}
					);
					}
				} else if('D' == vm.formMode){
					menuService.setCompanyName(vm.menu.companyName);
					menuService.setMenuName(vm.menu.menuName);
					
					menuService.deleteMenu()
					.then(deleteMenuSuccessCallback)
					.catch(deleteMenuFailedCallback);
					
					function deleteMenuSuccessCallback(response){
						hideBootstrapLoader($(DOM_MODAL_MENU_CONTAINER));
						
						$uibModalInstance.close();
						}
					
					function deleteMenuFailedCallback(responseError){
						hideBootstrapLoader($(DOM_MODAL_MENU_CONTAINER));
						
						try{
							JSON.parse(responseError.statusText);
							genValidationErrorFromResponse(responseError);
							} catch(e){	showBootstrapAlert(MENU_DELETE_CATCH_MESSAGE);
							}
							}
					}
		vm.validationErr = {};
		vm.validationErrDB = {};
		}
	
	function doDom2DbColumn(){
		var data = {};
		
		Object.keys(vm.menu).forEach(
				function(menuKey){
					if(
							!(null == vm.dom2DbColumn[menuKey]) &&
							!(undefined == vm.dom2DbColumn[menuKey])
							){	data[vm.dom2DbColumn[menuKey]] = vm.menu[menuKey];
							}
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