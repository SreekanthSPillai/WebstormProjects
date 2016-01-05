(function () {

    var CalendarController = function ($scope, dataService) {
        var vm = this;
        vm.events = [];

       vm.getEventSummary = function () {
            dataService.getEventSummary()
                   .then(function (events) {
                       vm.events = events;
                   }, function (error) {
                       $window.alert(error.message);
                   });
        };

       vm.getEventSummary();

    };

    CalendarController.$inject = ['$scope', 'dataService'];

    angular.module('office365App').controller('CalendarController', CalendarController);

}());