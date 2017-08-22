angular.module('swire').controller('resourceProjectTagController', function ($scope, $stateParams, $rootScope,CompleteUserData,TagFormat, CompleteResourceData,ResourceValue,Language,Resource,$state, $window, $filter, KeyMapper, $http,Sidebar) {
	$scope.customerName = $stateParams.customerName;
    $scope.service = $stateParams.resourceName;
    $scope.selectedRowId = 0;
    $scope.resourcesObject = {};
    $scope.resourcesObject = CompleteResourceData.CompletResourceData;
    $scope.sidebar = Sidebar.sidebar;
    $scope.tabTableView = false;
    var resourceName = $stateParams.resourceName;
    $scope.customerName = $stateParams.customerName || '';
    $scope.serviceName = $stateParams.serviceName || '';
    $scope.resourceName = resourceName;
    $scope.master = $stateParams.serviceName;
    $scope.newRole = "true";
    // $scope.serviceData = ResourceValue.virtualMachine({resourceName: resourceName});
    $scope.serviceData = CompleteUserData.CompleteUserData;
    $scope.language = Language.language;
    $scope.serviceDataItems = [];
    $scope.dataFortable = {};
    $scope.type = 'projects';
    $scope.sidebar.$promise.then(function(response) {
        var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
        $scope.customerSideBar = customer;
    })
    $scope.filteredBus = [];
	$scope.options = [
	      {name:'Tagged', value: true},
	      {name:'Untagged', value: false}
		];
    var keyMapper = KeyMapper.keyMapper;
    $scope.tagFormat = TagFormat.tagFormat;
		 $scope.sidebar.$promise.then(function(response) {
	        var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
	        $scope.customerSideBar = customer;
    	})	
	$scope.translate = function (keyword) {
		if (keyword.slice(-1) == 's') {
		    keyword = keyword.slice(0, -1);
		}
		return $scope.language[keyword] || keyword;
	}
	
	$scope.getTaggedProjects = function() {
		var selectedServiceName = $scope.serviceName;
		$scope.custmerProjects  = [];
		ResourceValue.getResourceTaggedProject({resourceName: $scope.resourceName,customerName:$scope.customerName,instanceId: $stateParams.instanceId,resourceKey: $stateParams.key}).$promise.then(function(response) {
			$scope.selectedRowId = 0;
			if(response.status === 'success' && response['statusMessage'].projectName !== 'untagged') {
				$scope.custmerProjects = [{'projectName': response['statusMessage'].projectName,'tagged': true}]
			}
		})

	}
	$scope.getFilter = function (newRole) {
        if(newRole === 'true') {
        	$scope.getTaggedProjects();
        } else if(newRole === 'false') {
        	$scope.getUnTaggedProjects();	
        }
    }
	$scope.getUnTaggedProjects = function() {
		// var selectedServiceName = $scope.serviceName;
		// ResourceValue.getUnTaggedProjects({customerName:$scope.customerName,resourceName:$stateParams.resourceName,instanceId:$stateParams.instanceId}).$promise.then(function(response) {
		// 	$scope.selectedRowId = 0;
		// 	$scope.filteredBuBudgets = response['statusMessage'].map(function (bu) {
		// 		return {
		// 			'buname': bu,
		// 			'tagged': true
		// 		}
		// 	});
		// })
		$scope.serviceData.$promise.then(function(response) {
			$scope.custmerProjects = response[$scope.customerName].projects.map(function (projects) {
			return {
			'projectName': projects.projectName,
			'tagged': false
			}
		});
       })
	}
	$scope.getTaggedProjects();
	// 
	$scope.selectRowData = function(row) {
		    $scope.selectedRowId = row;
	}
	$scope.tag = function() {
		ResourceValue.tagResourceToProject({resourceName:$stateParams.resourceName,instanceId:$stateParams.instanceId,customerName:$scope.customerName,project:$scope.custmerProjects[$scope.selectedRowId].projectName}).$promise.then(function(response) {
			$scope.selectedRowId = 0;
			$scope.getUnTaggedProjects();
		})
	}	

	$scope.untag = function() {		
		ResourceValue.unTagResourceToProject({resourceName:$stateParams.resourceName,instanceId:$stateParams.instanceId,customerName:$scope.customerName,project:$scope.custmerProjects[$scope.selectedRowId].projectName}).$promise.then(function(response) {
			$scope.selectedRowId = 0;
			$scope.getTaggedProjects();
		})
	}	
})

