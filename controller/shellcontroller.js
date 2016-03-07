var main_shell = angular.module('main_shell', ['ui.directives']);
main_shell.controller('shellcontroller', function($scope, $window) {
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