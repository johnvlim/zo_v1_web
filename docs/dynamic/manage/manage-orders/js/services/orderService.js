angular
.module('starter')
.factory(
		'orderService', 
		orderService
		);

orderService.$inject = [
                        'API_BASE_URL', 
                        'BROADCAST_MESSAGES', 
                        'KEYS', 
                        'ORDER_STATUS', 
                        'ORDERS_DB_FIELDS', 
                        '$rootScope', 
                        '$http', 
                        '$localStorage', 
                        '$q', 
                        'loginService'
                        ];

function orderService(
		API_BASE_URL, 
		BROADCAST_MESSAGES, 
		KEYS, 
		ORDER_STATUS, 
		ORDERS_DB_FIELDS, 
		$rootScope, 
		$http, 
		$localStorage, 
		$q, 
		loginService
		){
	var orderServiceObj = {
			orders: {}, 
			companyName: undefined, 
			branchName: undefined, 
			tableNumber: undefined, 
			orderreferenceCode: undefined, 
			orderId: undefined, 
			getOrders: getOrders, 
			getCompanyName: getCompanyName, 
			getBranchName: getBranchName, 
			getTableNumber: getTableNumber, 
			getOrderreferenceCode: getOrderreferenceCode, 
			getOrderId: getOrderId, 
			setOrders: setOrders, 
			setCompanyName: setCompanyName, 
			setBranchName: setBranchName, 
			setTableNumber: setTableNumber, 
			setOrderreferenceCode: setOrderreferenceCode, 
			setOrderId: setOrderId, 
			getOptions: {
				1: 'getCompanyBranchOrders', 
				2: 'getCompanyBranchOrder', 
				3: 'getCompanyBranchOrdersOrderStatus', 
				4: 'getCompanyBranchOrdersNotOrderStatus', 
				5: 'getCompanyBranchTableOrders', 
				6: 'getCompanyBranchTableOrder', 
				7: 'getCompanyBranchTableOrdersOrderStatus', 
				8: 'getCompanyBranchTableOrdersNotOrderStatus', 
				9: 'getCompanyBranchTableOrderreferenceOrders', 
				10: 'getCompanyBranchTableOrderreferenceOrder', 
				11: 'getCompanyBranchTableOrderreferenceOrdersOrderStatus', 
				12: 'getCompanyBranchTableOrderreferenceOrdersNotOrderStatus', 
				13: 'getByQuery'
					}, 
					fetchOrders: fetchOrders, 
					addOrder: addOrder, 
					updateOrder: updateOrder, 
					deleteOrder: deleteOrder
					};
	
	function getOrders(){	return orderServiceObj.orders;
	}
	function getCompanyName(){	return orderServiceObj.companyName;
	}
	function getBranchName(){	return orderServiceObj.branchName;
	}
	function getTableNumber(){	return orderServiceObj.tableNumber;
	}
	function getOrderreferenceCode(){	return orderServiceObj.orderreferenceCode;
	}
	function getOrderId(){	return orderServiceObj.orderId;
	}
	function setOrders(orders){	orderServiceObj.orders = orders;
	}
	function setCompanyName(companyName){	orderServiceObj.companyName = companyName;
	}
	function setBranchName(branchName){	orderServiceObj.branchName = branchName;
	}
	function setTableNumber(tableNumber){	orderServiceObj.tableNumber = tableNumber;
	}
	function setOrderreferenceCode(orderreferenceCode){	orderServiceObj.orderreferenceCode = orderreferenceCode;
	}
	function setOrderId(orderId){	orderServiceObj.orderId = orderId;
	}
	
	function fetchOrders(
			getOption, 
			getParams
			){
		var deferred = $q.defer();
		var httpConfig = {	method: 'GET'	};
		
		switch(orderServiceObj.getOptions[getOption]){
		case 'getCompanyBranchOrders':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/orders';
			break;
		case 'getCompanyBranchOrder':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/orders/' + orderServiceObj.orderId;
			break;
		case 'getCompanyBranchOrdersOrderStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/orders/status/' + getParams['OrderStatus'];
			break;
		case 'getCompanyBranchOrdersNotOrderStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/orders/status_not/' + getParams['OrderStatus'];
			break;
		case 'getCompanyBranchTableOrders':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orders';
			break;
		case 'getCompanyBranchTableOrder':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orders/' + orderServiceObj.orderId;
			break;
		case 'getCompanyBranchTableOrdersOrderStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orders/status/' + getParams['OrderStatus'];
			break;
		case 'getCompanyBranchTableOrdersNotOrderStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orders/status_not/' + getParams['OrderStatus'];
			break;
		case 'getCompanyBranchTableOrderreferenceOrders':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orderreferences/' + orderServiceObj.orderreferenceCode + '/orders';
			break;
		case 'getCompanyBranchTableOrderreferenceOrder':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orderreferences/' + orderServiceObj.orderreferenceCode + '/orders/' + orderServiceObj.orderId;
			break;
		case 'getCompanyBranchTableOrderreferenceOrdersOrderStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orderreferences/' + orderServiceObj.orderreferenceCode + '/orders/status/' + getParams['OrderStatus'];
			break;
		case 'getCompanyBranchTableOrderreferenceOrdersNotOrderStatus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orderreferences/' + orderServiceObj.orderreferenceCode + '/orders/status_not/' + getParams['OrderStatus'];
			break;
		case 'getByQuery':
			httpConfig['url'] = API_BASE_URL + '/query/orders' + getParams['queryString'];
			default: break;
			}
		
		$http(httpConfig)
		.then(fetchOrdersSuccessCallback)
		.catch(fetchOrdersFailedCallback);
		
		function fetchOrdersSuccessCallback(response){
			var orders = undefined;
			orderServiceObj.orders = {};
			
			convertOrdersResponseToMap(response.data);
			orders = orderServiceObj.orders;
			orders = JSON.stringify(orders);
			localStorage.setItem(
					KEYS.Orders, 
					orders
					);
			
			deferred.resolve(response);
			}
		
		function fetchOrdersFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertOrdersResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var ordersDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(ORDERS_DB_FIELDS).length; j++){	ordersDetails[ ORDERS_DB_FIELDS[j]] = responseData[i][ ORDERS_DB_FIELDS[j]];
				}
				
				key = responseData[i][ORDERS_DB_FIELDS[0]]; //order_id
				orderServiceObj.orders[key] = ordersDetails;
				}
			}
		return deferred.promise;
		}
	
	function addOrder(orders){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orderreferences/' + orderServiceObj.orderreferenceCode + '/orders', 
				data: orders
				};
		
		$http(httpConfig)
		.then(addOrderSuccessCallback)
		.catch(addOrderFailedCallback);
		
		function addOrderSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addOrderFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function updateOrder(order){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orderreferences/' + orderServiceObj.orderreferenceCode + '/orders/' + orderServiceObj.orderId, 
				data: order
				};
		
		$http(httpConfig)
		.then(updateOrderSuccessCallback)
		.catch(updateOrderFailedCallback);
		
		function updateOrderSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateOrderFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function deleteOrder(deleteOption){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + orderServiceObj.companyName + '/branches/' + orderServiceObj.branchName + '/tables/' + orderServiceObj.tableNumber + '/orderreferences/' + orderServiceObj.orderreferenceCode + '/orders/' + orderServiceObj.orderId
					};
		
		$http(httpConfig)
		.then(deleteOrderSuccessCallback)
		.catch(deleteOrderFailedCallback);
		
		function deleteOrderSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteOrderFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return orderServiceObj;
	}