angular.module('swire').controller('MyRequestListController', function($scope, $rootScope, $filter, $state, $window, CompleteUserData, Language, Sidebar, KeyMapper, DTOptionsBuilder, Request){
	$rootScope.showCardViewButton = false;
	$rootScope.showListViewButton = false;

	$rootScope.customerName = $scope.customerName = $state.params.customerName;
	$rootScope.service = $scope.service = 'myRequests';
	$scope.master = 'request';

	$scope.serviceData = Request.myRequests();
	$scope.language = Language.language;
	$scope.sidebar = Sidebar.sidebar;
	$scope.keyMapper = KeyMapper.keyMapper;
	$scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('simple')
        .withDisplayLength(5)
        .withOption('bLengthChange', false);

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
			var firstColumn = Object.keys(response1[$scope.service]['table'])[0];
			var filtered = $filter('orderBy')(response['statusMessage'], firstColumn);
			$scope.selectedServiceData = filtered[0] || {};
		})
	})

	$scope.permissions = {};

	$scope.sidebar.$promise.then(function(response) {
		var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
		$scope.customerSideBar = customer;
		$scope.permissions.read = true;
	})

	$scope.setSelectedRow = function(rowData) {
		$scope.selectedServiceData = rowData;
	}

	$scope.translate = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return $scope.language[keyword] || keyword;
	}

	$scope.dtInstance = {};

	$scope.dtInstanceCallback = function(_dtInstance) {
		$scope.dtInstance = _dtInstance;
	}

	$scope.searchTable = function (dtInstance) {
	    $scope.dtInstance.DataTable.search($scope.customFilter);
	    $scope.dtInstance.DataTable.search($scope.customFilter).draw();
	};

	$scope.addComment = function() {
		Request.comment({requestId: $scope.selectedServiceData.requestId, comment: $scope.newComment, customerName: $scope.customerName}).$promise.then(function(response) {
			$scope.newComment = '';
			toastr.success('Comment added.');
			toastr.clear();
		})
	}
})

angular.module('swire').controller('RequestListController', function($scope, $rootScope, $filter, $state, $window, CompleteUserData, Language, Sidebar, KeyMapper, DTOptionsBuilder, Request){
	$rootScope.showCardViewButton = false;
	$rootScope.showListViewButton = false;

	$rootScope.customerName = $scope.customerName = $state.params.customerName;
	$rootScope.service = $scope.service = 'forApprovals';
	$scope.master = 'request';

	$scope.serviceData = Request.approvalList();
	$scope.language = Language.language;
	$scope.sidebar = Sidebar.sidebar;
	$scope.keyMapper = KeyMapper.keyMapper;
	$scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('simple')
        .withDisplayLength(5)
        .withOption('bLengthChange', false);

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
			var firstColumn = Object.keys(response1[$scope.service]['table'])[0];
			var filtered = $filter('orderBy')(response['statusMessage'], firstColumn);
			$scope.selectedServiceData = filtered[0] || {};
		})
	})

	$scope.permissions = {};

	$scope.sidebar.$promise.then(function(response) {
		var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
		$scope.permissions.read = true;
	})

	$scope.setSelectedRow = function(rowData) {
		$scope.selectedServiceData = rowData;
	}

	$scope.translate = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return $scope.language[keyword] || keyword;
	}

	$scope.dtInstance = {};

	$scope.dtInstanceCallback = function(_dtInstance) {
		$scope.dtInstance = _dtInstance;
	}

	$scope.searchTable = function (dtInstance) {
	    $scope.dtInstance.DataTable.search($scope.customFilter);
	    $scope.dtInstance.DataTable.search($scope.customFilter).draw();
	};

	$scope.rejectRequest = function() {
		Request.reject({requestId: $scope.selectedServiceData.requestId}).$promise.then(function(response) {
			toastr.success(response.statusMessage);
			toastr.clear();
		})
	}

	$scope.approveRequest = function() {
		Request.approve({requestId: $scope.selectedServiceData.requestId}).$promise.then(function(response) {
			toastr.success(response.statusMessage);
			toastr.clear();
		})
	}

	$scope.addComment = function() {
		Request.comment({requestId: $scope.selectedServiceData.requestId, comment: $scope.newComment, customerName: $scope.customerName}).$promise.then(function(response) {
			$scope.newComment = '';
			toastr.success('Comment added.');
			toastr.clear();
		})
	}
})