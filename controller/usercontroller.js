var users = angular.module("users", []);
users.controller("createuser", function ($scope, $http, $window) {
    "use strict";
    alert($window.sessionStorage.getItem("gktoken"));
    $scope.roles = [{"role": "Manager", "code": 0}, {"role": "Operator", "code": 1}];
    $scope.create = function () {
		var udetails = {username: $scope.name, userpassword: $scope.cnfpassword, userquestion: $scope.question, useranswer: $scope.answer, userrole: $scope.role.code};
		var config = {headers : {'Content-type': undefined, "gktoken": $window.sessionStorage.getItem("gktoken")}};
        $http.post("http://127.0.0.1:6543/users", udetails, config).then(function (response)
		      	{
			  		alert(response.data.gkstatus);
		      	});
		
	}
});