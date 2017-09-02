angular
.module('starter')
.controller(
		'homeController', 
		homeController
		);

homeController.$inject = [
                          '$timeout', 
                          'emailService'
                          ];

function homeController(
		$timeout, 
		emailService
		){
	const DOM_MODAL_PRE_SIGNUP = '#modal_pre_signup';
	const DOM_MODAL_PRE_SIGNUP_ROOT = '#modal_pre_signup_root';
	const DOM_LAUNCH_FORM_BUTTON = '#launch_form_btn';
	
	var vm = this;
	
	//controller_method
	vm.initBootstrapValidator = initBootstrapValidator;
	//controller_method
	vm.initDom = initDom;
	//controller_method
	vm.togglePreSignupVisibility = togglePreSignupVisibility;
	
	function initBootstrapValidator(){
		$.fn.validator.Constructor.INPUT_SELECTOR = ':input:not(".ng-hide")';
		
		$(DOM_MODAL_PRE_SIGNUP).validator();
		$(DOM_MODAL_PRE_SIGNUP).validator().on(
				'submit', 
				doSubmit
				);
		
		$timeout(
				function(){	$(DOM_MODAL_PRE_SIGNUP).validator('update');
				}
				);
		}
	
	function initDom(){
		$(DOM_MODAL_PRE_SIGNUP_ROOT).hide();
		}
	
	function togglePreSignupVisibility(){
		if(!($(DOM_MODAL_PRE_SIGNUP_ROOT).is(':visible'))){	$(DOM_MODAL_PRE_SIGNUP_ROOT).show();
		} else {	$(DOM_MODAL_PRE_SIGNUP_ROOT).hide();
		}
		}
	
	function doSubmit(e){
		emailService.sendEmailFromPreSignup([vm.preSignupDetails])
		.then(sendEmailFromPreSignupSuccessCallback)
		.catch(sendEmailFromPreSignupFailedCallback);
		
		showBootstrapLoader(DOM_MODAL_PRE_SIGNUP_ROOT);
		
		function sendEmailFromPreSignupSuccessCallback(response){	hideBootstrapLoader(DOM_MODAL_PRE_SIGNUP_ROOT);
		}
		
		function sendEmailFromPreSignupFailedCallback(responseError){	hideBootstrapLoader(DOM_MODAL_PRE_SIGNUP_ROOT);
		}
		
		function showBootstrapLoader(target){	$(target).LoadingOverlay('show');
		}
		
		function hideBootstrapLoader(target){	$(target).LoadingOverlay('hide');
		}
		}
	}