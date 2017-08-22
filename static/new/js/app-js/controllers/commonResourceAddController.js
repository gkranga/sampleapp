angular.module('swire').controller('commonResourceAddController', function($scope, $templateCache, WizardHandler, $rootScope, $state, $window, $filter, CompleteUserData, Sidebar, Language, KeyMapper, Select, Create, Profile, User, ProvisionService){
  $scope.editFlag = false;
  $scope.typeSelected = '';
  $scope.cspSelected = '';

  $temp = {
    dnsHostedZones:{
      step1: {
        exit: "exitValidation(forms.step1)",
        form: "forms.step1",
        fields: "fields.step1",
        finishingStep: true
      }
    },
    dnsTrafficPolicyInstances:{
      step1: {
        // exit: "exitValidation(forms.step1)",
        form: "forms.step1",
        fields: "fields.step1",
        finishingStep: true
      },
      step2: {
        // exit: "exitValidation(forms.step2)",
        form: "forms.step2",
        fields: "fields.step2",
        finishingStep: true
      },
      step3: {
        // exit: "exitValidation(forms.step3",
        form: "forms.step3",
        fields: "fields.step3",
        finishingStep: true
      }
    },
    dnsHostedZones:{
      step1: {
        exit: "exitValidation(forms.step1)",
        form: "forms.step1",
        fields: "fields.step1",
        finishingStep: true
      }
    },
    dnsTrafficPolicyInstances:{
      step1: {
        // exit: "exitValidation(forms.step1)",
        form: "forms.step1",
        fields: "fields.step1",
        finishingStep: true
      },
      step2: {
        // exit: "exitValidation(forms.step2)",
        form: "forms.step2",
        fields: "fields.step2",
        finishingStep: true
      },
      step3: {
        // exit: "exitValidation(forms.step3",
        form: "forms.step3",
        fields: "fields.step3",
        finishingStep: true
      }
    },
    subnet:{
      step1: {
        // exit: "exitValidation(forms.step1)",
        form: "forms.step1",
        fields: "fields.step1",
        finishingStep: true
      },
    },
    vpc:{
      step1: {
        // exit: "exitValidation(forms.step1)",
        form: "forms.step1",
        fields: "fields.step1",
        finishingStep: true
      },
    },
    provisioningNewSecurityGroup: {
      step1: {
        exit: "exitValidation(forms.step1)",
        form: "forms.step1",
        fields: "fields.step1"
      },
      step2: {
        exit: "exitValidation(forms.step2)",
        form: "forms.step2",
        fields: "fields.step2",
        finishingStep: true
      },
      step3: {
        exit: "exitValidation(forms.step3)",
        form: "forms.step3",
        fields: "fields.step3",
        finishingStep: true
      }
    }
  }

  $scope.pagesJson = {
    virtualMachine: [
      {
        tabName: "By Provider",
        tabSlug: "byProvider",
        wizard: {
          aws: {
            step1: {
              // exit: "exitValidation(forms.step1)",
              form: "forms.step1",
              fields: "fields.step1"
            },
            step2: {
              // exit: "exitValidation(forms.step2)",
              form: "forms.step2",
              fields: "fields.step2",
              finishingStep: false
            },
            step3: {
              // exit: "exitValidation(forms.step3)",
              form: "forms.step3",
              fields: "fields.step3",
              finishingStep: false
            },
            step4: {
              // exit: "exitValidation(forms.step4)",
              form: "forms.step4",
              fields: "fields.step4",
              finishingStep: false
            },
            step5: {
              // exit: "exitValidation(forms.step5)",
              form: "forms.step5",
              fields: "fields.step5",
              finishingStep: false
            },
            step6: {
              // exit: "exitValidation(forms.step6)",
              form: "forms.step6",
              fields: "fields.step6",
              finishingStep: false
            },
            step7: {
              // exit: "exitValidation(forms.step7)",
              form: "forms.step7",
              fields: "fields.step7",
              noNextStep: true,
              finishingStep: true
            }
          },
          azure: {
            step1: {
              // exit: "exitValidation(forms.step1)",
              form: "forms.step1",
              fields: "fields.step1"
            },
            step2: {
              // exit: "exitValidation(forms.step2)",
              form: "forms.step2",
              fields: "fields.step2",
              finishingStep: true
            },
            step3: {
              // exit: "exitValidation(forms.step3)",
              form: "forms.step3",
              fields: "fields.step3",
              finishingStep: true
            },
            step4: {
              // exit: "exitValidation(forms.step4)",
              form: "forms.step4",
              fields: "fields.step4",
              finishingStep: true
            },
            step5: {
              // exit: "exitValidation(forms.step5)",
              form: "forms.step5",
              fields: "fields.step5",
              noNextStep: true,
              finishingStep: true
            }
          }
        }
      },
      {
        tabName: "By Price",
        tabSlug: "byPrice",
        wizard: {}
      }
    ],
    dnsHostedZones: [
      {
        tabName: "By Provider",
        tabSlug: "byProvider",
        wizard: {
          aws: {
            step1: {
              // exit: "exitValidation(forms.step1)",
              form: "forms.step1",
              fields: "fields.step1"
            },
            step2: {
              // exit: "exitValidation(forms.step2)",
              form: "forms.step2",
              fields: "fields.step2",
              finishingStep: true
            },
            step3: {
              // exit: "exitValidation(forms.step3)",
              form: "forms.step3",
              fields: "fields.step3",
              finishingStep: true
            },
            step4: {
              // exit: "exitValidation(forms.step4)",
              form: "forms.step4",
              fields: "fields.step4",
              finishingStep: true
            },
            step5: {
              // exit: "exitValidation(forms.step5)",
              form: "forms.step5",
              fields: "fields.step5",
              finishingStep: true
            },
            step6: {
              // exit: "exitValidation(forms.step6)",
              form: "forms.step6",
              fields: "fields.step6",
              finishingStep: true
            },
            step7: {
              // exit: "exitValidation(forms.step7)",
              form: "forms.step7",
              fields: "fields.step7",
              noNextStep: true,
              finishingStep: true
            }
          },
          azure: {
            step1: {
              // exit: "exitValidation(forms.step1)",
              form: "forms.step1",
              fields: "fields.step1"
            },
            step2: {
              // exit: "exitValidation(forms.step2)",
              form: "forms.step2",
              fields: "fields.step2",
              finishingStep: true
            },
            step3: {
              // exit: "exitValidation(forms.step3)",
              form: "forms.step3",
              fields: "fields.step3",
              finishingStep: true
            },
            step4: {
              // exit: "exitValidation(forms.step4)",
              form: "forms.step4",
              fields: "fields.step4",
              finishingStep: true
            },
             step5: {
              // exit: "exitValidation(forms.step5)",
              form: "forms.step5",
              fields: "fields.step5",
              noNextStep: true,
              finishingStep: true
            }
          },
          test:{
            step1: {
              exit: "exitValidation(forms.step1)",
              form: "forms.step1",
              fields: "fields.step1",
              finishingStep: true
            },
            step2: {
              exit: "exitValidation(forms.step2)",
              form: "forms.step2",
              fields: "fields.step2",
              finishingStep: true
            },
            step3: {
              exit: "exitValidation(forms.step3)",
              form: "forms.step3",
              fields: "fields.step3",
              finishingStep: true
            },
            step4: {
              exit: "exitValidation(forms.step4)",
              form: "forms.step4",
              fields: "fields.step4",
              finishingStep: true
            },
            step5: {
              exit: "exitValidation(forms.step5)",
              form: "forms.step5",
              fields: "fields.step5",
              finishingStep: true
            },
            step6: {
              exit: "exitValidation(forms.step6)",
              form: "forms.step6",
              fields: "fields.step6",
              noNextStep: true,
              finishingStep: true
            }
          }
        }
      },
      {
        tabName: "By Configuration",
        tabSlug: "byConfiguration",
        wizard: {}
      },
      {
        tabName: "By Price",
        tabSlug: "byPrice",
        wizard: {}
      }
    ]
  }

  $scope.fields = {
    virtualMachine: {
      aws: {
        step1: [
          {
            key: 'region',
            type: 'regionSelect',
            className: 'col-xs-7',
            defaultValue: '',
            templateOptions: {
              label: 'Region',
              title: 'Select Region',
              placeholder: 'Select Region',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: [{key: "", name: "Select Region"}]
            }
          },
          {
            key: 'os',
            type: 'osSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              'templateOptions.disabled': '!model.region'
            },
            templateOptions: {
              label: 'OS',
              title: 'Select OS',
              placeholder: 'Select OS',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: [{key: "", name: "Select OS"}]
            }
          },
          {
            key: 'imageId',
            type: 'imageSelect',
            className: 'col-xs-7',
            defaultValue: '{}',
            expressionProperties: {
              'templateOptions.disabled': '!(model.os && model.region)',
              'templateOptions.region': ('model.region')
            },
            templateOptions: {
              label: 'Image',
              title: 'Select Image',
              placeholder: 'Select Image',
              required: true,
              labelProp: "name",
              valueProp: "extra",
              options: [{key: "{}", name: "Select Image"}]
            }
          }
        ],
        step2: [
          {
            key: 'instanceType',
            type: 'instanceSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              'templateOptions.disabled': '!(model.os && model.region)',
              'templateOptions.region': 'model.region'
            },
            templateOptions: {
              label: 'Instance',
              placeholder: 'Select Instance!',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: [{key: "", name: "Select Instance"}]
            }
          }
        ],
        step3: [
          {
            key: 'instance',
            type: 'instanceCount',
            className: 'col-xs-7',
            defaultValue: 1,
            wrapper: 'tooltipLabel',
            templateOptions: {
               tooltipLabel : {
                  label: 'No. of Instance'
              },
              title: 'You can choose to launch more than one instance at a time.',
              placeholder: 'Enter a number',
              required: true,
              type: 'number',
              max: 99,
              min: 1,
              pattern: '\\d'
            },
            controller: ['$scope', function($scope){

            }]
          },
          {
            key: 'network',
            type: 'networkSelect',
            className: 'col-xs-7',
            defaultValue: '',
            wrapper: 'tooltipLabel',
            expressionProperties: {
              'templateOptions.disabled': '!(model.instance)',
              'templateOptions.customerName': 'model.customerName',
              'templateOptions.region': 'model.region'
            },
            templateOptions: {
              tooltipLabel : { 
                label: 'Network'
              },
              title: 'Launch your instance into an Amazon Virtual Private Cloud (VPC). You can create a VPC and select your own IP address range, create subnets, configure route tables, and configure network gateways.',
              placeholder: 'Select Network',
              required: true,  
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'createVPC',
            type: 'linkButton',
            className: 'col-xs-2',
            defaultValue: '',
            expressionProperties: {
              'templateOptions.disabled': '!(model.instance)'
            },
            templateOptions: {
              class: 'button-link',
              label: 'Create VPC',
              method: function(){
                console.log("works"); // put the link in the function
              }
            }
          },
          {
            key: 'subnetId',
            type: 'subnetSelect',
            className: 'col-xs-7',
            defaultValue: '',
            wrapper: 'tooltipLabel',
            expressionProperties: {
              'templateOptions.disabled': '!(model.network)',
              'templateOptions.customerName': 'model.customerName'
            },
            templateOptions: {
              tooltipLabel : { 
                label: 'Subnet'
              },
              title: 'Requests a public IP address from Amazon\'s public IP address pool, to make your instance reachable from the Internet. In most cases, the public IP address is associated with the instance until it’s stopped or terminated, after which it’s no longer available for you to use. If you require a persistent public IP address that you can associate and disassociate at will, use an Elastic IP address (EIP) instead. You can allocate your own EIP, and associate it to your instance after launch.',
              placeholder: 'Select Subnet',
              required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'createSubnet',
            type: 'linkButton',
            className: 'col-xs-2',
            defaultValue: '',
            expressionProperties: {
              'templateOptions.disabled': '!(model.subnet)'
            },
            templateOptions: {
              class: 'button-link',
              label: 'Create Subnet',
              method: function(){
                console.log("works"); // put the link in the function
              }
            }
          },
          {
            key: 'autoAssignPublicIP',
            type: 'publicIPSelect',
            className: 'col-xs-7',
            defaultValue: '',
            wrapper: 'tooltipLabel',
            expressionProperties: {
              'templateOptions.disabled': '!(model.subnetId)'
            },
            templateOptions: {
              tooltipLabel : { 
                label: 'Auto Assign Public IP',
              },
              title: 'Requests a public IP address from Amazon\'s public IP address pool, to make your instance reachable from the Internet. In most cases, the public IP address is associated with the instance until it’s stopped or terminated, after which it’s no longer available for you to use. If you require a persistent public IP address that you can associate and disassociate at will, use an Elastic IP address (EIP) instead. You can allocate your own EIP, and associate it to your instance after launch.',
              placeholder: 'Select IP',
              required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'instanceInitiatedShutdownBehavior',
            type: 'select',
            className: 'col-xs-7',
            defaultValue: 'stop',
            wrapper: 'tooltipLabel',
            templateOptions: {
              tooltipLabel : { 
                label: 'Shutdown behavior'
              },
              title: 'Specify the instance behavior when an OS level shutdown is performed.',
              placeholder: 'Select',
              required: true, 
              labelProp: "name",
              valueProp: "key",
              options: [{name: "Stop", key: "stop"}, {name: "Terminate", key: "terminate"}]
            }
          },
          {
            key: 'disableApiTermination',
            type: 'select',
            className: 'col-xs-7',
            defaultValue: true,
            wrapper: 'tooltipLabel',
            expressionProperties: {
              'templateOptions.disabled': '!(model.autoAssignPublicIP)'
            },
            templateOptions: {
              tooltipLabel : { 
                label: 'Enable Termination Protection'
              },
              title: 'You can protect instances from being accidentally terminated. Once enabled, you won\'t be able to terminate this instance via the API or the AWS Management Console until termination protection has been disabled.',
              placeholder: 'Select',
              required: true, 
              labelProp: "name",
              valueProp: "key",
              options: [{name: "Yes", key: true}, {name:"No", key: false}]
            }
          },
          {
            key: 'monitoring',
            type: 'select',
            className: 'col-xs-7',
            wrapper: 'tooltipLabel',
            defaultValue: true,
            expressionProperties: {
              'templateOptions.disabled': '!(model.disableApiTermination)'
            },
            templateOptions: {
              tooltipLabel : { 
                label: 'Monitoring'
              },
              title: 'Enables you to monitor, collect, and analyze metrics about your instances through Amazon CloudWatch. Additional charges apply if you enable this option.',
              placeholder: 'Select',
              required: true, 
              labelProp: "name",
              valueProp: "key",
              options: [{key: true, name: "enabled"}, {key: false, name: "disabled"}]
            }
          },
          {
            key: 'tenancy',
            type: 'tenancySelect',
            className: 'col-xs-7',
            defaultValue: '',
            wrapper: 'tooltipLabel',
            expressionProperties: {
              'templateOptions.disabled': '!(model.monitoring)'
            },
            templateOptions: {
              tooltipLabel : { 
                label: 'Tenancy'
              },
              title: 'You can choose to run your instances on physical servers fully dedicated for your use. The use of host tenancy will request to launch instances onto Dedicated hosts (https://aws.amazon.com/ec2/dedicated-hosts/), while the use of dedicated tenancy will launch instances as Dedicated instances (https://aws.amazon.com/dedicated-instances/). You can launch an instance with a tenancy of host or dedicated into a Dedicated VPC.',
              placeholder: 'Select Tenancy',
              required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'userdata',
            type: 'input',
            className: 'col-xs-7',
            wrapper: 'tooltipLabel',
            expressionProperties: {
              'templateOptions.disabled': '!(model.tenancy)'
            },
            templateOptions: {
              tooltipLabel : { 
                label: 'User Data'
              },
              title: 'You can specify user data to configure an instance or run a configuration script during launch. If you launch more than one instance at a time, the user data is available to all the instances in that reservation.'
            }
          }
        ],
        step4: [
          {
            className: 'row table-header step-tooltip',
            template: ['<div class="col-xs-1"><strong>Volume Type</strong>',
            '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            'title="Amazon EBS is a block-level storage volume that persists independently from the lifetime of an EC2 instance, so you can stop and restart your instance at a later time. Ephemeral instance store volumes are physically attached to the host computer. The data on an instance store persists only during the lifetime of the instance." tooltip><i class="fa fa-info"></i></span></div>',
            
            '<div class="col-xs-1"><strong>Device</strong>',
            '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            'title="The available device names for the volume. Depending on the block device driver of the selected AMI\'s kernel, the device may be attached with a different name than what you specify. Amazon Linux AMIs create a symbolic link from the renamed device path to the name you specify, but other AMIs may behave differently" tooltip><i class="fa fa-info"></i></span>',
            '</div>',

            '<div class="col-xs-1"><strong>Snapshot</strong>',
            '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            'title="A snapshot is a backup of an EC2 volume that\'s stored in S3. You can create a new volume using data stored in a snapshot by entering the snapshot\'s ID. You can search for public snapshots by typing text in the Snapshot field. Descriptions are case-sensitive" tooltip><i class="fa fa-info"></i></span>',
            '</div>',
            
            '<div class="col-xs-1"><strong>Size (GiB)</strong>',
            '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            'title="Volume size must be greater than zero or the size of the snapshot used. Provisioned IOPS (SSD) volumes must be at least 4 GiB in size." tooltip><i class="fa fa-info"></i></span>',
            '</div>',

            '<div class="col-xs-2"><strong>Volume Type</strong>',
            '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            'title="General Purpose (SSD) volumes can burst to 3000 IOPS, and deliver a consistent baseline of 3 IOPS/GiB. Provisioned IOPs (SSD) volumes can deliver up to 20000 IOPS, and are best for EBS-optimized instances. Magnetic volumes, previously called standard volumes, deliver 100 IOPS on average, and can burst to hundreds of IOPS." tooltip><i class="fa fa-info"></i></span></div>',
            
            
            '<div class="col-xs-1"><strong>IOPS</strong>',
            '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            'title="The requested number of I/O operations per second that the volume can support. For Provisioned IOPS (SSD) volumes, you can provision up to 50 IOPS per GiB. For General Purpose (SSD) volumes, baseline performance is 3 IOPS per GiB, with a minimum of 100 IOPS and a maximum of 10000 IOPS. General Purpose (SSD) volumes under 1000 GiB can burst up to 3000 IOPS." tooltip><i class="fa fa-info"></i></span>',
            '</div>',

            '<div class="col-xs-2"><strong>Throughput (MB/s)</strong>',
            '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            'title="Throughput that the volume can support is specified for Streaming Optimized volumes: ST1 and SC1." tooltip><i class="fa fa-info"></i></span>',
            '</div>',

            '<div class="col-xs-2"><strong>Delete on Termination</strong>',
            '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            'title="EBS volumes persist independently from the running life of an EC2 instance. However, you can choose to automatically delete an EBS volume when the associated instance is terminated." tooltip><i class="fa fa-info"></i></span>',
            '</div>',

            '<div class="col-xs-1"><strong>Encryption</strong>',
            '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            'title="Volumes that are created from encrypted snapshots are automatically encrypted, and volumes that are created from unencrypted snapshots are automatically unencrypted. If no snapshot is selected, you can choose to encrypt the volume." tooltip><i class="fa fa-info"></i></span>',
            '</div>'
            ].join(' ')
          },
          {
            type: 'addNewVolume',
            key: 'volume',
            templateOptions: {
              btnText:'Add new volume',
              fields: [
                {
                  className: 'row table-fields',
                  fieldGroup: [
                  {
                    className: 'col-xs-1',
                    type: 'input',
                    key: 'volume_type'
                  },
                  {
                    className: 'col-xs-1',
                    type: 'input',
                    key: 'device'
                  },{
                    className: 'col-xs-1',
                    type: 'input',
                    key: 'snapshot'
                  },{
                    className: 'col-xs-1',
                    type: 'input',
                    key: 'volumeSize'
                  },
                  {
                    key: 'volumeType',
                    type: 'volumeTypeSelect',
                    className: 'col-xs-2',
                    defaultValue: '',
                    templateOptions: {
                      placeholder: 'Select',
                      required: true,
                      labelProp: "name",
                      valueProp: "key",
                      options: []
                    }
                  },
                  {
                    className: 'col-xs-1',
                    type: 'input',
                    key: 'iops'
                  },
                  {
                    className: 'col-xs-2',
                    type: 'input',
                    key: 'throughput'
                  },
                  {
                    key: 'deleteOnTermination',
                    type: 'yesNoSelect',
                    className: 'col-xs-2',
                    defaultValue: true,
                    templateOptions: {
                      placeholder: 'Select',
                      required: true,
                      labelProp: "name",
                      valueProp: "key",
                      options: []
                    }
                  },
                  {
                    key: 'encrypted',
                    type: 'yesNoSelect',
                    className: 'col-xs-1',
                    defaultValue: '',
                    templateOptions: {
                      placeholder: 'Select',
                      required: true,
                      labelProp: "name",
                      valueProp: "key",
                      options: []
                    }
                  }]
                },
              ]
            }
          }
        ],
        step5: [
          {
            className: 'row step-5-p-b-p table-header',
            template: ['<div class="col-xs-5"><strong>Key</strong>(127 characters max)</div>',
            '<div class="col-xs-5"><strong>Value</strong>(255 characters max)</div>'
            ].join(' ')
          },
          {
            className: 'row step-5-p-b-p',
            template: '<hr>',
          },
          {
            className: 'row step-5-p-b-p',
            fieldGroup: [  
              {
                type: 'addNewVolume',
                key: 'tags',
                templateOptions: {
                  btnText:'Add another tag',
                  fields: [
                    {
                      className: 'row step-5-p-b-p table-fields',
                      fieldGroup: [
                        {
                          className: 'col-xs-5',
                          type: 'input',
                          key: 'key'
                        },
                        {
                          className: 'col-xs-5',
                          type: 'input',
                          key: 'value'
                        }
                      ]
                    }
                  ]
                }
              },
              {
                className: 'col-xs-4',
                type: 'tagLabel',
                key: 'tag-limit'
              }
            ]
          }
        ],
        step6: [
          {
            className: 'row step-6-p-b-p',
            fieldGroup: [  
              {
                type: 'addNewVolume',
                key: 'security',
                templateOptions: {
                  btnText:'Add new security group',
                  fields: [
                    {
                      className: 'row step-6-p-b-p table-fields',
                      fieldGroup: [
                        {
                          key: 'securityGroup',
                          type: 'securityGroupSelect',
                          className: 'col-xs-8',
                          defaultValue: '',
                          templateOptions: {
                            label: 'Security Group',
                            placeholder: 'Select Security Group',
                            required: true, 
                            labelProp: "name",
                            valueProp: "key",
                            options: []
                          }
                        }
                      ]
                    },
                  ]
                }
              }
            ]
          },
        ],
        step7: [
          {
            className: 'row step-5-p-b-p',
            fieldGroup: [
              {
                key: 'projectName',
                type: 'projectSelect',
                className: 'col-xs-8',
                defaultValue: '',
                expressionProperties: {
                  'templateOptions.customerName': 'model.customerName'
                },
                templateOptions: {
                  label: 'Project',
                  placeholder: 'Select Project',
                  required: true, 
                  labelProp: "name",
                  valueProp: "key",
                  options: []
                }
              },
            ]
          },
          {
            className: 'row step-5-p-b-p',
            fieldGroup: [
              {
                key: 'accountName',
                type: 'accountSelect',
                className: 'col-xs-8',
                defaultValue: '',
                expressionProperties: {
                  'templateOptions.customerName': 'model.customerName'
                },
                templateOptions: {
                  label: 'Account',
                  placeholder: 'Select Account',
                  required: true, 
                  labelProp: "name",
                  valueProp: "key",
                  options: []
                }
              },
            ]
          }
        ],
        step8: [
          {
            className: 'row step-5-p-b-p final-step',
            template: ['<div class="col-xs-12 final-screen"><div class="col-xs-1"><strong>Key</strong></div>',
            '<div class="col-xs-1"><strong>Value</strong></div></div>'
            ].join(' ')
          }
        ],        
      },
      azure: {
        step1: [
          {
            key: 'region',
            type: 'azureRegionSelect',
            className: 'col-xs-7',
            defaultValue: '',
            templateOptions: {
              label: 'Region',
              placeholder: 'Select Region',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'os',
            type: 'azureOsSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!model.region'
            },
            templateOptions: {
              label: 'OS',
              placeholder: 'Select OS',
              // required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'image',
            type: 'azureImageSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.os && model.region)'
            },
            templateOptions: {
              label: 'Image',
              placeholder: 'Select Image!',
              // required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'azureInstanceName',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Instance Name',
              // required: true
            }
          },
           {
            key: 'azureUsername',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'UserName',
              // required: true
            }
          },
          {
            key: 'azurePassword',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Password',
              // required: true
            }
          },
          {
            key: 'azurePublicKey',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Public Key',
              // required: true
            }
          },
          {
            key: 'resourcegroup',
            type: 'azureResourceGroup',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.os && model.region)'
            },
            templateOptions: {
              label: 'Image',
              placeholder: 'Select Image!',
              // required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'createResourceGroup',
            type: 'linkButton',
            className: 'col-xs-2',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.instance)'
            },
            templateOptions: {
              class: 'button-link',
              label: 'Create Resource Group',
              method: function(){
                console.log("works"); // put the link in the function
              }
            }
          }
        ],
        step2: [
          {
            className: 'row table-header step-tooltip',

            template: ['<div class="col-xs-2"><strong>Region Name</strong>',
            // '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            // 'title="Amazon EBS is a block-level storage volume that persists independently from the lifetime of an EC2 instance, so you can stop and restart your instance at a later time. Ephemeral instance store volumes are physically attached to the host computer. The data on an instance store persists only during the lifetime of the instance." tooltip><i class="fa fa-info"></i></span>
            '</div>',
            
            '<div class="col-xs-1"><strong>OS Name</strong>',
            // '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            // 'title="The available device names for the volume. Depending on the block device driver of the selected AMI\'s kernel, the device may be attached with a different name than what you specify. Amazon Linux AMIs create a symbolic link from the renamed device path to the name you specify, but other AMIs may behave differently" tooltip><i class="fa fa-info"></i></span>',
            '</div>',

            '<div class="col-xs-1"><strong>CPU</strong>',
            // '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            // 'title="A snapshot is a backup of an EC2 volume that\'s stored in S3. You can create a new volume using data stored in a snapshot by entering the snapshot\'s ID. You can search for public snapshots by typing text in the Snapshot field. Descriptions are case-sensitive" tooltip><i class="fa fa-info"></i></span>',
            '</div>',
            
            '<div class="col-xs-1"><strong>Memory</strong>',
            // '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            // 'title="Volume size must be greater than zero or the size of the snapshot used. Provisioned IOPS (SSD) volumes must be at least 4 GiB in size." tooltip><i class="fa fa-info"></i></span>',
            '</div>',

            '<div class="col-xs-1"><strong>Disks</strong>',
            // '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            // 'title="General Purpose (SSD) volumes can burst to 3000 IOPS, and deliver a consistent baseline of 3 IOPS/GiB. Provisioned IOPs (SSD) volumes can deliver up to 20000 IOPS, and are best for EBS-optimized instances. Magnetic volumes, previously called standard volumes, deliver 100 IOPS on average, and can burst to hundreds of IOPS." tooltip><i class="fa fa-info"></i></span></div>',
            '</div>',
            
            '<div class="col-xs-1"><strong>IOPS</strong>',
            // '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            // 'title="The requested number of I/O operations per second that the volume can support. For Provisioned IOPS (SSD) volumes, you can provision up to 50 IOPS per GiB. For General Purpose (SSD) volumes, baseline performance is 3 IOPS per GiB, with a minimum of 100 IOPS and a maximum of 10000 IOPS. General Purpose (SSD) volumes under 1000 GiB can burst up to 3000 IOPS." tooltip><i class="fa fa-info"></i></span>',
            '</div>',

            '<div class="col-xs-1"><strong>Local SSD</strong>',
            // '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            // 'title="Throughput that the volume can support is specified for Streaming Optimized volumes: ST1 and SC1." tooltip><i class="fa fa-info"></i></span>',
            '</div>',

            '<div class="col-xs-2"><strong>Load Balancing</strong>',
            // '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            // 'title="EBS volumes persist independently from the running life of an EC2 instance. However, you can choose to automatically delete an EBS volume when the associated instance is terminated." tooltip><i class="fa fa-info"></i></span>',
            '</div>',

            '<div class="col-xs-1"><strong>Premium</strong>',
            // '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            // 'title="Volumes that are created from encrypted snapshots are automatically encrypted, and volumes that are created from unencrypted snapshots are automatically unencrypted. If no snapshot is selected, you can choose to encrypt the volume." tooltip><i class="fa fa-info"></i></span>',
            '</div>',

            '<div class="col-xs-1"><strong>Price</strong>',
            // '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            // 'title="Volumes that are created from encrypted snapshots are automatically encrypted, and volumes that are created from unencrypted snapshots are automatically unencrypted. If no snapshot is selected, you can choose to encrypt the volume." tooltip><i class="fa fa-info"></i></span>',
            '</div>'
            ].join(' ')
          },
          {
            // type: 'addNewVolume',
            // key: 'volume',
            // templateOptions: {
            //   btnText:'Add new volume',
            //   fields: [
            //     {
                  className: 'row table-fields',
                  fieldGroup: [
                  {
                    className: 'col-xs-2',
                    type: 'input',
                    key: 'azureStep3RegionName'
                  },
                  {
                    className: 'col-xs-1',
                    type: 'input',
                    key: 'azureStep3OSName'
                  },
                  {
                    className: 'col-xs-1',
                    type: 'input',
                    key: 'azureStep3snapshot'
                  },
                  {
                    className: 'col-xs-1',
                    type: 'input',
                    key: 'azureStep3size'
                  },
                  {
                    className: 'col-xs-1',
                    type: 'input',
                    key: 'azureStep3volume_type'
                  },
                  {
                    className: 'col-xs-1',
                    type: 'input',
                    key: 'azureStep3device'
                  },
                  {
                    className: 'col-xs-1',
                    type: 'input',
                    key: 'azureStep3snapshot'
                  },
                  {
                    className: 'col-xs-2',
                    type: 'input',
                    key: 'azureStep3size'
                  },
                  {
                    className: 'col-xs-1',
                    type: 'input',
                    key: 'azureStep3snapshot'
                  },
                  {
                    className: 'col-xs-1',
                    type: 'input',
                    key: 'azureStep3size'
                  }
                ]
                },
            //   ]
            // }
          {
            key: 'supportoption',
            type: 'azureSupportOption',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.os && model.region)'
            },
            templateOptions: {
              label: 'Support Option',
              placeholder: 'Support Option',
              // required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          }
        ],
        step3: [
          {
            key: 'usermanageddisks',
            type: 'userManagedDisksSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.os && model.region)'
            },
            templateOptions: {
              label: 'User Managed Disks',
              placeholder: 'User Managed Disks',
              // required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'azureStorageAccount',
            type: 'yesNoSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.autoAssignPublicIP)'
            },
            templateOptions: {
              label: 'Support Option',
              placeholder: 'Select',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'azureStorageAccountLink',
            type: 'linkButton',
            className: 'col-xs-2',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.instance)'
            },
            templateOptions: {
              class: 'button-link',
              label: 'Create Storage Account',
              method: function(){
                console.log("works"); // put the link in the function
              }
            }
          },
          {
            className: 'row step-5-p-b-p',
            template: '<br/>',
          },
        ],
        step4: [
          {
            key: 'azureVirtualNetwork',
            type: 'azureVirtualNetworkSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.autoAssignPublicIP)'
            },
            templateOptions: {
              label: 'Virtual Network',
              placeholder: 'Select',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'azureVirtualNetworkLink',
            type: 'linkButton',
            className: 'col-xs-2',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.instance)'
            },
            templateOptions: {
              class: 'button-link',
              label: 'Create Virtual Network',
              method: function(){
                console.log("works"); // put the link in the function
              }
            }
          },
          {
            key: 'azureSubnet',
            type: 'azureSubnetSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.autoAssignPublicIP)'
            },
            templateOptions: {
              label: 'Subnet',
              placeholder: 'Select',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'azurePublicIp',
            type: 'yesNoSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.autoAssignPublicIP)'
            },
            templateOptions: {
              label: 'Public IPs',
              placeholder: 'Select',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'azurePublicIpLink',
            type: 'linkButton',
            className: 'col-xs-2',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.instance)'
            },
            templateOptions: {
              class: 'button-link',
              label: 'Create Public IP',
              method: function(){
                console.log("works"); // put the link in the function
              }
            }
          },
          {
            key: 'azureNetworkSecurityGroup',
            type: 'yesNoSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.autoAssignPublicIP)'
            },
            templateOptions: {
              label: 'Network Security Group',
              placeholder: 'Select',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'azureNetworkSecurityGroupLink',
            type: 'linkButton',
            className: 'col-xs-2',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.instance)'
            },
            templateOptions: {
              class: 'button-link',
              label: 'Create Network Security Group',
              method: function(){
                console.log("works"); // put the link in the function
              }
            }
          },
          {
            className: 'row step-5-p-b-p',
            template: '<br/>',
          }
        ],
        step5: [
          {
            key: 'azureAvailabilitySet',
            type: 'yesNoSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.autoAssignPublicIP)'
            },
            templateOptions: {
              label: 'Availability Set',
              placeholder: 'Select',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'azureAvailabilitySetLink',
            type: 'linkButton',
            className: 'col-xs-2',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.instance)'
            },
            templateOptions: {
              class: 'button-link',
              label: 'Create Availability Set',
              method: function(){
                console.log("works"); // put the link in the function
              }
            }
          },
          {
            key: 'azureAvailabilitySet',
            type: 'yesNoSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.autoAssignPublicIP)'
            },
            templateOptions: {
              label: 'Enable Boot Diagnostics',
              placeholder: 'Select',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'azureAvailabilitySet',
            type: 'yesNoSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.autoAssignPublicIP)'
            },
            templateOptions: {
              label: 'Enable Guest OS Diagnostics',
              placeholder: 'Select',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'azureAvailabilitySet',
            type: 'yesNoSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.autoAssignPublicIP)'
            },
            templateOptions: {
              label: 'Diagnostics Storage Account',
              placeholder: 'Select',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'azureAvailabilitySetLink',
            type: 'linkButton',
            className: 'col-xs-2',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.instance)'
            },
            templateOptions: {
              class: 'button-link',
              label: 'Create Storage Account',
              method: function(){
                console.log("works"); // put the link in the function
              }
            }
          },
          {
            key: 'azureProjectSelect',
            type: 'yesNoSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.autoAssignPublicIP)'
            },
            templateOptions: {
              label: 'Select Project',
              placeholder: 'Select',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'azureAccountSelect',
            type: 'yesNoSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.autoAssignPublicIP)'
            },
            templateOptions: {
              label: 'Select Account',
              placeholder: 'Select',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          }
        ]
      },
      dnsHostedZones:{
        step1: [
          {
            key: 'domainName',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Domain Name',
              // required: true
            }
          },
          {
            key: 'comment',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Comment',
              // required: true
            }
          },
          {
            key: 'type',
            type: 'dnsHostedZonesType',
            className: 'col-xs-7',
            defaultValue: '',
            templateOptions: {
              label: 'Type',
              placeholder: 'Select Type',
              required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          }
        ] 
      },
      dnsTrafficPolicyInstances:{
        step1: [
          {
            key: 'policyName',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Policy Name',
              // required: true
            }
          },
          {
            key: 'versionNumber',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Version Number',
              // required: true
            }
          },
          {
            key: 'versionDescription',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Version Description',
              // required: true
            }
          }
        ],
        step2: [
          {
            className: 'row step-5-p-b-p',
            fieldGroup: [
              {
                key: 'startPoint',
                type: 'startPointSelect',
                className: 'col-xs-7',
                defaultValue: '',
               
                templateOptions: {
                  label: 'Start Point',
                  placeholder: 'Select Start Point',
                  required: true,  
                  labelProp: "name",
                  valueProp: "key",
                  options: []
                }
              },
              {
                key: 'connectTo',
                type: 'connectSelect',
                className: 'col-xs-7',
                defaultValue: '',
                expressionProperties: {
                  'templateOptions.disabled': '!(model.startPoint)'
                },
                templateOptions: {
                  label: 'Connect To',
                  placeholder: 'Select type',
                  required: true,  
                  labelProp: "name",
                  valueProp: "key",
                  options: []
                }
              },
            ]
          },
          {
            className: 'row step-5-p-b-p add-new-tag',
            fieldGroup: [
              {
                className: 'col-xs-2',
                type: 'addImportTrafficPolicyBtn',
                key: 'add-import-traffic-policy'
              }
            ]
          }
        ] 
      },
      subnet:{
        step1: [
          {
            key: 'nameTag',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Name tag',
              // required: true
            }
          },
          {
            key: 'selectVPC',
            type: 'VPCSelect',
            className: 'col-xs-8',
            defaultValue: '',
            templateOptions: {
              label: 'VPC',
              placeholder: 'Select VPC',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'availabilityZone',
            type: 'availabilityZoneSelect',
            className: 'col-xs-7',
            defaultValue: '',
            templateOptions: {
              label: 'Availability Zone',
              placeholder: 'Select Type',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'cidrBlock',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'IPv4 CIDR block',
              // required: true
            }
          },
        ] 
      },
      vpc:{
        step1: [
          {
            key: 'nameTag',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Name tag',
              // required: true
            }
          },
          {
            key: 'ipv4CidrBlock',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'IPv4 CIDR block',
              // required: true
            }
          },
          {
            key: 'ipv6CidrBlock',
            type: 'radio',
            className: 'col-xs-7 radio-inline-block',
            defaultValue: '',
            templateOptions: {
                label: 'IPv6 CIDR block',
                labelProp: "name",
                valueProp: "key",
                options: [
                    {name: "No IPv6 CIDR block", key: 'no'},
                    {name: "Amazon provided IPv6 CIDR block", key: 'amazon'}
                ]
            }
          },
          {
            key: 'selectTenancy',
            type: 'TenancySelect',
            className: 'col-xs-8',
            defaultValue: '',
            templateOptions: {
              label: 'Tenancy',
              placeholder: 'Select Tenancy',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          }
        ] 
      },
      provisioningNewSecurityGroup: {
        step1: [
          {
            key: 'securityGroupName',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Security Group Name',
              required: true
            }
          },
          {
            key: 'securityGroupDescription',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Description',
              required: true
            }
          },
          {
            key: 'securityGroupVpcSelect',
            type: 'selectSecurityGroupVpc',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              'templateOptions.disabled': '!model.securityGroupDescription'
            },
            templateOptions: {
              label: 'Security Group Vpc',
              placeholder: 'Select Security Group Vpc',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          }
        ],
        step2: [
         {
            key: 'inboundType',
            type: 'selectInboundType',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Type',
              placeholder: 'Select type',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'inboundProtocol',
            type: 'selectInboundType',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Type',
              placeholder: 'Select type',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'inboundPortRange',
            type: 'selectInboundType',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Type',
              placeholder: 'Select type',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'inboundSource',
            type: 'selectInboundType',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Type',
              placeholder: 'Select type',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          }
        ],
        step3: [
         {
            key: 'outboundType',
            type: 'selectOutboundType',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Type',
              placeholder: 'Select type',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'outboundProtocol',
            type: 'selectOutboundType',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Type',
              placeholder: 'Select type',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'outboundPortRange',
            type: 'selectOutboundType',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Type',
              placeholder: 'Select type',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'outboundSource',
            type: 'selectOutboundType',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Type',
              placeholder: 'Select type',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          }
        ]
      },
      provisioningGlacierNearlineStorage: {
        step1: [
          {
            key: 'pgnstorageregion',
            type: 'regionSelect',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Type',
              placeholder: 'Select Region',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'pgnstoragevaultname',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Vault Name',
              // required: true
            }
          },
        ],
        step2: [
          {
            key: 'ipv6CidrBlock',
            type: 'radio',
            className: 'col-xs-7',
            defaultValue: '',
            templateOptions: {
                label: 'IPv6 CIDR block',
                labelProp: "name",
                valueProp: "key",
                options: [
                    {name: "Do not enable notifications ", key: 'default'},
                    {name: "Enable notifications and create a new SNS topic", key: '1'},
                    {name: "Enable notifications and create a new Amazon SNS topic to send the notifications.", key: '2'},
                    {name: "Enable notifications and use an existing SNS topic", key: '3'},
                    {name: "Enable notifications and enter an existing SNS topic to send the notifications.", key: '4'},

                ]
            }
          }
        ],
        step3: [
          {
            key: 'topicName',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Topic Name',
              // required: true
            }
          },
          {
            key: 'displayName',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Display Name',
              // required: true
            }
          },
          {
            key: 'archiveretrievaljobcomplete',
            type: 'checkbox',
            templateOptions: {
                label: 'Archive Retrieval Job Complete'
            }
          },
          {
            key: 'vaultinventoryretrievaljobcomplete',
            type: 'checkbox',
            templateOptions: {
                label: 'Vault Inventory Retrieval Job Complete '
            }
          },
        ],
        step4: [
          {
            key: 'amazonSNSTopicARN',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Amazon SNS Topic ARN*',
              // required: true
            }
          },
          {
            key: 'archiveretrievaljobcomplete',
            type: 'checkbox',
            templateOptions: {
                label: 'Archive Retrieval Job Complete'
            }
          },
          {
            key: 'vaultinventoryretrievaljobcomplete',
            type: 'checkbox',
            templateOptions: {
                label: 'Vault Inventory Retrieval Job Complete '
            }
          },
        ],
        step5: [
          {
            className: 'row step-5-p-b-p final-step',
            template: ['<div class="col-xs-12 final-screen"><div class="col-xs-1"><strong>Key</strong></div>',
            '<div class="col-xs-1"><strong>Value</strong></div></div>'
            ].join(' ')
          }
        ]
      },
      provisioningObjectStorage: {
        step1: [
          {
            key: 'bucketName',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Bucket Name',
              // required: true
            }
          },
          {
            key: 'pObjectStorageregion',
            type: 'regionSelect',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Type',
              placeholder: 'Select Region',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'copySettingsfromBucket',
            type: 'checkbox',
            templateOptions: {
                label: 'Copy Settings from Existing Bucket'
            }
          },
        ],
        step2: [
          {
            key: 'posVersioning',
            type: 'radio',
            className: 'col-xs-7',
            defaultValue: '',
            templateOptions: {
                label: 'Versioning',
                labelProp: "name",
                valueProp: "key",
                options: [
                    {name: "Enable ", key: 'enable'},
                    {name: "Disable", key: 'disable'}
                ]
            }
          },
          {
            key: 'posLogging',
            type: 'radio',
            className: 'col-xs-7',
            defaultValue: '',
            templateOptions: {
                label: 'Logging',
                labelProp: "name",
                valueProp: "key",
                options: [
                    {name: "Enable ", key: 'enable'},
                    {name: "Disable", key: 'disable'}
                ]
            }
          },
          {
            type: 'addPOSTag',
            key: 'tags',
            templateOptions: {
              btnText:'Add a tag',
              fields: [
                {
                  className: 'row step-5-p-b-p table-fields',
                  fieldGroup: [
                    {
                      className: 'col-xs-5',
                      type: 'input',
                      key: 'key'
                    },
                    {
                      className: 'col-xs-5',
                      type: 'input',
                      key: 'value'
                    }
                  ]
                }
              ]
            }
          }
        ],
        step3: [
          {
            className: 'row',
            template: ['<div class="col-xs-2"><strong>Manage Users</strong></div>']
          },
          {
            template: ['<div class="col-xs-2"><strong>Objects</strong></div>']
          },
          {
            key: 'setPermissionLoggedInUser',
            type: 'checkbox',
            templateOptions: {
                label: 'Read'
            }
          },
          {
            key: 'setPermissionLoggedInUser',
            type: 'checkbox',
            templateOptions: {
                label: 'Write'
            }
          },
          {
            template: ['<div class="col-xs-2"><strong>Object Permissions</strong></div>']
          },
          {
            key: 'setPermissionLoggedInUser',
            type: 'checkbox',
            templateOptions: {
                label: 'Read'
            }
          },
          {
            key: 'setPermissionLoggedInUser',
            type: 'checkbox',
            templateOptions: {
                label: 'Write'
            }
          },
          {
            className: 'row',
            template: ['<div class="col-xs-2"><strong>Manage Public Permissions</strong></div>']
          },
          {
            template: ['<div class="col-xs-2"><strong>Objects</strong></div>']
          },
          {
            key: 'setPermissionLoggedInUser',
            type: 'checkbox',
            templateOptions: {
                label: 'Read'
            }
          },
          {
            key: 'setPermissionLoggedInUser',
            type: 'checkbox',
            templateOptions: {
                label: 'Write'
            }
          },
          {
            template: ['<div class="col-xs-2"><strong>Object Permissions</strong></div>']
          },
          {
            key: 'setPermissionLoggedInUser',
            type: 'checkbox',
            templateOptions: {
                label: 'Read'
            }
          },
          {
            key: 'setPermissionLoggedInUser',
            type: 'checkbox',
            templateOptions: {
                label: 'Write'
            }
          }

        ],
        step4: [
          {
            className: 'row step-5-p-b-p final-step',
            template: ['<div class="col-xs-12 final-screen"><div class="col-xs-1"><strong>Key</strong></div>',
            '<div class="col-xs-1"><strong>Value</strong></div></div>'
            ].join(' ')
          }
        ]
      },
      provisioningEBS: {
        step1: [
          {
            key: 'volumeButton',
            type: 'BtnPrimary',
            className: 'col-xs-2',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.subnet)'
            },
            templateOptions: {
              class: 'button-link',
              label: 'Volume',
              method: function(){
                console.log("works"); // put the link in the function
              }
            }
          },
          {
            key: 'snapshotButton',
            type: 'BtnPrimary',
            className: 'col-xs-2',
            defaultValue: '',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.subnet)'
            },
            templateOptions: {
              class: 'button-link',
              label: 'Snapshot',
              method: function(){
                console.log("works"); // put the link in the function
              }
            }
          }
        ],
        step2: [
          {
            key: 'ebsSize',
            type: 'input',
            className: 'col-xs-7',
            wrapper: 'tooltipLabel',
            expressionProperties: {
              // 'templateOptions.disabled': '!(model.tenancy)'
            },
            templateOptions: {
              tooltipLabel : { 
                label: 'Size (GiB)'
              },
              title: 'The size of the EBS volume in GiB. Note that 1 GiB = 1024^3 bytes, whereas 1 GB = 1000^3 bytes.',
              required: true,
              type: 'number',
              min: 1,
              pattern: '\\d'
            }
          },
          {
            key: 'ebsIops',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'IOPS',
              // required: true
            }
          },
          {
            key: 'ebsThroughput',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Throughput (MB/s)',
              // required: true
            }
          },
          {
            key: 'awsEBSAvailabilityZone',
            type: 'awsAvailabilityZoneSelect',
            className: 'col-xs-8',
            defaultValue: '',
            templateOptions: {
              label: 'VPC',
              placeholder: 'Select VPC',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'awsSnapshotID',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Comment',
              // required: true
            }
          },
          {
            key: 'ebsEncryption',
            type: 'checkbox',
            templateOptions: {
                label: 'Encrypt this Volume'
            }
          }
        ],
        step3: [
          {
            key: 'ebsVolumeText',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Volume',
              // required: true
            }
          },
          {
            key: 'ebsName',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Name',
              // required: true
            }
          },
          {
            key: 'ebsDescription',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Description',
              // required: true
            }
          },
          {
            key: 'ebsEncryption',
            type: 'checkbox',
            templateOptions: {
                label: 'Volume is encrypted'
            }
            // Make this non editable using ng-disabled
          }
        ]
      },
      provisioningEFS: {
        step1: [
          {
            key: 'awsVPCSelect',
            type: 'VPCSelect',
            className: 'col-xs-8',
            defaultValue: '',
            templateOptions: {
              label: 'VPC',
              placeholder: 'Select VPC',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'awsRegionAvailabilityZone',
            type: 'availabilityZoneSelect',
            className: 'col-xs-7',
            defaultValue: '',
            templateOptions: {
              label: 'Availability Zone',
              placeholder: 'Select Region',
              // required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            className: 'row table-header step-tooltip',
            //space for checkbox
            template: ['<div class="col-xs-1"></div>',
            
            '<div class="col-xs-1"><strong>Availability Zone</strong>',
            // '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            // 'title="Amazon EBS is a block-level storage volume that persists independently from the lifetime of an EC2 instance, so you can stop and restart your instance at a later time. Ephemeral instance store volumes are physically attached to the host computer. The data on an instance store persists only during the lifetime of the instance." tooltip><i class="fa fa-info"></i></span>'
            '</div>',
            
            '<div class="col-xs-1"><strong>Subnet</strong>',
            '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            'title="Select Subnet"></i></span>',
            //TODO: add a better tooltip, consult Balaji
            '</div>',

            '<div class="col-xs-1"><strong>IP Address</strong>',
            '<span class="tooltip-icon" data-toggle="tooltip" data-placement="bottom"',
            'title="A snapshot is a backup of an EC2 volume that\'s stored in S3. You can create a new volume using data stored in a snapshot by entering the snapshot\'s ID. You can search for public snapshots by typing text in the Snapshot field. Descriptions are case-sensitive" tooltip><i class="fa fa-info"></i></span>',
            '</div>'
            ].join(' ')
          },
          {
            type: 'addNewVolume',
            key: 'volume',
            templateOptions: {
              btnText:'Add new volume',
              fields: [
                {
                  className: 'row table-fields',
                  fieldGroup: [
                    {
                      key: 'awsEFScheckbox',
                      type: 'checkbox',
                      templateOptions: {
                          // label: 'Archive Retrieval Job Complete'
                      }
                    },
                    {
                      className: 'col-xs-1',
                      type: 'text',
                      key: 'awsEFSAvailabilityZone'
                    },
                    {
                      key: 'awsEFSSubnet',
                      type: 'awsSubnetSelect',
                      className: 'col-xs-2',
                      defaultValue: '',
                      templateOptions: {
                        placeholder: 'Select',
                        required: true,
                        labelProp: "name",
                        valueProp: "key",
                        options: []
                      }
                    },
                    {
                      key: 'awsIPAddress',
                      type: 'awsIPAddressSelect',
                      className: 'col-xs-2',
                      defaultValue: '',
                      templateOptions: {
                        placeholder: 'Select',
                        required: true,
                        labelProp: "name",
                        valueProp: "key",
                        options: []
                      }
                    }
                  ]
                }
              ]
            }
          }
        ],
        step2: [
          {
            className: 'row step-5-p-b-p table-header',
            template: ['<div class="col-xs-5"><strong>Key</strong>(127 characters max)</div>',
            '<div class="col-xs-5"><strong>Value</strong>(255 characters max)</div>'
            ].join(' ')
          },
          {
            className: 'row step-5-p-b-p',
            template: '<hr>',
          },
          {
            className: 'row step-5-p-b-p',
            fieldGroup: [  
              {
                type: 'addNewVolume',
                key: 'tags',
                templateOptions: {
                  btnText:'Add another tag',
                  fields: [
                    {
                      className: 'row step-5-p-b-p table-fields',
                      fieldGroup: [
                        {
                          className: 'col-xs-5',
                          type: 'input',
                          key: 'key'
                        },
                        {
                          className: 'col-xs-5',
                          type: 'input',
                          key: 'value'
                        }
                      ]
                    }
                  ]
                }
              },
              {
                className: 'col-xs-4',
                type: 'tagLabel',
                key: 'tag-limit'
              }
            ]
          },
          {
            key: 'awsEFSPerormanceMode',
            type: 'radio',
            className: 'col-xs-7 radio-inline-block',
            defaultValue: '',
            templateOptions: {
                label: 'Choose Performance Mode',
                labelProp: "name",
                valueProp: "key",
                options: [
                    {name: "General Purpose", key: 'default'},
                    {name: "Max I/O", key: 'max'}
                ]
            }
          }
        ],
        step3: [
          {
            className: 'row step-5-p-b-p final-step',
            template: ['<div class="col-xs-12 final-screen"><div class="col-xs-1"><strong>Key</strong></div>',
            '<div class="col-xs-1"><strong>Value</strong></div></div>'
            ].join(' ')
          }
        ]
      }
    },
    dnsHostedZones: {
      aws: {
        step1: [
          {
            key: 'domainName',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Domain Name',
              // required: true
            }
          },
          {
            key: 'comment',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Comment',
              // required: true
            }
          }
        ]       
      },
      azure: {
        step1: [
          {
            key: 'region',
            type: 'regionSelect',
            className: 'col-xs-7',
            defaultValue: '',
            templateOptions: {
              label: 'Region',
              placeholder: 'Select Region',
              required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'os',
            type: 'osSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              'templateOptions.disabled': '!model.region'
            },
            templateOptions: {
              label: 'OS',
              placeholder: 'Select OS',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          },
          {
            key: 'image',
            type: 'imageSelect',
            className: 'col-xs-7',
            defaultValue: '',
            expressionProperties: {
              'templateOptions.disabled': '!(model.os && model.region)'
            },
            templateOptions: {
              label: 'Image',
              placeholder: 'Select Image!',
              required: true,
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          }
        ],
        step2: [
          {
            key: 'firstName',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'First Name',
              required: true
            }
          },
          {
            key: 'lastName',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Last Name',
              required: true
            }
          }
        ],
        step3: [
          {
            key: 'college',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'College',
              required: true
            }
          },
          {
            key: 'class',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Class',
              required: true
            }
          }
        ]
      },
      test:{
        step1: [
          {
            key: 'domainName',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Domain Name',
              // required: true
            }
          },
          {
            key: 'comment',
            type: 'input',
            className: 'col-xs-7',
            templateOptions: {
              label: 'Comment',
              // required: true
            }
          },
          {
            key: 'type',
            type: 'dnsHostedZonesType',
            className: 'col-xs-7',
            defaultValue: '',
            templateOptions: {
              label: 'Type',
              placeholder: 'Select Type',
              required: true, 
              labelProp: "name",
              valueProp: "key",
              options: []
            }
          }
        ] 
      }
    }
  };

  $scope.formDefaults = {
    virtualMachine: {
      aws: {
        resourceType: 'EC2',
        volume: [
          {
            volume_type: "Root",
            device: "/dev/sda1",
            snapshot: "snap-77fcc4f2",
            volumeSize: "10",
            volumeType: "volume1",
            iops: "10/3000",
            throughput: "N/A",
            deleteOnTermination: true,
            termination: "yes",
            encrypted: "yes"
          }
        ],
      	autoAssignPublicIP: "default",
      	disableApiTermination: "yes",
      	monitoring: true,
      	tenancy: "shared",
        networkInterfaces: [
          {  
            deviceIndex: 0,
            subnetId: "subnet-ce47dc95",
            groups: []
          }
        ]
      }
    }
  }

  $rootScope.showCardViewButton = false;
  $rootScope.showListViewButton = false;
  $scope.master = $state.params.serviceName;

  $scope.customerName = $state.params.customerName;
  $scope.serviceSingular = $scope.serviceName = $state.params.serviceName;
  $scope.resourceName = $state.params.resourceName;

  $scope.serviceInit = function () {
    $scope.model = {};
    $scope.model = $scope.formDefaults[$scope.resourceName][$scope.cspSelectedName];
    $scope.model.customerName = $scope.customerName;
    $scope.projects = [];
    $scope.accounts = [];
  }

  $scope.init = function () {
    $scope.serviceData = CompleteUserData.CompleteUserData;
    $scope.language = Language.language;
    $scope.sidebar = Sidebar.sidebar;
    $scope.keyMapper = KeyMapper.keyMapper;

    $scope.selectedTabJson = $scope.pagesJson[$scope.resourceName][0];
    $scope.tabSelected = $scope.pagesJson[$scope.resourceName][0]['tabSlug'];
  }
  $scope.init();

  $scope.getSingular = function(keyword) {
    if (keyword.slice(-1) == 's') {
      keyword = keyword.slice(0, -1);
    }
    return keyword;
  }

  $scope.sidebar.$promise.then(function(response) {
    var customer = $filter('objectFromArray')(response, 'name', $scope.customerName);
    $scope.customerSideBar = customer;
  })

  $scope.translate = function(keyword) {
    keyword = $scope.getSingular(keyword);
    return $scope.language[keyword] || keyword;
  }

  $scope.setProvisioningType = function(type) {
    $scope.provisioningTypeSelected = type;
  }

  $scope.setCsp = function(csp, cspName) {
    $scope.cspSelected = csp;
    $scope.cspSelectedName = cspName;
    $scope.serviceInit();
  }

  $scope.exitValidation = function(forms, nextStep) {
    if (forms && !forms.$invalid) {
      return true;
    }
  };

  $scope.isTabActive = function(tabSlug) {
    if (tabSlug == $scope.tabSelected) {
      return 'bold';
    }
    return 'none';
  }

  $scope.finishWizard = function(forms) {
    if (forms.$valid) {
      $scope.model.nativeCsp = $scope.cspSelectedName; console.log($scope.model);
      // Object.keys($scope.model).forEach(function(key) {
      //   if (typeof $scope.model[key] == 'object') {
      //     $scope.model[key] = angular.toJson($scope.model[key]);
      //   }
      // })
      // $scope.model['volume'] = angular.toJson($scope.model['volume']);
      // $scope.model['security'] = angular.toJson($scope.model['security']);
      var req = angular.copy(angular.toJson($scope.model));
      console.log(req);
      ProvisionService.createVirtualMachine({reqData: req}).$promise.then(function(response) {
        alert(response);
      }, function(error) {
        console.log(error);
      })
    } else {
      alert('Please fill all fields');
    }
  }

  $scope.cancel = function() {
    $scope.model = {};
    $scope.cspSelected = false;
    $scope.cspSelectedName = '';
    $scope.provisioningTypeSelected = false;
  }

})
