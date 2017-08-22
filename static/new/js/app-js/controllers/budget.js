angular.module('swire').controller('BudgetController', function($scope, $rootScope,$stateParams,budgetServices,Sidebar,$filter,Language,$state,$http ,moment   ) {
    $scope.budget = {};
    $scope.budget.active = 'active';
    $scope.budget.budget_period = 'yearly';
    var d = new Date();
    var n = d.getFullYear();
    $scope.disableBudgetName = false;
    $scope.budgetyear = [n-1,n,n+1];
    $scope.budgetMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
    $scope.budgetQuarter = [1,2,3,4];
    $scope.budget.f_year = '2017';
    $scope.budget.f_quarter = 'Q1';
    $scope.budget.type = 'soft';
    $scope.master = 'finance';
    $scope.service = 'budget';

    $scope.budget.customer_name = $stateParams.customerName;
    $scope.create = function () {
        var formData = $scope.budget;
        formData['financialMonth'] = $scope.budgetMonth[formData['start_date']].toLowerCase();
        budgetServices.create(formData, function (response) {
            if(response.status ==='success') {
                $state.go('budget-list',  {customerName:$stateParams.customerName});
            }
        }, function (error) {
            console.log("Error");
        });
    };
    if($stateParams.budgetName){
        $scope.disableBudgetName =true;
        $http({
        method: 'GET',
        url: '/budget/'+$stateParams.customerName+'/'+$stateParams.budgetName
    }).then(function successCallback(response) {
        $scope.budget.budget_name = response.data.statusMessage.budgetName;
        $scope.budget.budget_period = response.data.statusMessage.period;
        $scope.budgetupdate();
        $scope.budget.budget_period = response.data.statusMessage.period;
        $scope.budget.f_year  = response.data.statusMessage.financialYear;
        $scope.budget.f_quarter  = response.data.statusMessage.financialQuarter;
        $scope.budget.f_month = response.data.statusMessage.financialMonth;
        $scope.budget.value = parseInt(response.data.statusMessage.value);
        $scope.budget.start_date = String(moment(response.data.statusMessage.start).format('M'));
        $scope.budget.end_date = String(moment(response.data.statusMessage.end).format('M'));
        $scope.budget.type = response.data.statusMessage.type;
        $scope.budget.create_active = response.data.statusMessage.isActive;
    }, function errorCallback(response) {
        // console.log(response.serviceDataItems);
    });
    }else {
       $scope.budget.start_date = '1';
        $scope.budget.end_date = '12';
    }
    
    $scope.update = function () {
        var formData = $scope.budget;
    
        budgetServices.update(formData, function (response) {
            if(response.status ==='success') {
                $state.go('budget-list',  {customerName:$stateParams.customerName});
            }
        }, function (error) {
            console.log("Error");
        })  
    }
    
    $scope.endDateDisabled = true;
    $scope.year_show = true;
    $scope.show_end_date = true;
    $scope.quarter_show = false;
    $scope.monthly_show = false;
    // $scope.serviceData = ResourceValue.virtualMachine({resourceName: resourceName});
    $scope.budgetupdate = function () {
        // $scope.budget.start_date  = "";
        // $scope.budget.end_date  = "";
        $scope.year_show = true;
        $scope.show_end_date = true;
        $scope.endDateDisabled = false;
        $scope.quarter_show = false;
        $scope.monthly_show = false;
        switch($scope.budget.budget_period) {
            case 'yearly' :
                $scope.year_show = true;
                $scope.endDateDisabled = true;
                $scope.updateBudgetPeriod();
                break;
            case 'quarterly' :
                $scope.quarter_show = true;
                $scope.endDateDisabled = true;
                $scope.updateBudgetPeriod();
                break;
            case 'monthly' :
                $scope.monthly_show = false;
                $scope.show_end_date = false;
                $scope.updateBudgetPeriod();
                break;                
        }
    }

    $scope.updateBudgetPeriod  = function() {
            
        if($scope.budget.budget_period === 'yearly') {
            var endMonth  = parseInt($scope.budget.start_date) + 11;
                if(endMonth <= 12) {
                    $scope.budget.end_date = String(endMonth);
                } else if(endMonth >= 12) {
                    $scope.budget.end_date = String(endMonth - 12);
                }
                console.log($scope.budget.end_date);
        }else if($scope.budget.budget_period === 'quarterly') {
             
             var endMonth  = parseInt($scope.budget.start_date) + 2;
                if(endMonth <= 12) {
                    $scope.budget.end_date = String(endMonth);
                } else if(endMonth >= 12) {
                    $scope.budget.end_date = String(endMonth - 12);
                }
            
        }else if($scope.budget.budget_period === 'monthly') {
            $scope.budget.end_date  = "";
        }
    }

    $scope.budget.create_active = 'yes';
    $scope.customerName = $stateParams.customerName || '';
    $scope.resourceName = 'budget';
    $scope.service = 'Budget list';
    $scope.sidebar = Sidebar.sidebar;
    $scope.sidebar.$promise.then(function(response) {
        var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
        $scope.customerSideBar = customer;
    })
    $scope.language = Language.language;

    $scope.translate = function (keyword) {
        if (keyword) {
            if (keyword.slice(-1) == 's') {
                keyword = keyword.slice(0, -1);
            }
            return $scope.language[keyword] || keyword;
        }
    }
})

