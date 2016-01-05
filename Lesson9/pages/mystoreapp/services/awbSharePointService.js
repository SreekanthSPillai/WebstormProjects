(function () {

    var customersFactory = function ($http, $q, $window, $location, $timeout) {
        var serviceBase = '/Handlers/WebProxy.ashx?url=',
            refreshUrlBase = '/home/refreshtoken?returnUrl=',
            exchangeMailUrl = 'https://outlook.office365.com/api/v1.0/me/messages',
            exchangeEventUrl = 'https://outlook.office365.com/api/v1.0/me/events',
            filesUrl= 'https://insteg-my.sharepoint.com/_api/v1.0/me/files',
            yammerFeedsUrl = 'https://www.yammer.com/api/v1/messages.json';
        
       

        var SPSettings = {
            baseSPUrl: 'https://insteg.sharepoint.com/sites/AgentsWB/_api/',
            baseSPListsUrl: 'https://insteg.sharepoint.com/sites/AgentsWB/_api/web/lists/',
            defaultSharePointHttpGetOptions: {
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'Content-Type': 'application/json;odata=verbose',
                }
            }
        };

        factory = {
            itemCount: 0,
            policies: null
        },
        requestDigest = null;

        factory.getCustomersAndPolicies = function (pageIndex, pageSize) {

            var deferred = $q.defer();
            var empsPromise = $http.get(SPSettings.baseSPListsUrl +
                "getByTitle('AWBCustomers')/items?$select=ID,Fname,Lname&$orderby=Lname,Fname", SPSettings.defaultSharePointHttpGetOptions);
            
            //Currently the SharePoint REST API doesn't make grabbing the customers & policies
            //all at once so we're grabbing them individually
            //$q.all([empsPromise, policiesPromise])
            empsPromise .then(function (result1) {
                var customers = (result1.data) ? caseProps(result1.data.value, propStyleEnum.camelCase) : []; //Get customers data
                
                var policiesPromise = $http.get(SPSettings.baseSPListsUrl +
                "getByTitle('AWBPolicies')/items?$select=PolicyNumber,StartDate,EndDate,Created,PolicyType,CustomerId/Id,CustomerId/Fname,CustomerId/Lname&$expand=CustomerId");
                //"getByTitle('AWBPolicies')/items?$select=PolicyNumber,StartDate,EndDate,Created,PolicyType,AWBCustomers/Id&$expand=AWBCustomers/Id");

                empsPromise.then(function (result2) { 
                    var policies = (result2.data) ? caseProps(result2.data.value, propStyleEnum.camelCase) : []; //Get policies data

                    mapCustomerToPolicies(customers, policies);                

                    deferred.resolve(customers);
                                    
                    });
               },
              function (error) {
                  if (error.status === 302) {
                      deferred.resolve(null);
                      //Potential infinite loop here - haven't dealt with that possibility yet
                      $window.location.href = getRedirectUrl();
                  }
              });

            return deferred.promise; //Return promise to caller
        };

        factory.getCustomersSummary = function (pageIndex, pageSize) {
            var url = SPSettings.baseSPListsUrl + "getByTitle('AWBCustomers')/items?$select=ID,Fname,Lname,Gender,Address,City,State,Zip,Email,MobNo&$orderby=Lname,Fname";
            return getPagedResource(url, pageIndex, pageSize);
        };

        factory.getStates = function () {

            var url = serviceBase + encodeURIComponent(SPSettings.baseSPListsUrl + "getByTitle('States')/items?$select=Title&$orderby=Title");
            return $http.get(url).then(
                function (result) {
                    return [
{ "title": "Alabama", "code": "AL" },
{ "title": "Alaska", "code": "AK" },
{ "title": "Arizona", "code": "AZ" },
{ "title": "Arkansas", "code": "AR" },
{ "title": "California", "code": "CA" },
{ "title": "Colorado", "code": "CO" },
{ "title": "Connecticut", "code": "CT" },
{ "title": "Delaware", "code": "DE" },
{ "title": "District of Columbia", "code": "DC" },
{ "title": "Florida", "code": "FL" },
{ "title": "Georgia", "code": "GA" },
{ "title": "Hawaii", "code": "HI" },
{ "title": "Idaho", "code": "ID" },
{ "title": "Illinois", "code": "IL" },
{ "title": "Indiana", "code": "IN" },
{ "title": "Iowa", "code": "IA" },
{ "title": "Kansa", "code": "KS" },
{ "title": "Kentucky", "code": "KY" },
{ "title": "Lousiana", "code": "LA" },
{ "title": "Maine", "code": "ME" },
{ "title": "Maryland", "code": "MD" },
{ "title": "Massachusetts", "code": "MA" },
{ "title": "Michigan", "code": "MI" },
{ "title": "Minnesota", "code": "MN" },
{ "title": "Mississippi", "code": "MS" },
{ "title": "Missouri", "code": "MO" },
{ "title": "Montana", "code": "MT" },
{ "title": "Nebraska", "code": "NE" },
{ "title": "Nevada", "code": "NV" },
{ "title": "New Hampshire", "code": "NH" },
{ "title": "New Jersey", "code": "NJ" },
{ "title": "New Mexico", "code": "NM" },
{ "title": "New York", "code": "NY" },
{ "title": "North Carolina", "code": "NC" },
{ "title": "North Dakota", "code": "ND" },
{ "title": "Ohio", "code": "OH" },
{ "title": "Oklahoma", "code": "OK" },
{ "title": "Oregon", "code": "OR" },
{ "title": "Pennsylvania", "code": "PA" },
{ "title": "Rhode Island", "code": "RI" },
{ "title": "South Carolina", "code": "SC" },
{ "title": "South Dakota", "code": "SD" },
{ "title": "Tennessee", "code": "TN" },
{ "title": "Texas", "code": "TX" },
{ "title": "Utah", "code": "UT" },
{ "title": "Vermont", "code": "VT" },
{ "title": "Virginia", "code": "VA" },
{ "title": "Washington", "code": "WA" },
{ "title": "West Virginia", "code": "WV" },
{ "title": "Wisconsin", "code": "WI" },
{ "title": "Wyoming", "code": "WY" }
                    ];
                });
        };

        factory.getCustomer = function (id) {
            var url = serviceBase + encodeURIComponent(SPSettings.baseSPListsUrl + "getByTitle('AWBCustomers')/items(" + id + ")?$select=ID,Fname,Lname,Gender,Address,City,State,Zip,Email,MobNo");
            return $http.get(url).then(function (result) {
                var cust = caseProps(result.data, propStyleEnum.camelCase);
                cust.zip = parseInt(cust.zip);
                return cust;
            },
            function (error) {
                if (error.status === 302) {
                    //Potential infinite loop here - haven't dealt with that possibility yet
                    $window.location.href = getRedirectUrl();
                }
            });
        };

        factory.getMailSummary = function () {
            return $http.get(exchangeMailUrl)
              .then(function (response) {
                  return response.data.value;                
              }, function (error) {
                  alert('service call failed');
                  return null;
              });
        };

        factory.getFiles = function () {
              return $http.get(filesUrl)      
              .then(function (response) {
                  return response.data.value;
              }, function (error) {
                  alert('service call failed');
                  return null;
              });
        };

        factory.getEventSummary = function () {
            return $http.get(exchangeEventUrl)
              .then(function (response) {
                  return response.data.value;
              }, function (error) {                
                  return null;
              });
        };
        
        factory.getFeedSummary = function () {
            return $http.get(yammerFeedsUrl)
              .then(function (response) {
                  return response.data.value;
              }, function (error) {
                  return null;
              });
        };

        factory.checkUniqueValue = function (id, property, value) {
            if (!id) id = 0;
            return $http.get(serviceBase + 'checkUnique/' + id + '?property=' + property + '&value=' + escape(value)).then(
                function (results) {
                    return results.data.status;
                });
        };

        factory.getCustomerPolicies = function (id) {

            var deferred = $q.defer();
            var empPromise = factory.getCustomer(id);
            var policiesPromise = $http.get(SPSettings.baseSPListsUrl + "getByTitle('AWBPolicies')/items?$select=PolicyNumber,StartDate,EndDate,Created,PolicyType,CustomerId/Id,CustomerId/Fname,CustomerId/Lname&$expand=CustomerId&$filter=CustomerId eq '" + id +"'");
            //https://insteg.sharepoint.com/sites/AgentsWB/_api/web/lists/getByTitle('AWBPolicies')/items?$select=PolicyNumber,StartDate,EndDate,Created,PolicyType&$filter=CustomerId%20eq%20%272%27
            //"getByTitle('Policies')/items?$filter=Customer eq " + id + "&$select=Amount,Created,PolicyCategory,Title"
            

            $q.all([empPromise, policiesPromise])
              .then(function (results) {
                  var customer = results[0]; //Get customer data
                  customer.policies = caseProps(results[1].data.value, propStyleEnum.camelCase); //Get policies data

                  //calculatePoliciesTotal(customer);

                  deferred.resolve(customer);
              },
              function (error) {
                  if (error.status === 302) {
                      deferred.resolve(null);
                      //Potential infinite loop here - haven't dealt with that possibility yet
                      $window.location.href = getRedirectUrl();
                  }
              });

            return deferred.promise; //Return promise to caller

        },

        factory.insertCustomer = function (customer) {

            customer = caseProps(customer, propStyleEnum.pascalCase);
            customer.Title = customer.FirstName + ' ' + customer.LastName;
            customer.Zip = customer.Zip.toString(); //Zip is a string in SharePoint
            customer.__metadata = { type: 'SP.Data.CustomersListItem' };

            var options = {
                url: serviceBase + encodeURIComponent(SPSettings.baseSPListsUrl + "getByTitle('Customers')/items"),
                method: 'POST',
                data: JSON.stringify(customer),
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'Content-Type': 'application/json;odata=verbose'
                    //'X-RequestDigest': requestDigest
                },
            };

            return $http(options).then(function (result) {
                var cust = caseProps(result.data, propStyleEnum.camelCase);
                cust.zip = parseInt(cust.zip); //SharePoint Zip field is a string so convert to int
                return cust;
            },
            function (error) {
                $window.alert(error.message);
                return error;
            });
        };

        factory.newCustomer = function () {
            return $q.when({ });
        };

        factory.updateCustomer = function (customer) {

            customer = caseProps(customer, propStyleEnum.pascalCase);
            customer.Title = customer.FirstName + ' ' + customer.LastName;
            customer.Zip = customer.Zip.toString(); //Zip is a string in SharePoint

            var options = {
                url: serviceBase + encodeURIComponent(customer.__metadata.uri),
                method: 'MERGE',
                data: JSON.stringify(customer),
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'Content-Type': 'application/json;odata=verbose',
                    'If-Match': customer.__metadata.etag
                    //'X-RequestDigest': requestDigest
                }
            };

            return $http(options);

        };

        factory.deleteCustomer = function (customer) {

            var options = {
                url: serviceBase + encodeURIComponent(customer.__metadata.uri),
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'If-Match': customer.__metadata.etag
                    //'X-RequestDigest': requestDigest
                }
            };

            return $http(options).then(function (status) {
                return status.data;
            },
            function (error) {
                $window.alert(error.message);
                return error;
            });
        };
        
        function getRequestDigest() {

            var options = {
                url: serviceBase + encodeURIComponent(SPSettings.SPSettings + 'contextinfo'),
                method: 'POST',
                headers: {
                    //Following will be set in HTTP Handler but listed here for completeness
                    'Accept': 'application/json;odata=verbose',
                    'ContextInfoRequest': true
                }
            };

            $http(options).success(function (data) {
                if (data && data.d) requestDigest = data.d.GetContextWebInformation.FormDigestValue;
            });
        }

        //getRequestDigest();

        function getRedirectUrl() {
            var port = ($location.port()) ? ':' + $location.port() : '';
            var link = $location.protocol() + '://' + $location.host() + port +
                   refreshUrlBase + encodeURIComponent($location.absUrl());
            return link;
        }

        function getPagedResource(baseResource, pageIndex, pageSize) {
            var url = baseResource;
            //url; += (arguments.length == 3) ? buildPagingUri(pageIndex, pageSize) : '';

            //Server-side paging not currently implemented due to lack of proper paging support
            //in SharePoint OData/REST api.
            var deferred = $q.defer();
            var countPromise = $http.get(SPSettings.baseSPListsUrl + "getByTitle('AWBCustomers')/itemcount", SPSettings.defaultSharePointHttpGetOptions);
            
           // $q.all([countPromise, empPromise])
            countPromise.then(function (result1) {
                var custCount = (result1.data) ? result1.data.value : 0; //Get countPromise data

                var empPromise = $http.get(url);
                empPromise.then(function (result2) {
                    var custs = (result2.data) ? caseProps(result2.data.value, propStyleEnum.camelCase) : []; //Get empPromise data

                    //extendCustomers(custs);
                    var custData = {
                        totalRecords: custCount,
                        results: custs
                    };

                    deferred.resolve(custData);
                });
                
              },
              function (error) {
                  if (error.status === 302) {
                      deferred.resolve(null);
                      //Potential infinite loop here - haven't dealt with that possibility yet
                      $window.location.href = getRedirectUrl();
                  }
              });

            return deferred.promise; //Return promise to caller
        }

        function buildPagingUri(pageIndex, pageSize) {
            var uri = '&$skip=' + (pageIndex * pageSize) + '&$top=' + pageSize;
            return uri;
        }

        function mapCustomerToPolicies(customers, policies) {
            if (customers && policies) {
                for (var i = 0; i < customers.length; i++) {
                    var customer = customers[i];
                    var CustomerPolicies = [];
                    for (var j = 0; j < policies.length; j++) {
                        var policy = policies[j];
                        if (policy.customerId.Id === customer.id) { //Case of "Id" is correct for this instance
                            CustomerPolicies.push(policy);
                        }
                    }
                    customer.policies = CustomerPolicies;
                    calculatePoliciesTotal(customer);
                }
            }
        }

        function extendCustomers(customers) {
            var customersLen = customers.length;
            //Iterate through customers
            for (var i = 0; i < customersLen; i++) {
                var customer = customers[i];
                calculatePoliciesTotal(customer);
            }
        }

        function calculatePoliciesTotal(customer) {
            var policiesLen = customer.policies.length;
            customer.policiesTotal = 0;
            //Iterate through policies
            for (var j = 0; j < policiesLen; j++) {
                customer.policiesTotal += customer.policies[j].amount;
            }
        }

        var propStyleEnum = {
            camelCase: 'camel',
            pascalCase: 'pascal'
        };

        function caseProps(obj, propStyle) {

            function caseProp(str) {
                if (!str) return str;

                //Camel Case Option
                if (!propStyle || propStyle === propStyleEnum.camelCase) {
                    return str.charAt(0).toLowerCase() + str.slice(1);
                }
                //Pascal Case Option
                else {
                    //SharePoint-specific fields to worry about
                    if (str !== '__metadata') {
                        return str.charAt(0).toUpperCase() + str.slice(1);
                    }
                    return str;
                }
            }

            function iterate(obj) {
                var newObj = {};
                for (prop in obj) {
                    newObj[caseProp(prop)] = obj[prop];
                }
                return newObj;
            }

            if (Array.isArray(obj)) {
                var newArray = [];
                for (var i = 0; i < obj.length; i++) {
                    newArray.push(iterate(obj[i]));
                }
                return newArray;
            }
            else {
                return iterate(obj);
            }

        }

        function getItemTypeForListName(listName) {
            return "SP.Data." + listName.charAt(0).toUpperCase() + listName.slice(1) + "ListItem";
        }

        return factory;
    };

    customersFactory.$inject = ['$http', '$q', '$window', '$location', '$timeout'];

    angular.module('office365App').factory('awbSharePointService', customersFactory);

}());