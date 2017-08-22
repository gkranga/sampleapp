# swireUI
UI for SWire...

### These are the steps to simulate an end to end flow...

1.  Login as servicewire@servicewire.com which is the swa role.  
2.  You will get only two services in the **authservices.json** file - Customers and Users under swa.  This is listed in the left pane of the UI and the right pane will be empty.
3.  Click on Customers.  This will make a call to **listCustomers** service, which will populate the table.
4.  Click on "Create" in the "Action" dropdown.  This will open a form to take the required input to create a customer, validate the input and make a call to the **createCustomer** service.  A new customer will be created and the table is refreshed with the customer details.
5.  Click on "Users".  This will make a call to the **listUsers** service which will give a list of all the users for that customer.  In this case, since there are no users, the table on the right pane will be rendered empty.
6.  From the Action dropdown, choose "Create User".  This will open a form to take the required input to create a user, validate the user details and make a call to the **createUser** service.  Since this is SWA, user creation will not happen in a customer context.  A new user will be created and the table is refreshed with the user details.
7.  Click on the respective user in the table and in the Action dropdown on that row, select "
8.  
