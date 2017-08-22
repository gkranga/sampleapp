angular.module('swire').config(function(formlyConfigProvider) {
  var unique = 1;
  formlyConfigProvider.setType({
    name: 'regionSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.to.loading = ProvisionService.getRegions({csp: "AWS"}).$promise.then(function(response) {
        $scope.to.options = response.statusMessage;
        $scope.to.options.unshift({key: "", name: "Select Region"});
      })
    }]
  });

  formlyConfigProvider.setType({
    name: 'osSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.$watch('model.region', function (newValue, oldValue, theScope) {
        if((newValue !== oldValue) && (newValue != '')) {
          $scope.to.loading = ProvisionService.getOs({region: newValue}).$promise.then(function(response) {
            $scope.to.options = response.statusMessage;
            $scope.to.options.unshift({key: "", name: "Select OS"});
          })
        }
      });
    }]
  });

  formlyConfigProvider.setType({
    name: 'imageSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.$watch('model.os', function (newValue, oldValue, theScope) {
        if((newValue !== oldValue) && (newValue != '')) {
          $scope.to.loading = ProvisionService.getImages({region: $scope.to.region}).$promise.then(function(response) {
            $scope.to.options = response.statusMessage;
            $scope.to.options.unshift({key: "{}", name: "Select Image"});
          })
        }
      });
    }]
  });

  formlyConfigProvider.setType({
    name: 'instanceSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.$watch('model.os', function (newValue, oldValue, theScope) {
        if((newValue !== oldValue) && (newValue != '')) {
          $scope.to.options = [];
          $scope.to.loading = ProvisionService.getInstances({os: newValue, region: $scope.to.region}).$promise.then(function(response) {
            response.statusMessage.forEach(function(value) {
              $scope.to.options.unshift({key: value, name: value});
            })
            $scope.to.options.unshift({key: "", name: "Select Instance"});
          })
        }
      });
    }]
  });

  formlyConfigProvider.setType({
    name: 'instanceCount',
    extends: 'input',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.$watch('model.instance', function (newValue, oldValue, theScope) {
        $scope.model.minCount = newValue;
        $scope.model.maxCount = newValue;
      });
    }]
  });

  formlyConfigProvider.setType({
    name: 'networkSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.$watch('model.instanceType', function (newValue, oldValue, theScope) {
        if(newValue !== oldValue) {
          $scope.to.options = [];
          $scope.to.loading = ProvisionService.getNetworks({customerName: $scope.to.customerName, region: $scope.to.region}).$promise.then(function(response) {
            response.statusMessage.forEach(function(value) {
              $scope.to.options.unshift({key: value, name: value});
            })
            $scope.to.options.unshift({key: "", name: "Select Network"});
          })
        }
      });
    }]
  });

  // select VPC

  formlyConfigProvider.setType({
    name: 'VPCSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.$watch('model.nameTag', function (newValue, oldValue, theScope) {
        if(newValue !== oldValue) {
          // logic to reload this select's options asynchronusly based on product's value (newValue)
          // console.log('new value is different from old value');
          if($scope.model[$scope.options.key] && oldValue) {
            // reset this select
            $scope.model[$scope.options.key] = '';
          } 
          // Reload options
          $scope.to.options = [
            {name: "Select VPC", key: ''},
            {name: "VPC", key: 'vpc'},
            {name: "dummy value", key: 'dummy'}
          ];
          // $scope.to.loading = DataService.allOptionsByProduct(newValue).then(function (res) {
          //   $scope.to.options = res;
          // });
        }
      });
    }]
  });

  // select Availability Zone

  formlyConfigProvider.setType({
    name: 'availabilityZoneSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.$watch('model.selectVPC', function (newValue, oldValue, theScope) {
        if(newValue !== oldValue) {
          // logic to reload this select's options asynchronusly based on product's value (newValue)
          // console.log('new value is different from old value');
          if($scope.model[$scope.options.key] && oldValue) {
            // reset this select
            $scope.model[$scope.options.key] = '';
          } 
          // Reload options
          $scope.to.options = [
            {name: "Select VPC", key: ''},
            {name: "No Preference", key: 'default'},
            {name: "dummy value", key: 'dummy'}
          ];
          // $scope.to.loading = DataService.allOptionsByProduct(newValue).then(function (res) {
          //   $scope.to.options = res;
          // });
        }
      });
    }]
  });

 // Select Tenancy ( VPC )

  formlyConfigProvider.setType({
    name: 'TenancySelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.$watch('model.ipv6CidrBlock', function (newValue, oldValue, theScope) {
        if(newValue !== oldValue) {
          // logic to reload this select's options asynchronusly based on product's value (newValue)
          // console.log('new value is different from old value');
          if($scope.model[$scope.options.key] && oldValue) {
            // reset this select
            $scope.model[$scope.options.key] = '';
          } 
          // Reload options
          $scope.to.options = [
            {name: "Select Tenancy", key: ''},
            {name: "Default", key: 'default'},
            {name: "Dedicated", key: 'dummy'}
          ];
          // $scope.to.loading = DataService.allOptionsByProduct(newValue).then(function (res) {
          //   $scope.to.options = res;
          // });
        }
      });
    }]
  });

   // Select Security Group VPC

  formlyConfigProvider.setType({
    name: 'selectSecurityGroupVpc',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.$watch('model.securityGroupDescription', function (newValue, oldValue, theScope) {
        if(newValue !== oldValue) {
          // logic to reload this select's options asynchronusly based on product's value (newValue)
          // console.log('new value is different from old value');
          if($scope.model[$scope.options.key] && oldValue) {
            // reset this select
            $scope.model[$scope.options.key] = '';
          } 
          // Reload options
          $scope.to.options = [
            {name: "Select Security Group VPC", key: ''},
            {name: "Default", key: 'default'},
            {name: "Dedicated", key: 'dummy'}
          ];
          // $scope.to.loading = DataService.allOptionsByProduct(newValue).then(function (res) {
          //   $scope.to.options = res;
          // });
        }
      });
    }]
  });

   // Select Inbound Type

   formlyConfigProvider.setType({
    name: 'selectInboundType',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
          // Reload options
          $scope.to.options = [
            {name: "Select", key: ''},
            {name: "Test1", key: 'test1'},
            {name: "Test2", key: 'test2'}
          ];
          // $scope.to.loading = DataService.allOptionsByProduct(newValue).then(function (res) {
          //   $scope.to.options = res;
          // });
    }]
  });   

  // Select Outbound Type

   formlyConfigProvider.setType({
    name: 'selectOutboundType',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
          // Reload options
          $scope.to.options = [
            {name: "Select", key: ''},
            {name: "Test1", key: 'test1'},
            {name: "Test2", key: 'test2'}
          ];
          // $scope.to.loading = DataService.allOptionsByProduct(newValue).then(function (res) {
          //   $scope.to.options = res;
          // });
    }]
  });

  formlyConfigProvider.setType({
    name: 'subnetSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.$watch('model.region', function (newValue, oldValue, theScope) {
        if(newValue !== oldValue) {
          $scope.to.options = [];
          $scope.to.loading = ProvisionService.getSubnets({customerName: $scope.to.customerName, region: newValue}).$promise.then(function(response) {
            response.statusMessage.forEach(function(value) {
              $scope.to.options.unshift({key: value, name: value});
            })
            $scope.to.options.unshift({key: "", name: "Select Subnet"});
          })
        }
      });
    }]
  });

  formlyConfigProvider.setType({
    name: 'dnsHostedZonesType',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.to.options = [
        {name: "Select Network", key: ''},
        {name: "Public Hosted Zone", key: 'publicHostedZone'},
        {name: "Private Hosted Zone", key: 'privateHostedZone'}
      ];
    }]
  });

  formlyConfigProvider.setType({
    name: 'startPointSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
          // Reload options
          $scope.to.options = [
            {name: "Select Network", key: ''},
            {name: "A: IP address in IPv4 format", key: 'typeA'},
            {name: "AAAA: IP address in IPv6 format", key: 'typeAAAA'},
            {name: "CNAME: Canonical name", key: 'typeCname'},
            {name: "MX: Mail exchange", key: 'typeMx'},
            {name: "PTR: Pointer", key: 'typePtr'},
            {name: "SPF: Sender policy framework", key: 'typeSpf'},
            {name: "SRV: Service locator", key: 'typeSrv'},
            {name: "TXT: Text", key: 'typeTxt'}
          ];
        }]
      });


  formlyConfigProvider.setType({
    name: 'connectSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.to.options = [
        {name: "Select Network", key: ''},
        {name: "Weighted rule", key: 'weightedRule'},
        {name: "Failover rule", key: 'failoverRule'},
        {name: "Geolocation rule", key: 'geolocationRule'},
        {name: "Latency rule", key: 'latencyRule'},
        {name: "New endpoint", key: 'newEndpoint'}
      ];
    }]
  });


  formlyConfigProvider.setType({
    name: 'publicIPSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.to.options = [
        {name: "Select IP", key: ''},
        {name: "Use Subnet Default", key: 'default'},
        {name: "Enable", key: 'enable'},
        {name: "Disable", key: 'disable'}
      ];
    }]
  });

  formlyConfigProvider.setType({
    name: 'tenancySelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.to.options = [
        {name: "Select", key: ''},
        {name: "Shared", key: 'shared'},
        {name: "Dedicated", key: 'dedicated'},
        {name: "Dedicated Host", key: 'dedicatedHost'}
      ];
    }]
  });

  formlyConfigProvider.setType({
    name: 'yesNoSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.to.options = [
        {name: "Select", key: ''},
        {name: "Yes", key: true},
        {name: "No", key: false}
      ];
    }]
  });


  formlyConfigProvider.setType({
    name: 'volumeType',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.to.options = [
        {name: "Select", key: ''},
        {name: "Test1", key: 'test1'},
        {name: "Test2", key: 'test2'}
      ];
    }]
  });


  formlyConfigProvider.setType({
    name: 'securityGroupSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.to.options = [];
      // var temp = [];
      $scope.to.loading = ProvisionService.getSecurityGroups({customerName: $scope.model.customerName, region: $scope.model.region}).$promise.then(function(response) {
        response.statusMessage.forEach(function(value) {
          // if (temp.indexOf(value._id.$oid) == -1) {
            $scope.to.options.push({key: value.groupId, name: value.groupName+' - Description: '+value.description});
            // temp.push(value._id.$oid);
          // }
        })
        $scope.to.options.unshift({key: "", name: "Select Security Group"});
      })
    }]
  });



  formlyConfigProvider.setType({
    name: 'volumeTypeSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
          // Reload options
          $scope.to.options = [
            {name: "Select", key: ''},
            {name: "Volume1", key: 'volume1'},
            {name: "Volume2", key: 'volume2'}
          ];
          // $scope.to.loading = DataService.allOptionsByProduct(newValue).then(function (res) {
          //   $scope.to.options = res;
          // });

    }]
  });

  formlyConfigProvider.setType({
    name: 'projectSelect',
    extends: 'select',
    controller: ['$scope','CompleteUserData', function ($scope, CompleteUserData) {
      CompleteUserData.CompleteUserData.$promise.then(function(response) {
        response[$scope.model.customerName].projects.forEach(function(value) {
          $scope.to.options.push({name: value.projectName, key:value.projectName});
        })
      })
      $scope.to.options.unshift({key: "", name: "Select Project"});
    }]
  });
  

  formlyConfigProvider.setType({
    name: 'accountSelect',
    extends: 'select',
    controller: ['$scope','CompleteUserData', function ($scope, CompleteUserData) {
      CompleteUserData.CompleteUserData.$promise.then(function(response) {
        var temp = [];
        response[$scope.model.customerName].projects.forEach(function(value) {
          var obj = {name: value.accountName, key:value.accountName};
          if (temp.indexOf(value.accountName) == -1) {
            $scope.to.options.push(obj);
            temp.push(value.accountName);
          }
        })
      })
      $scope.to.options.unshift({key: "", name: "Select Account"});
    }]
  });





