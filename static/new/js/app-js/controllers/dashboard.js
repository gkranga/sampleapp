angular.module('swire').controller('DashboardController', function($scope, $rootScope, $state, $stateParams, $window, CompleteUserData,CompletResourceData, Language, Sidebar, Request) {
	$rootScope.showCardViewButton = false;
	$rootScope.showListViewButton = false;
	$scope.isSwa = false;
	$scope.rolesAuthorizedForRequest = ['AA', 'CA', 'BUA', 'PA'];
	$scope.customersObject = CompleteUserData.CompleteUserData;
	$scope.language = Language.language;
	$scope.sidebar = Sidebar.sidebar;
	$scope.customerName = $stateParams.customerName || '';


    $scope.sidebar.$promise.then(function(res) {
        $scope.customerName = $scope.customerName || res[0]['name'];
        $scope.setSlider();
		res.forEach(function(customer) {
			Request.count({customerName: customer.name}).$promise.then(function(res) {
				customer.requestCount = res.statusMessage.count;
            })
        })
        $scope.resourcesObject = CompletResourceData.CompletResourceData({customer: $scope.customerName });
        $scope.resourcesObject.$promise.then(function(res) {
            $scope.resourcesObject = res;
            $scope.setSlider();
        })
    })
	$scope.customersObject.$promise.then(function(res) {
		if (res.isSwa) {
			$scope.isSwa = true;
		}
	})

	$scope.translate = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return $scope.language[keyword] || keyword;
	}

	$scope.searchKeyWord = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return keyword;
	}

	$scope.redirect = function(keyword, customer) {
		$state.go('cardView', {customerName: customer, service: keyword});
	}
	$scope.redirectToList = function(keyword, customer) {
		$state.go('requestListView', {customerName: customer, service: keyword});
	}
	$scope.redirectToListView = function(keyword, customer,service) {
		$state.go('resources', {customerName: customer, resourceName: keyword,serviceName:service});
	}

	// for swa user list
	$scope.redirectToSwaUserList = function() {
		$state.go('swaListView', {service: 'users'});
	}
	$scope.redirectToSwaCustomerList = function(keyword, customer) {
		$state.go('swaListView', {service: 'customers'});
	}

	$scope.resourceRedirect = function(resourceName) {
		$state.go('resources', {resourceName: resourceName});
	}
	
	
	$scope.checkRequest = function(userRoles) {
		return userRoles.some(function(v)
			{
				return $scope.rolesAuthorizedForRequest.indexOf(v) >= 0;
			}
		);
	}

	$scope.setSlider = function() {
		jQuery('.your-class').slick({
            slidesToShow: 6,
            slidesToScroll: 1,
            infinite: false,
            responsive: [
            {
                breakpoint: 2600,
                settings: {
                    slidesToShow: 7,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: false
                }
            },
            {
                breakpoint: 2000,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: false
                }
            },
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: false
                }
            },
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: false
                }
            },
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 425,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 321,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
            ]
        });
	}
})
