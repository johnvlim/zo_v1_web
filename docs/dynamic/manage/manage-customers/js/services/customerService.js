angular
.module('starter')
.factory(
		'customerService', 
		customerService
		);

customerService.$inject = [
                           'API_BASE_URL', 
                           'CUSTOMERS_DB_FIELDS', 
                           'KEYS', 
                           '$http', 
                           '$localStorage', 
                           '$q'
                           ];

function customerService(
		API_BASE_URL, 
		CUSTOMERS_DB_FIELDS, 
		KEYS, 
		$http, 
		$localStorage, 
		$q
		){
	var customerServiceObj = {
			customers: {}, 
			customerUsername: undefined, 
			getCustomers: getCustomers, 
			getCustomerUsername: getCustomerUsername, 
			setCustomers: setCustomers, 
			setCustomerUsername: setCustomerUsername, 
			getOptions: {
				1: 'getCustomers_asAdministrator', 
				2: 'getCustomers', 
				3: 'getCustomer'
					}, 
					fetchCustomers: fetchCustomers, 
					addCustomerValidate: addCustomerValidate, 
					addCustomer: addCustomer, 
					updateCustomerValidate: updateCustomerValidate, 
					updateCustomer: updateCustomer, 
					deleteCustomer: deleteCustomer
					};
	
	function getCustomers(){	return customerServiceObj.customers;
	}
	function getCustomerUsername(){	return customerServiceObj.customerUsername;
	}
	function setCustomers(customers){	customerServiceObj.customers = customers;
	}
	function setCustomerUsername(customerUsername){	customerServiceObj.customerUsername = customerUsername;
	}
	
	function fetchCustomers(
			getOption, 
			getParams
			){
		var deferred = $q.defer();
		var httpConfig = {	method: 'GET'	};
		
		switch(customerServiceObj.getOptions[getOption]){
		case 'getOptionsAdvertisements':
			httpConfig['url'] = API_BASE_URL + '/customers/companies/' + getParams['CompanyName'];
			break;
		case 'getCustomers':
			httpConfig['url'] = API_BASE_URL + '/customers';
			break;
		case 'getCustomer':
			httpConfig['url'] = API_BASE_URL + '/customers/' + customerServiceObj.customerUsername;
			break;
			default:
				break;
			}
		
		$http(httpConfig)
		.then(fetchCustomersSuccessCallback)
		.catch(fetchCustomersFailedCallback);
		
		function fetchCustomersSuccessCallback(response){
			var customers = undefined;
			customerServiceObj.customers = {};
			
			convertCustomersResponseToMap(response.data);
			customers = customerServiceObj.customers;
			customers = JSON.stringify(customers);
			localStorage.setItem(
					KEYS.Customers, 
					customers
					);
			
			deferred.resolve(response);
			}
		
		function fetchCustomersFailedCallback(responseError){	return deferred.reject(responseError);
		}
		
		function convertCustomersResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var customersDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(CUSTOMERS_DB_FIELDS).length; j++){	customersDetails[CUSTOMERS_DB_FIELDS[j]] = responseData[i][CUSTOMERS_DB_FIELDS[j]];
				}
				
				key = responseData[i][CUSTOMERS_DB_FIELDS[0]]; //customer_username
				customerServiceObj.customers[key] = customersDetails;
				}
			}
		return deferred.promise;
		}
	
	function addCustomerValidate(customers){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/customers/validate', 
				data: customers
				};
		
		$http(httpConfig)
		.then(addCustomerValidateSuccessCallback)
		.catch(addCustomerValidateFailedCallback);
		
		function addCustomerValidateSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addCustomerValidateFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function addCustomer(customers){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/customers', 
				data: customers
				};
		
		$http(httpConfig)
		.then(addCustomerSuccessCallback)
		.catch(addCustomerFailedCallback);
		
		function addCustomerSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addCustomerFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function updateCustomerValidate(customer){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/customers/' + customerServiceObj.customerUsername + '/validate', 
				data: customer
				};
		
		$http(httpConfig)
		.then(updateCustomerSuccessCallback)
		.catch(updateCustomerFailedCallback);
		
		function updateCustomerSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateCustomerFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function updateCustomer(customer){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/customers/' + customerServiceObj.customerUsername, 
				data: customer
				};
		
		$http(httpConfig)
		.then(updateCustomerSuccessCallback)
		.catch(updateCustomerFailedCallback);
		
		function updateCustomerSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateCustomerFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function deleteCustomer(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/customers/' + customerServiceObj.customerUsername
				};
		
		$http(httpConfig)
		.then(deleteCustomerSuccessCallback)
		.catch(deleteCustomerFailedCallback);
		
		function deleteCustomerSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteCustomerFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return customerServiceObj;
	}