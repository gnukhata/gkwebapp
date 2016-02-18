/**
 * 
 */

var app = angular.module('Orgs', []);
  app.controller('postOrgs', function($scope, $http) {
  
  $scope.create = function(){
  var fdate = $scope.fyear + '-' + $scope.fmonth + '-'+ $scope.fday;
  var tdate = $scope.tyear + '-' + $scope.tmonth + '-'+ $scope.tday;
  var orgdetails = {orgname:$scope.name, orgtype:$scope.type, yearstart:fdate, yearend:tdate};
  var config = {headers :{'Content-type': undefined}}
  $http.post("http://127.0.0.1:6543/organisations",orgdetails, config).then(function(response)
      	{
      		alert(response.data);
      	});
      };
  });
  
var app = angular.module('existingorg', []);
  app.controller('getOrgs', function($scope, $http) {
    
    $http.get("http://127.0.0.1:6543/organisations").then(function (response) {
        $scope.myData = response.data;
        $scope.getDetails = function(){
        	$http.get("http://127.0.0.1:6543/orgyears/"+$scope.selected.orgname+"/"+$scope.selected.orgtype).then(function(response)
        	{
        		$scope.years = response.data;
        	});
        }
    });
  });

