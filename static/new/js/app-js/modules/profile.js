angular.module('swire').config(function($stateProvider,$httpProvider,$locationProvider){
    $stateProvider.state('profile',{
        url:'/profile',
        templateUrl:'/static/new/partials/profile.html',
        controller:'ProfileController'
    })
    $stateProvider.state('billing',{
        url:'/finance/:customerName/billing',
        templateUrl:'/static/new/partials/billing.html',
        controller:'BillingController'
    })
    $stateProvider.state('test',{
        url:'/reports',
        templateUrl:'/static/new/partials/reports.html',
        controller:'TestController'
    })
    $stateProvider.state('test2',{
        url:'/notification-view',
        templateUrl:'/static/new/partials/notificationAdminView.html',
        controller:'TestController'
    })
    $stateProvider.state('test3',{
        url:'/notification-settings',
        templateUrl:'/static/new/partials/notificationSettings.html',
        controller:'TestController'
    })
    $stateProvider.state('budget',{
        url:'/:customerName/budget',
        templateUrl:'/static/new/partials/create_budget.html',
        controller:'BudgetController'
    })
    $stateProvider.state('budgetEdit',{
        url:'/:customerName/:budgetName/budget',
        templateUrl:'/static/new/partials/create_budget.html',
        controller:'BudgetController'
    })    
    $stateProvider.state('budget-list',{
        url:'/finance/:customerName/budget/list',
        templateUrl:'/static/new/partials/budget-list.html',
        controller:'BudgetListController'
    })
    $stateProvider.state('budget-card-view',{
        url:'/finance/:customerName/budget',
        templateUrl:'/static/new/partials/budget-card.html',
        controller:'BudgetCardController'
    })
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
 	$httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
     	var key, result = [], response;
     	if(typeof data == "string") { //$http support
            response = data;
     	} else {
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
                }
            }
            response = result.join("&");
        }
        return response;
	});
});