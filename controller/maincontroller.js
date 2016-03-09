var mainapp = angular.module('mainapp', ['ngRoute']);
mainapp.config([
             '$routeProvider', function($routeProvider) {
                    $routeProvider.when('/account', {

            	       templateUrl: 'createaccount.html',
            	       controller: "accountController"
                    });
                    $routeProvider.when('/createuser', {

            	       templateUrl: 'createuser.html',
            	       controller: "createuser"
                    });
              }
           ]);
