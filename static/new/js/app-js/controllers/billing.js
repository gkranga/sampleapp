angular.module('swire').controller('BillingController', function($scope, $rootScope,$stateParams,$filter,$state,Sidebar,Language,$http,billingServices,moment) {
    $scope.billing = {};
    $scope.customerName = $stateParams.customerName || '';
    $scope.master = 'finance';
    $scope.resourceName = 'billing';
    $scope.sidebar = Sidebar.sidebar;
    $scope.sidebar.$promise.then(function(response) {
        var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
        $scope.customerSideBar = customer;
    })

    $scope.filtersList = ['Provider','Region','Account','Business Unit','Project','Resource Type']; 
    $scope.billing.commonFilter1 = 'Provider';
    $scope.billing.commonFilter2 = 'Region';
    $scope.billing.commonFilter3 = 'Account';
    $scope.billing.commonFilter4 = 'Business Unit';
    $scope.billing.period = 'current'; 
    $scope.billing.csp = 'all';
    $scope.billing.account = 'all';
    $scope.billing.bu = 'all';
    $scope.billing.project = 'all';
    $scope.billing.resourceName = 'all';
    $scope.billing.region = 'all';
    // billing.region
    $scope.billing.regions = [];
    $scope.billingData =[];
    $scope.language = Language.language;
    $scope.data = {};
    $scope.billing.projects = [];
    billingServices.getbillingFilter({customerName: $stateParams.customerName}).$promise.then(function(response) {
        if (response['status'] === 'success') {
            $scope.billing.accounts = response['statusMessage'].accounts;
            $scope.billing.bus = response['statusMessage'].bus;
            $scope.billing.csps = response['statusMessage'].csps;
            $scope.billing.projects = response['statusMessage'].projects;
            $scope.billing.resourceNames = response['statusMessage'].resourceNames;
            let regions = response['statusMessage'].csps.map(function(val) {
                    return val.regions;
            }).reduce(function(a,b){
                  return a.concat(b);
            }, []).filter(function(item, i, ar){
                return ar.indexOf(item) === i;
            });
            $scope.billing.regions.push(regions);

            $scope.accountChange();
        }
        $scope.tabInitComplete = true;
        $scope.refreshBilling();
    });
    $scope.data.customerName =  $stateParams.customerName;
    $scope.data.projects = $scope.billing.projects
    if ($scope.billing.period == 'current')
    {  
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        var yourFormat = 'YYYY-M-D';
        $scope.data.start_date = moment(firstDay).format(yourFormat);
        $scope.data.end_date  = moment(lastDay).format(yourFormat);
        
    }
    $scope.periodChange  = function () {
         if ($scope.billing.period == '3m')
        {   
            var firstDay = new moment().subtract(3, 'months').startOf('month');
            var lastDay = new moment().subtract(1, 'months').endOf('month');
        
        } else if ($scope.billing.period == '6m')
        {   
            var firstDay = new moment().subtract(6, 'months').startOf('month');
            var lastDay = new moment().subtract(1, 'months').endOf('month');
        } else if ($scope.billing.period == '12m')
        {
            var firstDay = new moment().subtract(12, 'months').startOf('month');
            var lastDay = new moment().subtract(1, 'months').endOf('month');
        }
            $scope.data.start_date = moment(firstDay).format(yourFormat);
            $scope.data.end_date  = moment(lastDay).format(yourFormat);
            
    };
    $scope.refreshBilling  = function () {
        $scope.data.provider = [];
        if($scope.billing.csp == 'all') {
            var cps = $scope.billing.csps.map(function(val) {
                    return val.name;
            });
            $scope.data.provider = cps;
        }
        $scope.initComplete = false;
        billingServices.getbilling($scope.data).$promise.then(function(response) {
        if (response['status'] == 'success') {
        $scope.billingKeys = [];
        $scope.billingMarked = [];
        $scope.finalBilling = [];
        $scope.billingMarkedBillValue = [];


        $scope.billingKeys1 = [];
        $scope.billingMarked1 = [];
        $scope.finalBilling1 = [];
        $scope.billingMarkedBillValue1 = [];

        $scope.billingKeys2 = [];
        $scope.billingMarked2 = [];
        $scope.finalBilling2 = [];
        $scope.billingMarkedBillValue2 = [];        

        $scope.billingKeys3 = [];
        $scope.billingMarked3 = [];
        $scope.finalBilling3 = [];
        $scope.billingMarkedBillValue3 = [];                
        
        $scope.bill = [];
        $scope.billingData = response['statusMessage'][0];
        for (var i in $scope.billingData.Provider) {
            $scope.billingKeys.push(i);
            $scope.billingMarked.push($scope.billingData.Provider[i].marked_value);
            $scope.billingMarkedBillValue.push($scope.billingData.Provider[i].marked_bill_value);

            $scope.billingKeys1.push(i);
            $scope.billingMarked1.push($scope.billingData.Provider[i].marked_value);
            $scope.billingMarkedBillValue1.push($scope.billingData.Provider[i].marked_bill_value);

            $scope.billingKeys2.push(i);
            $scope.billingMarked2.push($scope.billingData.Provider[i].marked_value);
            $scope.billingMarkedBillValue2.push($scope.billingData.Provider[i].marked_bill_value);

            $scope.billingKeys3.push(i);
            $scope.billingMarked3.push($scope.billingData.Provider[i].marked_value);
            $scope.billingMarkedBillValue3.push($scope.billingData.Provider[i].marked_bill_value);
        }
            $scope.finalBilling.push($scope.billingMarked);
            $scope.finalBilling.push($scope.billingMarkedBillValue);

            $scope.finalBilling1.push($scope.billingMarked1);
            $scope.finalBilling1.push($scope.billingMarkedBillValue1);

            $scope.finalBilling2.push($scope.billingMarked2);
            $scope.finalBilling2.push($scope.billingMarkedBillValue2);

            $scope.finalBilling3.push($scope.billingMarked3);
            $scope.finalBilling3.push($scope.billingMarkedBillValue3);
            $scope.initComplete = true;
        }
        });
    };


    
    $scope.providerChange = function (keyword) {
        var  allcsps = [];
        $scope.billing.regions =[];
        angular.copy($scope.billing.csps, allcsps);
        if($scope.billing.csp !== 'all') { 
            let regions = allcsps.filter(function(item, i, ar){
                if(item.name === $scope.billing.csp) {
                    return item;
                }
            });

        $scope.billing.regions.push(regions[0].regions);
        } else {
            let regions = allcsps.map(function(val) {
                    return val.regions;
            }).reduce(function(a,b){
                  return a.concat(b);
            }, []).filter(function(item, i, ar){
                return ar.indexOf(item) === i;
            });
             $scope.billing.regions.push(regions);
        }
        $scope.billing.region = 'all';
    }; 

    $scope.accountChange = function (keyword) {
        var  accountsProject = accountsBu = [];
        $scope.billing.projects =[];
        angular.copy($scope.billing.accounts, accountsProject);        
        if($scope.billing.account !== 'all') { 
            let projects = accountsProject.filter(function(item, i, ar){
                if(item.name === $scope.billing.account) {
                    return item.projects;
                }
            });
            if(projects[0].projects.length) {
                $scope.billing.projects.push(projects[0].projects);
            }    
        }else{ 
            let projects = accountsProject.map(function(val) {
                    return val.projects;
                }).reduce(function(a,b){
                    return a.concat(b);
                }, []).filter(function(item, i, ar){
                    return ar.indexOf(item) === i;
                });
            $scope.billing.projects = projects ;
        }

        // angular.copy($scope.billing.bus, accountsBu);        
        // if($scope.billing.bu !== 'all') { 
        //     let projects = accountsBu.filter(function(item, i, ar){
        //         if(item.name === $scope.billing.bu) {
        //             return item.projects;
        //         }
        //     });
        //     if(projects[0].projects.length) {
        //         $scope.billing.projects.push(projects[0].projects);
        //     }    
        // }    

        // $scope.billing.project.push(regions[0].regions);
        // } else {
        //     let regions = allcsps.map(function(val) {
        //             return val.regions;
        //     }).reduce(function(a,b){
        //           return a.concat(b);
        //     }, []).filter(function(item, i, ar){
        //         return ar.indexOf(item) === i;
        //     });
        //      $scope.billing.regions.push(regions);
        // }
        // $scope.billing.region = 'all';
    };     
    $scope.translate = function (keyword) {
        if (keyword) {
            if (keyword.slice(-1) == 's') {
                keyword = keyword.slice(0, -1);
            }
            return $scope.language[keyword] || keyword;
        }
    }

 
    $scope.changeFilter1 = function() {
        $scope.billingKeys = [];
        $scope.billingMarked = [];
        $scope.finalBilling = [];
        console.log();
        $scope.billingMarkedBillValue = [];
        for (var i in $scope.billingData[$scope.billing.commonFilter1]) {
            $scope.billingKeys.push(i);
            // console.log();
            $scope.billingMarked.push($scope.billingData[$scope.billing.commonFilter1][i].marked_value);
            $scope.billingMarkedBillValue.push($scope.billingData[$scope.billing.commonFilter1][i].marked_bill_value);
        }
            $scope.finalBilling.push($scope.billingMarked);
            $scope.finalBilling.push($scope.billingMarkedBillValue);
    }
 
    $scope.changeFilter2 = function() {
        $scope.billingKeys1 = [];
        $scope.billingMarked1 = [];
        $scope.finalBilling1 = [];
        $scope.billingMarkedBillValue1 = [];
        console.log($scope.billing.commonFilter2);
        for (var i in $scope.billingData[$scope.billing.commonFilter2]) {
            $scope.billingKeys1.push(i);
            // console.log();
            $scope.billingMarked1.push($scope.billingData[$scope.billing.commonFilter2][i].marked_value);
            $scope.billingMarkedBillValue1.push($scope.billingData[$scope.billing.commonFilter2][i].marked_bill_value);
        }
            $scope.finalBilling1.push($scope.billingMarked1);
            $scope.finalBilling1.push($scope.billingMarkedBillValue1);
    }
    $scope.changeFilter3 = function() {
        $scope.billingKeys2 = [];
        $scope.billingMarked2 = [];
        $scope.finalBilling2 = [];
        $scope.billingMarkedBillValue2 = [];

        for (var i in $scope.billingData[$scope.billing.commonFilter3]) {
            $scope.billingKeys2.push(i);
            // console.log();
            $scope.billingMarked2.push($scope.billingData[$scope.billing.commonFilter3][i].marked_value);
            $scope.billingMarkedBillValue2.push($scope.billingData[$scope.billing.commonFilter3][i].marked_bill_value);
        }
            $scope.finalBilling2.push($scope.billingMarked2);
            $scope.finalBilling2.push($scope.billingMarkedBillValue2);

    }

    $scope.changeFilter4 = function() {

        $scope.billingKeys3 = [];
        $scope.billingMarked3 = [];
        $scope.finalBilling3 = [];
        $scope.billingMarkedBillValue3 = [];

        for (var i in $scope.billingData[$scope.billing.commonFilter4]) {
            $scope.billingKeys3.push(i);
            // console.log();
            $scope.billingMarked3.push($scope.billingData[$scope.billing.commonFilter4][i].marked_value);
            $scope.billingMarkedBillValue3.push($scope.billingData[$scope.billing.commonFilter4][i].marked_bill_value);
        }
            $scope.finalBilling3.push($scope.billingMarked3);
            $scope.finalBilling3.push($scope.billingMarkedBillValue3);

    }
})

