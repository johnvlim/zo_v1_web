angular
.module('starter')
.controller(
		'bannerController', 
		bannerController
		);

bannerController.$inject = [
                            'BROADCAST_MESSAGES', 
                            'KEYS', 
                            'USER_ROLES', 
                            '$localStorage', 
                            '$rootScope', 
                            '$scope', 
                            '$state', 
                            '$timeout', 
                            '$uibModal', 
                            'branchService', 
                            'customerService', 
                            'companyService', 
                            'customerCompanyBranchService', 
                            'loginService'
                            ];

function bannerController(
		BROADCAST_MESSAGES, 
		KEYS, 
		USER_ROLES, 
		$localStorage, 
		$rootScope, 
		$scope, 
		$state, 
		$timeout, 
		$uibModal, 
		branchService, 
		customerService, 
		companyService, 
		customerCompanyBranchService, 
		loginService
		){
	const STATE_HOME = 'home';
	const STATE_MANAGE = 'manage';
	
	var vm = this;
	
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user= JSON.parse(vm.user);
		}
	
	//controller_method
	vm.doLogin = doLogin;
	//controller_method
	vm.doLogout = doLogout;
	//controller_method
	vm.doSignup = doSignup;
	
	function doLogin(){
		const  DOM_NAVBAR_NAVBAR_DEFAULT_CLASS = '.navbar.navbar-default';
		
		loginService.setLoginUsername(vm.loginUsername);
		loginService.setLoginPassword(vm.loginPassword);
		
		loginService.doLogin()
		.then(doLoginSuccessCallback)
		.catch(doLoginFailedCallback);
		
		showBootstrapLoader($(DOM_NAVBAR_NAVBAR_DEFAULT_CLASS));
		
		function doLoginSuccessCallback(response){	hideBootstrapLoader($(DOM_NAVBAR_NAVBAR_DEFAULT_CLASS));
		}
		
		function doLoginFailedCallback(responseError){	hideBootstrapLoader($(DOM_NAVBAR_NAVBAR_DEFAULT_CLASS));
		}
		}
	
	function doLogout(){
		const  DOM_NAVBAR_NAVBAR_DEFAULT_CLASS = '.navbar.navbar-default';
		
		showBootstrapLoader($(DOM_NAVBAR_NAVBAR_DEFAULT_CLASS));
		
		localStorage.clear();
		$state.go(
				STATE_HOME, 
				{}, 
				{	reload: true	}
				);
		
		hideBootstrapLoader($(DOM_NAVBAR_NAVBAR_DEFAULT_CLASS));
		
		vm.user = {};
		vm.loginUsername = '';
		vm.loginPassword = '';
		}
	
	function doSignup(){
		var formMode = 'I';
		var fromSignup = true;
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-customers/modalCustomer.html', 
					controller: 'modalCustomerController as modalCustomerController', 
					resolve: {
						customer: function(){	return {	customerRole: 'administrator'	};
						}, 
						formMode: function(){	return formMode;
						}, 
						fromSignup: function(){	return fromSignup;
						}, 
						modalHiddenFields: function(){	return {	customerRole: true	};
						}
						}
				}
				);
		modalInstance.result.then(customerUibModalResultCallback);
		
		function customerUibModalResultCallback(data){
			if(null == data){	return;
			}
			
			vm.customer = data[0];
			if(null == vm.customer){	return;
			}
			
			if(USER_ROLES.administrator == vm.customer.customer_role){	doSignupAsAdministrator();
			}
			}
		
		function doSignupAsAdministrator(){
			var modalInstance =  $uibModal.open(
					{
						animation: true, 
						templateUrl: 'docs/dynamic/manage/manage-companies/modalCompany.html', 
						controller: 'modalCompanyController as modalCompanyController', 
						resolve: {
							company: function(){	return {};
							}, 
							formMode: function(){	return formMode;
							}, 
							fromSignup: function(){	return fromSignup;
							}, 
							modalHiddenFields: function(){	return null;
							}
							}
					}
					);
			modalInstance.result.then(companyUibModalResultCallback);
			
			function companyUibModalResultCallback(data){
				if(null == data){	return;
				}
				
				vm.company = data[0];
				if(null == vm.company){	return;
				}
				
				modalInstance = $uibModal.open(
						{
							animation: true, 
							templateUrl: 'docs/dynamic/manage/manage-branches/modalBranch.html', 
							controller: 'modalBranchController as modalBranchController', 
							resolve: {
								branch: function(){	return {	companyName: vm.company.company_name	};
								}, 
								formMode: function(){	return formMode;
								}, 
								fromSignup: function(){	return fromSignup;
								}, 
								modalHiddenFields: function(){	return {	companyName: true	};
								}
								}
						}
						);
				modalInstance.result.then(branchUibModalResultCallback);
				
				function branchUibModalResultCallback(data){
					if(null == data){	return;
					}
					
					vm.branch = data[0];
					if(null == vm.branch){	return;
					}
					
					doAdminCascadedPosts();
					}
				
				function doAdminCascadedPosts(){
					var customerCompanyBranch = {
							customer_username: vm.customer.customer_username, 
							company_name: vm.company.company_name, 
							branch_name: vm.branch.branch_name
							};
					var transParams = {
							customer: vm.customer, 
							company: vm.company, 
							branch: vm.branch, 
							customerCompanyBranch: vm.customerCompanyBranch
							};
					
					customerCompanyBranchService.addCustomerCompanyBranch([transParams])
					.then(addCustomerCompanyBranchSuccessCallback)
					.catch(addCustomerCompanyBranchFailedCallback);
					
					function addCustomerCompanyBranchSuccessCallback(response){	//do something on success
					}
					
					function addCustomerCompanyBranchFailedCallback(responseError){	//do something on failure
					}
					}
				}
			}
		}
	
	$scope.$watch(
			function(){	return localStorage.getItem(KEYS.User);
			}, 
			function(){
				if(!(null == localStorage.getItem(KEYS.User))){
					vm.user = localStorage.getItem(KEYS.User);
					vm.user = JSON.parse(vm.user);
					
					$timeout(
							function(){	$state.go(STATE_MANAGE);
							}
							);
					}
				}
			);
	
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