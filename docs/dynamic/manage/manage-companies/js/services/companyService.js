angular
.module('starter')
.factory(
		'companyService', 
		companyService
		);

companyService.$inject = [
                          'API_BASE_URL', 
                          'COMPANIES_DB_FIELDS', 
                          'KEYS', 
                          '$http', 
                          '$localStorage', 
                          '$q'
                          ];

function companyService(
		API_BASE_URL, 
		COMPANIES_DB_FIELDS, 
		KEYS, 
		$http, 
		$localStorage, 
		$q
		){
	var companyServiceObj = {
		companies: {}, 
		companyName: undefined, 
		getCompanies: getCompanies, 
		getCompanyName: getCompanyName, 
		setCompanies: setCompanies, 
		setCompanyName: setCompanyName, 
		getOptions: {
			1: 'getCompanies_asAdministrator', 
			2: 'getCompanies', 
			3: 'getCompany'
				}, 
				fetchCompanies: fetchCompanies, 
				addCompanyValidate: addCompanyValidate, 
				addCompany: addCompany, 
				updateCompanyValidate: updateCompanyValidate, 
				updateCompany: updateCompany, 
				deleteCompany: deleteCompany, 
				uploadCompanyLogo: uploadCompanyLogo
				}
	
	function getCompanies(){	return companyServiceObj.companies;
	}
	function getCompanyName(){	return companyServiceObj.companyName;
	}
	function setCompanies(companies){	companyServiceObj.companies = companies;
	}
	function setCompanyName(companyName){	companyServiceObj.companyName = companyName;
	}
	
	function fetchCompanies(
			getOption, 
			getParams
			){
		var deferred = $q.defer();
		var httpConfig = {	method: 'GET'	};
		
		switch(companyServiceObj.getOptions[getOption]){
		case 'getCompanies_asAdministrator':
			httpConfig['url'] = API_BASE_URL + '/companies/customers/' + getParams['CustomerUsername'];
			break;
		case 'getCompanies':
			httpConfig['url'] = API_BASE_URL + '/companies';
			break;
		case 'getCompany':
			httpConfig['url'] = API_BASE_URL + '/companies/' + companyServiceObj.companyName;
			default:
				break;
			}
		
		$http(httpConfig)
		.then(fetchCompaniesSuccessCallback)
		.catch(fetchCompaniesFailedCallback);
		
		function fetchCompaniesSuccessCallback(response){
			var companies = undefined;
			companyServiceObj.companies = {};
			
			convertCompaniesResponseToMap(response.data);
			companies = companyServiceObj.companies;
			companies = JSON.stringify(companies);
			localStorage.setItem(
					KEYS.Companies, 
					companies
					);
			
			deferred.resolve(response);
			}
		
		function fetchCompaniesFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertCompaniesResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var companiesDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(COMPANIES_DB_FIELDS).length; j++){	companiesDetails[COMPANIES_DB_FIELDS[j]] = responseData[i][COMPANIES_DB_FIELDS[j]];
				}
				
				key = responseData[i][COMPANIES_DB_FIELDS[0]]; //company_name
				companyServiceObj.companies[key] = companiesDetails;
				}
			}
		return deferred.promise;
		}
	
	function addCompanyValidate(companies){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/validate', 
				data: companies
				};
		
		$http(httpConfig)
		.then(addCompanyValidateSuccessCallback)
		.catch(addCompanyValidateFailedCallback);
		
		function addCompanyValidateSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addCompanyValidateFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function addCompany(companies){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies', 
				data: companies
				};
		
		$http(httpConfig)
		.then(addCompanySuccessCallback)
		.catch(addCompanyFailedCallback);
		
		function addCompanySuccessCallback(response){	deferred.resolve(response);
		}
		
		function addCompanyFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function updateCompanyValidate(company){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + companyServiceObj.companyName, 
				data: company
				};
		
		$http(httpConfig)
		.then(updateCompanyValidateSuccessCallback)
		.catch(updateCompanyValidateFailedCallback);
		
		function updateCompanyValidateSuccessCallback(response){	deferrred.resolve(response);
		}
		
		function updateCompanyValidateFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise
		}
	
	function updateCompany(company){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + companyServiceObj.companyName, 
				data: company
				};
		
		$http(httpConfig)
		.then(updateCompanySuccessCallback)
		.catch(updateCompanyFailedCallback);
		
		function updateCompanySuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateCompanyFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function deleteCompany(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + companyServiceObj.companyName
				};
		
		$http(httpConfig)
		.then(deleteCompanySuccessCallback)
		.catch(deleteCompanyFailedCallback);
		
		function deleteCompanySuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteCompanyFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function uploadCompanyLogo(imgFile){
		var httpFD = new FormData();
		httpFD.append('imgFile', imgFile);
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + companyServiceObj.companyName + '/companyImage', 
				data: httpFD, 
				headers: {	'Content-Type': undefined	}
		};
		
		$http(httpConfig)
		.then(uploadCompanyLogoSuccessCallback)
		.catch(uploadCompanyLogoFailedCallback);
		
		function uploadCompanyLogoSuccessCallback(response){	deferred.resolve(response);
		}
		
		function uploadCompanyLogoFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return companyServiceObj;
	}