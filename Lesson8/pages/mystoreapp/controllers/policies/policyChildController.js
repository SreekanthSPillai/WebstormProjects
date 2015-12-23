(function() {

    var PolicyChildController = function ($scope) {
        var vm = this;

        vm.customer = null;
        vm.orderby = 'endDate';
        vm.reverse = false;
        vm.policiesTotal = 0.00;

        init();

        vm.setOrder = function (orderby) {
            if (orderby === vm.orderby) {
                vm.reverse = !vm.reverse;
            }
            vm.orderby = orderby;
        };

        function init() {
            //See if parent $scope has an customer that's inherited (PoliciesController)
            if ($scope.customer) {
                vm.customer = $scope.customer;
                //updateTotal($scope.customer);
            //Customer not available yet so listen for availability (CustomerPoliciesController)
            } else {                
                $scope.$on('customer', function (event, customer) {
                    vm.customer = customer;
                    //updateTotal(customer);
                })
            }
        }

        function updateTotal(customer) {
            if (customer && customer.policies) {
                var total = 0.00;
                for (var i = 0; i < customer.policies.length; i++) {
                    var order = customer.policies[i];
                    total += order.orderTotal;
                }
                vm.policiesTotal = total;
            }
        }
    };

    PolicyChildController.$inject = ['$scope'];

    angular.module('office365App').controller('PolicyChildController', PolicyChildController);

}());