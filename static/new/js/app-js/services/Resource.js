angular.module('swire').factory('Resource', function($resource) {
	return $resource('/resource', {}, {
        // virtualMachine: {method: 'GET', url: 'resource/virtualMachine/:resourceName'},
        serviceDataItems: {method: 'GET', url: '/resource/resourceData', isArray: true},
        formaterJson: {method: 'GET', url: '/resource/formaterJson'},
        cancel: {method: 'POST', url: '/request/cancel'},
        comment: {method: 'POST', url: '/request/comment'},
        approve: {method: 'POST', url: '/request/approve'},
        reject: {method: 'POST', url: '/request/reject'}
    });
})

angular.module('swire').factory('ResourceValue', function($resource) {
	return $resource('/resource', {}, {
        virtualMachine: {method: 'GET', url: 'resource/virtualMachine/:resourceName'},
        getResourceTaggedProject: {method: 'GET', url: '/resource/get-resource-tagged-project'},
        getUnTaggedProjects: {method: 'GET', url: '/resource/get-untagged-projects'},
        tagResourceToProject: {method: 'POST', url: '/resource/tag-resource-to-project'},
        unTagResourceToProject: {method: 'POST', url: '/resource/untag-resource-to-project'}
     });
})

angular.module('swire').factory('CompleteResourceData', function($resource) {
	var resource = $resource('/newdashboard/resourceData');
	var message = {};

	message.CompletResourceData = resource.get();

	message.refresh = function() {
		message.CompletResourceData = resource.get();
	}

	return message;
})
