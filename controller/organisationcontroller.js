/**
 * 
 */
  var orgs = angular.module('orgs', ['ngRoute'])
  orgs.config([
    '$routeProvider', function($routeProvider) {
      $routeProvider.when('/about', {
        templateUrl: 'about.html'
      });
      $routeProvider.when('/selectorg', {
        controller: "getOrgs",
        templateUrl: 'existingorg.html'
      });
      $routeProvider.when('/createorg', {
        controller: "postOrgs",
        templateUrl: 'create_organisation.html'
      });
      $routeProvider.when('/login', {
          controller: "login",
          templateUrl: 'login.html'
        });
      $routeProvider.when('/createadmin', {
          controller: "createOrg",
          templateUrl: 'createadmin.html'
        });
    }
  ]);


  orgs.controller('postOrgs', function($scope, orgDetails, $location) {
  
  $scope.create = function(){
  var fdate = $scope.fyear + '-' + $scope.fmonth + '-'+ $scope.fday;
  var tdate = $scope.tyear + '-' + $scope.tmonth + '-'+ $scope.tday;
  var orgdetails = {orgname:$scope.name, orgtype:$scope.type, yearstart:fdate, yearend:tdate};
  orgDetails.set(orgdetails);
  $location.path("/createadmin");
      };
  });
  
  orgs.factory("orgDetails", function() {
		var orgdetails = {}
		function set(data) {
			orgdetails = data;
		}
		function get() {
			return orgdetails;
		}
		
		return{
			set:set,
			get:get
		}
		
	});
  
  orgs.controller('createOrg', function($scope, $http, orgDetails, $window) {
	  alert(orgDetails.get().orgname)
	$scope.createOrg = function() {
		var odetails = orgDetails.get()
		alert(odetails.orgname)
		var udetails = {username:$scope.name,userpassword:$scope.cnfpassword,userquestion:$scope.question,useranswer:$scope.answer}
		var allDetails = {orgdetails:odetails,userdetails:udetails}
		
		var config = {headers :{'Content-type': undefined}}
		  $http.post("http://127.0.0.1:6543/organisations",allDetails, config).then(function(response)
		      	{
			  		alert(response.data.status)
			  		$window.sessionStorage.setItem("gktoken",response.data.token);
		      		$window.location.href ="main_shell.html"
		      	});
		
	}
});
  

  orgs.controller('getOrgs', function($scope, $http, orgcode, $location) {
    $http.get("http://127.0.0.1:6543/organisations").then(function (response) {
        $scope.nameType = response.data;
        $scope.getDetails = function(){
        	$http.get("http://127.0.0.1:6543/orgyears/"+$scope.selectednameType.orgname+"/"+$scope.selectednameType.orgtype).then(function(response)
        	{
        		$scope.years = response.data;
        	});
        }
        
    });
    $scope.getOrgCode = function(){
    $http.get("http://127.0.0.1:6543/organisation/"+$scope.selectednameType.orgname+"/"+$scope.selectednameType.orgtype+"/"+$scope.selectedYears.yearstart+"/"+$scope.selectedYears.yearend).then(function (response) {
    	$scope.orgid = response.data;
    	orgcode.set($scope.orgid);
    	});
    
    }
    
    $scope.showlogin = function() {
		$location.path("/login");
	}
  });

  


orgs.factory("orgcode", function() {
	var orgcode = {}
	function set(data) {
		orgcode = data;
	}
	function get() {
		return orgcode;
	}
	
	return{
		set:set,
		get:get
	}
	
});
orgs.controller("login", function($scope, $window, $http, orgcode) {

	$scope.code = orgcode.get().orgcode;
	 $scope.showMainshell = function() {
		 var userdetails = {orgcode:$scope.code, username:$scope.name, userpassword:$scope.password};
		 var config = {headers :{'Content-type': undefined}}
		 $http.post("http://127.0.0.1:6543/login",userdetails, config).then(function(response)
	      	{
	      		alert(response.data.status);
	      		$window.sessionStorage.setItem("gktoken",response.data.token);
	      		$window.location.href ="main_shell.html"
	      	});
	 }
})

var main_shell = angular.module('main_shell', ['ui.directives']);
main_shell.controller('shellcontroller', function($scope, $window) {
	alert($window.sessionStorage.getItem("gktoken"))
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
