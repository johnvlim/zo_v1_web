angular
.module('starter')
.controller(
		'manageMenuController', 
		manageMenuController
		);

manageMenuController.$inject = [
                                'API_BASE_URL', 
                                'BROADCAST_MESSAGES', 
                                'KEYS', 
                                'MENUS_DB_FIELDS', 
                                '$compile', 
                                '$rootScope', 
                                '$scope', 
                                '$stateParams', 
                                '$uibModal', 
                                'DTColumnBuilder', 
                                'DTOptionsBuilder', 
                                'datatableService'
                                ];

function manageMenuController(
		API_BASE_URL, 
		BROADCAST_MESSAGES, 
		KEYS, 
		MENUS_DB_FIELDS, 
		$compile, 
		$rootScope, 
		$scope, 
		$stateParams, 
		$uibModal, 
		DTColumnBuilder, 
		DTOptionsBuilder, 
		datatableService
		){
	const DOM_MENU_TABLE = '#menu_table';
	
	var vm = this;
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user= JSON.parse(vm.user);
		}
	if(!(null == $stateParams['companyName'])){	vm.companyName = $stateParams['companyName'];
	} else {
		if(!(null == vm.user)){	vm.companyName = vm.user.company_name;
		}
		}
	vm.menu = {};
	vm.controllerObjName = 'manageMenuController';
	vm.dtInstance = dtInstanceCallback;
	vm.dtHiddenColumns = {};
	vm.dbColumnFields = MENUS_DB_FIELDS;
	vm.dbColumn2Colheader = {
			menu_id: 'Id', 
			menu_name: 'Name', 
			company_name: 'Company name', 
			menu_desc: 'Description', 
			menu_image: 'Image', 
			menu_last_change_timestamp: 'Last change timestamp'
				};
	vm.dbColumn2Dom = {
			menu_id: 'menuId', 
			menu_name: 'menuName', 
			company_name: 'companyName', 
			menu_desc: 'menuDesc', 
			menu_image: 'menuImage'
				};
	vm.restApiSource = API_BASE_URL + '/companies/' + vm.companyName + '/menus';
	
	function dtInstanceCallback(dtInstance){	vm.dtInstance = dtInstance;
	}
	
	//controller_method
	vm.dtAssignOnSelect = dtAssignOnSelect;
	
	function dtAssignOnSelect(
			data, 
			$event
			){
		const DOM_TD_SELECT_CHECKBOX_CLASS = 'td.select-checkbox';
		const DOM_ROWS = 'table.dataTable tbody tr';
		
		var eSrc = $event.currentTarget.parentElement.parentElement;
		var eClassname = eSrc.className;
		var isRecHighlighted = datatableService.isRecHighlighted(
				$(DOM_ROWS), 
				eSrc._DT_RowIndex
				);
		
		$(DOM_TD_SELECT_CHECKBOX_CLASS).get(eSrc._DT_RowIndex).click();
		$event.stopPropagation();
		
		if(-1 == eClassname.indexOf('selected')){
			vm.menu = data;
			
			if(isRecHighlighted){	return;
			}
			
			$rootScope.$broadcast(
					BROADCAST_MESSAGES.toggleMenuitem, 
					{
						companyName: vm.companyName, 
						menuName: vm.menu.menu_name
						}
					);
			} else {
				vm.menu= {};
				
				$rootScope.$broadcast(
						BROADCAST_MESSAGES.toggleMenuitem, 
						{
							companyName: vm.companyName, 
							menuName: vm.menu.menu_name
							}
						);
				}
		}
	
	function addMenu(){
		var formMode = 'I';
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-menus/modalMenu.html', 
					controller: 'modalMenuController as modalMenuController', 
					resolve: {
						menu: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return formMode;
						}, 
						modalHiddenFields: function(){	return genModalHiddenFields(formMode);
						}
						}
				}
				)
				.closed.then(uibModalClosedCallback);
		}
	
	function updateMenu(){
		var formMode = 'A';
		
		if(0 == Object.keys(vm.menu).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-menus/modalMenu.html', 
					controller: 'modalMenuController as modalMenuController', 
					resolve: {
						menu: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return formMode;
						}, 
						modalHiddenFields: function(){	return genModalHiddenFields(formMode);
						}
						}
				}
				)
				.closed.then(uibModalClosedCallback);
		}
	
	function deleteMenu(){
		var formMode = 'D';
		
		if(0 == Object.keys(vm.menu).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-menus/modalMenu.html', 
					controller: 'modalMenuController as modalMenuController', 
					resolve: {
						menu: function(){	return doDbColumn2Dom(formMode);
						}, 
						formMode: function(){	return formMode;
						}, 
						modalHiddenFields: function(){	return genModalHiddenFields(formMode);
						}
						}
				}
				)
				.closed.then(uibModalClosedCallback);
		}
	
	function doDbColumn2Dom(formMode){
		var data = {};
		
		Object.keys(vm.dbColumn2Colheader).forEach(
				function(dbColumn2ColheaderKey){
					var dataKey = vm.dbColumn2Dom[dbColumn2ColheaderKey];
					
					if('I' == formMode){	data[dataKey] = undefined;
					} else {	data[dataKey] = vm.menu[dbColumn2ColheaderKey];
					}
					
					data['companyName'] = vm.companyName;
					}
				);
		
		return data;
		}
	
	function genModalHiddenFields(formMode){
		var modalHiddenFields = {};
		
		genDtHiddenColumns();
		
		if('I' == formMode){	return null;
		}
		
		Object.keys(vm.dtHiddenColumns).forEach(
				function(dtHiddenColumnsKey){	modalHiddenFields[vm.dbColumn2Dom[dtHiddenColumnsKey]] = true;
				}
				);
		
		return modalHiddenFields;
	}
	
	function uibModalClosedCallback(){
		vm.dtInstance.reloadData();
		vm.menu = {};
		
		if(0 == $('.dataTable tr.selected').length){	return;
		}
		
		$rootScope.$broadcast(
				BROADCAST_MESSAGES.toggleMenuitem, 
				{
					companyName: vm.companyName, 
					menuName: vm.menu.menu_name
					}
				);
		}
	
	function genDtHiddenColumns(){
		var tableDt = $(DOM_MENU_TABLE).dataTable();
		vm.dtHiddenColumns = {};
		
		$.each(
				tableDt.fnSettings().aoColumns, 
				function(aoColumn){
					var aoColumnsRunner = tableDt.fnSettings().aoColumns[aoColumn];
					var aoColumnsRunnerMdata = aoColumnsRunner.mData;
					
					if(!(null == aoColumnsRunnerMdata)){
						if(false == aoColumnsRunner.bVisible){	vm.dtHiddenColumns[aoColumnsRunnerMdata] = true;
						}
						}
					}
				);
		}
	
	dtInitialize();
	
	function dtInitialize(){
		datatableService.setDbColumnFields(vm.dbColumnFields);
		datatableService.setDbColumn2Colheader(vm.dbColumn2Colheader);
		datatableService.doDTInitOptions(
				DTOptionsBuilder, 
				vm.restApiSource, 
				BROADCAST_MESSAGES.addMenu, 
				BROADCAST_MESSAGES.updateMenu, 
				BROADCAST_MESSAGES.deleteMenu
				);
		datatableService.doDTInitColumns(
				DTColumnBuilder, 
				vm
				);
		
		vm.dtOptions = datatableService.getDtOptions();
		vm.dtColumns = datatableService.getDtColumns();
		vm.dtOptions
		.withOption(
				'createdRow', 
				createdRowCallback
				)
				.withOption(
						'initComplete', 
						initCompleteCallback
						);
		
		function createdRowCallback(row){	$compile(angular.element(row).contents())($scope);
		}
		
		function initCompleteCallback(row){
			var menuTableDom = $(DOM_MENU_TABLE).DataTable();
			
			Object.keys(vm.dtHiddenColumns).forEach(
					function(dtHiddenColumnsKey){	menuTableDom.column(vm.dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
					}
					);
			}
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.addMenu, 
			addMenu
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.updateMenu, 
			updateMenu
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.deleteMenu, 
			deleteMenu
			);
	}