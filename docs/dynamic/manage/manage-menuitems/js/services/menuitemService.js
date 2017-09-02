angular
.module('starter')
.factory(
		'menuitemService', 
		menuitemService
		);

menuitemService.$inject = [
                           'API_BASE_URL', 
                           'KEYS', 
                           'MENUITEMS_DB_FIELDS', 
                           '$http', 
                           '$localStorage', 
                           '$q'
                           ];

function menuitemService(
		API_BASE_URL, 
		KEYS, 
		MENUITEMS_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q
		){
	var menuitemServiceObj = {
			menuitems: {}, 
			companyName: undefined, 
			menuName: undefined, 
			menuitemCode: undefined, 
			getMenuitems: getMenuitems, 
			getCompanyName: getCompanyName, 
			getMenuName: getMenuName, 
			getMenuitemCode: getMenuitemCode, 
			setMenuitems: setMenuitems, 
			setCompanyName: setCompanyName, 
			setMenuName: setMenuName, 
			setMenuitemCode: setMenuitemCode, 
			getOptions: {
				1: 'getCompanyMenuMenuitems', 
				2: 'getCompanyMenuMenuitem'
					}, 
					fetchMenuitems: fetchMenuitems, 
					addMenuitem: addMenuitem, 
					updateMenuitem: updateMenuitem, 
					deleteMenuitem: deleteMenuitem, 
					uploadMenuitemImage: uploadMenuitemImage
					};
	
	function getMenuitems(){	return menuitemServiceObj.menuitems;
	}
	function getCompanyName(){	return menuitemServiceObj.companyName;
	}
	function getMenuName(){	return menuitemServiceObj.menuName;
	}
	function getMenuitemCode(){	return menuitemServiceObj.menuitemCode;
	}
	function setMenuitems(menuitems){	menuitemServiceObj.menuitems = menuitems;
	}
	function setCompanyName(companyName){	menuitemServiceObj.companyName = companyName;
	}
	function setMenuName(menuName){	menuitemServiceObj.menuName = menuName;
	}
	function setMenuitemCode(menuitemCode){	menuitemServiceObj.menuitemCode = menuitemCode;
	}
	
	function fetchMenuitems(
			getOption, 
			getParams
			){
		var deferred = $q.defer();
		var httpConfig = {	method: 'GET'	};
		
		switch(menuitemServiceObj.getOptions[getOption]){
		case 'getCompanyMenuMenuitems':
			httpConfig['url'] = API_BASE_URL + '/companies/' + menuitemServiceObj.companyName + '/menus/' + menuitemServiceObj.menuName + '/menuitems';
			break;
		case 'getCompanyMenuMenuitem':
			httpConfig['url'] = API_BASE_URL + '/companies/' + menuitemServiceObj.companyName + '/menus/' + menuitemServiceObj.menuName + '/menuitems/' + menuitemServiceObj.menuitemCode;
			break;
			default:
				break;
			}
		
		$http(httpConfig)
		.then(fetchMenuitemsSuccessCallback)
		.catch(fetchMenuitemsFailedCallback);
		
		function fetchMenuitemsSuccessCallback(response){
			var menuitems = undefined;
			menuitemServiceObj.menuitems = {};
			
			convertMenuitemsResponseToMap(response.data);
			menuitems = menuitemServiceObj.menuitems;
			menuitems = JSON.stringify(menuitems);
			localStorage.setItem(
					KEYS.Menuitems, 
					menuitems
					);
			
			deferred.resolve(response);
			}
		
		function fetchMenuitemsFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertMenuitemsResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var menuitemsDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(MENUITEMS_DB_FIELDS).length; j++){	menuitemsDetails[MENUITEMS_DB_FIELDS[j]] = responseData[i][MENUITEMS_DB_FIELDS[j]];
				}
				
				var key = responseData[i][MENUITEMS_DB_FIELDS[1]]; //menuitem_code
				menuitemServiceObj.menuitems[key] = menuitemsDetails;
				}
			}
		return deferred.promise;
		}
	
	function addMenuitem(menuitems){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + menuitemServiceObj.companyName + '/menus/' + menuitemServiceObj.menuName + '/menuitems', 
				data: menuitems
				};
		
		$http(httpConfig)
		.then(addMenuitemsSuccessCallback)
		.catch(addMenuitemsFailedCallback);
		
		function addMenuitemsSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addMenuitemsFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function updateMenuitem(menuitem){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + menuitemServiceObj.companyName + '/menus/' + menuitemServiceObj.menuName + '/menuitems/' + menuitemServiceObj.menuitemCode, 
				data: menuitem
				};
		
		$http(httpConfig)
		.then(updateMenuitemSuccessCallback)
		.catch(updateMenuitemFailedCallback);
		
		function  updateMenuitemSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateMenuitemFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function deleteMenuitem(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + menuitemServiceObj.companyName + '/menus/' + menuitemServiceObj.menuName + '/menuitems/' + menuitemServiceObj.menuitemCode
				};
		
		$http(httpConfig)
		.then(deleteMenuitemSuccessCallback)
		.catch(deleteMenuitemFailedCallback);
		
		function deleteMenuitemSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteMenuitemFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function uploadMenuitemImage(imgFile){
		var httpFD = new FormData();
		httpFD.append('imgFile', imgFile);
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + menuitemServiceObj.companyName + '/menus/' + menuitemServiceObj.menuName + '/menuitems/' + menuitemServiceObj.menuitemCode + '/menuitemImage', 
				data: httpFD, 
				headers: {	'Content-Type': undefined	}
		};
		
		$http(httpConfig)
		.then(uploadMenuitemImageSuccessCallback)
		.catch(uploadMenuitemImageFailedCallback);
		
		function uploadMenuitemImageSuccessCallback(response){	deferred.resolve(response);
		}
		
		function uploadMenuitemImageFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return menuitemServiceObj;
	}