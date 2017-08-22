angular.module('swire').controller('ProfileController', function($scope, $rootScope, $state, $window, Language, Profile){
	$rootScope.showCardViewButton = false;
	$rootScope.showListViewButton = false;

	$scope.language = Language.language;

	$scope.getUser = function () {
		$scope.user = Profile.get();
	}
	$scope.getUser();

	$scope.getSingular = function(keyword) {
		if (keyword.slice(-1) == 's') {
			keyword = keyword.slice(0, -1);
		}
		return keyword;
	}

	$scope.translate = function(keyword) {
		keyword = $scope.getSingular(keyword);
		return $scope.language[keyword] || keyword;
	}

	$scope.changeImage = function() {
		var form = jQuery('#imgForm');
		var str = new FormData(form[0]); 
		jQuery.ajax({
			url: '/dashboard/image',
			data: str,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function(data) {
			  	$('.profilePic').attr('src', data.src+'?t='+ new Date());
			}
		});
	}

	$scope.formSubmit = function() {
		Profile.save({uid: $scope.user.uid, fname: $scope.user.fname, sname: $scope.user.sname, userAddress: $scope.user.userAddress, userCity: $scope.user.userCity, userCountry: $scope.user.userCountry, userZip: $scope.user.userZip, userPhone: $scope.user.userPhone, language: $scope.user.language}, function(response) {
			Profile.refresh();
			toastr.success(response.statusMessage);
			toastr.clear();
		});
	}
})

angular.module('swire').controller('TestController', function($scope, $rootScope, $state, $window, Language){
	$rootScope.showCardViewButton = false;
	$rootScope.showListViewButton = false;
	$scope.language = Language.language;

  	$scope.user = {};

	  // note, these field types will need to be
	  // pre-defined. See the pre-built and custom templates
	  // http://docs.angular-formly.com/v6.4.0/docs/custom-templates
	  $scope.model = {};
    
    $scope.fields = [
      {
        key: 'email',
        type: 'input',
        className:'col-lg-7',
        templateOptions: {
          label: 'Email',
          type: 'email',
          placeholder: 'Formly is terrific!',
          required: true
        }
      },
      {
      	key: 'country',
      	type: 'select',
        className:'col-lg-7',
      	defaultValue: '',
      	templateOptions: {
  			label: 'Country',
          	placeholder: 'Select Country!',
          	required: true,
          	labelProp: "name",
            valueProp: "key",
            options: [
            	{name: "Select Country", key: ''},
                {name: "India", key: 'IND'},
                {name: "Pakistan", key: 'PAK'}
            ]
      	}
      },
      {
        key: 'password',
        type: 'input',
        className:'col-lg-12',
        templateOptions: {
          label: 'Password',
          type: 'password',
          placeholder: 'Formly is terrific!',
          required: true
        }
      }
    ];

    $scope.onSubmit = function () {
      if ($scope.form.$valid) {
        alert(JSON.stringify($scope.model), null, 2);
      }
    }


    $scope.example14model = [];
    $scope.notificationMethodsModel = [];

    $scope.example14settings = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: false
    };

    $scope.examplesettings = {
      showCheckAll: false,
      showUncheckAll: false
    };

    $scope.example14data = [{
        "label": "All",
            "id": "all"
      }, {
          "label": "1",
              "id": "1"
      }, {
          "label": "2",
              "id": "2"
      }, {
          "label": "3",
              "id": "3"
      }, {
        "label": "4",
            "id": "4"
      }
    ];

    $scope.notificationMethods = [
      {
          "label": "Email",
              "id": "email"
      }, {
          "label": "SMS",
              "id": "sms"
      }, {
          "label": "Push (Browser)",
              "id": "push"
      }
    ];


    $scope.notificationModule = [{
        "label": "Budgeting",
            "id": "budgeting"
      }, {
          "label": "Billing",
              "id": "billing"
      }, {
          "label": "Approval",
              "id": "approval"
      }, {
          "label": "Requests",
              "id": "requests"
      }, {
        "label": "ResourceAction",
            "id": "resourceAction"
      },{
        "label": "Accounts",
            "id": "accounts"
      }
    ];

    $scope.loadEventData = function(selectedModule){
      $scope.notificationEvent = $scope.notificationEventData[selectedModule];
    }

    $scope.notificationEventData = {
      "budgeting": [
        {
          "label": "50%",
            "id": "fifty"
        },
        {
          "label": "75%",
            "id": "seventy-five"
        },
        {
          "label": "90%",
            "id": "ninety"
        }
      ],
      "billing": [
        {
          "label": "Daily",
            "id": "daily"
        },
        {
          "label": "Weekly",
            "id": "weekly"
        }
      ],
      "approval": [
        {
          "label": "Approval",
            "id": "approval"
        },
        {
          "label": "Rejected",
            "id": "rejected"
        }
      ],
      "requests": [
        {
          "label": "New",
            "id": "new"
        },
        {
          "label": "Pending For Approval",
            "id": "pending"
        },
        {
          "label": "Resolved",
            "id": "resolved"
        },
        {
          "label": "Failed",
            "id": "failed"
        }
      ],
      "resourceAction": [
        {
          "label": "Suspend",
            "id": "suspend"
        },
        {
          "label": "Start",
            "id": "start"
        },
        {
          "label": "Stop",
            "id": "stop"
        },
        {
          "label": "Terminate",
            "id": "terminate"
        },
        {
          "label": "Config Change",
            "id": "config-change"
        }
      ],
      "accounts": [
        {
          "label": "Enabled",
            "id": "enabled"
        },
        {
          "label": "Disabled",
            "id": "disabled"
        },
        {
          "label": "Creation",
            "id": "creation"
        },
        {
          "label": "Project Tagged",
            "id": "project-tagged"
        }
      ]
    }


    $scope.$watch('examplemodel', function (newValue, oldValue, scope) {
        scope.loadEventData(newValue);
    }, true);

});
