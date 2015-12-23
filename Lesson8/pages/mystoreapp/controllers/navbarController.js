(function () {
		
    var NavbarController = function ($scope) {
        
		
		$scope.today = new Date();

		$scope.categories = [{"id":"1", "name": "Apple",  "sort_order": "0", "icon": "", "hide": false, "url": "/ByCategory?b=Apple" },
			{"id":"2", "name": "Samsung",  "sort_order": "0", "icon": "", "hide": false, "url": "/ByCategory?b=Samsung" },
			{"id":"3", "name": "HTC",  "sort_order": "0", "icon": "", "hide": false, "url": "/ByCategory?b=HTC" },
			{"id":"4", "name": "Sony",  "sort_order": "0", "icon": "", "hide": false, "url": "/ByCategory?b=Sony" },
			{"id":"5", "name": "Micromax",  "sort_order": "0", "icon": "", "hide": false, "url": "/ByCategory?b=Micromax" },
			{"id":"6", "name": "Xolo",  "sort_order": "0", "icon": "", "hide": false, "url": "/ByCategoryXolo" },
			{"id":"7", "name": "Spice",  "sort_order": "0", "icon": "", "hide": true, "url": "/ByCategory?b=Spice" },
			{"id":"8", "name": "Lenovo",  "sort_order": "0", "icon": "", "hide": false, "url": "/ByCategory?b=Lenovo" },
			{"id":"9", "name": "Blackberry",  "sort_order": "0", "icon": "", "hide": false, "url": "/ByCategory?b=Blackberry" },
			{"id":"10", "name": "Nokia",  "sort_order": "0", "icon": "", "hide": true, "url": "/ByCategory?b=Nokia" },
			{"id":"11", "name": "Motorola",  "sort_order": "0", "icon": "", "hide": false, "url": "/ByCategory?b=Motorola" }];


	};
		
	
    NavbarController.$inject = ['$scope'];

    angular.module('myStoreApp').controller('NavbarController', NavbarController);

}());
