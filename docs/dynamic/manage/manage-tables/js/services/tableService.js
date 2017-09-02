angular
.module('starter')
.factory(
		'tableService', 
		tableService
		);

tableService.$inject = [
                        'API_BASE_URL', 
                        'KEYS', 
                        'TABLES_DB_FIELDS', 
                        '$http', 
                        '$localStorage', 
                        '$q'
                        ];

function tableService(
		API_BASE_URL, 
		KEYS, 
		TABLES_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q
		){
	var tableServiceObj = {
			tables: {}, 
			companyName: undefined, 
			branchName: undefined, 
			tableNumber: undefined, 
			getTables: getTables, 
			getCompanyName: getCompanyName, 
			getBranchName: getBranchName, 
			getTableNumber: getTableNumber, 
			setTables: setTables, 
			setCompanyName: setCompanyName, 
			setBranchName: setBranchName, 
			setTableNumber: setTableNumber, 
			getOptions: {
				1: 'getCompanyBranchTables', 
				2: 'getCompanyBranchTable'
					}, 
					fetchTables: fetchTables, 
					addTable: addTable, 
					updateTable: updateTable, 
					deleteTable: deleteTable
					};
	
	function getTables(){	return tableServiceObj.tables;
	}
	function getTable(){	return tableServiceObj.table;
	}
	function getCompanyName(){	return tableServiceObj.companyName;
	}
	function getBranchName(){	return tableServiceObj.branchName;
	}
	function getTableNumber(){	return tableServiceObj.tableNumber;
	}
	function setTables(tables){	tableServiceObj.tables = tables;
	}
	function setTable(table){	tableServiceObj.table = table;
	}
	function setCompanyName(companyName){	tableServiceObj.companyName = companyName;
	}
	function setBranchName(branchName){	tableServiceObj.branchName = branchName;
	}
	function setTableNumber(tableNumber){	tableServiceObj.tableNumber = tableNumber;
	}
	
	function fetchTables(
			getOption, 
			getParams
			){
		var deferred = $q.defer();
		var httpConfig = {	method: 'GET'	};
		
		switch(tableServiceObj.getOptions[getOption]){
		case 'getCompanyBranchTables':
			httpConfig['url'] = API_BASE_URL + '/companies/' + tableServiceObj.companyName + '/branches/' + tableServiceObj.branchName + '/tables';
			break;
		case 'getCompanyBranchTables':
			httpConfig['url'] = API_BASE_URL + '/companies/' + tableServiceObj.companyName + '/branches/' + tableServiceObj.branchName + '/tables/' + tableServiceObj.tableNumber;
			break;
			default:
				break;
			}
		
		$http(httpConfig)
		.then(fetchTablesSuccessCallback)
		.catch(fetchTablesFailedCallback);
		
		function fetchTablesSuccessCallback(response){
			var tables = undefined;
			tableServiceObj.tables = {};
			
			convertTablesResponseToMap(response.data);
			tables = tableServiceObj.tables;
			tables = JSON.stringify(tables);
			localStorage.setItem(
					KEYS.Tables, 
					tables
					);
			
			deferred.resolve(response);
			}
		
		function fetchTablesFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertTablesResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var tablesDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(TABLES_DB_FIELDS).length; j++){	tablesDetails[TABLES_DB_FIELDS[j]] = responseData[i][TABLES_DB_FIELDS[j]];
				}
				
				key = responseData[i][TABLES_DB_FIELDS[1]]; //table_number
				tableServiceObj.tables[key] = tablesDetails;
				}
			}
		return deferred.promise;
		}
	
	function addTable(tables){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + tableServiceObj.companyName + '/branches/' + tableServiceObj.branchName + '/tables', 
				data: tables
				};
		
		$http(httpConfig)
		.then(addTableSuccessCallback)
		.catch(addTableFailedCallback);
		
		function addTableSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addTableFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function updateTable(table){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + tableServiceObj.companyName + '/branches/' + tableServiceObj.branchName + '/tables/' + tableServiceObj.tableNumber, 
				data: table
				};
		
		$http(httpConfig)
		.then(updateTableSuccessCallback)
		.catch(updateTableFailedCallback);
		
		function updateTableSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateTableFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function deleteTable(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + tableServiceObj.companyName + '/branches/' + tableServiceObj.branchName + '/tables/' + tableServiceObj.tableNumber
				};
		
		$http(httpConfig)
		.then(deleteTableSuccessCallback)
		.catch(deleteTableFailedCallback);
		
		function deleteTableSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteTableFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return tableServiceObj;
	}