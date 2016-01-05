(function () {

    var nameCityStateFilter = function () {

        return function (customers, filterValue) {
            if (!filterValue) return customers;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < customers.length; i++) {
                var emp = customers[i];
                if (emp.firstName.toLowerCase().indexOf(filterValue) > -1 ||
                    emp.lastName.toLowerCase().indexOf(filterValue) > -1 ||
                    emp.city.toLowerCase().indexOf(filterValue) > -1 ||
                    emp.state.toLowerCase().indexOf(filterValue) > -1) {

                    matches.push(emp);
                }
            }
            return matches;
        };
    };

    angular.module('office365App').filter('nameCityStateFilter', nameCityStateFilter);

}());