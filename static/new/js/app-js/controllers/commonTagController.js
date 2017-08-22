angular.module('swire').controller('TagController',
	function($scope, $rootScope, $filter, $state,
		$window, CompleteUserData, Language, Sidebar, KeyMapper,
		DTOptionsBuilder, Customer, User, TagFormat, Entity){
	$rootScope.showCardViewButton = false;
	$rootScope.showListViewButton = false;

	$scope.customerName = $state.params.customerName;
	$scope.service = $state.params.service;
	$scope.serviceName = $state.params.serviceName;
	$scope.tagName = $state.params.tagName;
	$scope.role = $state.params.role;
	$scope.master = 'administrator';
	$scope.masterService = 'adminServices';
	
	$scope.serviceData = CompleteUserData.CompleteUserData;
	$scope.language = Language.language;
	$scope.sidebar = Sidebar.sidebar;
	$scope.keyMapper = KeyMapper.keyMapper;
	$scope.tagFormat = TagFormat.tagFormat;
	$scope.customer = Customer.query({customerName: $scope.customerName});

	$scope.search = {};
	$scope.filteredUsers = [];
	$scope.filteredServices = [];
	$scope.uids = [];
	$scope.checkboxModel = {};
	$scope.allSelected = false;

	$scope.options = [
      {name:'Tagged', value: $scope.role},
      {name:'Untagged', value: '!'+$scope.role}
    ];

	$scope.getSingular = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return keyword;
	}

	$scope.serviceSingular = $scope.getSingular($scope.service);
	$scope.serviceSingularName = ($scope.service == 'users') ? 'uid' : $scope.getSingular($scope.service)+'Name';

	$scope.getServiceToBeTagged = function() {
		if ($scope.role == 'PA' || $scope.role == 'PU') {
			return 'projects';
		} else if ($scope.role == 'CA') {
			return 'customers';
		} else if ($scope.role == 'BUA') {
			return 'bus';
		} else if ($scope.role == 'AA') {
			return 'accounts';
		} else {
			return $scope.service;
		}
	}
	$scope.serviceToBeTagged = $scope.getServiceToBeTagged();

	$scope.permissions = {};

	$scope.serviceData.$promise.then(function(response) {
		if(response.isSwa) {
			$scope.isSwa = true;
		}
	})

	$scope.sidebar.$promise.then(function(response) {
		var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
		$scope.customerSideBar = customer;
		$scope.permissions.read = customer.actionList[$scope.masterService].indexOf('read'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.create = customer.actionList[$scope.masterService].indexOf('create'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.update = customer.actionList[$scope.masterService].indexOf('update'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.all = customer.actionList[$scope.masterService];
	})

	$scope.translate = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return $scope.language[keyword] || keyword;
	}

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

	$scope.getFilteredUsers = function(role) {
		var selectedServiceName = $scope.serviceName;
		$scope.newRole = role;
		User.userListWithFilter({customerName: $scope.customerName, service: $scope.serviceSingularName, serviceName: selectedServiceName, role: role || $scope.role, query: $scope.search}).$promise.then(function(response) {
			$scope.filteredUsers = response['statusMessage'];
			$scope.uids = [];
		})
	}

	$scope.getFilteredService = function(role) {
		var functionName = '';
		if (role) {
			$scope.newRole = role;
		}
		if (role[0] == '!') {
			functionName = $scope.serviceToBeTagged + 'NotUnderUser';
			role = role.slice(1);
		} else {
			functionName = $scope.serviceToBeTagged + 'UnderUser';
		}
		// console.log({customerName: $scope.customerName, service: $scope.serviceSingularName, serviceName: $scope.serviceName, role: role})
		Entity[functionName]({customerName: $scope.customerName, uid: $scope.serviceName, role: role}).$promise.then(function(response) {
			var temp = angular.copy($scope.serviceData[$scope.customerName][$scope.serviceToBeTagged]);
			var keyToSearch = $scope.serviceToBeTagged.slice(0, -1) + 'Name';
			var searchCriteria = {isActive: "yes"};
			$scope.filteredServices = [];
			response['statusMessage'].forEach(function(value, key) {
				searchCriteria[keyToSearch] = value;
				if ($filter('filter')(temp, searchCriteria, true).length) {
					$scope.filteredServices.push(value);
				}
			})
			$scope.uids = [];
		})
	}

	$scope.toggleAll = function() {
    	if ($scope.uids.length === $scope.filteredUsers.length) {
      		$scope.uids = [];
    	} else if ($scope.uids.length === 0 || $scope.uids.length > 0) {
      		$scope.uids = $scope.filteredUsers.map(function(item) { return item.uid; });
    	}
  	};

  	$scope.toggleAllService = function() {
    	if ($scope.uids.length === $scope.filteredServices.length) {
      		$scope.uids = [];
    	} else if ($scope.uids.length === 0 || $scope.uids.length > 0) {
      		$scope.uids = $scope.filteredServices.map(function(item) { return item; });
    	}
  	};

	$scope.toggle = function (item) {
	    var idx = $scope.uids.indexOf(item);
	    if (idx > -1) {
	      $scope.uids.splice(idx, 1);
	    }
	    else {
	      $scope.uids.push(item);
	    }
  	};

  	$scope.exists = function (item) {
    	return $scope.uids.indexOf(item) > -1;
  	};

  	$scope.tag = function() {
  		var tagCall = $scope.tagName;
  		$scope[tagCall]($scope.uids, [$scope.serviceName]);
  	}

  	$scope.untag = function() {
  		var untagCall = 'un'+$scope.tagName;
  		$scope[untagCall]($scope.uids, [$scope.serviceName]);
  	}

  	$scope.tagService = function() {
  		var tagCall = $scope.tagName;
  		$scope[tagCall]([$scope.serviceName], $scope.uids);
  	}

  	$scope.untagService = function() {
  		var untagCall = 'un'+$scope.tagName;
  		$scope[untagCall]([$scope.serviceName], $scope.uids);
  	}

  	$scope.isChecked = function() {
    	return ($scope.uids.length === $scope.filteredUsers.length) && $scope.filteredUsers.length;
  	};

  	$scope.isCheckedService = function() {
    	return ($scope.uids.length === $scope.filteredServices.length) && $scope.filteredServices.length;
  	};

  	$scope.refreshAllData = function() {
  		$scope.customer = Customer.query({customerName: $scope.customerName});
	}

	$scope.tagCa = function(uids, services) {
		User.tagCa({customerNames: JSON.stringify(services), uids: JSON.stringify(uids)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}

	$scope.tagBua = function(uids, services) {
		User.tagBua({customerName: $scope.customerName, uids: JSON.stringify(uids), buNames: JSON.stringify(services)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}

	$scope.tagPa = function(uids, services) {
		User.tagPa({customerName: $scope.customerName, uids: JSON.stringify(uids), projectNames: JSON.stringify(services)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}

	$scope.tagPu = function(uids, services) {
		User.tagPu({customerName: $scope.customerName, uids: JSON.stringify(uids), projectNames: JSON.stringify(services)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}

	$scope.tagAa = function(uids, services) {
		User.tagAa({customerName: $scope.customerName, uids: JSON.stringify(uids)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}

	$scope.tagAaRole = function(uids, services) {
		User.tagAaRole({customerName: $scope.customerName, uids: JSON.stringify(uids)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}

	$scope.tagFaRole = function(uids, services) {
		User.tagFaRole({customerName: $scope.customerName, uids: JSON.stringify(uids)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}

	$scope.tagAcAdminAndAccount = function(uids, services) {
		User.tagAcAdminAndAccount({customerName: $scope.customerName, uids: JSON.stringify(uids), accountNames: JSON.stringify(services)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}

	$scope.untagAcAdminAndAccount = function(uids, services) {
		User.untagAcAdminAndAccount({customerName: $scope.customerName, uids: JSON.stringify(uids), accountNames: JSON.stringify(services)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}

	$scope.untagCa = function(uids, services) {
		User.untagCa({customerNames: JSON.stringify(services), uids: JSON.stringify(uids)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}

	$scope.untagBua = function(uids, services) {
		User.untagBua({customerName: $scope.customerName, uids: JSON.stringify(uids), buNames: JSON.stringify(services)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}

	$scope.untagPa = function(uids, services) {
		User.untagPa({customerName: $scope.customerName, uids: JSON.stringify(uids), projectNames: JSON.stringify(services)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}

	$scope.untagPu = function(uids, services) {
		User.untagPu({customerName: $scope.customerName, uids: JSON.stringify(uids), projectNames: JSON.stringify(services)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}

	$scope.untagAa = function(uids, services) {
		User.untagAa({customerName: $scope.customerName, uids: JSON.stringify(uids)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}
	$scope.untagFaRole= function(uids, services) {
		User.untagFaRole({customerName: $scope.customerName, uids: JSON.stringify(uids)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}
	$scope.untagAaRole = function(uids, services) {
		User.untagAaRole({customerName: $scope.customerName, uids: JSON.stringify(uids)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage.success[0].statusMessage);
				$scope.refreshAllData();
			} else {
				toastr.error(response.statusMessage.fail[0].statusMessage);
			}
			toastr.clear();
			$scope.getFilteredUsers($scope.newRole);
			$scope.getFilteredService($scope.newRole);
		})
	}
})