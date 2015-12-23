(function () {

    var ProductController = function ($scope, $http) {
        $scope.phones = [];//productDataServices.query();
        $scope.orderProp = 'age';
        $http.get('mystoreapp/data/phones.json').success(function (data){
            $scope.phones = data;
        });
    };

    ProductController.$inject = ['$scope','$http'];

    angular.module('myStoreApp').controller('ProductController', ProductController);

}());