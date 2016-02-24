/**
 * 
 */
var acc = angular.module('acc',[])

acc.controller('getGroups', function($scope, $http) {
	$http.get("http://127.0.0.1:6543/groupsubgroups/1").then(function (response) {
		$scope.groups = response.data;
	});
	
	$scope.getSubGroups = function(){
		$http.get("http://127.0.0.1:6543/groupDetails/"+$scope.grp.groupcode).then(function (response) {
			$scope.subgroups = response.data;
		});
	}
	$scope.createAccount = function() {
		 var accdetails = {groupcode:"a call to be made by sending the subgrp", accountname:$scope.accname, openingbalance:$scope.openingbal,orgcode:"from token"};
		 var config = {headers :{'Content-type': undefined}}
		 $http.post("http://127.0.0.1:6543/accounts/1",accdetails, config).then(function(response)
	      	{
	      		alert(response.data.status);
	      		
	      	});
	 }
	
});

