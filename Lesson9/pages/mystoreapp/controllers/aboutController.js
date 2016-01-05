(function () {

    var AboutController = function ($scope, dataService) {
        var vm = this;
                   
        vm.emails = [];//dataService.getMailSummary();

        dataService.getMailSummary()
               .then(function (mails) {                   
                   vm.emails = mails;                 
               }, function (error) {
                   $window.alert(error.message);
               });
    };

    AboutController.$inject = ['$scope', 'dataService'];

    angular.module('office365App').controller('AboutController', AboutController);

}());