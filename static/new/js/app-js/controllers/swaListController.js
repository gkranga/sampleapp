angular.module('swire').controller('swaListController', function(User, $scope, $rootScope, $filter, $state, $window, CompleteUserData, Language, Sidebar, KeyMapper, DTOptionsBuilder){
	$rootScope.showCardViewButton = false;
	$rootScope.showListViewButton = false;

	$rootScope.customerName = $scope.customerName = 'servicewire';
	$rootScope.service = $scope.service = $state.params.service;
	$scope.master = 'administrator';
	$scope.initComplete = false;

	$scope.serviceData = CompleteUserData.CompleteUserData;
	$scope.language = Language.language;
	$scope.sidebar = Sidebar.sidebar;
	$scope.keyMapper = KeyMapper.keyMapper;
	$scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('simple')
        .withDisplayLength(5)
        .withOption('bLengthChange', false)

    $scope.isSwa = true;

	$scope.getSingular = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return keyword;
	}

	$scope.serviceSingular = $scope.getSingular($scope.service);
	$scope.serviceSingularName = ($scope.service == 'users') ? 'uid' : $scope.getSingular($scope.service)+'Name';

	$scope.serviceData.$promise.then(function(response) {
		$scope.keyMapper.$promise.then(function(response1) {
			$scope.initComplete = true;
			var firstColumn = Object.keys(response1[$scope.service]['table'])[0];
			var filtered = $filter('orderBy')(response[$scope.service], firstColumn);
			$scope.selectedServiceData = filtered[0] || {};

			if (response1[$scope.service]['tab'] && response1[$scope.service]['tab'][0]) {	
				$scope.defaultTabFormat = $scope.tabFormat = response1[$scope.service]['tab'][0];
				$scope.defaultActiveTabName = $scope.activeTabName = response1[$scope.service]['tab'][0]['tabName'];
			}
		})
	})

	$scope.permissions = {};

	$scope.permissions.read = true;
	$scope.permissions.create = true;
	$scope.permissions.update = true;
	$scope.permissions.all = ['tagCa', 'readCustomer', 'readUser'];

	$scope.setSelectedRow = function(rowData) {
		$scope.selectedServiceData = rowData;

		$scope.tabFormat = $scope.defaultTabFormat;
		$scope.activeTabName = $scope.defaultActiveTabName;
	}

	$scope.translate = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return $scope.language[keyword] || keyword;
	}

	$scope.getTypeObject = function(word) {
		if (word === undefined) {
			return true;
		}
		return (typeof word == 'object');
	}

	$scope.dtInstance = {};

	$scope.dtInstanceCallback = function(_dtInstance) {
		$scope.dtInstance = _dtInstance;
	}

	$scope.searchTable = function (dtInstance) {
	    $scope.dtInstance.DataTable.search($scope.customFilter);
	    $scope.dtInstance.DataTable.search($scope.customFilter).draw();
	};

	$scope.objectTransform = function(name) {
		if(typeof(name) =="object"){
			return name.name;
		}else{

			return name;	
		}
	}

	$scope.valIsObjectOrNot = function(val) {
		if(typeof(val) =="object"){
			return true;
		}else{
			return false;	
		}
	}

	$scope.tabDetails = function(tab) {
		$scope.tabFormat = tab;
		$scope.activeTabName = tab.tabName;
        $scope.tabInitComplete = true;
		// console.log($scope.tabFormat.tabData)
	}

	$scope.isTabActive = function(tabName) {
		return ($scope.activeTabName === tabName) ? 'bold' : 'inherit';
	}

	$scope.loadUsersRelatedToService = function(selectedServiceName, role) {
		$scope.usersRelatedToService = [];
		$scope.tabInitComplete = false;
		User.userList({customerName: $scope.customerName, service: $scope.serviceSingularName, serviceName: selectedServiceName, role: role}).$promise.then(function(response) {
			if (response['status'] == 'success') {
				$scope.usersRelatedToService = response['statusMessage'];
			}
			$scope.tabInitComplete = true;
		})
	}
	
	$scope.tabInitComplete = function()
	{
		$scope.tabInitComplete = true;
	}
})