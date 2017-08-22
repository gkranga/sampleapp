angular.module('swire').controller('BudgetListController', function($scope,$state,$stateParams, $rootScope,$http,Sidebar,$filter,Language,ResourceValue,User,Customer,KeyMapper,budgetServices) {
    // $scope.budgets = 'asdasdsaaaaaaaaa';
    $scope.customerBudgets = [];
    // $scope.budgetListObject = budgetListServices.budgetListServices;

    // $scope.budgetListObject.$promise.then(function (response) {
    //     $scope.budgetList = response;
    // })
    $rootScope.showCardViewButtonBudget = true;

    $rootScope.showListViewButtonBudget = false;
    $scope.selectedRowId = 0 ;
    $scope.getSingular = function(keyword) {
        if (keyword.slice(-1) == 's') {
            keyword = keyword.slice(0, -1);
        }
        return keyword;
    }
    $scope.tabInitComplete = false;
    $scope.tabFormat = 'details';

    $scope.customerName = $stateParams.customerName || '';
    $scope.masterService = 'adminServices';
    $scope.ser  =  $scope.service = $state.params.service;
    // $scope.serviceSingular = $scope.getSingular($scope.ser);
    $scope.master = 'finance';
    $scope.service  = 'budget';
    $scope.resourceName  = 'budget';
    $scope.sidebar = Sidebar.sidebar;
    $scope.sidebar.$promise.then(function(response) {
        var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
        $scope.customerSideBar = customer;
    })
    
    $scope.serviceData = ResourceValue.virtualMachine({resourceName: $scope.service});

    $scope.serviceData.$promise.then(function (response) {
     
        angular.forEach(response, function (resourseValue, resourseKey) {
        
            if (resourseValue.table) {
                $scope.table = resourseValue.table;
            }
            if (resourseValue.tab) {
                $scope.tabs = resourseValue.tab;
                // $scope.tabDetails($scope.tabs[0], 'General', $scope.tabs[0].isTable);

            }
        });
    });
    $scope.keyMapper = KeyMapper.keyMapper;

    $scope.objectTransform = function (name) {
        if (typeof (name) == "object") {
            return name.toString();
        } else {
            if(typeof name != Number)
                return name.charAt(0).toUpperCase() +  name.substr(1).toLowerCase();
            return name;
        }
    }

    $scope.language = Language.language;
    $http({
        method: 'GET',
        url: '/budget/list/'+$scope.customerName
    }).then(function successCallback(response) {
        $scope.customerBudgets = response.data.statusMessage;
        // console.log($scope.tabs);
        $scope.tabDetails($scope.tabs[0]);
    }, function errorCallback(response) {
        // console.log(response.serviceDataItems);
    });
    $scope.loadbusOfBudget  = function(customerName,selectedRowId) {
        $scope.busOfBudget = {};
        budgetServices.getBudgetBU({customerName:customerName,budgetName:$scope.customerBudgets[selectedRowId].budgetName}).$promise.then(function(response) {
            if (response['status'] == 'success') {
                $scope.busOfBudget = response['statusMessage'];
            }
            $scope.tabInitComplete = true;
        })
    }    
     $scope.loadProjectsOfBudget  = function(customerName,selectedRowId) {
        budgetServices.getBudgetProject({customerName:customerName,budgetName:$scope.customerBudgets[selectedRowId].budgetName,name:name}).$promise.then(function(response) {
            if (response['status'] == 'success') {
                $scope.projectsOfBudget = response['statusMessage'];
            }
            $scope.tabInitComplete = true;
        })
    } 
    $scope.budgetName = $scope.customerBudgets[$scope.selectedRowId];

    $scope.selectRowData = function (rowKey) {
        $scope.busOfBudget = [];
        $scope.projectsOfBudget = [];
        $scope.selectedRowId = rowKey;
        $scope.tabDetails($scope.tabs[0]);

    }
    $scope.tabDetails = function(tab) {
        let tabname = tab.tabName;
        $scope.tabtable ={};
        if(tab.tabName == 'Projects') {
            $scope.loadbusOfBudget($scope.customerName , $scope.selectedRowId);
        } else if (tab.tabName == 'BU') {
            $scope.loadbusOfBudget($scope.customerName , $scope.selectedRowId);
        } else if (tab.tabName == 'Details') {
            $scope.detailsData = $scope.customerBudgets[$scope.selectedRowId] //($scope.customerName , );
        }      
        $scope.tabtable  = tab.tabData[0];
    
        $scope.tabInitComplete = true;
        $scope.tabFormat = tabname.toLowerCase();
        $scope.activeTabName = tab.tabName;
    }
    $scope.translate = function (keyword) {

        if (keyword) {
            if (keyword.slice(-1) == 's') {
                keyword = keyword.slice(0, -1);
            }
            return $scope.language[keyword] || keyword;
        }
    }
    $scope.notSorted = function(obj){
    if (!obj) {
        return [];
    }
    return Object.keys(obj);
    }
    // $scope.tabDetails = function (data, tabKeySearch, isTable = true) {
    //
    //         $scope.tabTableView = isTable;
    //         $scope.generalRowId = 0;
    //         $scope.dataFortable["general"] = [];
    //         $scope.dataFortable["general"][$scope.generalRowId] = [];
    //         genaralRow = {};
    //         $q.all(promises).then(function (results) {
    //             var generalData = data.tabData[0].columns;
    //             angular.forEach(generalData, function (rowValue, rowKey) {
    //                 genaralRow[rowKey] = ($scope.serviceDataItems[$scope.selectedRowId][rowKey]) ? $scope.serviceDataItems[$scope.selectedRowId][rowKey] : null;
    //             });
    //             $scope.dataFortable["general"][$scope.generalRowId].push(genaralRow);
    //         }, function (response) {
    //         });
    //
    //     $scope.selectedTabData = data;
    // }
    $scope.test = false;
});
