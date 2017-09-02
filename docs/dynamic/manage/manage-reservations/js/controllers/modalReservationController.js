angular
.module('starter')
.controller(
		'modalReservationController', 
		modalReservationController
		);

modalReservationController.$inject = [
                                      'PAYMENT_MODES', 
                                      'RESERVATION_STATUS', 
                                      '$uibModalInstance', 
                                      '$timeout', 
                                      'reservationService', 
                                      'reservation', 
                                      'formMode', 
                                      'modalHiddenFields'
                                      ];

function modalReservationController(
		PAYMENT_MODES, 
		RESERVATION_STATUS, 
		$uibModalInstance, 
		$timeout, 
		reservationService, 
		reservation, 
		formMode, 
		modalHiddenFields
		){
	const RESERVATION_ADD_CATCH_MESSAGE = 'UNABLE TO ADD RESERVATION, DB EXCEPTION ENCOUNTERED';
	const RESERVATION_UPDATE_CATCH_MESSAGE = 'UNABLE TO UPDATE RESERVATION, DB EXCEPTION ENCOUNTERED';
	const RESERVATION_UPDATE_CUSTOM_ERR_MESSAGE = 'UNABLE TO UPDATE RESERVATION, DATA IS EMPTY/UNCHANGED';
	const RESERVATION_DELETE_CATCH_MESSAGE = 'UNABLE TO DELETE RESERVATION, DB EXCEPTION ENCOUNTERED';
	const DOM_MODAL_RESERVATION = '#modal_reservation';
	const DOM_MODAL_RESERVATION_CONTAINER = '#modal_reservation-container';
	
	var vm = this;
	vm.formMode = formMode;
	vm.reservation= reservation;
	vm.reservationSnapshot = JSON.parse(JSON.stringify(reservation));
	vm.modalHiddenFields = modalHiddenFields;
	vm.dom2DbColumn = {
			reservationCode: 'reservation_code', 
			customerUsername: 'customer_username', 
			orderreferenceCode: 'orderreference_code', 
			reservationDinersCount: 'reservation_diners_count', 
			reservationEta: 'reservation_eta', 
			reservationPaymentMode: 'reservation_payment_mode', 
			reservationServiceTime: 'reservation_service_time', 
			reservationStatus: 'reservation_status'
				};
	vm.dbColumn2Dom = {
			reservation_code: 'reservationCode', 
			customer_username: 'customerUsername', 
			orderreference_code: 'orderreferenceCode', 
			reservation_diners_count: 'reservationDinersCount', 
			reservation_eta: 'reservationEta', 
			reservation_payment_mode: 'reservationPaymentMode', 
			reservation_service_time: 'reservationServiceTime', 
			reservation_status: 'reservationStatus'
				};
	vm.dbColumn2DomIndex = {
			reservation_code: 0, 
			customer_username: 1,  
			orderreference_code: 2, 
			reservation_diners_count: 3, 
			reservation_eta: 4, 
			reservation_payment_mode: 5, 
			reservation_service_time: 6,  
			reservation_status: 7
			};
	vm.reservationPaymentModeOptions = PAYMENT_MODES;
	vm.reservationStatusOptions = RESERVATION_STATUS;
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
		$(DOM_MODAL_RESERVATION).validator();
		$(DOM_MODAL_RESERVATION).validator().on(
				'submit', 
				doSubmit
				);
		
		$timeout(
				function(){	$(DOM_MODAL_RESERVATION).validator('update');
				}
				);
		}
	
	function initDom(){
		if('D' == vm.formMode){
			$('#modal_reservation-container input').prop(
					'disabled', 
					true
					);
			$('#modal_reservation-container textarea').prop(
					'disabled', 
					true
					);
			$('#modal_reservation-container select').prop(
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
		
		showBootstrapLoader($(DOM_MODAL_RESERVATION_CONTAINER));
		
		if('I' == vm.formMode){
			data[0].reservation_status_change_timestamp = moment(new Date()).format('YYYY-MM-DD h:mm:ss');
			
			reservationService.setCompanyName(vm.reservation.companyName);
			reservationService.setBranchName(vm.reservation.branchName);
			reservationService.setTableNumber(vm.reservation.tableNumber);
			reservationService.setOrderreferenceCode(vm.reservation.orderreferenceCode);
			
			reservationService.addReservation(data)
			.then(addReservationSuccessCallback)
			.catch(addReservationFailedCallback);
			
			function addReservationSuccessCallback(response){
				hideBootstrapLoader($(DOM_MODAL_RESERVATION_CONTAINER));
				
				$uibModalInstance.close();
				}
			
			function addReservationFailedCallback(responseError){
				hideBootstrapLoader($(DOM_MODAL_RESERVATION_CONTAINER));
				
				try{
					JSON.parse(responseError.statusText);
					genValidationErrorFromResponse(responseError);
					} catch(e){	showBootstrapAlert(RESERVATION_ADD_CATCH_MESSAGE);
					}
					}
			} else if('A' == vm.formMode){
				discardModalHiddenFields();
				discardModalUnchangedFields();
				
				if(0 == Object.keys(data).length){
					hideBootstrapLoader($(DOM_MODAL_RESERVATION_CONTAINER));
					
					showBootstrapLoader(RESERVATION_UPDATE_CUSTOM_ERR_MESSAGE);
					
					return;
					}
				
				if(!(null == data.reservation_status)){	data[0].reservation_status_change_timestamp = moment(new Date()).format('YYYY-MM-DD h:mm:ss');
				}
				data[0].reservation_last_change_timestamp = moment(new Date()).format('YYYY-MM-DD h:mm:ss');
				
				reservationService.setCompanyName(vm.reservationSnapshot.companyName);
				reservationService.setBranchName(vm.reservationSnapshot.branchName);
				reservationService.setTableNumber(vm.reservationSnapshot.tableNumber);
				reservationService.setOrderreferenceCode(vm.reservationSnapshot.orderreferenceCode);
				
				reservationService.updateReservation(data)
				.then(updateReservationSuccessCallback)
				.catch(updateReservationFailedCallback);
				
				function updateReservationSuccessCallback(response){
					hideBootstrapLoader($(DOM_MODAL_RESERVATION_CONTAINER));
					
					$uibModalInstance.close();
					}
				
				function updateReservationFailedCallback(responseError){
					hideBootstrapLoader($(DOM_MODAL_RESERVATION_CONTAINER));
					
					try{
						JSON.parse(responseError.statusText);
						genValidationErrorFromResponse(responseError);
						} catch(e){	showBootstrapAlert(RESERVATION_UPDATE_CATCH_MESSAGE);
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
								var reservationSnapshotValue = vm.reservationSnapshot[vm.dbColumn2Dom[dataKey]];
								
								if(dataValue == reservationSnapshotValue){	delete data[0][dataKey];
								}
								}
							);
					}
				} else if('D' == vm.formMode){
					reservationService.setCompanyName(vm.reservation.companyName);
					reservationService.setBranchName(vm.reservation.branchName);
					reservationService.setTableNumber(vm.reservation.tableNumber);
					reservationService.setOrderreferenceCode(vm.reservation.orderreferenceCode);
					reservationService.setReservationCode(vm.reservation.reservationCode);
					
					reservationService.deleteReservation()
					.then(deleteReservationSuccessCallback)
					.catch(deleteReservationFailedCallback);
					
					function deleteReservationSuccessCallback(response){
						hideBootstrapLoader($(DOM_MODAL_RESERVATION_CONTAINER));
						
						$uibModalInstance.close();
						}
					
					function deleteReservationFailedCallback(responseError){
						hideBootstrapLoader($(DOM_MODAL_RESERVATION_CONTAINER));
						
						try{
							JSON.parse(responseError.statusText);
							genValidationErrorFromResponse(responseError);
							} catch(e){	showBootstrapAlert(RESERVATION_DELETE_CATCH_MESSAGE);
							}
							}
					}
		vm.validationErr = {};
		vm.validationErrDB = {};
		}
	
	function doDom2DbColumn(){
		data = {};
		
		Object.keys(vm.reservation).forEach(
				function(reservationKey){
					if(
							!(null == vm.dom2DbColumn[reservationKey]) &&
							!(undefined == vm.dom2DbColumn[reservationKey])
							){	data[vm.dom2DbColumn[reservationKey]] = vm.reservation[reservationKey];
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
					var errorMsg = statusTextObj[statusTextKey][0];
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