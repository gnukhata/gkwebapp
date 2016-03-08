var mainapp = angular.module('mainapp', ['ui.directives','ngRoute']);
mainapp.config([
             '$routeProvider', function($routeProvider) {
               $routeProvider.when('/account', {

            	   templateUrl: 'createaccount.html',
            	   controller: "accountController"
               });
              }
           ]);



mainapp.controller('mainController', function($scope, $window) {
    $scope.count=0;
    $scope.flag =0;
    $scope.show = function() {
		$scope.flag = $scope.count%2;
        return $scope.flag;
    };    
    $scope.keypresscount = function () {
    	$scope.count = $scope.count+1;
  	};
  	
});