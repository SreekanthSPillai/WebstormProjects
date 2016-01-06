(function () {
	
    var ProductDetailsController = function ($scope, $http, $routeParams, $filter) {
		var vm = this;
		var phoneId = ($routeParams.phoneId) ? $routeParams.phoneId : 'Unknown';

        vm.phone = {};
        vm.phone.id = phoneId;
        vm.phones = [];			
		
		function init() {
			$http.get('mystoreapp/data/phones.json').success(function (data){
				vm.phones = data;
				
				vm.SelectedPhones = vm.phones.filter(function (phone) {
					return (phone.id == vm.phone.id);
				});
				
				vm.phone = vm.SelectedPhones[0];				
			});	
		}
		
		init();
    };
	
	
	
    ProductDetailsController.$inject = ['$scope','$http','$routeParams','$filter'];

    angular.module('myStoreApp').controller('ProductDetailsController', ProductDetailsController);

}());