(function () {

    var CustomerPoliciesController = function ($scope, $routeParams, $window, dataService) {
        var vm = this;
        //Grab customerId off of the route        
        var customerId = ($routeParams.customerId) ? parseInt($routeParams.customerId) : 0;

        vm.customer = {};
        vm.policiesTotal = 0.00;

        init();

        function init() {
            if (customerId > 0) {
                dataService.getCustomerPolicies(customerId)
                .then(function (customer) {
                    vm.customer = customer;
                    $scope.$broadcast('customer', customer);
                }, function (error) {
                    $window.alert("Sorry, an error occurred: " + error.message);
                });
            }
        }
    };

    CustomerPoliciesController.$inject = ['$scope', '$routeParams', '$window', 'dataService'];

    angular.module('office365App').controller('CustomerPoliciesController', CustomerPoliciesController);

}());