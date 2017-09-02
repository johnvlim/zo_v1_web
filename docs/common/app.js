angular
.module(
		'starter', 
		[
			'datatables.buttons', 
			'datatables.bootstrap', 
			'datatables.fixedcolumns', 
			'datatables.light-columnfilter', 
			'datatables.scroller', 
			'datatables.select', 
			'ngStorage', 
			'ui.bootstrap', 
			'ui.router', 
			'monospaced.qrcode'
			]
		)
		
.config(doRouteConfig)
.run(doRunConfig);

function doRouteConfig(
		$stateProvider, 
		$urlRouterProvider
		){
	$stateProvider
	.state(
			'manage', 
			{
				url: '/manage', 
				views: {
					'main': {
						templateUrl: 'docs/dynamic/manage/manage.html'
							}
			}
			}
			)
			.state(
					'manage.company', 
					{
						url: '/company', 
						views: {
							'manage-datatable': {
								templateUrl: 'docs/dynamic/manage/manage-companies/manageCompany.html', 
								controller: 'manageCompanyController', 
								controllerAs: 'manageCompanyController'
									}
					}
					}
					)
			.state(
					'manage.customer', 
					{
						url: '/customer', 
						views: {
							'manage-datatable': {
								templateUrl: 'docs/dynamic/manage/manage-customers/manageCustomer.html', 
								controller: 'manageCustomerController', 
								controllerAs: 'manageCustomerController'
									}
					}
					}
					)
			.state(
					'manage.company.branch', 
					{
						url: '/:companyName/branch', 
						views: {
							'manage-datatable@manage': {
								templateUrl: 'docs/dynamic/manage/manage-branches/manageBranch.html', 
								controller: 'manageBranchController', 
								controllerAs: 'manageBranchController'
									}
					}
					}
					)
			.state(
					'manage.company.menu', 
					{
						url: '/:companyName/menu', 
						views: {
							'manage-datatable@manage': {
								templateUrl: 'docs/dynamic/manage/manage-menus/manageMenu.html', 
								controller: 'manageMenuController', 
								controllerAs: 'manageMenuController'
									}
					}
					}
					)
			.state(
					'manage.company.branch.table', 
					{
						url: '/:branchName/table', 
						views: {
							'manage-datatable@manage': {
								templateUrl: 'docs/dynamic/manage/manage-tables/manageTable.html', 
								controller: 'manageTableController', 
								controllerAs: 'manageTableController'
									}
					}
					}
					)
			.state(
					'manage.company.menu.menuitem', 
					{
						url: '/:menuName/menuitem', 
						views: {
							'manage-datatable@manage': {
								templateUrl: 'docs/dynamic/manage/manage-menuitems/manageMenuitem.html', 
								controller: 'manageMenuitemController', 
								controllerAs: 'manageMenuitemController'
									}
					}
					}
					)
			.state(
					'manage.orderreference', 
					{
						url: '/orderreference', 
						views: {
							'manage-datatable@manage': {
								templateUrl: 'docs/dynamic/manage/manage-orderreferences/manageOrderreference.html', 
								controller: 'manageOrderreferenceController', 
								controllerAs: 'manageOrderreferenceController'
							}
						}
					}
					)
			.state(
					'manage.company.branch.table.orderreference', 
					{
						url: '/:tableNumber/orderreference', 
						views: {
							'manage-datatable@manage': {
								templateUrl: 'docs/dynamic/manage/manage-orderreferences/manageOrderreference.html', 
								controller: 'manageOrderreferenceController', 
								controllerAs: 'manageOrderreferenceController'
									}
					}
					}
					)
			.state(
					'manage.order', 
					{
						url: '/order', 
						views: {
							'manage-datatable@manage': {
								templateUrl: 'docs/dynamic/manage/manage-orders/manageOrder.html', 
								controller: 'manageOrderController', 
								controllerAs: 'manageOrderController'
									}
					}
					}
					)
			.state(
					'manage.company.branch.table.orderreference.order', 
					{
						url: '/:orderreferenceCode/order', 
						views: {
							'manage-datatable@manage': {
								templateUrl: 'docs/dynamic/manage/manage-orders/manageOrder.html', 
								controller: 'manageOrderController', 
								controllerAs: 'manageOrderController'
									}
					}
					}
					)
			.state(
					'manage.reservation', 
					{
						url: '/reservation', 
						views: {
							'manage-datatable@manage': {
								templateUrl: 'docs/dynamic/manage/manage-reservations/manageReservation.html', 
								controller: 'manageReservationController', 
								controllerAs: 'manageReservationController'
									}
					}
					}
					)
			.state(
					'manage.company.branch.table.orderreference.reservation', 
					{
						url: '/:orderreferenceCode/reservation', 
						views: {
							'manage-datatable@manage': {
								templateUrl: 'docs/dynamic/manage/manage-reservations/manageReservation.html', 
								controller: 'manageReservationController', 
								controllerAs: 'manageReservationController'
									}
					}
					}
					)
	.state(
			'home', 
			{
				url: '/home', 
				views: {
					'main': {
						templateUrl: 'docs/static/home/home.html', 
						controller: 'homeController', 
						controllerAs: 'homeController'
							}
			}
			}
			);
			
	$urlRouterProvider
	.otherwise("/home");
	}

function doRunConfig(
		$rootScope, 
		$state, 
		$timeout
		){
	$rootScope.$on(
			'$stateChangeStart', 
			function(
					evnt, 
					toState, 
					toStateParams, 
					fromState, 
					fromStateParams
					){
				const USER = 'user';
				const STATE_HOME = 'home';
				
				var user = localStorage.getItem(USER);
				
				if(null == user){	$timeout(
						function(){	$state.go(STATE_HOME);
						}
						);
				}
				}
			);
	}