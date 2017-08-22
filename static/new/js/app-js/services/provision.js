angular.module('swire').factory('ProvisionService', function($resource) {
	return $resource('/provision', {}, {
        getRegions: {method: 'GET', url: '/provision/getRegions'},
        getOs: {method: 'GET', url: '/provision/getOs'},
        getImages: {method: 'GET', url: '/provision/getImages'},
        getInstances: {method: 'GET', url: '/provision/getInstanceType'},
        getNetworks: {method: 'GET', url: '/provision/getNetworks'},
        getSubnets: {method: 'GET', url: '/provision/getSubnets'},
        getSecurityGroups: {method: 'GET', url: '/provision/getSecurityGroups'},
        createVirtualMachine: {method: 'POST', url: '/provision/virtualMachine/create'}
     });
})