angular
.module('starter')
.factory(
		'branchService', 
		branchService
		);

branchService.$inject = [
                         'API_BASE_URL', 
                         'BRANCHES_DB_FIELDS', 
                         'KEYS', 
                         '$http', 
                         '$localStorage', 
                         '$q'
                         ];

function branchService(
		API_BASE_URL, 
		BRANCHES_DB_FIELDS, 
		KEYS, 
		$http, 
		$localStorage, 
		$q
		){
	var branchServiceObj = {
			branches: {}, 
			companyName: undefined, 
			branchName: undefined, 
			getBranches: getBranches, 
			getCompanyName: getCompanyName, 
			getBranchName: getBranchName, 
			setBranches: setBranches, 
			setCompanyName: setCompanyName, 
			setBranchName: setBranchName, 
			getOptions: {
				1: 'getCompanyBranches', 
				2: 'getCompanyBranch'
					}, 
					fetchBranches: fetchBranches, 
					addBranchValidate: addBranchValidate, 
					addBranch: addBranch, 
					updateBranchValidate: updateBranchValidate, 
					updateBranch: updateBranch, 
					deleteBranch: deleteBranch, 
					toStringAddress: toStringAddress
					};
	
	function getBranches(){	return branchServiceObj.branches;
	}
	function getCompanyName(){	return branchServiceObj.companyName;
	}
	function getBranchName(){	return branchServiceObj.branchName;
	}
	function setBranches(branches){	branchServiceObj.branches = branches;
	}
	function setCompanyName(companyName){	branchServiceObj.companyName = companyName;
	}
	function setBranchName(branchName){	branchServiceObj.branchName = branchName;
	}
	
	function fetchBranches(
			getOption, 
			getParams
			){
		var deferred = $q.defer();
		var httpConfig = {	method: 'GET'	};
		
		switch(branchServiceObj.getOptions[getOption]){
		case 'getCompanyBranches':
			httpConfig['url'] = API_BASE_URL + '/companies/' + branchServiceObj.companyName + '/branches';
			break;
		case 'getCompanyBranch':
			httpConfig['url'] = API_BASE_URL + '/companies/' + branchServiceObj.companyName + '/branches/' + branchServiceObj.branchName;
			break;
			default:
				break;
			}
		
		$http(httpConfig)
		.then(fetchBranchesSuccessCallback)
		.catch(fetchBranchesFailedCallback);
		
		function fetchBranchesSuccessCallback(response){
			var branches = undefined;
			branchServiceObj.branches = {};
			
			convertBranchesResponseToMap(response.data);
			branches = branchServiceObj.branches;
			branches = JSON.stringify(branches);
			localStorage.setItem(
					KEYS.Branches, 
					branches
					);
			
			deferred.resolve(response);
			}
		
		function fetchBranchesFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertBranchesResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var branchesDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(BRANCHES_DB_FIELDS).length; j++){	branchesDetails[BRANCHES_DB_FIELDS[j]] = responseData[i][BRANCHES_DB_FIELDS[j]];
				}
				
				key = responseData[i][BRANCHES_DB_FIELDS[1]]; //branch_name
				branchServiceObj.branches[key] = branchesDetails;
				}
			}
		return deferred.promise;
		}
	
	function addBranchValidate(branches){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + branchServiceObj.companyName + '/branches', 
				data: branches
				};
		
		$http(httpConfig)
		.then(addBranchValidateSuccessCallback)
		.catch(addBranchValidateFailedCallback);
		
		function addBranchValidateSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addBranchValidateFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function addBranch(branches){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + branchServiceObj.companyName + '/branches', 
				data: branches
				};
		
		$http(httpConfig)
		.then(addBranchSuccessCallback)
		.catch(addBranchFailedCallback);
		
		function addBranchSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addBranchFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function updateBranchValidate(branch){
		var deferred = $q.defer();
		var httpConfig =  {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + branchServiceObj.companyName + '/branches/' + branchServiceObj.branchName, 
				data: branch
				};
		
		$http(httpConfig)
		.then(updateBranchValidateSuccessCallback)
		.catch(updateBranchValidateFailedCallback);
		
		function updateBranchValidateSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateBranchValidateFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function updateBranch(branch){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + branchServiceObj.companyName + '/branches/' + branchServiceObj.branchName, 
				data: branch
				};
		
		$http(httpConfig)
		.then(updateBranchSuccessCallback)
		.catch(updateBranchFailedCallback);
		
		function updateBranchSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateBranchFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function deleteBranch(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + branchServiceObj.companyName + '/branches/' + branchServiceObj.branchName
				};
		
		$http(httpConfig)
		.then(deleteBranchSuccessCallback)
		.catch(deleteBranchFailedCallback);
		
		function deleteBranchSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteBranchFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function toStringAddress(){
		const INDEX_START_ADDRESS = 3;
		const INDEX_END_ADDRESS = 9;
		
		var branch = branchServiceObj.branches;
		var branchLocArray = [];
		var returnStr = '';
		
		angular.forEach(
				BRANCHES_DB_FIELDS, 
				function(
						v, 
						k
						){
					if(!(k < 3 || k > 9)){	branchLocArray[k-INDEX_START_ADDRESS] = branch[BRANCHES_DB_FIELDS[k]];
					}
					}
				);
		
		angular.forEach(
				branchLocArray, 
				function(i){
					returnStr += i + ', ';
					}
				);
		
		returnStr = returnStr.substring(0, returnStr.length-2);
		
		return returnStr;
		}
	
	return branchServiceObj;
	}