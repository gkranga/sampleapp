angular.module('swire').controller('EditController', function($scope, $rootScope, $state, $window, $filter, CompleteUserData, Sidebar, Language, KeyMapper, Select, Create, Profile, User){
	$scope.editFlag = true;
	$scope.init = function () {
		$scope.serviceData = CompleteUserData.CompleteUserData;
		$scope.language = Language.language;
		$scope.sidebar = Sidebar.sidebar;
		$scope.keyMapper = KeyMapper.keyMapper;
	}
	$scope.init();

	$rootScope.showCardViewButton = false;
	$rootScope.showListViewButton = false;

	$scope.customerName = $state.params.customerName;
	$scope.service = $state.params.service;
	$scope.serviceName = $state.params.serviceName;
	$scope.master = 'administrator';

	$scope.nativeCsps = Select.query({customerName: $scope.customerName, service: 'nativeCsps'});
	$scope.accounts = Select.query({customerName: $scope.customerName, service: 'accounts'});
	$scope.bus = Select.query({customerName: $scope.customerName, service: 'bus'});
	$scope.csps = Select.query({customerName: $scope.customerName, service: 'csps'});
	$scope.regions = {};
	$scope.nativeRegionAll = [];
	$scope.getRegions = function(nativeCsp) {
		$scope.regions = Select.query({customerName: $scope.customerName, service: 'nativeRegions', nativeCsps: nativeCsp});
	}

	$scope.getSingular = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return keyword;
	}

	$scope.serviceSingular = $scope.getSingular($scope.service);
	$scope.serviceSingularName = ($scope.service == 'users') ? 'uid' : $scope.getSingular($scope.service)+'Name';

	$scope.setRequiredData = function(a1,a2,a3) {
		$scope.selectedServiceData = $filter('objectFromArray')(a1,a2,a3);
		if ($scope.serviceSingular == 'csp') {
			$scope.initCspRegion();
		}
	}

	$scope.initCspRegion = function() {
		$scope.csps.$promise.then(function() {
			$scope.setSelectedNativeRegions($scope.selectedServiceData.nativeCsp);
			$scope.selectedServiceData.customerName = $scope.customerName;
			if (typeof $scope.selectedServiceData['regions'] == 'string') {
				$scope.selectedServiceData['regions'] = JSON.parse($scope.selectedServiceData['regions']);
			}
			if ($scope.selectedServiceData['regions']) {
				$scope.selectedServiceData['regions'].forEach(function(value){
					$scope.regions[value.nativeRegion] = value.name;
				}) 
			}
		})
	}

	$scope.serviceData.$promise.then(function(response) {
		if(response.isSwa) {
			$scope.isSwa = true;
			$scope.setRequiredData($scope.serviceData[$scope.service], $scope.serviceSingularName, $scope.serviceName);
		} else {
			$scope.setRequiredData($scope.serviceData[$scope.customerName][$scope.service], $scope.serviceSingularName, $scope.serviceName);
		}
		if ($scope.service == 'displayRegions') {
			$scope.getRegions($scope.selectedServiceData.displayCspName);
		}
	})

	$scope.permissions = {};

	$scope.sidebar.$promise.then(function(response) {
		var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
		$scope.customerSideBar = customer;
		$scope.permissions.read = customer.actionList.adminServices.indexOf('read'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.create = customer.actionList.adminServices.indexOf('create'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.update = customer.actionList.adminServices.indexOf('update'+$filter('capitalize')($scope.serviceSingular)) != -1 ? true : false;
		$scope.permissions.all = customer.actionList.adminServices;
	})

	$scope.translate = function(keyword) {
		keyword = $scope.getSingular(keyword);
		return $scope.language[keyword] || keyword;
	}


	$scope.setFromDate = function(setDate) {
		if (jQuery('#setMin').val() < setDate) {
			jQuery('#setMin').val(setDate);
		}
	}

	$scope.tagCa = function() {
		var uids = [];
		uids.push($scope.taggedUser || this.taggedUser);
		User.tagCa({customerName: $scope.serviceName, uids: JSON.stringify(uids)}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage);
			} else {
				toastr.error(response.statusMessage);
			}
			toastr.clear();
		})
	}

	$scope.tagBua = function() {
		var uids = [];
		uids.push($scope.taggedUser || this.taggedUser);
		User.tagBua({customerName: $scope.customerName, uids: JSON.stringify(uids), buName: $scope.serviceName}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage);
			} else {
				toastr.error(response.statusMessage);
			}
			toastr.clear();
		})
	}

	$scope.tagPa = function() {
		var uids = [];
		uids.push($scope.taggedUser || this.taggedUser);
		User.tagPa({customerName: $scope.customerName, uids: JSON.stringify(uids), projectName: $scope.serviceName}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage);
			} else {
				toastr.error(response.statusMessage);
			}
			toastr.clear();
		})
	}

	$scope.tagPu = function() {
		var uids = [];
		uids.push($scope.taggedUser1 || this.taggedUser1);
		User.tagPu({customerName: $scope.customerName, uids: JSON.stringify(uids), projectName: $scope.serviceName}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage);
			} else {
				toastr.error(response.statusMessage);
			}
			toastr.clear();
		})
	}

	$scope.tagAa = function() {
		User.tagAaRole({customerName: $scope.customerName, uids: JSON.stringify([$scope.serviceName])}).$promise.then(function(response) {
			if (response.status == 'success') {
				toastr.success(response.statusMessage);
			} else {
				toastr.error(response.statusMessage);
			}
			toastr.clear();
		})
	}

	$scope.save = function() {
		// console.log($scope.selectedServiceData);
		var actionName = 'update'+$filter('capitalize')($scope.serviceSingular);
		var fieldsToSend = $scope.keyMapper[$scope.service]['table'];
		fieldsToSend = angular.extend(fieldsToSend, $scope.keyMapper[$scope.service]['oldTab']);
		var finalArray = {};
		Object.keys(fieldsToSend).forEach(function(key) {
			if (key != 'role' && key != 'actions') {
				finalArray[key] = $scope.selectedServiceData[key];
			}
		})
		finalArray['customerName'] = $scope.selectedServiceData.customerName;
		delete $scope.selectedServiceData['$$hashKey'];

		var dataToSend = $scope.selectedServiceData;

		if ($scope.serviceSingular == 'user') {
			// dataToSend = finalArray;
			delete dataToSend['customerName'];
			delete dataToSend['customers'];
		}

		if ($scope.serviceSingular == 'customer') {
			// dataToSend = finalArray;
		}
		
		Create.save({createService: actionName}, dataToSend, function(response) {
			Profile.refresh().$promise.then(function() {
				CompleteUserData.refresh();
				if (response.status == 'success') {
					toastr.success(response.statusMessage);
				} else {
					toastr.error(response.statusMessage);
				}
				toastr.clear();
			})
		})
	}

	$scope.setPublishFile = function() {
		$scope.selectedServiceData.publishSettingFileData = $scope.publishSettingFile.base64;
		$scope.selectedServiceData.publishSettingFileName = $scope.publishSettingFile.filename;
	}

	$scope.setNativeCSP = function(nativeCsp) {
		var allCSP = angular.copy($scope.csps);
		var cspObj = $filter('filter')(allCSP, {value: nativeCsp})[0];
		$scope.nativeCsps = cspObj.nativeCsp;
	}

	$scope.setNativeCSPAccount = function(csp) {
		var allCSP = angular.copy($scope.csps);
		var cspObj = $filter('filter')(allCSP, {value: csp})[0];
		$scope.selectedServiceData.nativeCsp = cspObj.nativeCsp;
	}

	$scope.selectAll = function() {
		$scope.selectedServiceData['regions'] = [];
		$scope.nativeRegionAll.forEach(function(value) {
			$scope.selectedServiceData['regions'].push({name: $scope.regions[value], nativeRegion: value})
		})
	}

	$scope.unselectAll = function() {
		$scope.selectedServiceData['regions'] = [];
	}

	$scope.setSelectedNativeRegions = function(nativeCsp) {
		var allNativeCsp = angular.copy($scope.nativeCsps);
		var nativeCspObj = $filter('filter')(allNativeCsp, {value: nativeCsp})[0];
		$scope.nativeRegionAll = nativeCspObj.nativeRegions;
	}

	$scope.isNativeRegionChecked = function(nativeRegion) {
		if ($scope.selectedServiceData['regions'] && $filter('filter')($scope.selectedServiceData['regions'], {nativeRegion: nativeRegion}, true).length) {
			return true;
		}
		return false;
	}

	$scope.toggleNativeRegion = function(nativeRegion) {
		if ($scope.selectedServiceData['regions'] && $filter('filter')($scope.selectedServiceData['regions'], {nativeRegion: nativeRegion}, true).length) {
			for(var i = $scope.selectedServiceData['regions'].length - 1; i >= 0; i--){
		        if($scope.selectedServiceData['regions'][i].nativeRegion == nativeRegion){
		            $scope.selectedServiceData['regions'].splice(i,1);
		    	}
		    }
		} else {
			if (!$scope.selectedServiceData['regions']) {
				$scope.selectedServiceData['regions'] = [];
			}
			$scope.selectedServiceData['regions'].push({name: $scope.regions[nativeRegion], nativeRegion: nativeRegion})
		}
	}

	$scope.updateRegionName = function(nativeRegion, text) {
		if ($scope.selectedServiceData['regions']) {
			var filter = $filter('filter')($scope.selectedServiceData['regions'], {nativeRegion: nativeRegion}, true);
			if (filter.length) {
				filter[0].name = text;
			}
		}
	}

	$scope.saveCsp = function() {
		var dataToSend = angular.copy($scope.selectedServiceData);
		if (typeof $scope.selectedServiceData['regions'] == 'object') {
			dataToSend['regions'] = angular.toJson($scope.selectedServiceData['regions'])
		}
		// console.log(dataToSend)
		var actionName = 'update'+$filter('capitalize')($scope.serviceSingular);
		Create.save({createService: actionName}, dataToSend, function(response) {
			Profile.refresh().$promise.then(function() {
				CompleteUserData.refresh();
				if (response.status == 'success') {
					toastr.success(response.statusMessage);
				} else {
					toastr.error(response.statusMessage);
				}
				toastr.clear();
			})
		})
	}
})