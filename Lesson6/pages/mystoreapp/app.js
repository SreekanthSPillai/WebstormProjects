(function () {

  var myStoreApp = angular.module('myStoreApp', []);


  angular.module('myStoreApp').directive('similarProducts', function(){
    return {

      restrict: 'E',
      templateUrl: 'mystoreapp/directives/similarproducts.html'
    };

  });

})();