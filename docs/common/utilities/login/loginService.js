angular
.module('starter')
.factory(
		'loginService', 
		loginService
		);

loginService.$inject = [
                        'API_BASE_URL', 
                        'KEYS', 
                        'USER_ROLES', 
                        '$http', 
                        '$localStorage', 
                        '$q'
                        ];

function loginService(
		API_BASE_URL, 
		KEYS, 
		USER_ROLES, 
		$http, 
		$localStorage, 
		$q
		){
	var loginServiceObj = {
		loginUsername: undefined, 
		loginPassword: undefined, 
		user: {
			username: undefined, 
			token: undefined, 
			role: undefined, 
			name: undefined
			}, 
			getLoginUsername: getLoginUsername, 
			getLoginPassword: getLoginPassword, 
			getUser: getUser, 
			setLoginUsername: setLoginUsername, 
			setLoginPassword: setLoginPassword, 
			setUser: setUser, 
			doLogin: doLogin
			};
	
	function getLoginUsername(){	return loginServiceObj.loginUsername;
	}
	function getLoginPassword(){	return loginServiceObj.loginPassword;
	}
	function getUser(){	return loginServiceObj.user;
	}
	function setLoginUsername(loginUsername){	loginServiceObj.loginUsername = loginUsername;
	}
	function setLoginPassword(loginPassword){	loginServiceObj.loginPassword = loginPassword;
	}
	function setUser(user){	loginServiceObj.user = user;
	}
	
	function doLogin(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/login?customer_username=' + loginServiceObj.loginUsername + '&customer_password=' + loginServiceObj.loginPassword
				};
		
		$http(httpConfig)
		.then(doLoginSuccessCallback)
		.catch(doLoginFailedCallback);
		
		function doLoginSuccessCallback(response){
			loginServiceObj.user = {};
			var userResponseData = response.data.User;
			
			loginServiceObj.user.username = userResponseData.customer_username;
			loginServiceObj.user.token = response.data.Token;
			loginServiceObj.user.role = userResponseData.customer_role;
			loginServiceObj.user.name = 
				userResponseData.customer_name_fname + " " + 
				userResponseData.customer_name_mname + ". " + 
				userResponseData.customer_name_lname;
			loginServiceObj.user.isAuthenticated = true;
			
			$http.defaults.headers.common.Authorization = "bearer " + loginServiceObj.user.token;
			
			if(USER_ROLES.customer == loginServiceObj.user.role){
				localStorage.setItem(
						KEYS.User, 
						JSON.stringify(loginServiceObj.user)
						);
				deferred.resolve();
			} else {	getCustomerCompanyBranch();
			}
			
			function getCustomerCompanyBranch(){
				var httpConfig = {
						method: 'GET', 
						url: API_BASE_URL + '/customers-companies-branches/' + loginServiceObj.user.username
						};
				
				$http(httpConfig)
				.then(getCustomerCompanyBranchSuccessCallback)
				.catch(getCustomerCompanyBranchFailedCallback);
				
				function getCustomerCompanyBranchSuccessCallback(response){
					var responseData = response.data;
					
					responseData = responseData[0];
					loginServiceObj.user.company_name = responseData.company_name;
					loginServiceObj.user.branch_id = responseData.branch_id;
					loginServiceObj.user.branch_name = responseData.branch_name;
					
					localStorage.setItem(
							KEYS.User, 
							JSON.stringify(loginServiceObj.user)
							);
					deferred.resolve();
					}
				
				function getCustomerCompanyBranchFailedCallback(responseError){	deferred.reject(responseError);
				}
				}
			}
		
		function doLoginFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return loginServiceObj;
	}