(function () {

    var PoliciesController = function ($filter, $window, dataService) {
        var vm = this;

        vm.customers = [];
        vm.filteredCustomers = [];
        vm.pagedCustomers = [];
        vm.filteredCount = 0;
        vm.searchText = null;
        

        //paging
        vm.totalRecords = 0;
        vm.pageSize = 5;
        vm.currentPage = 1;
        vm.folderUrl = null;
        vm.numRecordsDisplaying;

        vm.pageChanged = function (page) {
            vm.currentPage = page;
            pageRecords();
        };

        vm.searchTextChanged = function () {
            filterCustomersPolicies(vm.searchText);
        };

        function init() {
            getCustomersAndPolicies();
        }

        function filterCustomersPolicies(filterText) {
            vm.filteredCustomers = $filter("namePolicyFilter")(vm.customers, filterText);
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
        }

        function getCustomersAndPolicies() {
            dataService.getCustomersAndPolicies()
                .then(function (customers) {
                        vm.totalRecords = customers.length;
                        vm.customers = customers;
                        filterCustomersPolicies('');
                   }, function (error) {
                        $window.alert(error.message);
                });
        }

        var vm = this;

        vm.Files = [];

        dataService.getFiles()
               .then(function (Files) {
                   vm.Files = Files;
                   var endIndex = vm.Files[0].webUrl.lastIndexOf("/");
                   vm.folderUrl = vm.Files[0].webUrl.substr(0, endIndex+1);                   
                    }, function (error) {
                   $window.alert(error.message);
               });


        init();

    };

    PoliciesController.$inject = ['$filter', '$window', 'dataService'];

    angular.module('office365App').controller('PoliciesController', PoliciesController);

}());



