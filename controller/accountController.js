/**
 * 
 */


angular.module('mainapp').controller('accountController', function($scope, $http, $window ) {
	
	var config = {headers :{'Content-type': undefined,'gktoken':$window.sessionStorage.getItem("gktoken")}}
	$http.get("http://127.0.0.1:6543/groupsubgroups",config).then(function (response) {
		$scope.groups = response.data.gkresult;
	});
	
	$scope.getSubGroups = function(){
		
		$http.get("http://127.0.0.1:6543/groupDetails/"+$scope.grp.groupcode, config).then(function (response) {
			$scope.subgroups = response.data.gkresult;
		});
	}
	$scope.createAccount = function() {
		 var accdetails = {groupcode:$scope.subgrp.groupcode, accountname:$scope.accname, openingbalance:$scope.openingbal};
		 
		 $http.post("http://127.0.0.1:6543/accounts",accdetails, config).then(function(response)
	      	{
	      		alert(response.data.gkstatus);
	      		
	      	});
	 }
	
});

