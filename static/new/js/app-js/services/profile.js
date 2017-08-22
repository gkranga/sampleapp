angular.module('swire').factory('Profile', function($resource) {
	return $resource('/newdashboard/profile', {}, {
        save: {method: 'POST', url: '/api/updateUser'},
        refresh: {method: 'GET', url: '/dashboard/refresh'}
    });
})