﻿(function () {

    angular.module('office365App')
        .config(['$httpProvider', function ($httpProvider) {

        var httpInterceptor401 = function ($q, $rootScope) {

            var success = function (response) {
                return response;
            };

            var error = function (res) {
                if (res.status === 401) {
                    //Raise event so listener (navbarController) can act on it
                    $rootScope.$broadcast('redirectToLogin', null);
                    return $q.reject(res);
                }
                return $q.reject(res);
            };

            return function (promise) {
                return promise.then(success, error);
            };

        };

        httpInterceptor401.$inject = ['$q', '$rootScope'];

        $httpProvider.interceptors.push(httpInterceptor401);

    }]);

}());