angular.module('swire').factory('budgetListServices', function($resource) {
    var resource = $resource('/budget/list');
    var message = {};

    message.CompletResourceData = resource.get();

    message.refresh = function() {
        message.CompletResourceData = resource.get();
    }

    return message;
})

angular.module('swire').factory('billingListServices', function($resource) {
    var resource = $resource('/budget/billing');
    var message = {};

    message.CompletResourceData = resource.get();

    message.refresh = function() {
        message.CompletResourceData = resource.get();
    }

    return message;
})