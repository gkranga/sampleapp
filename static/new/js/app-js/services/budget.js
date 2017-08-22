angular.module('swire').factory('budgetServices', function($resource) {
    return $resource('/budgetServices', {}, {
        create: {method: 'POST', url: '/budget/create'},
        update: {method: 'POST', url: '/budget/update'},
        getBudgetBU: {method: 'GET', url: '/budget/getBudgetBU'},
        getBUBudgets: {method: 'GET', url: '/budget/getBUBudgets'},
        getBudgetProject: {method: 'GET', url: '/budget/getBudgetProject'},
        update: {method: 'POST', url: '/budget/update'},
        // getFilteredBudgets:{method: 'GET', url: '/budget/getBudgetProject'},
        getUntaggedBudgetBu: {method: 'GET', url: '/budget/getUntaggedBudgetBu'},
		getUntaggedBudgetProject: {method: 'GET', url: '/budget/getUntaggedBudgetProject'},
		tagBudgetBu: {method: 'GET', url: '/budget/tagBudgetBu'},
		tagBudgetProject: {method: 'GET', url: '/budget/tagBudgetProject'},
		unTagBudgetBu: {method: 'GET', url: '/budget/unTagBudgetBu'},
		unTagBudgetProject: {method: 'GET', url: '/budget/unTagBudgetProject'}
    });
})
