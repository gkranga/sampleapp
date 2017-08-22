'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var Q = require('q');
var apiService = require('../services/ApiService');
var requestApiService = require('../services/RequestApiService');
var resourceApiService = require('../services/resourceApiService');
var userService = require('../services/UserService');
var helperService = require('../services/HelperService');
var natsClient = require('../services/NatsClient');
var formService = require('../services/FormCRUDService');
var config = require('config');
var fs = require('fs');


var mailer = require("nodemailer");
// Server connection
var nats = require('nats');

// Globals
// var servers = ['nats://ec2-54-254-224-248.ap-southeast-1.compute.amazonaws.com:4222'];
var servers = config.get('nats');
var router = express.Router();

// Middlewares
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.get('/virtualMachine/:resourceName', function(req, res) {
   var value = req.params.resourceName;
   console.log(value);
   var obj =[];
   obj["virtualMachine"] = {"virtualMachine":{"table":{"instanceId": "Instance Id","projectName": "Project Name","csp": "CSP","region": "Region","flavorName":"Flavor","cpu": "CPU","memory": "Memory","price": "Price","unbilledAmount": "Unbilled Amount","state": "State"},"tab":[{"tabName": "Details","isTable":false,"tabData": [{"name": "","columns": {"buName": "BU Name","accountName": "Account Name","timeStamp": "Created Time", "publicDns": "Public DNS","privateDns": "Private DNS","monitoring": "Monitoring","architecture": "Architecture","operatingSystem": "OS","availabilitySet": "Availability Zone","computerName": "Computer Name"}}]},{"tabName": "Tags","isTable":true,"tabData": [{"name": "","columns": {"key": "Key","value": "Value"}}]},{"tabName": "Storage","isTable":true,"tabData": [{"name": "OS Disks","columns": {"diskName": "Disk Name","diskCapacity": "Disk Capacity"}},{"name": "Data Disks","columns": {"diskName": "Disk Name","diskCapacity": "Disk Capacity"}}]},{"tabName": "Security Policy","isTable":true,"tabData": [{"name": "inBound","columns": {"source": "Source","portRange": "Port Range","protocol": "Protocol"}},{"name": "outBound","columns": {"destination": "Destination","portRange": "Port Range","protocol": "Protocol"}},{"name": "defaultInBound","columns": {"source": "Source","portRange": "Port Range","protocol": "Protocol"}},{"name": "defaultOutBound","columns": {"destination": "Destination","portRange": "Port Range","protocol": "Protocol"}}]}],'other':{'uniqueKey':'instanceId',"actions":{"delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["image"]= {"image":{ "table":{ "imageId": "Policy Id", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "imageName":"Image Name","state":"State","isPublic":"Is Public ?", "architecture":"Architecture", "imageType":"Image Type" }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name", "description":"Description", "imageOwnerId":"Image Owner Id","hypervisor":"Hypervisor","rootDeviceType":"Root Device Type" } }] }, {"tabName": "Block Device Mapping", "isTable":true,"tabData": [ { "name": "", "columns": { "deviceName": "Device Name", "snapshotId": "Snapshot Id", "volumeSize": "Volume Size", "volumeType": "Volume Type", "deleteOnTermination": "Delete On Termination", } }] } ],'other':{'uniqueKey':'imageId',"actions":{"delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["blockStorageVolume"] = {"blockStorageVolume":{"table":{"volumeId": "Volume Id","projectName": "Project Name","csp": "CSP","region": "Region","price": "Price","unbilledAmount": "Unbilled Amount","volumeType":"Volume Type","size":"Size (Bytes)","state": "State"},"tab":[{"tabName": "Details","isTable":false,"tabData": [{"name": "","columns": {"buName": "BU Name","accountName": "Account Name","createdTime": "Created Time","snapshotId": "Snapshot Id","availabilityZone": "Availability Zone"}}]},{"tabName": "Attached VMs","isTable":true,"tabData": [{"name": "","columns": {"instanceId": {"type": "link", "service": "virtualMachines", "name": "Instance Id"},"attachTime": "Attach Time","state": "State","deleteOnTermination": "Delete On Termination ?","mountPoint":"Mount Point"}}]}],"other": {"uniqueKey": "volumeId","actions": {  "delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["fileStorage"]= {"fileStorage":{ "table":{ "fileSystemId": "File System Id", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "fileSystemName":"File System Name", "sizeInBytes":"Size In Bytes", "lifeCycleState":"Life Cycle State", "performanceMode":"Performance Mode", "numberOfMountTargets":"Number Of Mount Targets" }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name",  "createdTime": "Created Time", "ownerId":"Owner Id"} }] } ],"other": {"uniqueKey": "fileSystemId","actions": {  "delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["objectStorage"]= {"objectStorage":{ "table":{ "bucketName": "Bucket Name", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "isTruncated": "Is Truncated ?" }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name", "createdBy": "Created By" } }] }, {"tabName": "Objects", "isTable":true,"tabData": [ { "name": "", "columns": { "objectName": "Object Name", "ownerId": "Owner Id", "displayName": "Display Name", "lastModified": "Last Modified", "size": "Size", "storageClass": "Storage Class" } }] } ],'other':{'uniqueKey':'bucketName',"actions":{"delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["nearlineStorage"]= {"nearlineStorage":{ "table":{ "vaultName": "Vault Name", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "vaultARN":"Vault ARN", "sizeInBytes":"Size In Bytes", "numberOfArchives":"Number Of Archives", "lastInventoryDate":"Last Inventory Date" }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name",  "creationDate": "Created Time" } }] } ],'other':{'uniqueKey':'vaultName',"actions":{"delete": "Delete","start": "Start","stop": "Stop"}}}}; 
   obj["vpc"]= { "vpc":{ "table":{ "vpcId": "VPC Id", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "cidrBlock": "CIDR Block", "state": "State"}, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name", "dhcpOptionsId": "DHCP Options Id", "instanceTenancy": "Instance Tenancy", "isDefault": "Is Default ?" } }] }, {"tabName": "Tags", "isTable":true,"tabData": [ { "name": "", "columns": { "key": "Key", "value": "Value" } }] } ],'other':{'uniqueKey':'vpcId',"actions":{"delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["vpn"]={ "vpn":{ "table":{ "vpnConnectionId": "VPN Connection Id", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "type": "Type", "state": "State", "customerGatewayId": "customerGatewayId", "vpnGatewayId": {"type": "link", "service": "vpnGateways", "serviceName": "networkServices" ,"resourceName": "vpnGateway", "name": "VPN Gateway Id"}, }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name", "createdBy": "Created By" } }] } ],'other':{'uniqueKey':'vpnConnectionId',"actions":{"delete": "Delete","start": "Start","stop": "Stop"}}}}
   obj["vpnGateway"]={ "vpnGateway":{ "table":{ "vpnGatewayId": "VPN Gateway Id", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "state": "State", "type": "Type", "availabilityZone": "Availability Zone" }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name", "createdBy": "Created By" } }] }, {"tabName": "Attachments", "isTable":true,"tabData": [ { "name": "", "columns": { "vpcId": {"type": "link", "service": "vpc", "name": "VPC Id"}, "state": "State" } }] } ],'other':{'uniqueKey':'vpnGatewayId',"actions":{"delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["customerGateway"]= {"customerGateway":{"table":{"customerGatewayId": "Customer Gateway Id","projectName": "Project Name","csp": "CSP","region": "Region","price": "Price","unbilledAmount":"Unbilled Amount","ipAddress":"IP Address","type":"Type","state": "State","bgpAsn": "Bgp Asn"},"tab":[{"tabName": "Details","isTable":false,"tabData": [{"name": "","columns": {"buName": "BU Name","accountName": "Account Name","createdBy": "Created By"}}]}],"other": {"uniqueKey": "customerGatewayId","actions": {   "delete": "Delete","start": "Start","stop": "Stop"}}}};   
   obj["natRule"]= {"natRule":{ "table":{ "natGatewayId": "NAT Gateway Id", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "state":"State", "vpcId": {"type": "link", "service": "vpc", "name": "VPC Id", "serviceName": "networkServices" ,"resourceName": "vpc"}, "subnetId":{"type": "link", "service": "subnet", "name": "Subnet Id", "serviceName": "networkServices" ,"resourceName": "subnet"} }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name",  "createdTime": "Created Time" } }] }, {"tabName": "Block Device Mapping", "isTable":true,"tabData": [ { "name": "", "columns": { "networkInterfaceId": "Device Name", "publicIp": {"type": "link", "service": "publicIps", "name": "Public IP"}, "privateIp": {"type": "link", "service": "privateIps", "name": "Private IP"}, "allocationId": "Allocation Id" } }] } ],'other':{'uniqueKey':'natGatewayId',"actions":{"delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["subnet"]= {"subnet":{ "table":{ "subnetId": "Subnet Id", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "state": "State", "vpcId": {"type": "link", "service": "vpc", "name": "VPC Id", "serviceName": "networkServices" ,"resourceName": "vpc"}, "cidrBlock": "CIDR Block" }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name", "createdBy": "Created By" , "availabilityZone": "Availability Zone"} }] } ],'other':{'uniqueKey':'subnetId',"actions":{"delete": "Delete","start": "Start","stop": "Stop"}}}}
   obj["dnsDomainRegistration"]= {"dnsDomainRegistration":{ "table":{ "domainName": "Domain Name", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "nameservers":"Name Servers", "autoRenew":"Auto Renew", "techPrivacy": "Tech Privacy", "updatedDate": "Updated Date", "whoIsServer": "Who Is Server" }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name",  "createdDate": "Created Date", "expirationDate": "Expiration Date" , "abuseContactEmail": "Abuse Contact Email", "abuseContactPhone": "Abuse Contact Phone"} }] }, {"tabName": "Admin Contact", "isTable":true,"tabData": [ { "name": "", "columns": { "firstName": "First Name", "lastName": "Last Name", "contactType": "Contact Type", "addressLine1": "Address Line1", "addressLine2": "Address Line2", "city": "City", "state":"State", "country": "Country", "zipCode": "Zip Code", "phoneNumber": "Phone Number", "email":"Email", "fax":"Fax" } }] }, {"tabName": "Registrant Contact", "isTable":true,"tabData": [ { "name": "", "columns": { "firstName": "First Name", "lastName": "Last Name", "contactType": "Contact Type", "addressLine1": "Address Line1", "addressLine2": "Address Line2", "city": "City", "state":"State", "country": "Country", "zipCode": "Zip Code", "phoneNumber": "Phone Number", "email":"Email", "fax":"Fax" } }] }, {"tabName": "Tech Contact", "isTable":true,"tabData": [ { "name": "", "columns": { "firstName": "First Name", "lastName": "Last Name", "contactType": "Contact Type", "addressLine1": "Address Line1", "addressLine2": "Address Line2", "city": "City", "state":"State", "country": "Country", "zipCode": "Zip Code", "phoneNumber": "Phone Number", "email":"Email", "fax":"Fax" } }] } ],"other": {"uniqueKey": "domainName","actions": { "delete": "Delete","start": "Start","stop": "Stop"}}}}
   obj["dnsHealthCheck"]= {"dnsHealthCheck":{ "table":{ "hcId": "HC Id", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount" }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name",  "description":"Description" } }] }, {"tabName": "Config", "isTable":true,"tabData": [ { "name": "", "columns": { "endPointIP": "End Point IP", "endPointPort": "End Point Port", "endPointType": "End Point Type", "resourcePath": "Resource Path", "fqdn": "FQDN", "searchString": "Search String", "requestInterval":"Request Interval", "failureThreshold": "Failure Threshold", "measureLatency": "Measure Latency", "regions": "Regions" } }] } ],"other": {"uniqueKey": "hcId","actions": { "delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["dnsHostedZone"]= {"dnsHostedZone":{ "table":{ "zoneId": "Zone Id", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "privateZone":"Private - True/False?", "dnsDomainName":"DNS Domain Name", "resourceRecordSetCount":"Resource Record Set Count", "vpcRegion":"VPC Region", "vpcId": {"type": "link", "service": "vpc", "name": "VPC Id"} }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name",  "nameServers":"Name Servers", "comments":"Comments" } }] }, {"tabName": "Record Sets", "isTable":true,"tabData": [ { "name": "", "columns": { "dnsDomainName": "DNS Domain Name", "dnsRecordType": "DNS Record Type", "ttl": "TTL - time to live in seconds", "resourceRecordValue": "Resource Record Value", "hcId": {"type": "link", "service": "healthChecks", "name": "HC Id"}, } }] } ],"other": {"uniqueKey": "zoneId","actions": {  "delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["dnsTrafficPolicy"]= { "dnsTrafficPolicy":{ "table":{ "policyId": "Policy Id", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "policyType":"Policy Type", "dnsHostedZoneName":"DNS Hosted Zone Name" }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name",  } }] } ],"other": {"uniqueKey": "policyId","actions": { "delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["networkLoadBalancer"]={"networkLoadBalancer":{ "table":{ "lbName": "LB Name", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "vpcId": {"type": "link", "service": "vpc", "name": "VPC Id", "serviceName": "networkServices" ,"resourceName": "vpc"}, "dnsName": "DNS Name" }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name",  "createdTime": "Created Time" , "availabilityZones": "Availability Zones", "subnets": "Subnets"} }] }, {"tabName": "Listeners", "isTable":true,"tabData": [ { "name": "", "columns": { "instanceProtocol": "Instance Protocol", "instancePort": "Instance Port", "lbProtocol": "LB Protocol", "lbPort": "LB Port" } }] }, {"tabName": "Health Check", "isTable":true,"tabData": [ { "name": "", "columns": { "healthyThreshold": "Healthy Threshold", "unhealthyThreshold": "Unhealthy Threshold", "timeout": "Timeout", "interval": "Interval", "target": "Target" } }] }, {"tabName": "Instance Health Status", "isTable":true,"tabData": [ { "name": "", "columns": { "instanceId": {"type": "link", "service": "virtualMachines", "name": "Instance Id"}, "description": "Description", "state": "State" } }] } ],'other':{'uniqueKey':'lbName',"actions":{"delete": "Delete","start": "Start","stop": "Stop"}}}};   
   obj["applicationLoadBalancer"]= {"applicationLoadBalancer":{ "table":{ "lbName": "LB Name", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "vpcId": {"type": "link", "service": "vpc", "name": "VPC Id" , "serviceName": "networkServices" ,"resourceName": "vpc"}, "dnsName": "DNS Name"}, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name",  "createdTime": "Created Time" , "availabilityZones": "Availability Zones", "subnets": "Subnets" } }] }, {"tabName": "Listeners", "isTable":true,"tabData": [ { "name": "", "columns": { "instanceProtocol": "Instance Protocol", "instancePort": "Instance Port", "lbProtocol": "LB Protocol", "lbPort": "LB Port" } }] }, {"tabName": "Health Check", "isTable":true,"tabData": [ { "name": "", "columns": { "healthyThreshold": "Healthy Threshold", "unhealthyThreshold": "Unhealthy Threshold", "timeout": "Timeout", "interval": "Interval", "target": "Target" } }] }, {"tabName": "Instance Health Status", "isTable":true,"tabData": [ { "name": "", "columns": { "instanceId": {"type": "link", "service": "virtualMachines", "name": "Instance Id"}, "description": "Description", "state": "State" } }] } ],'other':{'uniqueKey':'lbId',"actions":{"delete": "Delete","start": "Start","stop": "Stop"}}}};;
   obj["privateIp"]= {"privateIp":{ "table":{ "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "flavorName": "Flavor", "state": "State", "privateIpAddress": "Private Ip Address", "privateDns": "Private DNS" }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name",  "createdTime": "Created Time" , "instanceId": {"type": "link", "service": "virtualMachines", "name": "Instance Id"},} }] }, {"tabName": "Tags", "isTable":true,"tabData": [ { "name": "", "columns": { "key": "Key", "value": "Value" } }] } ],'other':{'uniqueKey':'instanceId',"actions":{"delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["publicIp"]= {"publicIp":{ "table":{ "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "flavorName": "Flavor", "state": "State", "publicIpAddress": "Public IP Address", "publicDns": "Public DNS" }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name",  "createdTime": "Created Time", "instanceId": {"type": "link", "service": "virtualMachines", "name": "Instance Id"}, } }] }, {"tabName": "Tags", "isTable":true,"tabData": [ { "name": "", "columns": { "key": "Key", "value": "Value" } }] } ],'other':{'uniqueKey':'instanceId',"actions":{"delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["dnsDelegationSet"]= {"dnsDelegationSet":{ "table":{ "delegationSetId": "Delegation Set Id", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "nameServers":"Name Servers", "callerReference":"Caller Reference" }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name",  } }] } ],"other": {"uniqueKey": "delegationSet","actions": {   "delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["securityGroup"]= {"securityGroup":{ "table":{ "securityGroupName": "Security Group Name", "projectName": "Project Name", "csp": "CSP", "region": "Region", "price": "Price", "unbilledAmount": "Unbilled Amount", "securityGroupId": "Security Group Id", "ownerId": "Owner Id", "vpcId": {"type": "link", "service": "vpc", "name": "VPC Id"  , "serviceName": "networkServices" ,"resourceName": "vpc"} }, "tab":[ {"tabName": "Details","isTable":false,"tabData": [ { "name": "", "columns": { "buName": "BU Name", "accountName": "Account Name", "groupDescription": "Group Description"} }] }, {"tabName": "IP Permissions", "isTable":true,"tabData": [ { "name": "", "columns": { "ipProtocol": "IP Protocol", "fromPort": "From Port", "toPort": "To Port", "userId": "User Id", "groupId": "Group Id" } }] }, {"tabName": "Security Policy", "isTable":true,"tabData": [ { "name": "inBound", "columns": { "source": "Source", "portRange": "Port Range", "protocol": "Protocol"}}, { "name": "outBound", "columns": { "destination": "Destination", "portRange": "Port Range", "protocol": "Protocol"}} ]} ],'other':{'uniqueKey':'securityGroupId',"actions":{"delete": "Delete","start": "Start","stop": "Stop"}}}};
   obj["budget"] = {"budget":{"table":{"budgetName":"Budget Name","value": "Budget Value","type": "Type","financialYear": "Financial Year:","isActive": "is Active ?","period":"Budget Period"},"tab":[{"tabName": "Details","isTable":false,"tabData": [{"name": "","columns": {"start":"Start Date","end":"End Date"}}]},{"tabName": "BU","isTable":true,"tabData": [{"name": "","columns": {"buName": "BU Name","buDescription": "BU Description","isActive": "Is Active ?","buBudget":"Budget"}}]},{"tabName": "Project","isTable":true,"tabData": [{"name": "","columns": {"projectName": "Project Name","buName": "BU Name","projectDescription": "Project Description","projectStartdate": "Start Date","projectEnddate": "End Date","isActive": "Is Active ?","projectBudget": "Budget"}}]}]}};
   res.json(obj[value]);
})


router.get('/formaterJson', function(req, res) {
   var path = __dirname +'/../static/jsons/formatter.json';
    res.send(fs.readFileSync(path, 'utf8'));
})

router.post('/untag-resource-to-project', function(req, res) {
  let customerName = req.body.customerName;
  let projectName = req.body.project;
  let resourceName = req.body.resourceName;
  let instanceId = req.body.instanceId;
  let result = resourceApiService.unTagProjectToResource(resourceName, customerName, projectName, instanceId);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})


router.post('/tag-resource-to-project', function(req, res) {
  let customerName = req.body.customerName;
  let projectName = req.body.project;
  let resourceName = req.body.resourceName;
  let instanceId = req.body.instanceId;
  let result = resourceApiService.tagResourceToProject(resourceName, customerName, projectName, instanceId);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

// 
router.get('/get-untagged-projects', function(req, res) {
    var customerName = req.query.customerName;
    var user = JSON.parse(req.session.user);
    var resourceName = req.query.resourceName;
    var instanceId = req.query.instanceId;
    var result = resourceApiService.getUnTaggedProjects(customerName ,user.statusMessage.uid,resourceName, instanceId);
    result.then(function(response) {
        try {
            response = JSON.parse(response);
        } catch (e) {
            console.error('Invalid json: '+response+ ' \n Error: '+e);
        }
        if (response.status === "success") {
            res.json(response);
            res.end();
        } else {
            res.json({status: "fail", statusMessage: response.statusMessage});
            res.end();
        }
    })
});

router.get('/get-resource-tagged-project', function(req, res) {
    var resourceName = req.query.resourceName;
    var customerName = req.query.customerName;
    var resourceKey = req.query.resourceKey;
    var resourceValue = req.query.instanceId;
    var result = resourceApiService.getResourceTaggedProject(resourceName,customerName,resourceKey,resourceValue);
    result.then(function(response) {
        try {
            // console.log(response);
            response = JSON.parse(response);
            // console.log(response);
        } catch (e) {
            console.error('Invalid json: '+response+ ' \n Error: '+e);
        }
        if (response.status === "success") {
            res.json(response);
            res.end();
        } else {
            res.json({status: "fail", statusMessage: response.statusMessage});
            res.end();
        }
    })
});

router.get('/resourceData/:resourceName', function(req, res) {
   var resourceName = req.params.resourceName;
   var proceedToRender = Q.defer();
   var resource =  resourceApiService.listResources(resourceName);
    resource.then(function(response) {
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })

})

router.get('/resourceData/:resourceName/:filter', function(req, res) { 
   var resourceName = req.params.resourceName;
   var filter = req.params.filter;
   var proceedToRender = Q.defer();
   var resource =  resourceApiService.searchResources(resourceName,filter);
    resource.then(function(response) {
    try {
          // console.log('Nats response: ' + response);
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalids json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })

})

router.get('/resourceSortData/:resourceName/:sortField/:sortType', function(req, res) { 
   var resourceName = req.params.resourceName;
   var sortField = req.params.sortField;
   var sortType = req.params.sortType;
   var proceedToRender = Q.defer();
   var resource =  resourceApiService.sortResources(resourceName,sortField,sortType);
    resource.then(function(response) {
    try {
          console.log('Nats response: ' + response);
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalids json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })

})



router.get('/requestApiService', function(req, res) { 
	var response  = helperService.listRequests();
	res.json(response);
	res.end();
})


router.get('/list-delegates', function(req, res) { 
	 var proceedToRender = Q.defer();
   var resource =  resourceApiService.listDnsDelegates();
    resource.then(function(response) {
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.get('/dns-hosted-zone', function(req, res) { 
  
     var proceedToRender = Q.defer();
   var resource =  resourceApiService.DNSHostedZone();
    resource.then(function(response) {
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

module.exports = router;