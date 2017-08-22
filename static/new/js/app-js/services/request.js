angular.module('swire').factory('Request', function($resource) {
	return $resource('/request', {}, {
        myRequests: {method: 'GET', url: '/request/list'},
        approvalList: {method: 'GET', url: '/request/approval/list'},
        count: {method: 'GET', url: '/request/approval/count'},
        cancel: {method: 'POST', url: '/request/cancel'},
        comment: {method: 'POST', url: '/request/comment'},
        approve: {method: 'POST', url: '/request/approve'},
        reject: {method: 'POST', url: '/request/reject'}
    });
})