angular
.module('starter')
.controller(
		'manageNavigationController', 
		manageNavigationController
		);

manageNavigationController.$inject = [
                                      'BROADCAST_MESSAGES', 
                                      'KEYS', 
                                      '$localStorage', 
                                      '$scope', 
                                      '$state'
                                      ];

function manageNavigationController(
		BROADCAST_MESSAGES, 
		KEYS, 
		$localStorage, 
		$scope, 
		$state
		){
	const BRANCH_KEY = 'Branch';
	const MENU_KEY = 'Menu';
	const TABLE_KEY = 'Table';
	const MENUITEM_KEY = 'Menuitem';
	const ORDERREFERENCE_KEY = 'Orderreference';
	const ORDER_KEY = 'Order';
	const RESERVATION_KEY = 'Reservation';
	
	var vm = this;
	vm.isManageBranchHidden = true;
	vm.isManageMenuHidden = true;
	vm.isManageTableHidden = true;
	vm.isManageMenuitemHidden = true;
	vm.isManageOrderreferenceHidden = true;
	vm.isManageOrderHidden = true;
	vm.isManageReservationHidden = true;
	
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user= JSON.parse(vm.user);
		}
	
	vm.customerUsername = vm.user.username;
	
	//controller_method
	vm.initDom = initDom;
	
	function initDom(){
		const SELECTOR_USERMENU = 'ul.nav.nav_list-container > li > a';
		
		$(SELECTOR_USERMENU).each(
				function(){
					$(this).click(clickCallback);
					
					function clickCallback(){
						const CLASS_ACTIVE = 'active';
						
						//resets class attributes of usermenu
						$(SELECTOR_USERMENU).each(
								function(){	$(this).removeClass(CLASS_ACTIVE);
								}
								);
						
						//adds 'active' on class attribute of usermenu
						$(this).addClass(CLASS_ACTIVE);
						
						//hides inner nodes
						$(this).parent().find(SELECTOR_USERMENU).each(
								function(){
									var innerText = $(this).text();
									hideUsermenu(innerText);
									}
								);
						
						//hide sibling nodes
						$(this).parent().siblings('li').find(SELECTOR_USERMENU).each(
								function(){
									var innerText = $(this).text();
									hideUsermenu(innerText);
									}
								);
						
						function hideUsermenu(innerText){
							if(0 < innerText.indexOf(BRANCH_KEY)){	vm.isManageBranchHidden = true;
							} else if(0 < innerText.indexOf(MENUITEM_KEY)){	vm.isManageMenuitemHidden = true;
							} else if(0 < innerText.indexOf(TABLE_KEY)){	vm.isManageTableHidden = true;
							} else if(0 < innerText.indexOf(MENU_KEY)){	vm.isManageMenuHidden = true;
							} else if(0 < innerText.indexOf(ORDERREFERENCE_KEY)){	vm.isManageOrderreferenceHidden = true;
							} else if(0 < innerText.indexOf(ORDER_KEY)){	vm.isManageOrderHidden = true;
							} else if(0 < innerText.indexOf(RESERVATION_KEY)){	vm.isManageReservationHidden = true;
							}
							}
						}
					}
				);
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.toggleBranch, 
			toggleBranchCallback
			);
	
	function toggleBranchCallback(
			e, 
			args
			){
		vm.companyName = args.companyName;
		vm.isManageBranchHidden = !vm.isManageBranchHidden;
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.toggleMenu, 
			toggleMenuCallback
			);
	
	function toggleMenuCallback(
			e, 
			args
			){
		vm.companyName = args.companyName;
		vm.isManageMenuHidden = !vm.isManageMenuHidden;
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.toggleTable, 
			toggleTableCallback
			);
	
	function toggleTableCallback(
			e, 
			args
			){
		vm.companyName = args.companyName;
		vm.branchName = args.branchName;
		vm.isManageTableHidden = !vm.isManageTableHidden;
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.toggleMenuitem, 
			toggleMenuitemCallback
			);
	
	function toggleMenuitemCallback(
			e, 
			args
			){
		vm.companyName = args.companyName;
		vm.menuName = args.menuName;
		vm.isManageMenuitemHidden = !vm.isManageMenuitemHidden;
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.toggleOrderreference, 
			toggleOrderreferenceCallback
			);
	
	function toggleOrderreferenceCallback(
			e, 
			args
			){
		vm.companyName = args.companyName;
		vm.branchName = args.branchName;
		vm.tableNumber = args.tableNumber;
		vm.isManageOrderreferenceHidden = !vm.isManageOrderreferenceHidden;
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.toggleOrder, 
			toggleOrderCallback
			);
	
	function toggleOrderCallback(
			e, 
			args
			){
		vm.companyName = args.companyName;
		vm.branchName = args.branchName;
		vm.tableNumber = args.tableNumber;
		vm.orderreferenceCode = args.orderreferenceCode;
		vm.isManageOrderHidden = !vm.isManageOrderHidden;
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.toggleReservation, 
			toggleReservationCallback
			);
	
	function toggleReservationCallback(
			e, 
			args
			){
		vm.companyName = args.companyName;
		vm.branchName = args.branchName;
		vm.tableNumber = args.tableNumber;
		vm.orderreferenceCode = args.orderreferenceCode;
		vm.isManageReservationHidden = !vm.isManageReservationHidden;
		}
	}