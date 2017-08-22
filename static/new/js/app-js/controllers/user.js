angular.module('swire').controller('UserAddController', function($scope, $rootScope, $filter, $state, $window, CompleteUserData, Language, Sidebar, KeyMapper, DTOptionsBuilder, User){
	$rootScope.showCardViewButton = true;
	$rootScope.showListViewButton = false;

	$rootScope.customerName = $scope.customerName = $state.params.customerName;
	$rootScope.service = $scope.service = 'users';
	$scope.master = 'administrator';

	$scope.serviceData = CompleteUserData.CompleteUserData;
	$scope.language = Language.language;
	$scope.sidebar = Sidebar.sidebar;
	$scope.keyMapper = KeyMapper.keyMapper;

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
		$scope.customerSideBar = customer;
		$scope.permissions.read = customer.actionList.adminServices.indexOf('read'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.create = customer.actionList.adminServices.indexOf('create'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.update = customer.actionList.adminServices.indexOf('update'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.all = customer.actionList.adminService;
	})

	$scope.translate = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return $scope.language[keyword] || keyword;
	}

	// $scope.localUser = true;

	$scope.checkLocalUser = function() {
		User.isUserLocal({uid: $scope.selectedServiceData.uid}).$promise.then(function(response) {
			if (response.status == 'success') {
				$scope.ldapConfig = response.statusMessage;
				if (response.statusMessage === true) {
					toastr.error('User already exists');
					toastr.clear();
				}
			} else {
				$scope.localUser = true;
			}
		})
	}

	$scope.createLocalUser = function() {
		$scope.selectedServiceData['customerName'] = $scope.customerName;
		$scope.selectedServiceData['isActive'] = 'yes';
		User.localSave($scope.selectedServiceData).$promise.then(function(response) {
			toastr.success(response.statusMessage);
			toastr.clear();
		})
	}
})

angular.module('swire').controller('UserImportController', function($scope, $rootScope, $filter, $state, $window, CompleteUserData, Language, Sidebar, KeyMapper, DTOptionsBuilder, User){
	$rootScope.showCardViewButton = true;
	$rootScope.showListViewButton = false;

	$rootScope.customerName = $scope.customerName = $state.params.customerName;
	$rootScope.service = $scope.service = 'users';
	$scope.master = 'administrator';

	// $scope.serviceData = CompleteUserData.CompleteUserData;
	$scope.language = Language.language;
	$scope.sidebar = Sidebar.sidebar;
	$scope.keyMapper = KeyMapper.keyMapper;

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

	$scope.translate = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return $scope.language[keyword] || keyword;
	}

	$scope.csv = {
    	content: null,
    	header: true,
    	headerVisible: true,
    	separator: ',',
    	separatorVisible: true,
    	result: null,
    	encoding: 'ISO-8859-1',
    	encodingVisible: true,
    	accept: '.csv'
    };

    $scope.csvComplete = function(result) {
    	console.log(result);
    }
})

angular.module('swire').controller('SwaUserAddController', function($scope, $rootScope, $filter, $state, $window, CompleteUserData, Language, Sidebar, KeyMapper, DTOptionsBuilder, User){
	$rootScope.showCardViewButton = false;
	$rootScope.showListViewButton = false;

	$rootScope.customerName = $scope.customerName = 'servicewire';
	$rootScope.service = $scope.service = 'users';
	$scope.master = 'administrator';

	$scope.serviceData = CompleteUserData.CompleteUserData;
	$scope.language = Language.language;
	$scope.sidebar = Sidebar.sidebar;
	$scope.keyMapper = KeyMapper.keyMapper;

	$scope.getSingular = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return keyword;
	}

	$scope.serviceSingular = $scope.getSingular($scope.service);
	$scope.serviceSingularName = ($scope.service == 'users') ? 'uid' : $scope.getSingular($scope.service)+'Name';

	$scope.permissions = {};

	$scope.permissions.read = true;
	$scope.permissions.create = true;
	$scope.permissions.update = true;

	$scope.isSwa = true;

	$scope.translate = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return $scope.language[keyword] || keyword;
	}

	$scope.localUser = true;

	// $scope.checkLocalUser = function() {
	// 	User.isUserLocal({uid: $scope.selectedServiceData.uid}).$promise.then(function(response) {
	// 		if (response.status == 'success') {
	// 			toastr.error('User already exists.');
	// 			toastr.clear();
	// 		} else if (typeof response.statusMessage == "object") {
	// 			$scope.ldapConfig = response.statusMessage;
	// 		} else {
	// 			$scope.localUser = true;
	// 		}
	// 	})
	// }

	$scope.createLocalUser = function() {
		$scope.selectedServiceData['customerName'] = $scope.customerName;
		$scope.selectedServiceData['isActive'] = 'yes';
		User.localSave($scope.selectedServiceData).$promise.then(function(response) {
			toastr.success(response.statusMessage);
			toastr.clear();
		})
	}
})