angular
.module('starter')
.factory(
		'menuService', 
		menuService
		);

menuService.$inject = [
                       'API_BASE_URL', 
                       'KEYS', 
                       'MENUS_DB_FIELDS', 
                       '$http', 
                       '$localStorage', 
                       '$q'
                       ];

function menuService(
		API_BASE_URL, 
		KEYS, 
		MENUS_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q
		){
	var menuServiceObj = {
		menus: {}, 
		companyName: undefined, 
		menuName: undefined, 
		getMenus: getMenus, 
		getCompanyName: getCompanyName, 
		getMenuName: getMenuName, 
		setMenus: setMenus, 
		setCompanyName: setCompanyName, 
		setMenuName: setMenuName, 
		getOptions: {
			1: 'getCompanyMenus', 
			2: 'getCompanyMenu'
				}, 
				fetchMenus: fetchMenus, 
				addMenu: addMenu, 
				updateMenu: updateMenu, 
				deleteMenu: deleteMenu, 
				uploadMenuImage: uploadMenuImage
				};
	
	function getMenus(){	return menuServiceObj.menus;
	}
	function getCompanyName(){	return menuServiceObj.companyName;
	}
	function getMenuName(){	return menuServiceObj.menuName;
	}
	function setMenus(menus){	menuServiceObj.menus = menus;
	}
	function setCompanyName(companyName){	menuServiceObj.companyName = companyName;
	}
	function setMenuName(menuName){	menuServiceObj.menuName = menuName;
	}
	
	function fetchMenus(
			getOption, 
			getParams
			){
		var deferred = $q.defer();
		var httpConfig = {	method: 'GET'	};
		
		switch(menuServiceObj.getOptions[getOption]){
		case 'getCompanyMenus':
			httpConfig['url'] = API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus';
			break;
		case 'getCompanyMenu':
			httpConfig['url'] = API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus/' + menuServiceObj.menuName;
			break;
			default:
				break;
			}
		
		$http(httpConfig)
		.then(fetchMenusSuccessCallback)
		.catch(fetchMenusFailedCallback);
		
		function fetchMenusSuccessCallback(response){
			var menus = undefined;
			menuServiceObj.menus = {};
			
			convertMenusResponseToMap(response.data);
			menus = menuServiceObj.menus;
			menus = JSON.stringify(menus);
			localStorage.setItem(
					KEYS.Menus, 
					menus
					);
			
			deferred.resolve(response);
			}
		
		function fetchMenusFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertMenusResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var menusDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(MENUS_DB_FIELDS).length; j++){	menusDetails[MENUS_DB_FIELDS[j]] = responseData[i][MENUS_DB_FIELDS[j]];
				}
				
				key = responseData[i][MENUS_DB_FIELDS[1]]; //menu_name
				menuServiceObj.menus[key] = menusDetails;
				}
			}
		return deferred.promise;
		}
	
	function addMenu(menus){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus', 
				data: menus
				};
		
		$http(httpConfig)
		.then(addMenuSuccessCallback)
		.catch(addMenuFailedCallback);
		
		function addMenuSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addMenuFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function updateMenu(menu){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus/' + menuServiceObj.menuName, 
				data: menu
				};
		
		$http(httpConfig)
		.then(updateMenuSuccessCallback)
		.catch(updateMenuFailedCallback);
		
		function updateMenuSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateMenuFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function deleteMenu(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus/' + menuServiceObj.menuName
				};
		
		$http(httpConfig)
		.then(deleteMenuSuccessCallback)
		.catch(deleteMenuFailedCallback);
		
		function deleteMenuSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteMenuFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function uploadMenuImage(imgFile){
		var httpFD = new FormData();
		httpFD.append('imgFile', imgFile);
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + menuServiceObj.companyName + '/menus/' + menuServiceObj.menuName + '/menuImage', 
				data: httpFD, 
				headers: {	'Content-Type':	undefined	}
		};
		
		$http(httpConfig)
		.then(uploadMenuImageSuccessCallback)
		.catch(uploadMenuImageFailedCallback);
		
		function uploadMenuImageSuccessCallback(response){	deferred.resolve(response);
		}
		
		function uploadMenuImageFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return menuServiceObj;
	}