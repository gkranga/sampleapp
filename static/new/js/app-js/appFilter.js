angular.module('swire').filter('capitalize', function() {
	return function(input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1) : '';
	}
}).filter('objectFromArray', function() {
	return function(array, keyName, keyValue) {
		var result = {};
		if (array) {
			array.forEach(function(object) {
				if (object[keyName] == keyValue) {
					result = object;
				}
			})
		}
		return result;
	}
})

angular.module('swire').directive("datepicker", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                // call $apply to bring stuff to angular model
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };

            var options = {
                dateFormat: "yy-mm-dd",
                // handle jquery date change
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };

            // jqueryfy the element
            elem.datepicker(options);
        }
    }
});


// Bootstrap Tooltip Init

angular.module('swire').directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip({html: 'true', container: 'body'});
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

angular.module('swire').filter('keys', function() {
    return function(input) {
        if (!input) {
            return [];
        }
        return Object.keys(input);
    }
});
