angular.module('swire').controller('MyResourceCtrl', function ($scope, $q, $rootScope, $state, CompleteResourceData, $window, Resource, $filter, KeyMapper, $http, Language, $stateParams, Sidebar, ResourceValue) {
    $scope.selectedRowId = 0;
    $scope.resourcesObject = {};
    $scope.resourcesObject = CompleteResourceData.CompletResourceData;
    $scope.sidebar = Sidebar.sidebar;
    $scope.tabTableView = false;
    var resourceName = $stateParams.resourceName;
    $scope.customerName = $stateParams.customerName || '';
    $scope.resourceName = resourceName;
    $scope.master = $stateParams.serviceName;

    
    $scope.viewby = 2;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    var itemsPerPage = 5;
    $scope.maxSize = 5; //Number of pager buttons to show


    $scope.serviceData = ResourceValue.virtualMachine({resourceName: resourceName});
    $scope.language = Language.language;

    // $scope.tt = Resource.formaterJson();

    $scope.serviceData.$promise.then(function (response) {

        angular.forEach(response, function (resourseValue, resourseKey) {

            if (resourseValue.table) {
                $scope.table = resourseValue.table;
            }
            if (resourseValue.tab) {
                $scope.tabs = resourseValue.tab;
                $scope.tabDetails($scope.tabs[0], 'Details', $scope.tabs[0].isTable);

            }
            if (resourseValue.other) {
                $scope.otherDetails = resourseValue.other;
                console.log($stateParams);
                if($stateParams.key) {
                    console.log({resourceName: $scope.resourceName,customerName:$scope.customerName,instanceId: $stateParams.key,resourceKey: $scope.otherDetails.uniqueKey});
                    ResourceValue.getResourceTaggedProject({resourceName: $scope.resourceName,customerName:$scope.customerName,instanceId: $stateParams.key,resourceKey: $scope.otherDetails.uniqueKey}).$promise.then(function(response) {
                        $scope.serviceDataItems = [response.statusMessage];
                        $scope.data =  [response.statusMessage];
                        $scope.totalItems = 1;
                        $scope.param1 = ($scope.currentPage-1)*itemsPerPage;
                        $scope.param2 = $scope.currentPage*$scope.itemsPerPage;
                        $scope.tabDetails($scope.tabs[0], 'Details', $scope.tabs[0].isTable);
                        $scope.activeTabName = 'Details';
                    })

                }
            }
        });
    })


    $scope.serviceDataItems = [];
    $scope.dataFortable = {};

    $scope.sidebar.$promise.then(function(response) {
        var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
        $scope.customerSideBar = customer;
    })

    var keyMapper = KeyMapper.keyMapper;
    if(!$stateParams.key) {
        $http({
            method: 'GET',
            url: '/resource/resourceData/' + resourceName
        }).then(function successCallback(response) {
            $scope.serviceDataItems = response.data.statusMessage.resources;
            $scope.data =  response.data.statusMessage.resources;
            $scope.totalItems = response.data.statusMessage.metaData.totalCount;
            $scope.param1 = ($scope.currentPage-1)*itemsPerPage;
            $scope.param2 = $scope.currentPage*$scope.itemsPerPage;
            $scope.tabDetails($scope.tabs[0], 'Details', $scope.tabs[0].isTable);
            $scope.activeTabName = 'Details';
        }, function errorCallback(response) {
        });
    }
        keyMapper.$promise.then(function (response) {
            $scope.resourseTabKeymapper = keyMapper.myResources.tab;
        });
    $scope.searchTable = function () {
        var filter = "";
        var filter = $scope.customFilter
        $scope.serviceDataItems = [];

        $http({
            method: 'GET',
            url: '/resource/resourceData/' + resourceName + '/' + filter
        }).then(function successCallback(response) {
            $scope.serviceDataItems = response.data.statusMessage.resources;
            $scope.data =  response.data.statusMessage.resources;
            $scope.totalItems = response.data.statusMessage.metaData.totalCount;
            $scope.param1 = ($scope.currentPage-1)*itemsPerPage;
            $scope.param2 = $scope.currentPage*$scope.itemsPerPage;
            $scope.tabDetails($scope.tabs[0], 'Details', $scope.tabs[0].isTable);
            $scope.activeTabName = 'Details';
        }, function errorCallback(response) {
        });
    }


    $scope.pageChange = function(keyword){
            $scope.param1 = (parseInt(keyword)-1)*itemsPerPage;
            $scope.param2 = keyword*$scope.itemsPerPage;

    }

    $scope.translate = function (keyword) {
        if (keyword.slice(-1) == 's') {
            keyword = keyword.slice(0, -1);
        }
        return $scope.language[keyword] || keyword;
    }
    $scope.searchKeyWord = function (keyword) {
        if (keyword.slice(-1) == 's') {
            keyword = keyword.slice(0, -1);
        }
        return keyword;
    }
    $scope.isObject = function (name) {
        if (typeof (name) == "object") {
            return true;
        }
        return false;
    }
    $scope.objectTransform = function (name) {
        if (typeof (name) == "object") {
            return name.name;
        } else {

            return name;
        }
    }
    $scope.sortField = function (name, field) {
        if ($scope[field]) {
            if ($scope[field] == 'DESC') {
                // $scope.test+field = 'ASC';
                $scope[field] = 'ASC';
            } else {
                // $scope.test+field = 'DESC';
                $scope[field] = 'DESC';
            }

        } else {
            // $scope.test+field = 'ASC';
            $scope[field] = 'ASC';
        }
        $http({
            method: 'GET',
            url: '/resource/resourceSortData/' + resourceName + '/' + name + '/' + $scope[field]
        }).then(function successCallback(response) {
            $scope.serviceDataItems = response.data.statusMessage.resources;
            $scope.data =  response.data.statusMessage.resources;
            $scope.totalItems = response.data.statusMessage.metaData.totalCount;
            $scope.param1 = ($scope.currentPage-1)*itemsPerPage;
            $scope.param2 = $scope.currentPage*$scope.itemsPerPage;
            $scope.tabDetails($scope.tabs[0], 'Details', $scope.tabs[0].isTable);
            $scope.activeTabName = 'Details';
        }, function errorCallback(response) {
        });

    }

    $scope.redirect = function (keyword, customer) {
        $state.go('cardView', {customerName: customer, service: keyword});
    }
    $scope.redirectToList = function (keyword, customer) {
        $state.go('requestListView', {customerName: customer, service: keyword});
    }
    $scope.redirectToListView = function (keyword, customer) {
        $state.go('resources', {customerName: customer, resourceName: keyword});
    }
    $scope.valIsObjectOrNot = function (val) {
        if (typeof (val) == "object") {
            return true;
        } else {
            return false;
        }
    }

    $scope.selectRowData = function (rowKey) {
        $scope.selectedRowId = rowKey;

        $scope.tabDetails($scope.tabs[0], 'Details', $scope.tabs[0].isTable);

    }
    $scope.isTabActive = function (tabName) {
        return ($scope.activeTabName === tabName) ? 'bold' : 'inherit';
    }
    $scope.mappedTabTableName = function (tabnameSearch) {

        angular.forEach($scope.resourseTabKeymapper, function (formaterValue, formaterKey) {
            var deferred = $q.defer();
            if (formaterValue == tabnameSearch)
            {
                value = formaterKey;
            }
        });
        return value;
    }

    $scope.tabDetails = function (data, tabKeySearch, isTable = true) {
        $scope.activeTabName = tabKeySearch;
        var promises = [];
        $scope.dataFortable["Details"] = [];
        $scope.dataFortable = [];
        angular.forEach($scope.resourseTabKeymapper, function (formaterValue, formaterKey) {
            var deferred = $q.defer();
            if (formaterValue == tabKeySearch)
            {
                $scope.tabtbName = formaterKey;
                deferred.resolve(formaterKey);
                promises.push(deferred.promise);
            }
        });
        if (tabKeySearch != 'Details') {
            $scope.tabTableView = isTable;
            angular.forEach(data.tabData, function (table, tableKey) {
                if (table.name) {
                    mappedTabTableName = $scope.mappedTabTableName(table.name)
                    $scope.dataFortable[mappedTabTableName] = [];
                    angular.forEach($scope.serviceDataItems, function (value, key) {
                        if (key == $scope.selectedRowId) {
                            $scope.dataFortable[mappedTabTableName].push(value[mappedTabTableName]);
                        }

                    });

                } else {
                    $q.all(promises).then(function (results) {
                        $scope.dataFortable[$scope.tabtbName] = [];
                        angular.forEach($scope.serviceDataItems, function (value, key) {
                            if (key == $scope.selectedRowId) {
                                kValue = [];
                                angular.forEach(value[$scope.tabtbName], function (valueName, valueKey) {
                                    if (typeof (valueName) == "object") {
                                        kValue.push(valueName);
                                    } else {

                                    }

                                });
                                $scope.dataFortable[$scope.tabtbName].push(kValue);
                            }

                        });
                    }, function (response) {
                    });
                }
            });
        } else {

            $scope.tabTableView = isTable;
            $scope.generalRowId = 0;
            $scope.dataFortable["details"] = [];
            $scope.dataFortable["details"][$scope.generalRowId] = [];
            genaralRow = {};
            $q.all(promises).then(function (results) {
                var generalData = data.tabData[0].columns;
                angular.forEach(generalData, function (rowValue, rowKey) {
                    genaralRow[rowKey] = ($scope.serviceDataItems[$scope.selectedRowId][rowKey]) ? $scope.serviceDataItems[$scope.selectedRowId][rowKey] : null;
                });
                $scope.dataFortable["details"][$scope.generalRowId].push(genaralRow);
            }, function (response) {
            });
        }
        $scope.selectedTabData = data;
    }

    $scope.notSorted = function(obj){
        if (!obj) {
        return [];
        }
        return Object.keys(obj);
    }
    $scope.tagProjects = function(key, value){
        $state.go('resourceProjectTag', {serviceName: $stateParams.serviceName,customerName: $stateParams.customerName, resourceName: $stateParams.resourceName, key: key, instanceId: value});
    }
})

