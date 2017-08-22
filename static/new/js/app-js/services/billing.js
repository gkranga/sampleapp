angular.module('swire').factory('billingServices', function($resource) {
    return $resource('/billingServices', {}, {
        getbilling: {method: 'GET', url: '/budget/billing'},
        getbillingFilter: {method: 'GET', url: '/budget/list/filter/billing'},
    });
})
