(function () {

    var FeedsController = function ($scope, dataService) {
        var vm = this;

        vm.feeds = [];

        dataService.getFeedSummary()
               .then(function (feeds) {
                   vm.feeds = feeds;
               }, function (error) {
                   $window.alert(error.message);
               });
    };

    FeedsController.$inject = ['$scope', 'dataService'];

    angular.module('office365App').controller('FeedsController', FeedsController);

}());