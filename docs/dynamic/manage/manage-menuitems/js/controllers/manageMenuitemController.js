angular
.module('starter')
.controller(
		'manageMenuitemController', 
		manageMenuitemController
		);

manageMenuitemController.$inject = [
                                    'API_BASE_URL', 
                                    'BROADCAST_MESSAGES', 
                                    'KEYS', 
                                    'MENUITEMS_DB_FIELDS', 
                                    '$compile', 
                                    '$scope', 
                                    '$stateParams', 
                                    '$uibModal', 
                                    'DTColumnBuilder', 
                                    'DTOptionsBuilder', 
                                    'datatableService'
                                    ];

function manageMenuitemController(
		API_BASE_URL, 
		BROADCAST_MESSAGES, 
		KEYS, 
		MENUITEMS_DB_FIELDS, 
		$compile, 
		$scope, 
		$stateParams, 
		$uibModal, 
		DTColumnBuilder, 
		DTOptionsBuilder, 
		datatableService
		){
	const DOM_MENUITEM_TABLE = '#menuitem_table';
	
	var vm = this;
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user= JSON.parse(vm.user);
		}
	if(
			!(null == $stateParams['companyName']) &&
			!(null == $stateParams['menuName'])
			){
		vm.companyName = $stateParams['companyName'];
		vm.menuName = $stateParams['menuName'];
		}
	vm.menuitem = {};
	vm.controllerObjName = 'manageMenuitemController';
	vm.dtInstance = dtInstanceCallback;
	vm.dtHiddenColumns = {};
	vm.dbColumnFields = MENUITEMS_DB_FIELDS;
	vm.dbColumn2Colheader = {
			menuitem_id: 'Id', 
			menuitem_code: 'Code', 
			menu_id: 'Menu id', 
			menuitem_name: 'Name', 
			menuitem_desc: 'Description', 
			menuitem_price: 'Price', 
			menuitem_featured: 'Featured', 
			menuitem_image: 'Image', 
			menuitem_last_change_timestamp: 'Last change timestamp'
				};
	vm.dbColumn2Dom = {
			menuitem_id: 'menuitemId', 
			menuitem_code: 'menuitemCode', 
			menu_id: 'menuId', 
			menuitem_name: 'menuitemName', 
			menuitem_desc: 'menuitemDesc', 
			menuitem_price: 'menuitemPrice', 
			menuitem_featured: 'menuitemFeatured', 
			menuitem_image: 'menuitemImage'
				};
	vm.restApiSource = API_BASE_URL + '/companies/' + vm.companyName + '/menus/' + vm.menuName + '/menuitems';
	
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
		
		if(-1 == eClassname.indexOf('selected')){	vm.menuitem = data;
		} else {	vm.menuitem= {};
		}
		}
	
	function addMenuitem(){
		var formMode = 'I';
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-menuitems/modalMenuitem.html', 
					controller: 'modalMenuitemController as modalMenuitemController', 
					resolve: {
						menuitem: function(){	return doDbColumn2Dom(formMode);
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
	
	function updateMenuitem(){
		var formMode = 'A';
		
		if(0 == Object.keys(vm.menuitem).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-menuitems/modalMenuitem.html', 
					controller: 'modalMenuitemController as modalMenuitemController', 
					resolve: {
						menuitem: function(){	return doDbColumn2Dom(formMode);
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
	
	function deleteMenuitem(){
		var formMode = 'D';
		
		if(0 == Object.keys(vm.menuitem).length){	return;
		}
		
		var modalInstance = $uibModal.open(
				{
					animation: true, 
					templateUrl: 'docs/dynamic/manage/manage-menuitems/modalMenuitem.html', 
					controller: 'modalMenuitemController as modalMenuitemController', 
					resolve: {
						menuitem: function(){	return doDbColumn2Dom(formMode);
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
					} else {	data[dataKey] = vm.menuitem[dbColumn2ColheaderKey];
					}
					
					data['companyName'] = vm.companyName;
					data['menuName'] = vm.menuName;
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
		vm.menuitem = {};
		}
	
	function genDtHiddenColumns(){
		var tableDt = $(DOM_MENUITEM_TABLE).dataTable();
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
				BROADCAST_MESSAGES.addMenuitem, 
				BROADCAST_MESSAGES.updateMenuitem, 
				BROADCAST_MESSAGES.deleteMenuitem
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
			var menuitemTableDom = $(DOM_MENUITEM_TABLE).DataTable();
			
			Object.keys(vm.dtHiddenColumns).forEach(
					function(dtHiddenColumnsKey){	menuitemTableDom.column(vm.dtHiddenColumns[dtHiddenColumnsKey]).visible(false);
					}
					);
			}
		}
	
	$scope.$on(
			BROADCAST_MESSAGES.addMenuitem, 
			addMenuitem
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.updateMenuitem, 
			updateMenuitem
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.deleteMenuitem, 
			deleteMenuitem
			);
	}