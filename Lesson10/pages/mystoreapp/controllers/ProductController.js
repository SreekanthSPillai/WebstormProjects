(function () {
	
    var ProductController = function ($rootScope, $http, $routeParams, $filter) {
		var vm = this;
		vm.allPhones;
        vm.phones = [];//productDataServices.query();
        vm.orderProp = 'age';
       		
		function filterProductsByBrand(brand) {
            vm.filteredPhones = $filter("phoneBrandFilter")(vm.allPhones, brand);
			vm.phones = vm.filteredPhones;   
			if(vm.phones.length < 1){
				vm.noPhones = 'No phones available';
			}
        };
		
		
		 $http.get('mystoreapp/data/phones.json').success(function (data){
            vm.allPhones = data;
			vm.phones = vm.allPhones;			
        });		
		
		$rootScope.$on('brand-Selected', function(event, brand) {
			filterProductsByBrand(brand);
		});
    };

    ProductController.$inject = ['$rootScope','$http','$routeParams','$filter'];

    angular.module('myStoreApp').controller('ProductController', ProductController);

}());