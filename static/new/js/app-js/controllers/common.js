angular.module('swire').controller('CardController', function($scope, $rootScope, $stateParams, $state, $filter, $window, CompleteUserData, Language, Sidebar){
	
	$rootScope.showCardViewButton = false;
	$rootScope.showListViewButton = true;

	$scope.customerName = $stateParams.customerName;
	$rootScope.service = $scope.service = $state.params.service;

	$scope.serviceData = CompleteUserData.CompleteUserData;
	$scope.language = Language.language;
	$scope.sidebar = Sidebar.sidebar;
	$scope.permissions = {};

	$scope.getSingular = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return keyword;
	}

	$scope.serviceSingular = $scope.getSingular($scope.service);
	$scope.serviceSingularName = ($scope.service == 'users') ? 'uid' : $scope.getSingular($scope.service)+'Name';

	$scope.sidebar.$promise.then(function(response) {
		var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
		$scope.customerSideBar = customer;
		$scope.permissions.read = customer.actionList.adminServices.indexOf('read'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.create = customer.actionList.adminServices.indexOf('create'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.update = customer.actionList.adminServices.indexOf('update'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
	})

	$scope.translate = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return $scope.language[keyword] || keyword;
	}

	$scope.redirect = function(keyword) {
		// $state.go(keyword+'CardView');
	}
})

angular.module('swire').controller('DetailsController', function($scope, $filter, $rootScope, $state, $window, CompleteUserData, Language, Sidebar){
	$scope.init = function () {
		$scope.serviceData = CompleteUserData.CompleteUserData;
		$scope.language = Language.language;
	}
	$scope.init();

	$rootScope.showCardViewButton = false;
	$rootScope.showListViewButton = false;

	$scope.customerName = $state.params.customerName;
	$scope.service = $state.params.service;
	$scope.serviceName = $state.params.serviceName;
	$scope.sidebar = Sidebar.sidebar;

	$scope.getSingular = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return keyword;
	}

	$scope.serviceSingular = $scope.getSingular($scope.service);
	$scope.serviceSingularName = ($scope.service == 'users') ? 'uid' : $scope.getSingular($scope.service)+'Name';

	$scope.permissions = {};

	$scope.sidebar.$promise.then(function(response) {
		var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
		$scope.permissions.read = customer.actionList.adminServices.indexOf('read'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.create = customer.actionList.adminServices.indexOf('create'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.update = customer.actionList.adminServices.indexOf('update'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
	})

	$scope.setRequiredData = function(a1,a2,a3) { $scope.requiredData = $filter('objectFromArray')(a1,a2,a3) }
	$scope.serviceData.$promise.then(function(response) {
		$scope.setRequiredData($scope.serviceData[$scope.customerName][$scope.service], $scope.serviceSingularName, $scope.serviceName);
	})

	$scope.translate = function(keyword) {
		keyword = $scope.getSingular(keyword);
		return $scope.language[keyword] || keyword;
	}
})