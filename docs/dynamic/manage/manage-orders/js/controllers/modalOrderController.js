angular
.module('starter')
.controller(
		'modalOrderController', 
		modalOrderController
		);

modalOrderController.$inject = [
                                'ORDER_STATUS', 
                                '$uibModalInstance', 
                                '$timeout', 
                                'orderService', 
                                'order', 
                                'formMode', 
                                'modalHiddenFields'
                                ];

function modalOrderController(
		ORDER_STATUS, 
		$uibModalInstance, 
		$timeout, 
		orderService, 
		order, 
		formMode, 
		modalHiddenFields
		){
	const ORDER_ADD_CATCH_MESSAGE = 'UNABLE TO ADD ORDER, DB EXCEPTION ENCOUNTERED';
	const ORDER_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE ORDER, DB EXCEPTION ENCOUNTERED';
	const ORDER_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE ORDER, DATA IS EMPTY/UNCHANGED';
	const ORDER_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE ORDER, DB EXCEPTION ENCOUNTERED';
	const DOM_MODAL_ORDER = '#modal_order';
	const DOM_MODAL_ORDER_CONTAINER = '#modal_order-container';
	
	var vm = this;
	vm.formMode = formMode;
	if(order){
		vm.order = order;
		vm.order.menuitemId = parseInt(vm.order.menuitemId);
		angular.forEach(
				ORDER_STATUS, 
				function(
						v, 
						k
						){
					if(v == vm.order.orderStatus){	vm.order.orderStatus = k;
					}
					}
				);
		}
	vm.orderSnapshot = JSON.parse(JSON.stringify(order));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			menuitemId: 'menuitem_id', 
			orderreferenceCode: 'orderreference_code', 
			orderStatus: 'order_status'
				};
	vm.dbColumn2Dom = {
			menuitem_id: 'menuitemId', 
			orderreference_code: 'orderreferenceCode', 
			order_status: 'orderStatus'
				};
	vm.dbColumn2DomIndex = {
			menuitem_id: 0, 
			orderreference_code: 1, 
			order_status: 2
			};
	vm.orderStatusOptions = ORDER_STATUS;
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
		$(DOM_MODAL_ORDER).validator();
		$(DOM_MODAL_ORDER).validator().on(
				'submit', 
				doSubmit
				);
		
		$timeout(
				function(){	$(DOM_MODAL_ORDER).validator('update');
				}
				);
		}
	
	function initDom(){
		if('D' == vm.formMode){
			$('#modal_order-container input').prop(
					'disabled', 
					true
					);
			$('#modal_order-container textarea').prop(
					'disabled', 
					true
					);
			$('#modal_order-container select').prop(
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
		
		showBootstrapLoader($(DOM_MODAL_ORDER_CONTAINER));
		
		if('I' == vm.formMode){
			data[0].order_status_change_timestamp = moment(new Date()).format('YYYY-MM-DD h:mm:ss');
			
			orderService.setCompanyName(vm.order.companyName);
			orderService.setBranchName(vm.order.branchName);
			orderService.setTableNumber(vm.order.tableNumber);
			orderService.setOrderreferenceCode(vm.order.orderreferenceCode);
			
			orderService.addOrder(data)
			.then(addOrderSuccessCallback)
			.catch(addOrderFailedCallback);
			
			function addOrderSuccessCallback(response){
				hideBootstrapLoader($(DOM_MODAL_ORDER_CONTAINER));
				
				$uibModalInstance.close();
				}
			
			function addOrderFailedCallback(responseError){
				hideBootstrapLoader($(DOM_MODAL_ORDER_CONTAINER));
				
				try{
					JSON.parse(responseError.statusText);
					genValidationErrorFromResponse(responseError);
					} catch(e){	showBootstrapAlert(ORDER_ADD_CATCH_MESSAGE);
					}
					}
			} else if('A' == vm.formMode){
				discardModalHiddenFields();
				discardModalUnchangedFields();
				
				if(0 == Object.keys(data).length){
					hideBootstrapLoader($(DOM_MODAL_ORDER_CONTAINER));
					
					showBootstrapLoader(ORDER_UPDATE_CUSTOM_ERR_MESSAGE);
					
					return;
					}
				
				if(!(null == data.order_status)){	data[0].order_status_change_timestamp = moment(new Date()).format('YYYY-MM-DD h:mm:ss');
				}
				data[0].order_last_change_timestamp = moment(new Date()).format('YYYY-MM-DD h:mm:ss');
				
				orderService.setCompanyName(vm.orderSnapshot.companyName);
				orderService.setBranchName(vm.orderSnapshot.branchName);
				orderService.setTableNumber(vm.orderSnapshot.tableNumber);
				orderService.setOrderreferenceCode(vm.orderSnapshot.orderreferenceCode);
				orderService.setOrderId(vm.orderSnapshot.orderId);
				
				orderService.updateOrder(data)
				.then(updateOrderSuccessCallback)
				.catch(updateOrderFailedCallback);
				
				function updateOrderSuccessCallback(response){
					hideBootstrapLoader($(DOM_MODAL_ORDER_CONTAINER));
					
					$uibModalInstance.close();
					}
				
				function updateOrderFailedCallback(responseError){
					hideBootstrapLoader($(DOM_MODAL_ORDER_CONTAINER));
					
					try{
						JSON.parse(responseError.statusText);
						genValidationErrorFromResponse(responseError);
						} catch(e){	showBootstrapAlert(ORDER_UPDATE_CATCH_MESSAGE);
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
								var orderSnapshotValue = vm.orderSnapshot[vm.dbColumn2Dom[dataKey]];
								
								if(dataValue == orderSnapshotValue){	delete data[0][dataKey];
								}
								}
							);
					}
				} else if('D' == vm.formMode){
					orderService.setCompanyName(vm.order.companyName);
					orderService.setBranchName(vm.order.branchName);
					orderService.setTableNumber(vm.order.tableNumber);
					orderService.setOrderreferenceCode(vm.order.orderreferenceCode);
					orderService.setOrderId(vm.order.orderId);
					
					orderService.deleteOrder()
					.then(deleteOrderSuccessCallback)
					.catch(deleteOrderFailedCallback);
					
					function deleteOrderSuccessCallback(response){
						hideBootstrapLoader($(DOM_MODAL_ORDER_CONTAINER));
						
						$uibModalInstance.close();
						}
					
					function deleteOrderFailedCallback(responseError){
						hideBootstrapLoader($(DOM_MODAL_ORDER_CONTAINER));
						
						try{
							JSON.parse(responseError.statusText);
							genValidationErrorFromResponse(responseError);
							} catch(e){	showBootstrapAlert(ORDER_DELETE_CATCH_MESSAGE);
							}
							}
					}
		vm.validationErr = {};
		vm.validationErrDB = {};
		}
	
	function doDom2DbColumn(){
		var data = {};
		
		Object.keys(vm.order).forEach(
				function(orderKey){
					if(
							!(null == vm.dom2DbColumn[orderKey]) &&
							!(undefined == vm.dom2DbColumn[orderKey])
							){	data[vm.dom2DbColumn[orderKey]] = vm.order[orderKey];
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