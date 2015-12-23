(function () {

    var CustomersController = function ($location, $filter, $window, $timeout, dataService, modalService) {
        var vm = this;

        vm.customers = [];
        vm.filteredCustomers = [];
        vm.pagedCustomers = [];
        vm.filteredCount = 0;
        vm.orderby = 'lname';
        vm.reverse = false;
        vm.searchText = null;
        vm.cardAnimationClass = 'card-animation';

        //paging
        vm.totalRecords = 0;
        vm.pageSize = 10;
        vm.currentPage = 1;
        vm.numRecordsDisplaying;

        vm.pageChanged = function (page) {
            vm.currentPage = page;
            pageRecords();
        };

        vm.deleteCustomer = function (id) {

            var emp = getCustomerById(id);
            var empName = emp.firstName + ' ' + emp.lastName;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Customer',
                headerText: 'Delete ' + empName + '?',
                bodyText: 'Are you sure you want to delete this customer?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteCustomer(emp).then(function () {
                        for (var i = 0; i < vm.customers.length; i++) {
                            if (vm.customers[i].id == id) {
                                vm.customers.splice(i, 1);
                                break;
                            }
                        }
                        filterCustomers(vm.searchText);
                    }, function (error) {
                        $window.alert('Error deleting customer: ' + error.message);
                    });
                }
            });
        };

        vm.DisplayModeEnum = {
            Card: 0,
            List: 1
        };

        vm.changeDisplayMode = function (displayMode) {
            switch (displayMode) {
                case vm.DisplayModeEnum.Card:
                    vm.listDisplayModeEnabled = false;
                    break;
                case vm.DisplayModeEnum.List:
                    vm.listDisplayModeEnabled = true;
                    break;
            }
        };

        vm.navigate = function (url) {
            $location.path(url);
        };

        vm.setOrder = function (orderby) {
            if (orderby === vm.orderby) {
                vm.reverse = !vm.reverse;
            }
            vm.orderby = orderby;
        };

        vm.searchTextChanged = function () {
            filterCustomers();
        };

        function init() {
            getCustomersSummary();
        }

        function getCustomersSummary() {
            dataService.getCustomersSummary(vm.currentPage - 1, vm.pageSize)
            .then(function (data) {
                vm.totalRecords = data.totalRecords;
                vm.customers = data.results;
                filterCustomers(''); //Trigger initial filter

                $timeout(function() {
                    vm.cardAnimationClass = ''; //Turn off animation
                }, 1000);

            }, function (error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        }

        function filterCustomers() {
            vm.filteredCustomers = $filter("nameCityStateFilter")(vm.customers, vm.searchText);
            vm.filteredCount = vm.filteredCustomers.length;

            //Factor in paging
            vm.currentPage = 1;
            vm.totalRecords = vm.filteredCount;
            pageRecords();
        }

        function pageRecords() {
            var useFiltered = vm.searchText && vm.searchText.length > 0,
                pageStart = (vm.currentPage - 1) * vm.pageSize,
                pageEnd = pageStart + vm.pageSize;

            if (useFiltered) {
                if (pageEnd > vm.filteredCount) pageEnd = vm.filteredCount;                
            }
            else {
                if (pageEnd > vm.customers.length) pageEnd = vm.customers.length;
                vm.totalRecords = vm.customers.length;
            }

            vm.pagedCustomers = (useFiltered) ? vm.filteredCustomers.slice(pageStart, pageEnd) : vm.customers.slice(pageStart, pageEnd);
            vm.numRecordsDisplaying = vm.pagedCustomers.length;
            vm.pagingInfo = {
                currentPage: vm.currentPage,
                totalRecords: vm.totalRecords,
                pageStart: pageStart,
                pageEnd: pageEnd,
                pagedCustomerLength: vm.pagedCustomers.length,
                numRecordsDisplaying: vm.numRecordsDisplaying
            };
        }

        function getCustomerById(id) {
            for (var i = 0; i < vm.customers.length; i++) {
                var emp = vm.customers[i];
                if (emp.id === id) {
                    return emp;
                }
            }
            return null;
        }

        init();
    };

    CustomersController.$inject = ['$location', '$filter', '$window', '$timeout', 'dataService', 'modalService'];

    angular.module('office365App').controller('CustomersController', CustomersController);

}());
