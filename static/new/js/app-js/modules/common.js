angular.module('swire').config(function($stateProvider,$httpProvider,$locationProvider){
    $stateProvider.state('cardView',{
      url:'/:customerName/:service',
      templateUrl: function($stateParams) {
        var keyword = $stateParams.service;
        if (keyword.slice(-1) == 's') {
          keyword = keyword.slice(0, -1);
        }
        return '/static/new/partials/'+keyword+'CardView.html'
      },
      controller:'CardController'
    }).state('listView',{
      url:'/:customerName/:service/list',
      templateUrl: '/static/new/partials/listView.html',
      controller:'ListController'
    }).state('add',{
      url:'/:customerName/:service/add',
      templateUrl: function($stateParams) {
        var keyword = $stateParams.service;
        if (keyword.slice(-1) == 's') {
          keyword = keyword.slice(0, -1);
        }
        return '/static/new/partials/'+keyword+'Add.html'
      },
      controller:'AddController'
      // details({customerName: 'ABCD', service: 'projects', serviceName: 'testProject'})
    }).state('details',{
      url:'/:customerName/:service/:serviceName',
      templateUrl: function($stateParams) {
        var keyword = $stateParams.service;
        if (keyword.slice(-1) == 's') {
          keyword = keyword.slice(0, -1);
        }
        return '/static/new/partials/'+keyword+'Details.html'
      },
      controller:'DetailsController'
    }).state('edit',{
      url:'/:customerName/:service/:serviceName/edit',
      templateUrl: function($stateParams) {
        var keyword = $stateParams.service;
        if (keyword == 'users') {
          return '/static/new/partials/userEdit.html';
        }
        if (keyword.slice(-1) == 's') {
          keyword = keyword.slice(0, -1);
        }
        return '/static/new/partials/'+keyword+'Add.html'
      },
      controller:'EditController'
    }).state('tagView',{
      url:'/:customerName/:service/:serviceName/tag/:tagName/role/:role',
      templateUrl: '/static/new/partials/tagView.html',
      controller:'TagController'
    }).state('budgetTagView',{
      url:'bu/:customerName/:service/:budgetName/tag/:tagName/:type',
      templateUrl: '/static/new/partials/financeTagView.html',
      controller:'budgetTagController'
    }).state('budgetProjectTagView',{
      url:'project/:customerName/:service/:budgetName/tag/:tagName/:type',
      templateUrl: '/static/new/partials/budgetProjectTagView.html',
      controller:'budgetProjectTagController'
    })
})
