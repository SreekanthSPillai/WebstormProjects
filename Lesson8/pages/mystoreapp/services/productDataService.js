(function () {

    var productDataServices = angular.module('ProductDataServices', ['ngResource']);

    productDataServices.factory('ProductDataServices', ['$resource',
        function($resource){
            return $resource('mystoreapp/data/:phoneId.json', {}, {
                query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
            });
        }]);

}());