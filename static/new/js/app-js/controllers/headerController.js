angular.module('swire').controller('HeaderController', function($scope, $rootScope, $state, $stateParams, $filter, $window, CompleteUserData, Language, Sidebar){
	
	$scope.serviceData = CompleteUserData.CompleteUserData;
	$scope.language = Language.language;
	$scope.sidebar = Sidebar.sidebar;
	$scope.allCustomerNames = [];

	$scope.sidebar.$promise.then(function(response) {
		$scope.custName = response[0]['name'];
		// $scope.allCustomerNames = Object.keys(response);
		var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
		$scope.customerSideBar = customer;
		response.forEach(function(value, key) {
			$scope.allCustomerNames.push(value.name)
		})
		$scope.customerName = $stateParams.customerName || $scope.allCustomerNames[0];
	})
	
	$scope.translate = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return $scope.language[keyword] || keyword;
	}

	$scope.changeCustomer = function(customerName) {
		var params = $stateParams;
		$scope.custName = customerName;
		params['customerName'] = customerName;
		$state.go('dashboard', params);
	}

	$scope.redirect = function(keyword) {
		// $state.go(keyword+'CardView');
	}
})