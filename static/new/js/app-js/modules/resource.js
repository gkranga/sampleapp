angular.module('swire').config(function($stateProvider,$httpProvider,$locationProvider){
    $stateProvider.state('resources',{
      url:'/:serviceName/:customerName/:resourceName/list?key',
      templateUrl:'/static/new/partials/resourceListView.html',
      controller:'MyResourceCtrl'
    })

    $stateProvider.state('resourceAdd',{
      url:'/:serviceName/:customerName/:resourceName/add',
      templateUrl:'/static/new/partials/provision/resourceCreateView.html',
      controller:'commonResourceAddController'
    })
    $stateProvider.state('resourceProjectTag',{
        url:'/:serviceName/:customerName/:resourceName/tagProject/:key?instanceId',
        templateUrl:'/static/new/partials/resourceProjectTag.html',
        controller:'resourceProjectTagController'
    })
})