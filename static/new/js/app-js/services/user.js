angular.module('swire').factory('User', function($resource) {
	return $resource('/api', {}, {
        isUserLocal: {method: 'POST', url: '/api/verify-user-local'},
        userSearch: {method: 'GET', url: '/newdashboard/ldap-user-search'},
        localSave: {method: 'POST', url: '/api/createUser'},
        tagCa: {method: 'POST', url: '/api/tagCa'},
        tagAaRole: {method: 'POST', url: '/api/tagAaRole'},
        tagFaRole: {method: 'POST', url: '/api/tagFaRole'},
        tagAa: {method: 'POST', url: '/api/tagAa'},
        tagAcAdminAndAccount: {method: 'POST', url: '/api/tagAcAdminAndAccount'},
        tagBua: {method: 'POST', url: '/api/tagBu'},
        tagPa: {method: 'POST', url: '/api/tagProjectAdmin'},
        tagPu: {method: 'POST', url: '/api/tagProjectUser'},
        untagCa: {method: 'POST', url: '/api/untagCa'},
        untagAaRole: {method: 'POST', url: '/api/untagAaRole'},
        untagFaRole: {method: 'POST', url: '/api/untagFaRole'},
        untagAa: {method: 'POST', url: '/api/untagAa'},
        untagAcAdminAndAccount: {method: 'POST', url: '/api/untagAcAdminAndAccount'},
        untagBua: {method: 'POST', url: '/api/untagBu'},
        untagPa: {method: 'POST', url: '/api/untagProjectAdmin'},
        untagPu: {method: 'POST', url: '/api/untagProjectUser'},
        userList: {method: 'GET', url: '/api/userListCustom'},
        userServiceList: {method: 'GET', url: '/api/userServiceList'},
        userListWithFilter: {method: 'GET', url: '/api/userListWithFilter'},
        customerUnderUser: {method: 'GET', url: '/api/customersUnderUser'},
        accountAdminsUnderCustomer: {method: 'GET', url: '/api/accountAdminsUnderCustomer'},
        financeAdminsUnderCustomer: {method: 'GET', url: '/api/financeAdminsUnderCustomer'},
        getBudgetCustomer: {method: 'GET', url: '/api/get-budget-customer'},
    });
})

angular.module('swire').factory('Entity', function($resource) {
    return $resource('/api', {}, {
        customersUnderUser: {method: 'GET', url: '/api/customersUnderUser'},
        customersNotUnderUser: {method: 'GET', url: '/api/customersNotUnderUser'},
        projectsUnderUser: {method: 'GET', url: '/api/projectsUnderUser'},
        projectsNotUnderUser: {method: 'GET', url: '/api/projectsNotUnderUser'},
        busUnderUser: {method: 'GET', url: '/api/busUnderUser'},
        busNotUnderUser: {method: 'GET', url: '/api/busNotUnderUser'},
        accountsUnderUser: {method: 'GET', url: '/api/accountsUnderUser'},
        accountsNotUnderUser: {method: 'GET', url: '/api/accountsNotUnderUser'},
        projectsUnderAccount: {method: 'GET', url: '/api/projectsUnderAccount'},
        projectsUnderBu: {method: 'GET', url: '/api/projectsUnderBu'}
    });
})