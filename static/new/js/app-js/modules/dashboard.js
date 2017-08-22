angular.module('swire').config(function($stateProvider,$httpProvider,$locationProvider){
    $stateProvider.state('dashboard',{
        url:'/:customerName',
        templateUrl:'/static/new/partials/dashboard.html',
        controller:'DashboardController'
    })
    // $locationProvider.html5Mode(true);
}).run(function($state){
   $state.go('dashboard');
});
