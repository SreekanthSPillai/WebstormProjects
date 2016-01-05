define(['adal'], function(AuthenticationContext) {
    app.factory('o365', o365);
 
    o365.$inject = ['$http', '$q', '$timeout', 'adalAuthenticationService'];
 
    function o365($http, $q, $timeout, adalProvider) {
        var self = this;
 
        self.adal = new AuthenticationContext(adalProvider.config);
        self.sleepInterval = 100;
 
        return {
            getListItems: getListItems,
            findDocument: findDocuments
        };
    }
 
    function getListItems(parentDeferred) {
        var deferred = parentDeferred || $q.defer();
 
        var url = 'https://mytenant.sharepoint.com/_api/...';
 
        if (accessTokenRequestInProgress(url, self.adal)) {
            $timeout(function() {
                getListItems(deferred);
            }, self.sleepInterval);
        }
        else {
            $http({
                url: url,
                // omitted for brevity
            }).success(function(data) {
                // omitted for brevity
            });
        }
 
        return deferred.promise;
    }
 
    function findDocuments(searchQuery, parentDeferred) {
        var deferred = parentDeferred || $q.defer();
 
        var url = 'https://mytenant.sharepoint.com/_api/...';
 
        if (accessTokenRequestInProgress(url, self.adal)) {
            $timeout(function() {
                findDocuments(searchQuery, deferred);
            }, self.sleepInterval);
        }
        else {
            $http({
                url: url
                // omitted for brevity
            }).success(function(data) {
                // omitted for brevity
            });
        }
 
        return deferred.promise;
    }
 
    function accessTokenRequestInProgress(endpoint, adal) {
        var requestInProgress = false;
 
        var resource = adal.getResourceForEndpoint(endpoint);
 
        var keysString = adal._getItem(adal.CONSTANTS.STORAGE.TOKEN_KEYS) || '';
        if (keysString.indexOf(resource + adal.CONSTANTS.RESOURCE_DELIMETER) > -1) {
            var tokenStored = adal.getCachedToken(resource);
 
            if (tokenStored === null) {
                requestInProgress = true;
            }
        }
 
        return requestInProgress;
    }
}