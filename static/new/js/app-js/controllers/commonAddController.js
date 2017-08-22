angular.module('swire').controller('AddController', function($scope, $rootScope, $state, $window, $filter, CompleteUserData, Sidebar, Language, KeyMapper, Select, Create, Profile, User){
	$scope.editFlag = false;
	$scope.init = function () {
		$scope.serviceData = CompleteUserData.CompleteUserData;
		$scope.language = Language.language;
		$scope.sidebar = Sidebar.sidebar;
		$scope.keyMapper = KeyMapper.keyMapper;
	}
	$scope.init();

	$rootScope.showCardViewButton = false;
	$rootScope.showListViewButton = false;
	$scope.master = 'administrator';

	$scope.customerName = $state.params.customerName;
	$scope.service = $state.params.service;
	
	$scope.nativeCsps = Select.query({customerName: $scope.customerName, service: 'nativeCsps'});
	$scope.bus = Select.query({customerName: $scope.customerName, service: 'bus'});
	$scope.accounts = Select.query({customerName: $scope.customerName, service: 'accounts'});
	$scope.csps = Select.query({customerName: $scope.customerName, service: 'csps'});
	$scope.regions = {};
	$scope.nativeRegionAll = [];
	$scope.getRegions = function(csp) {
		$scope.regions = Select.query({customerName: $scope.customerName, service: 'regions', nativeCsps: nativeCsp});
	}

	$scope.getSingular = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return keyword;
	}

	$scope.serviceData.$promise.then(function(response) {
		if(response.isSwa) {
			$scope.isSwa = true;
			$scope.selectedServiceData.customerName = '';
		}
	})

	$scope.sidebar.$promise.then(function(response) {
		var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
		$scope.customerSideBar = customer;
	})

	$scope.serviceSingular = $scope.getSingular($scope.service);
	$scope.serviceSingularName = ($scope.service == 'users') ? 'uid' : $scope.getSingular($scope.service)+'Name';

	$scope.selectedServiceData = {};

	$scope.selectedServiceData.customerName = $scope.customerName;
	$scope.selectedServiceData.isActive = 'yes';

	$scope.translate = function(keyword) {
		keyword = $scope.getSingular(keyword);
		return $scope.language[keyword] || keyword;
	}

	$scope.setFromDate = function(setDate) {
		if (jQuery('#setMin').val() < setDate) {
			jQuery('#setMin').val(setDate);
		}
	}

	$scope.save = function() {
		// console.log($scope.selectedServiceData)
		var actionName = 'create'+$filter('capitalize')($scope.serviceSingular);
		$scope.reduceDecimal();
		Create.save({createService: actionName}, $scope.selectedServiceData, function(response) {
			Profile.refresh().$promise.then(function() {
				CompleteUserData.refresh();
				if (response.status == 'success') {
					toastr.success(response.statusMessage);
					if (!$scope.isSwa) {
						$scope.selectedServiceData = {customerName: $scope.customerName};
					}
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
		// console.log($scope.selectedServiceData);
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
		// console.log($scope.selectedServiceData, JSON.stringify($scope.selectedServiceData));
		dataToSend['regions'] = angular.toJson($scope.selectedServiceData['regions'])
		
		var actionName = 'create'+$filter('capitalize')($scope.serviceSingular);
		Create.save({createService: actionName}, dataToSend, function(response) {
			Profile.refresh().$promise.then(function() {
				CompleteUserData.refresh();
				if (response.status == 'success') {
					toastr.success(response.statusMessage);
					$scope.selectedServiceData = {};
				} else {
					toastr.error(response.statusMessage);
				}
				toastr.clear();
			})
		})
	}

	$scope.reduceDecimal = function() {
		if ($scope.selectedServiceData.markUp) {
			$scope.selectedServiceData.markUp = $scope.selectedServiceData.markUp.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
		}
		if ($scope.selectedServiceData.markDown) {
			$scope.selectedServiceData.markDown = $scope.selectedServiceData.markDown.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
		}
	}
})