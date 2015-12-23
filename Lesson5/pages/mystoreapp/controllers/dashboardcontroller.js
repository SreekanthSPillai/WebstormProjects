(function () {

    var DashboardController = function ($scope, adalService, dataService) {
        var vm = this;

        $scope.$on('$viewContentLoaded', function () {          
           

            var chart1 = c3.generate({
                bindto: '#donut-example1',
                data : {
                    columns: [
                        ['Quotes', 300, 270, 280, 260, 270, 310],
                        ['Sales', 130, 100, 140, 180, 200, 160]
                    ],
                    types: {
                        Quotes: 'area-spline',
                        Sales: 'area-spline'
                    }
                   }
               });

            var chart2 = c3.generate({
                bindto: '#donut-example2',
                data: {
                    columns: [
                        ['In-Store Sales', 30],
                        ['Mail-Order Sales', 80],
                        ['Portal Sales', 120]
                    ],
                    type: 'donut',
                    onclick: function (d, i) { console.log("onclick", d, i); },
                    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                },
                donut: {
                    title: "Sales/Channel"
                }
            });


            var chart3 = c3.generate({
                bindto: '#donut-example3',
                data: {
                        x: 'x',
                        columns: [
                        ['x', '2015', '2014', '2013', '2012', '2011', '2010'],
                        ['Personal', 30, 200, 100, 400, 150, 250],
                        ['Commercial', 130, 100, 140, 200, 150, 50]
                    ],
                        type: 'bar'
                    }
            });

        });        
    };

    DashboardController.$inject = ['$scope', 'adalAuthenticationService', 'dataService'];

    angular.module('office365App').controller('DashboardController', DashboardController);

}());