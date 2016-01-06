(function () {

    var InboxController = function ($scope, dataService) {
        var vm = this;

        vm.emails = [];

        vm.getMailSummary = function () {
            dataService.getMailSummary()
               .then(function (mails) {
                   vm.emails = mails;
               }, function (error) {
                   $window.alert(error.message);
               });
        };

        vm.getMailSummary();

    };

    InboxController.$inject = ['$scope', 'dataService'];

    angular.module('office365App').controller('InboxController', InboxController);

}());