// 
// 
// 
// 
// 

// Provisioning

// VM

// Azure Fields

// 
// 
// 
// 


// Step 1 fields

formlyConfigProvider.setType({
    name: 'azureRegionSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.to.loading = ProvisionService.getRegions({csp: "Azure"}).$promise.then(function(response) {
        $scope.to.options = response.statusMessage;
        $scope.to.options.unshift({key: "", name: "Select Region"});
      })
    }]
  });

  formlyConfigProvider.setType({
    name: 'azureOsSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.$watch('model.region', function (newValue, oldValue, theScope) {
        if((newValue !== oldValue) && (newValue != '')) {
          $scope.to.loading = ProvisionService.getOs({region: newValue}).$promise.then(function(response) {
            $scope.to.options = response.statusMessage;
            $scope.to.options.unshift({key: "", name: "Select OS"});
          })
        }
      });
    }]
  });

  formlyConfigProvider.setType({
    name: 'azureImageSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.$watch('model.os', function (newValue, oldValue, theScope) {
        if((newValue !== oldValue) && (newValue != '')) {
          $scope.to.loading = ProvisionService.getImages({region: $scope.to.region}).$promise.then(function(response) {
            $scope.to.options = response.statusMessage;
            $scope.to.options.unshift({key: "", name: "Select Image"});
          })
        }
      });
    }]
  });

  formlyConfigProvider.setType({
    name: 'azureResourceGroup',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.$watch('model.os', function (newValue, oldValue, theScope) {
        if((newValue !== oldValue) && (newValue != '')) {
          $scope.to.loading = ProvisionService.getImages({region: $scope.to.region}).$promise.then(function(response) {
            $scope.to.options = response.statusMessage;
            $scope.to.options.unshift({key: "", name: "Select Image"});
          })
        }
      });
    }]
  });


