angular
.module('starter')
.factory(
		'emailService', 
		emailService
		);

emailService.$inject = [
	'API_BASE_URL', 
	'$http', 
	'$q'
	];

function emailService(
		API_BASE_URL, 
		$http, 
		$q
		){
	var emailServiceObj = {
			sendEmailFromPreSignup: sendEmailFromPreSignup
			}
	
	function sendEmailFromPreSignup(preSignupDetails){
		var deferred = $q.defer();
		var httpConfig = {
			method: 'POST', 
			url: API_BASE_URL + '/pre-signup', 
			data: preSignupDetails
			};
		
		$http(httpConfig)
		.then(sendEmailFromPreSignupSuccessCallback)
		.catch(sendEmailFromPreSignupFailedCallback);
		
		function sendEmailFromPreSignupSuccessCallback(response){	deferred.resolve(response);
		}
		
		function sendEmailFromPreSignupFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return emailServiceObj;
	}