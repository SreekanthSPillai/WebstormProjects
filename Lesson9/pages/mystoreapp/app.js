(function () {

  var myStoreApp = angular.module('myStoreApp', []);

})();


(function () {

  var app = angular.module('myStoreApp',
      ['ngRoute']);

  app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    var viewBase = 'mystoreapp/views/';

    $routeProvider
        .when('/products', {
          controller: 'ProductController',
          templateUrl: viewBase + 'product/listing.html',
          controllerAs: 'vm'
        })
        .when('/product/:productId', {
          controller: 'ProductController',
          templateUrl: viewBase + 'product/details.html',
          controllerAs: 'vm'
        })
        .when('/about', {
          controller: 'AboutController',
          templateUrl: viewBase + 'about.html',
          controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/products' });


  }]);

}());

