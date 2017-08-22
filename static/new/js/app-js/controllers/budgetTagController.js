angular.module('swire').controller('budgetTagController',
	function($scope, $rootScope, $filter, $state,
		$window, CompleteUserData, Language, Sidebar, KeyMapper,
		DTOptionsBuilder, Customer, User, TagFormat, Entity,budgetServices){
		$scope.customerName = $state.params.customerName;
		$scope.service = $state.params.service;
		$scope.budgetName = $state.params.budgetName;
		$scope.tagName = $state.params.tagName;
		$scope.type = $state.params.type;
		$scope.master = 'financeServices';
    	$scope.resourceName = 'Billing';

		$scope.serviceData = CompleteUserData.CompleteUserData;
		$scope.language = Language.language;
		$scope.sidebar = Sidebar.sidebar;
		$scope.tagFormat = TagFormat.tagFormat;
		 $scope.sidebar.$promise.then(function(response) {
	        var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
	        $scope.customerSideBar = customer;
    	})	
		$scope.search = {};
		$scope.search.buName = 'fghfh';
		$scope.filteredBus = [];
		$scope.options = [
		      {name:'Tagged', value: true},
		      {name:'Untagged', value: false}
   		];
   		// $scope.newRole ;

		$scope.getFilteredBudgets = function() {
			var selectedServiceName = $scope.serviceName;
			budgetServices.getBudgetBU({customerName: $scope.customerName,budgetName:$scope.budgetName}).$promise.then(function(response) {
				$scope.selectedRowId = 0;
				$scope.filteredBuBudgets = response['statusMessage'].map(function (bu) {
					return {
						'buname': bu,
						'tagged': true
					}
				});
			})
		}
	$scope.tag = function (){
		// console.log();
		console.log($scope.filteredBuBudgets[$scope.selectedRowId]);
		budgetServices.tagBudgetBu({customerName: $scope.customerName,BuName: $scope.filteredBuBudgets[$scope.selectedRowId].buname,budgetName:$scope.budgetName}).$promise.then(function(response) {
			$scope.getFilteredUnTaggedBudgets();
		})
	}
	$scope.untag = function (){
		budgetServices.unTagBudgetBu({customerName: $scope.customerName,BuName: $scope.filteredBuBudgets[$scope.selectedRowId].buname,budgetName:$scope.budgetName}).$promise.then(function(response) {
			$scope.getFilteredBudgets();
		})
	}
	$scope.toggle = function (item) {
	    var idx = $scope.uids.indexOf(item);
	    if (idx > -1) {
	      $scope.uids.splice(idx, 1);
	    }
	    else {
	      $scope.uids.push(item);
	    }
  	};
  	$scope.selectRowData = function (rowKey) {
  		console.log(rowKey);
        $scope.selectedRowId = rowKey;


    }



		$scope.getFilteredUnTaggedBudgets = function() {
			var selectedServiceName = $scope.serviceName;
			budgetServices.getUntaggedBudgetBu({customerName: $scope.customerName,budgetName:$scope.budgetName}).$promise.then(function(response) {
				$scope.selectedRowId = 0;
				$scope.filteredBuBudgets = response['statusMessage'].map(function (bu) {
					return {
						'buname': bu,
						'tagged': false
					}
				});
			})
		}
		$scope.getFilter  = function () {
			console.log($scope.newRole);
			if($scope.newRole == 'true') {
				$scope.getFilteredBudgets();
			}else if($scope.newRole === 'false') {
				$scope.getFilteredUnTaggedBudgets();
			}
		}
		$scope.translate = function (keyword) {
			if (keyword) {
			if (keyword.slice(-1) == 's') {
			    keyword = keyword.slice(0, -1);
			}
			return $scope.language[keyword] || keyword;
			}
		}
});