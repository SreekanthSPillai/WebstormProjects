(function () {

    var namePolicyFilter = function () {

        function matchesPolicy(customer, filterValue) {
            if (customer.policies) {
                for (var i = 0; i < customer.policies.length; i++) {
                    if (customer.policies[i].title.toLowerCase().indexOf(filterValue) > -1) {
                        return true;
                    }
                }
            }
            return false;
        }

        return function (customers, filterValue) {
            if (!filterValue || !customers) return customers;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < customers.length; i++) {
                var emp = customers[i];
                if (emp.firstName.toLowerCase().indexOf(filterValue) > -1 ||
                    emp.lastName.toLowerCase().indexOf(filterValue) > -1 ||
                    matchesPolicy(emp, filterValue)) {

                    matches.push(emp);
                }
            }
            return matches;
        };
    };

    angular.module('office365App').filter('namePolicyFilter', namePolicyFilter);

}());