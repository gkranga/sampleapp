angular.module('swire').controller('BudgetCardController', function($scope,$stateParams, $rootScope,$http,Sidebar,$filter,Language) {
    // $scope.budgets = 'asdasdsaaaaaaaaa';
    $scope.customerBudgets = [];
    // $scope.budgetListObject = budgetListServices.budgetListServices;

    // $scope.budgetListObject.$promise.then(function (response) {
    //     $scope.budgetList = response;
    // })
    $rootScope.showCardViewButtonBudget = false;

    $rootScope.showListViewButtonBudget = true;

    $scope.customerName = $stateParams.customerName || '';
    $scope.master = 'request';
    $scope.service = 'Budget list';
    $scope.sidebar = Sidebar.sidebar;
    $scope.sidebar.$promise.then(function(response) {
        var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
        $scope.customerSideBar = customer;
    })
    $scope.language = Language.language;
    $http({
        method: 'GET',
        url: '/budget/list/'+$scope.customerName
    }).then(function successCallback(response) {
        $scope.customerBudgets = response.data.statusMessage;
    }, function errorCallback(response) {
        // console.log(response.serviceDataItems);
    });

    $scope.translate = function (keyword) {
        if (keyword) {
            if (keyword.slice(-1) == 's') {
                keyword = keyword.slice(0, -1);
            }
            return $scope.language[keyword] || keyword;
        }
    }
});
