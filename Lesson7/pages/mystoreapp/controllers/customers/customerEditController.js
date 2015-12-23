(function () {

    var CustomerEditController = function ($scope, $location, $routeParams, $timeout, config, dataService, modalService) {
        var vm = this;

        var customerId = ($routeParams.customerId) ? parseInt($routeParams.customerId) : 0,
            timer,
            onRouteChangeOff;

        vm.customer = {};
        vm.customer.id = customerId;
        vm.states = [];
        vm.title = (customerId > 0) ? 'Edit' : 'Add';
        vm.buttonText = (customerId > 0) ? 'Update' : 'Add';
        vm.updateStatus = false;
        vm.errorMessage = '';

        vm.isStateSelected = function (customerStateId, stateId) {
            return customerStateId === stateId;
        };

        vm.savecustomer = function () {
            if ($scope.editForm.$valid) {
                if (!vm.customer.id) {
                    dataService.insertcustomer(vm.customer).then(function (insertedcustomer) {
                        vm.customer = insertedcustomer;
                        processSuccess();
                    },
                    processError);
                }
                else {
                    dataService.updatecustomer(vm.customer).then(processSuccess, processError);
                }
            }
        };

        vm.deletecustomer = function () {
            var empName = vm.customer.firstName + ' ' + vm.customer.lastName;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete customer',
                headerText: 'Delete ' + empName + '?',
                bodyText: 'Are you sure you want to delete this customer?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deletecustomer(vm.customer).then(function () {
                        onRouteChangeOff(); //Stop listening for location changes
                        $location.path('/customers');
                    }, processError);
                }
            });
        };

        function init() {

            getStates().then(function () {
                if (customerId > 0) {
                    dataService.getcustomer(customerId).then(function (customer) {
                        vm.customer = customer;
                    }, processError);
                }
            });



            //Make sure they're warned if they made a change but didn't save it
            //Call to $on returns a "deregistration" function that can be called to
            //remove the listener (see routeChange() for an example of using it)
            onRouteChangeOff = $scope.$on('$locationChangeStart', routeChange);
        }

        init();

        function routeChange(event, newUrl) {
            //Navigate to newUrl if the form isn't dirty
            if (!vm.editForm || !vm.editForm.$dirty) return;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ignore Changes',
                headerText: 'Unsaved Changes',
                bodyText: 'You have unsaved changes. Leave the page?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    onRouteChangeOff(); //Stop listening for location changes
                    $location.path($location.url(newUrl).hash()); //Go to page they're interested in
                }
            });

            //prevent navigation by default since we'll handle it
            //once the user selects a dialog option
            event.preventDefault();
            return;
        }

        function getStates() {
            return dataService.getStates().then(function (states) {
                vm.states = states;
            }, processError);
        }

        function processSuccess() {
            $scope.editForm.$dirty = false;
            vm.updateStatus = true;
            vm.title = 'Edit';
            vm.buttonText = 'Update';
            startTimer();
        }

        function processError(error) {
            vm.errorMessage = error.message;
            startTimer();
        }

        function startTimer() {
            timer = $timeout(function () {
                $timeout.cancel(timer);
                vm.errorMessage = '';
                vm.updateStatus = false;
            }, 3000);
        }
    };

    CustomerEditController.$inject = ['$scope', '$location', '$routeParams',
                                      '$timeout', 'config', 'dataService', 'modalService'];

    angular.module('office365App').controller('CustomerEditController', CustomerEditController);

}());