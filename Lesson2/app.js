 var myStoreApp = angular.module('myStoreApp', []);   
		myStoreApp.controller( 'navController', ['$scope', function($scope) {
			$scope.today = new Date();
	 }]);
	 
	 
(function () {

  angular
    .module('myStoreApp', []);

  // navController.js
  function navController () {
	$scope.today = new Date();
  }

  angular
    .module('myStoreApp')
    .controller('navController', navController);

  // dataService.js
  function dataService () {

  }

  angular
    .module('myStoreApp')
    .service('dataService', dataService);


})();