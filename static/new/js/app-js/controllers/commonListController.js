angular.module('swire').controller('ListController', function($scope, $stateParams, $rootScope, $filter, $state, $window, CompleteUserData, Language, Sidebar, KeyMapper, DTOptionsBuilder, Customer, User, Entity, SweetAlert,budgetServices){
	$rootScope.showCardViewButton = true;
	$rootScope.showListViewButton = false;

	$scope.customerName = $stateParams.customerName;
	$rootScope.service = $scope.service = $state.params.service;
	$scope.master = 'administrator';
	$scope.masterService = 'adminServices';
	$scope.selectedServiceData = {};
	$scope.initComplete = false;
	$scope.permissions = {};

	$scope.serviceData = CompleteUserData.CompleteUserData;
	$scope.language = Language.language;
	$scope.sidebar = Sidebar.sidebar;
	$scope.keyMapper = KeyMapper.keyMapper;
	$scope.customer = Customer.query({customerName: $scope.customerName});
	$scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('simple')
        .withDisplayLength(5)
        .withOption('bLengthChange', false)

	$scope.getSingular = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return keyword;
	}

	$scope.getTypeObject = function(word) {
		// if (word === undefined) {
		// 	return true;
		// }
		return (typeof word == 'object');
	}

	$scope.getFilteredUsers = function() {
		// console.log('Users filtered');
	}

	$scope.serviceSingular = $scope.getSingular($scope.service);
	$scope.serviceSingularName = ($scope.service == 'users') ? 'uid' : $scope.getSingular($scope.service)+'Name';

	$scope.serviceData.$promise.then(function(response) {
		$scope.keyMapper.$promise.then(function(response1) {
			$scope.initComplete = true;
			var firstColumn = Object.keys(response1[$scope.service]['table'])[0] || [];
			var filtered = $filter('orderBy')(response[$scope.customerName][$scope.service], firstColumn);
			if (filtered) {
				$scope.selectedServiceData = filtered[0];
			}

			$scope.sidebar.$promise.then(function() {
				if (response1[$scope.service]['tab']) {
					for (var i = 0; i < response1[$scope.service]['tab'].length; i++) {
						if (response1[$scope.service]['tab'][i] && $scope.permissions.all.indexOf(response1[$scope.service]['tab'][i]['actionToCheck']) > -1) {	
							$scope.defaultTabFormat = $scope.tabFormat = response1[$scope.service]['tab'][i];
							$scope.defaultActiveTabName = $scope.activeTabName = response1[$scope.service]['tab'][i]['tabName'];
							break;
						}
					}
				}
			})
		})
	})


	$scope.sidebar.$promise.then(function(response) {
		var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
		$scope.customerSideBar = customer;
		$scope.permissions.read = customer.actionList[$scope.masterService].indexOf('read'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.create = customer.actionList[$scope.masterService].indexOf('create'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.update = customer.actionList[$scope.masterService].indexOf('update'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.all = customer.actionList[$scope.masterService];
		if ($scope.permissions.all.indexOf('tagAaRole') > -1) {
			$scope.permissions.all.push('readAccount')
		}
	})

	$scope.setSelectedRow = function(rowData) {
		$scope.selectedServiceData = rowData;
		if ($scope.service == 'projects') {
			$scope.loadAccountsOfProject();
		}

		$scope.tabFormat = $scope.defaultTabFormat;
		$scope.activeTabName = $scope.defaultActiveTabName;
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
		// console.log($scope.tabFormat.tabData)
	}

	$scope.isTabActive = function(tabName) {
		return ($scope.activeTabName === tabName) ? 'bold' : 'inherit';
	}

	$scope.loadAccountsOfProject = function() {
		var accountName = $scope.selectedServiceData.accountName;
		$scope.tabInitComplete = false;
		$scope.customer.$promise.then(function(response) {
			$scope.accountsOfProject = response.statusMessage.accounts[accountName];
			$scope.tabInitComplete = true;
		})
	}

	$scope.loadBusOfProject = function() {
		var buName = $scope.selectedServiceData.buName;
		$scope.tabInitComplete = false;
		$scope.customer.$promise.then(function(response) {
			$scope.busOfProject = response.statusMessage.bus[buName];
			$scope.tabInitComplete = true;
		})
	}

	$scope.loadProjectsUnderBu = function() {
		$scope.tabInitComplete = false;
		Entity.projectsUnderBu({customerName: $scope.customerName, buName: $scope.selectedServiceData.buName}).$promise.then(function(response) {
			if (response['status'] == 'success') {
				$scope.usersRelatedToService = response['statusMessage'];
			}
			$scope.tabInitComplete = true;
		})
	}

	$scope.loadProjectsUnderAccount = function() {
		$scope.projectsOfAccounts = [];
		$scope.tabInitComplete = false;
		Entity.projectsUnderAccount({customerName: $scope.customerName, accountName: $scope.selectedServiceData.accountName}).$promise.then(function(response) {
			if (response['status'] == 'success') {
				$scope.usersRelatedToService = response['statusMessage'];
			}
			$scope.tabInitComplete = true;
		})
	}

	$scope.loadAccountAdminsUnderCustomer = function(serviceName) {
		$scope.accountAdminsUnderCustomer = [];
		$scope.tabInitComplete = false;
		User.accountAdminsUnderCustomer({customerName: serviceName}).$promise.then(function(response) {
			if (response['status'] == 'success') {
				$scope.accountAdminsUnderCustomer = response['statusMessage'];
			}
			$scope.tabInitComplete = true;
		})
	}

	$scope.loadFinanceAdminsUnderCustomer  = function(serviceName,role) {
		
        $scope.financeAdminsUnderCustomer = [];
        $scope.tabInitComplete = false;
        User.financeAdminsUnderCustomer({customerName: serviceName}).$promise.then(function(response) {
            if (response['status'] == 'success') {
                $scope.financeAdminsUnderCustomer = response['statusMessage'];
            }
            $scope.tabInitComplete = true;
        })
    }


	$scope.loadBudgetBus  = function(serviceName) {
        $scope.loadBudgetBus = [];
        $scope.tabInitComplete = false;
        budgetServices.getBUBudgets({customerName: serviceName}).$promise.then(function(response) {
            if (response['status'] == 'success') {
                $scope.financeAdminsUnderCustomer = response['statusMessage'];
            }
            $scope.tabInitComplete = true;
        })
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

	$scope.loadCustomersOfUser = function(selectedServiceName, role) {
		$scope.usersRelatedToService = [];
		$scope.tabInitComplete = false;
		User.customerUnderUser({uid: selectedServiceName, all: true}).$promise.then(function(response) {
			if (response['status'] == 'success') {
				$scope.usersRelatedToService = response['statusMessage'];
			}
			$scope.tabInitComplete = true;
		})
	}

	$scope.loadServiceRelatedToUser = function(selectedUserName, service, role) {
		$scope.tabInitComplete = false;
		if (role == 'PU') {
			$scope.servicesRelatedToUser1 = [];
		} else {
			$scope.servicesRelatedToUser = [];
		}
		User.userServiceList({customerName: $scope.customerName, service: service, uid: $scope.selectedServiceData['uid'], role: role}).$promise.then(function(response) {
			if (response['status'] == 'success') {
				if (role == 'PU') {
					$scope.servicesRelatedToUser1 = response['statusMessage'];
				} else {
					$scope.servicesRelatedToUser = response['statusMessage'];
				}
			}
			$scope.tabInitComplete = true;
		})
	}

	$scope.makeUserAccountAdmin = function(selectedUserName) {
		// console.log(selectedUserName, $scope.customerName)
		// var status = $window.confirm('Are you sure to tag this user as Account Admin?');
		SweetAlert.confirm("Are you sure to tag this user as Account Admin?", {title : "Tag User?"}).then(function(p) {
			if (p) {
				User.tagAaRole({customerName: $scope.customerName, uids: JSON.stringify([selectedUserName])}).$promise.then(function(response) {
					if (response.status == 'success') {
						SweetAlert.success("You have successfully tagged user as Account Admin!", {title: "Tagged Account Admin!"});
						// toastr.success(response.statusMessage.success[0].statusMessage);
					} else {
						SweetAlert.error(response.statusMessage.fail[0].statusMessage, {title: "Something wrong!"});
						// toastr.error(response.statusMessage.fail[0].statusMessage);
					}
					toastr.clear();
					$scope.getFilteredUsers($scope.newRole);
				})
			}
		}).then(function(p) {
			SweetAlert.error("Tagging Failed!", {title: "Something went wrong!"});
		})
	}

	$scope.tabInitComplete = function()
	{
		$scope.tabInitComplete = true;
	}
})