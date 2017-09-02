angular
.module('starter')
.factory(
		'orderreferenceService', 
		orderreferenceService
		);

orderreferenceService.$inject = [
                                 'API_BASE_URL', 
                                 'BRANCHES_DB_FIELDS', 
                                 'COMPANIES_DB_FIELDS', 
                                 'CUSTOMERS_DB_FIELDS', 
                                 'KEYS', 
                                 'ORDERREFERENCES_DB_FIELDS', 
                                 'TABLES_DB_FIELDS', 
                                 '$http', 
                                 '$localStorage', 
                                 '$q'
                                 ];

function orderreferenceService(
		API_BASE_URL, 
		BRANCHES_DB_FIELDS, 
		COMPANIES_DB_FIELDS, 
		CUSTOMERS_DB_FIELDS, 
		KEYS, 
		ORDERREFERENCES_DB_FIELDS, 
		TABLES_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q
		){
	var orderreferenceServiceObj = {
			orderreferences: {}, 
			companyName: undefined, 
			branchName: undefined, 
			tableNumber: undefined, 
			customerUsername: undefined, 
			orderreferenceCode: undefined, 
			getOrderreferences: getOrderreferences, 
			getCompanyName: getCompanyName, 
			getBranchName: getBranchName, 
			getTableNumber: getTableNumber, 
			getCustomerUsername: getCustomerUsername, 
			getOrderreferenceCode: getOrderreferenceCode, 
			setOrderreferences: setOrderreferences, 
			setCompanyName: setCompanyName, 
			setBranchName: setBranchName, 
			setTableNumber: setTableNumber, 
			setCustomerUsername: setCustomerUsername, 
			setOrderreferenceCode: setOrderreferenceCode, 
			getOptions: {
				1: 'getCompanyBranchOrderreferences', 
				2: 'getCompanyBranchOrderreference', 
				3: 'getCompanyBranchOrderreferencesOrderreferenceStatus', 
				4: 'getCompanyBranchOrderreferencesNotOrderreferenceStatus', 
				5: 'getCompanyBranchTableOrderreferences', 
				6: 'getCompanyBranchTableOrderreference', 
				7: 'getCompanyBranchTableOrderreferencesOrderreferenceStatus', 
				8: 'getCompanyBranchTableOrderreferencesNotOrderreferenceStatus', 
				9: 'getCustomerOrderreferences', 
				10: 'getCustomerOrderreference', 
				11: 'getCustomerOrderreferencesOrderreferenceStatus', 
				12: 'getCustomerOrderreferencesNotOrderreferenceStatus'
			}, 
			fetchOrderreferences: fetchOrderreferences, 
			addOrderreference: addOrderreference, 
			addOrderreferenceValidate: addOrderreferenceValidate, 
			updateOrderreference: updateOrderreference, 
			deleteOrderreference: deleteOrderreference
			};
	
	function getOrderreferences(){	return orderreferenceServiceObj.orderreferences;
	}
	function getCompanyName(){	return orderreferenceServiceObj.companyName;
	}
	function getBranchName(){	return orderreferenceServiceObj.branchName;
	}
	function getTableNumber(){	return orderreferenceServiceObj.tableNumber;
	}
	function getCustomerUsername(){	return orderreferenceServiceObj.customerUsername;
	}
	function getOrderreferenceCode(){	return orderreferenceServiceObj.orderreferenceCode;
	}
	function setOrderreferences(orderreferences){	orderreferenceServiceObj.orderreferences = orderreferences;
	}
	function setCompanyName(companyName){	orderreferenceServiceObj.companyName = companyName;
	}
	function setBranchName(branchName){	orderreferenceServiceObj.branchName = branchName;
	}
	function setTableNumber(tableNumber){	orderreferenceServiceObj.tableNumber = tableNumber;
	}
	function setCustomerUsername(customerUsername){	orderreferenceServiceObj.customerUsername = customerUsername;
	}
	function setOrderreferenceCode(orderreferenceCode){	orderreferenceServiceObj.orderreferenceCode = orderreferenceCode;
	}
	
	function fetchOrderreferences(
			getOption, 
			getParams
			){
		var deferred = $q.defer();
		var httpConfig = {	method: 'GET'	};
		
		switch(orderreferenceServiceObj.getOptions[getOption]){
		case 'getCompanyBranchOrderreferences':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderreferenceServiceObj.companyName + '/branches/' + orderreferenceServiceObj.branchName + '/orderreferences';
			break;
		case 'getCompanyBranchOrderreference':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderreferenceServiceObj.companyName + '/branches/' + orderreferenceServiceObj.branchName + '/orderreferences/' + orderreferenceServiceObj.orderreferenceCode;
			break;
		case 'getCompanyBranchOrderreferencesOrderreferenceStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderreferenceServiceObj.companyName + '/branches/' + orderreferenceServiceObj.branchName + '/orderreferences/status/' + getParams['OrderreferenceStatus'];
			break;
		case 'getCompanyBranchOrderreferencesNotOrderreferenceStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderreferenceServiceObj.companyName + '/branches/' + orderreferenceServiceObj.branchName + '/orderreferences/status_not/' + getParams['OrderreferenceStatus'];
			break;
		case 'getCompanyBranchTableOrderreferences':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderreferenceServiceObj.companyName + '/branches/' + orderreferenceServiceObj.branchName + '/tables/' + orderreferenceServiceObj.tableNumber + '/orderreferences';
			break;
		case 'getCompanyBranchTableOrderreference':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderreferenceServiceObj.companyName + '/branches/' + orderreferenceServiceObj.branchName + '/tables/' + orderreferenceServiceObj.tableNumber + '/orderreferences/' + orderreferenceServiceObj.orderreferenceCode;
			break;
		case 'getCompanyBranchTableOrderreferencesOrderreferenceStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderreferenceServiceObj.companyName + '/branches/' + orderreferenceServiceObj.branchName + '/tables/' + orderreferenceServiceObj.tableNumber + '/orderreferences/status/' + getParams['OrderreferenceStatus'];
			break;
		case 'getCompanyBranchTableOrderreferencesNotOrderreferenceStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderreferenceServiceObj.companyName + '/branches/' + orderreferenceServiceObj.branchName + '/tables/' + orderreferenceServiceObj.tableNumber + '/orderreferences/status_not/' + getParams['OrderreferenceStatus'];
			break;
		case 'getCustomerOrderreferences':
			httpConfig['url'] = API_BASE_URL + '/customers/' + orderreferenceServiceObj.customerUsername + '/orderreferences';
			break;
		case 'getCustomerOrderreference':
			httpConfig['url'] = API_BASE_URL + '/customers/' + orderreferenceServiceObj.customerUsername + '/orderreferences/' + orderreferenceServiceObj.orderreferenceCode;
			break;
		case 'getCustomerOrderreferencesOrderreferenceStatus':
			httpConfig['url'] = API_BASE_URL + '/customers/' + orderreferenceServiceObj.customerUsername + '/orderreferences/status/' + getParams['OrderreferenceStatus'];
			break;
		case 'getCustomerOrderreferencesNotOrderreferenceStatus':
			httpConfig['url'] = API_BASE_URL + '/customers/' + orderreferenceServiceObj.customerUsername + '/orderreferences/status_not/' + getParams['OrderreferenceStatus'];
			break;
			default:
				break;
			}
		
		$http(httpConfig)
		.then(fetchOrderreferencesSuccessCallback)
		.catch(fetchOrderreferencesFailedCallback);
		
		function fetchOrderreferencesSuccessCallback(response){
			var orderreferences = undefined;
			orderreferenceServiceObj.orderreferences = {};
			
			convertOrderreferencesResponseToMap(response.data);
			orderreferences = orderreferenceServiceObj.orderreferences;
			orderreferences = JSON.stringify(orderreferences);
			localStorage.setItem(
					KEYS.Orderreferences, 
					orderreferences
					);
			
			deferred.resolve(response);
			}
		
		function fetchOrderreferencesFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertOrderreferencesResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var orderreferencesDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(CUSTOMERS_DB_FIELDS).length; j++){
					if(null == orderreferencesDetails[KEYS.Customers]){	orderreferencesDetails[KEYS.Customers] = {};
					}
					orderreferencesDetails[KEYS.Customers][CUSTOMERS_DB_FIELDS[j]] = responseData[i][CUSTOMERS_DB_FIELDS[j]];
					}
				for(var j=0; j<Object.keys(COMPANIES_DB_FIELDS).length; j++){
					if(null == orderreferencesDetails[KEYS.Companies]){	orderreferencesDetails[KEYS.Companies] = {};
					}
					orderreferencesDetails[KEYS.Companies][COMPANIES_DB_FIELDS[j]] = responseData[i][COMPANIES_DB_FIELDS[j]];
					}
				for(var j=0; j<Object.keys(BRANCHES_DB_FIELDS).length; j++){
					if(null == orderreferencesDetails[KEYS.Branches]){	orderreferencesDetails[KEYS.Branches] = {};
					}
					orderreferencesDetails[KEYS.Branches][BRANCHES_DB_FIELDS[j]] = responseData[i][BRANCHES_DB_FIELDS[j]];
					}
				for(var j=0; j<Object.keys(TABLES_DB_FIELDS).length; j++){
					if(null == orderreferencesDetails[KEYS.Tables]){	orderreferencesDetails[KEYS.Tables] = {};
					}
					orderreferencesDetails[KEYS.Tables][TABLES_DB_FIELDS[j]] = responseData[i][TABLES_DB_FIELDS[j]];
					}
				for(var j=0; j<Object.keys(ORDERREFERENCES_DB_FIELDS).length; j++){
					if(null == orderreferencesDetails[KEYS.Orderreferences]){	orderreferencesDetails[KEYS.Orderreferences] = {};
					}
					orderreferencesDetails[KEYS.Orderreferences][ORDERREFERENCES_DB_FIELDS[j]] = responseData[i][ORDERREFERENCES_DB_FIELDS[j]];
					}
				
				key = responseData[i][ORDERREFERENCES_DB_FIELDS[1]]; //orderreference_code
				orderreferenceServiceObj.orderreferences[key] = orderreferencesDetails;
				}
			}
		return deferred.promise;
		}
	
	function addOrderreference(orderreferences){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + orderreferenceServiceObj.companyName + '/branches/' + orderreferenceServiceObj.branchName + '/tables/' + orderreferenceServiceObj.tableNumber + '/orderreferences', 
				data: orderreferences
				};
		
		$http(httpConfig)
		.then(addOrderreferenceSuccessCallback)
		.catch(addOrderreferenceFailedCallback);
		
		function addOrderreferenceSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addOrderreferenceFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function addOrderreferenceValidate(orderreferences){
		var isOrderreferenceValid = true;
		
		if(!(null == orderreferences)){
			angular.forEach(
					orderreferences, 
					function(
							v, 
							k
							){
						switch(k){
						case 'customer_username':
							if(null == v){	isOrderreferenceValid = isOrderreferenceValid && false;
							}
							break;
						case 'table_id':
							if(null == v){	isOrderreferenceValid = isOrderreferenceValid && false;
							}
							break;
						case 'orderreference_status':
							if(null == v){	isOrderreferenceValid = isOrderreferenceValid && false;
							}
							break;
						case 'orderreference_status_change_timestamp':
							if(null == v){	isOrderreferenceValid = isOrderreferenceValid && false;
							}
							break;
							}
						}
					);
			} else {	isOrderreferenceValid = isOrderreferenceValid && false;
			}
		return isOrderreferenceValid;
		}
	
	function updateOrderreference(orderreference){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + orderreferenceServiceObj.companyName + '/branches/' + orderreferenceServiceObj.branchName + '/tables/' + orderreferenceServiceObj.tableNumber + '/orderreferences/' + orderreferenceServiceObj.orderreferenceCode, 
				data: orderreference
				};
		
		$http(httpConfig)
		.then(updateOrderreferenceSuccessCallback)
		.catch(updateOrderreferenceFailedCallback);
		
		function updateOrderreferenceSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateOrderreferenceFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function deleteOrderreference(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + orderreferenceServiceObj.companyName + '/branches/' + orderreferenceServiceObj.branchName + '/tables/' + orderreferenceServiceObj.tableNumber + '/orderreferences/' + orderreferenceServiceObj.orderreferenceCode
				};
		
		$http(httpConfig)
		.then(deleteOrderreferenceSuccessCallback)
		.catch(deleteOrderreferenceFailedCallback);
		
		function deleteOrderreferenceSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteOrderreferenceFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return orderreferenceServiceObj;
	}