// Step 2 fields

  formlyConfigProvider.setType({
    name: 'azureSupportOption',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
      $scope.$watch('model.os', function (newValue, oldValue, theScope) {
        if((newValue !== oldValue) && (newValue != '')) {
          $scope.to.loading = ProvisionService.getImages({region: $scope.to.region}).$promise.then(function(response) {
            $scope.to.options = response.statusMessage;
            $scope.to.options.unshift({key: "", name: "Select Image"});
          })
        }
      });
    }]
  });


// Step 3 fields

  formlyConfigProvider.setType({
    name: 'userManagedDisksSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
          // Reload options
          $scope.to.options = [
            {name: "Select", key: ''},
            {name: "Volume1", key: 'volume1'},
            {name: "Volume2", key: 'volume2'}
          ];
          // $scope.to.loading = DataService.allOptionsByProduct(newValue).then(function (res) {
          //   $scope.to.options = res;
          // });

    }]
  });

  // Step 4 fields

  formlyConfigProvider.setType({
    name: 'azureSubnetSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
          // Reload options
          $scope.to.options = [
            {name: "Select", key: ''},
            {name: "Volume1", key: 'volume1'},
            {name: "Volume2", key: 'volume2'}
          ];
          // $scope.to.loading = DataService.allOptionsByProduct(newValue).then(function (res) {
          //   $scope.to.options = res;
          // });

    }]
  });

  formlyConfigProvider.setType({
    name: 'azureVirtualNetworkSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
          // Reload options
          $scope.to.options = [
            {name: "Select", key: ''},
            {name: "Volume1", key: 'volume1'},
            {name: "Volume2", key: 'volume2'}
          ];
          // $scope.to.loading = DataService.allOptionsByProduct(newValue).then(function (res) {
          //   $scope.to.options = res;
          // });

    }]
  });





