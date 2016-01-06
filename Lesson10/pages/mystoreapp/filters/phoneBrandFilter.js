(function () {

    var phoneBrandFilter = function () {

        function matchesProduct(phones, filterValue) {
            if (phones) {
                for (var i = 0; i < phones.length; i++) {
                    if (phones[i].snippet.toLowerCase().indexOf(filterValue) > -1) {
                        return true;
                    }
                }
            }
            return false;
        }

        return function (phones, filterValue) {
            if (!filterValue || !phones) return phones;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < phones.length; i++) {
                var item = phones[i];
                if (item.name.toLowerCase().indexOf(filterValue) > -1 ||
                    item.id.toLowerCase().indexOf(filterValue) > -1 ||
                    matchesProduct(item, filterValue)) {

                    matches.push(item);
                }
            }
            return matches;
        };
    };

    angular.module('myStoreApp').filter('phoneBrandFilter', phoneBrandFilter);

}());