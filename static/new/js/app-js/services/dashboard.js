angular.module('swire').factory('CompleteUserData', function($resource) {
	var resource = $resource('/newdashboard/dashboardData');
	var message = {};

	message.CompleteUserData = resource.get();

	message.refresh = function() {
		message.CompleteUserData = resource.get();
	}

	return message;
})

angular.module('swire').factory('CompletResourceData', function($resource) {
	var resource = $resource('/newdashboard/resourceData');
	var message = {};

	message.CompletResourceData = resource.get();

	message.refresh = function() {
		message.CompletResourceData = resource.get();
	}

	return message;
})

angular.module('swire').factory('CompletResourceData', function($resource) {
	return $resource('/CompletResourceData', {}, {
        CompletResourceData: {method: 'GET', url: '/newdashboard/resourceData'}
    });
})
angular.module('swire').factory('Language', function($resource) {
	var resource = $resource('/newdashboard/language');
	var message = {};

	message.language = resource.get();

	message.refresh = function() {
		message.language = resource.get();
	}

	return message;
})

angular.module('swire').factory('SingleServiceData', function($resource) {
	var resource = $resource('/getService');
	var message = {};
	message.getServiceDetails = function (serviceName, service) {
		return resource.get({serviceName: serviceName, service: service})
	}
	return message;
})

angular.module('swire').factory('Sidebar', function($resource) {
	var resource = $resource('/newdashboard/sidebar');
	var message = {};

	message.sidebar = resource.query();

	message.refresh = function() {
		message.sidebar = resource.query();
	}

	return message;
})

angular.module('swire').factory('KeyMapper', function($resource) {
	var resource = $resource('/newdashboard/serviceKeyMapper');
	var message = {};

	message.keyMapper = resource.get();

	message.refresh = function() {
		message.keyMapper = resource.get();
	}

	return message;
})

angular.module('swire').factory('TagFormat', function($resource) {
	var resource = $resource('/newdashboard/tagFormat');
	var message = {};

	message.tagFormat = resource.get();

	message.refresh = function() {
		message.tagFormat = resource.get();
	}

	return message;
})

angular.module('swire').factory('Select',function($resource){
    return $resource('/api/select/:customerName/:service', {customerName: '@customerName', service: '@service'}, {
    	regionQuery: {method: 'GET', params:{csps: '@csp'}}
    });
})

angular.module('swire').factory('Create',function($resource){
    return $resource('/api/:createService', {createService: '@createService'});
})