// AWS
// Provisioning EBS
//


// Step 2 ( or 1a)


  formlyConfigProvider.setType({
    name: 'awsAvailabilityZoneSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
          // Reload options
          $scope.to.options = [
            {name: "Select", key: ''},
            {name: "Volume1", key: 'volume1'},
            {name: "Volume2", key: 'volume2'}
          ];
          // $scope.to.loading = DataService.allOptionsByProduct(newValue).then(function (res) {
          //   $scope.to.options = res;
          // });

    }]
  });


// AWS
// Provisioning EFS
//


// Step 1

  formlyConfigProvider.setType({
    name: 'awsSubnetSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
          // Reload options
          $scope.to.options = [
            {name: "Select", key: ''},
            {name: "Volume1", key: 'volume1'},
            {name: "Volume2", key: 'volume2'}
          ];
          // $scope.to.loading = DataService.allOptionsByProduct(newValue).then(function (res) {
          //   $scope.to.options = res;
          // });

    }]
  });


  formlyConfigProvider.setType({
    name: 'awsIPAddressSelect',
    extends: 'select',
    controller: ['$scope','ProvisionService', function ($scope, ProvisionService) {
          // Reload options
          $scope.to.options = [
            {name: "Select", key: ''},
            {name: "Volume1", key: 'volume1'},
            {name: "Volume2", key: 'volume2'}
          ];
          // $scope.to.loading = DataService.allOptionsByProduct(newValue).then(function (res) {
          //   $scope.to.options = res;
          // });

    }]
  });


  formlyConfigProvider.setWrapper({
    name: 'horizontalBootstrapLabel',
    template: [
      '<label for="{{id}}" class="col-sm-2 control-label">',
        '{{to.label}} {{to.required ? "*" : ""}}',
      '</label>',
      '<div class="col-sm-8">',
        '<formly-transclude></formly-transclude>',
      '</div>'
    ].join(' ')
  });
  
  formlyConfigProvider.setWrapper({
    name: 'horizontalBootstrapCheckbox',
    template: [
      '<div class="col-sm-offset-2 col-sm-8">',
        '<formly-transclude></formly-transclude>',
      '</div>'
    ].join(' ')
  });

  formlyConfigProvider.setType({
    name: 'tableItems',
    template: [
      '<table>',
      '<formly-form ng-repeat="element in [1,2,3]"',
      ' fields="to.fields" model="element"',
      ' root-el="tr" field-root-el="td">',
      '</formly-form></table>'
      ].join('')
  });
    
  
  formlyConfigProvider.setType({
    name: 'horizontalInput',
    extends: 'input',
    wrapper: ['horizontalBootstrapLabel','bootstrapHasError']
  });

  formlyConfigProvider.setType({
    name: 'horizontalSelect',
    extends: 'select',
    wrapper: ['horizontalBootstrapLabel','bootstrapHasError']
  });
  
  formlyConfigProvider.setType({
    name: 'horizontalCheckbox',
    extends: 'checkbox',
    wrapper: ['horizontalBootstrapCheckbox', 'bootstrapHasError']
  });

  formlyConfigProvider.setType({
    name: 'linkButton',
    template: '<button class="{{to.class}}" ng-click="to.method()"><a href="">{{to.label}}</a></button>'
  });

  formlyConfigProvider.setType({
    name: 'BtnPrimary',
    template: '<button class="btn btn-primary {{to.class}}" ng-click="to.method()">Add another tag</button>'
  });

  formlyConfigProvider.setType({
    name: 'addNewTagBtn',
    template: '<button class="btn btn-default {{to.class}}" ng-click="to.method()">Add another tag</button>'
  });

  formlyConfigProvider.setType({
    name: 'addNewSecurityBtn',
    template: '<button class="btn btn-default {{to.class}}" ng-click="to.method()">Add new security group</button>'
  });

  formlyConfigProvider.setType({
    name: 'deleteIconButton',
    template: '<span class="{{to.class}}" ng-click="to.method()">x</span>'
  });

  formlyConfigProvider.setType({
    name: 'tagLabel',
    template: '<span class="{{to.class}}" ng-click="to.method()">(Upto 50 tags maximum)</span>'
  });


  formlyConfigProvider.setWrapper({
    name: 'tooltipLabel',
    template: '<div><label for="{{to.key}}" class="control-label">'+
      '{{to.tooltipLabel.label}}{{to.required ? \'*\' : \'\'}}'+
      '</label><span class="tooltip-icon" data-toggle="tooltip" data-placement= {{to.tooltipLabel.position ? to.tooltipLabel.position : "bottom" }} title={{to.title}} tooltip><i class="fa fa-info"></i></span>'+
      '<formly-transclude></formly-transclude>'+
      '</div>'
  });


  formlyConfigProvider.setType({
    name: 'addImportTrafficPolicyBtn',
    template: '<button class="btn btn-default {{to.class}}" ng-click="to.method()">Import traffic policy</button>'
  });


  formlyConfigProvider.setType({
    name: 'addNewVolume',
    template: [
              '<div class="{{hideRepeat}}">',
              '<div class="repeatsection" ng-repeat="element in model[options.key]" ng-init="fields = copyFields(to.fields)">',
              '<formly-form fields="fields" model="element" form="form"></formly-form>',
              '<div style="margin-bottom:20px;">',
              '<button type="button" class="btn btn-sm btn-danger pull-right" ng-click="model[options.key].splice($index, 1)">Remove</button>',
              '</div><hr class="clear-float">',
              '</div>',
              '<p class="AddNewButton col-xs-2">',
              '<button type="button" class="btn btn-default" ng-click="addNew()" >{{to.btnText}}</button></p>',
              '</div>' ].join(''),
      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;
        
        $scope.copyFields = copyFields;
        
        
        function copyFields(fields) {
          fields = angular.copy(fields);
          addRandomIds(fields);
          return fields;
        }
        
        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          if (lastSection) {
            newsection = angular.copy(lastSection);
          }
          newsection.customerName = $scope.model.customerName;
          newsection.region = $scope.model.region;
          repeatsection.push(newsection);
        }
        
        function addRandomIds(fields) {
          unique++;
          angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
              addRandomIds(field.fieldGroup);
              return; // fieldGroups don't need an ID
            }
            
            if (field.templateOptions && field.templateOptions.fields) {
              addRandomIds(field.templateOptions.fields);
            }
            
            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
          });
        }
        
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
    }
  });
});



