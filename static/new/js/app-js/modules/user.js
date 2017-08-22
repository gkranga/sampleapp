angular.module('swire').config(function($stateProvider,$httpProvider,$locationProvider){
  $stateProvider.state('swaUserAdd',{
    url:'/servicewire/users/add',
    templateUrl:'/static/new/partials/swaUserAdd.html',
    controller:'SwaUserAddController'
  }).state('userAdd',{
    url:'/:customerName/users/add',
    templateUrl:'/static/new/partials/userAdd.html',
    controller:'UserAddController'
  })
  .state('userImport', {
  	url: '/:customerName/users/import',
  	templateUrl: '/static/new/partials/userImport.html',
  	controller: 'UserImportController'
  })
  .state('swaListView', {
    url: '/swa/:service',
    templateUrl: '/static/new/partials/swaList.html',
    controller: 'swaListController'
  })
})