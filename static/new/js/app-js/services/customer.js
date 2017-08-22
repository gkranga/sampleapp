angular.module('swire').factory('Customer', function($resource) {
	return $resource('/api/customer/:customerName', {customerName: '@customerName'}, {
		query:  {method:'GET', isArray:false}
	});
})