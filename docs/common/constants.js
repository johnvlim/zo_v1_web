angular
.module('starter')

.constant(
		'API_BASE_URL', 
		'http://139.59.115.191/laravel/api'
		)
		
.constant(
		'MQTT_CONFIG', 
		{
			'host': '192.168.137.1', 
			'port': 1884
			}
		)
		
.constant(
		'MQTT_TOPICS', 
		{
			'waiterRequest': 'waiterRequest', 
			'waiterResponse': 'waiterResponse'
				}
		)
		
.constant(
		'CUSTOMERS_DB_FIELDS', 
		{
			0: 'customer_username', 
			1: 'customer_password', 
			2: 'customer_name_fname', 
			3: 'customer_name_mname', 
			4: 'customer_name_lname', 
			5: 'customer_role', 
			6: 'customer_gender', 
			7: 'customer_address_house_building', 
			8: 'customer_address_street', 
			9: 'customer_address_district', 
			10: 'customer_address_city', 
			11: 'customer_address_postalcode', 
			12: 'customer_address_country', 
			13: 'customer_mobile', 
			14: 'customer_email', 
			15: 'customer_birthday_month', 
			16: 'customer_birthday_date', 
			17: 'customer_birthday_year', 
			18: 'customer_last_change_timestamp', 
			19: 'customer_device_token'
				}
		)
		
.constant(
		'COMPANIES_DB_FIELDS', 
		{
			0: 'company_name', 
			1: 'company_desc', 
			2: 'company_category', 
			3: 'company_logo', 
			4: 'company_last_change_timestamp'
				}
		)
		
.constant(
		'BRANCHES_DB_FIELDS', 
		{
			0: 'branch_id', 
			1: 'branch_name', 
			2: 'company_name', 
			3: 'branch_address_house_building', 
			4: 'branch_address_street', 
			5: 'branch_address_district', 
			6: 'branch_address_city', 
			7: 'branch_address_postalcode', 
			8: 'branch_address_country', 
			9: 'branch_hotline', 
			10: 'branch_last_change_timestamp'
				}
		)
		
.constant(
		'MENUS_DB_FIELDS', 
		{
			0: 'menu_id', 
			1: 'menu_name', 
			2: 'company_name', 
			3: 'menu_desc', 
			4: 'menu_image', 
			5: 'menu_last_change_timestamp'
				}
		)
		
.constant(
		'TABLES_DB_FIELDS', 
		{
			0: 'table_id', 
			1: 'table_number', 
			2: 'branch_id', 
			3: 'table_capacity', 
			4: 'table_status', 
			5: 'table_status_change_timestamp', 
			6: 'table_last_change_timestamp'
				}
		)
		
.constant(
		'MENUITEMS_DB_FIELDS', 
		{
			0: 'menuitem_id', 
			1: 'menuitem_code', 
			2: 'menu_id', 
			3: 'menuitem_name', 
			4: 'menuitem_desc', 
			5: 'menuitem_price', 
			6: 'menuitem_featured', 
			7: 'menuitem_image', 
			8: 'menuitem_last_change_timestamp'
				}
		)
		
.constant(
		'ORDERREFERENCES_DB_FIELDS', 
		{
			0: 'orderreference_id', 
			1: 'orderreference_code', 
			2: 'customer_username', 
			3: 'table_id', 
			4: 'orderreference_status', 
			5: 'orderreference_status_change_timestamp', 
			6: 'orderreference_last_change_timestamp'
				}
		)
		
.constant(
		'ORDERS_DB_FIELDS', 
		{
			0: 'order_id', 
			1: 'menuitem_id', 
			2: 'orderreference_code', 
			3: 'order_status', 
			4: 'order_status_change_timestamp', 
			5: 'order_last_change_timestamp'
				}
		)
		
.constant(
		'RESERVATIONS_DB_FIELDS', 
		{
			0: 'reservation_id', 
			1: 'reservation_code', 
			2: 'customer_username', 
			3: 'orderreference_code', 
			4: 'reservation_diners_count', 
			5: 'reservation_eta', 
			6: 'reservation_payment_mode', 
			7: 'reservation_service_time', 
			8: 'reservation_status', 
			9: 'reservation_status_change_timestamp', 
			10: 'reservation_last_change_timestamp'
				}
		)
		
.constant(
		'CUSTOMERCOMPANYBRANCH_DB_FIELDS', 
		{
			0: 'customer_username', 
			1: 'company_name', 
			2: 'branch_name', 
			3: 'customerCompanyBranch_last_change_timestamp'
				}
		)
		
.constant(
		'ADVERTISEMENTS_DB_FIELDS', 
		{
			0: 'advertisement_id', 
			1: 'company_name', 
			2: 'advertisement_title', 
			3: 'advertisement_content', 
			4: 'advertisement_price', 
			5: 'advertisement_image', 
			6: 'advertisement_url', 
			7: 'advertisement_last_change_timestamp'
				}
		)
		
.constant(
		'BLOGS_DB_FIELDS', 
		{
			0: 'blog_id', 
			1: 'blog_title', 
			2: 'blog_author', 
			3: 'blog_content', 
			4: 'blog_image', 
			5: 'blog_url', 
			6: 'blog_last_change_timestamp'
				}
		)
		
.constant(
		'BROADCAST_MESSAGES', 
		{
			authAuthenticated: 'authAuthenticated', 
			toggleMenu: 'toggleMenu', 
			toggleTable: 'toggleTable', 
			toggleMenuitem: 'toggleMenuitem', 
			toggleOrderreference: 'toggleOrderreference', 
			toggleOrder: 'toggleOrder', 
			toggleReservation: 'toggleReservation', 
			addCustomer: 'addCustomer', 
			updateCustomer: 'updateCustomer', 
			deleteCustomer: 'deleteCustomer', 
			addCompany: 'addCompany', 
			updateCompany: 'updateCompany', 
			deleteCompany: 'deleteCompany', 
			addBranch: 'addBranch', 
			updateBranch: 'updateBranch', 
			deleteBranch: 'deleteBranch', 
			addMenu: 'addMenu', 
			updateMenu: 'updateMenu', 
			deleteMenu: 'deleteMenu', 
			addTable: 'addTable', 
			updateTable: 'updateTable', 
			deleteTable: 'deleteTable', 
			addMenuitem: 'addMenuitem', 
			updateMenuitem: 'updateMenuitem', 
			deleteMenuitem: 'deleteMenuitem', 
			addOrderreference: 'addOrderreference', 
			updateOrderreference: 'updateOrderreference', 
			deleteOrderreference: 'deleteOrderreference', 
			addOrder: 'addOrder', 
			updateOrder: 'updateOrder', 
			deleteOrder: 'deleteOrder', 
			addReservation: 'addReservation', 
			updateReservation: 'updateReservation', 
			deleteReservation: 'deleteReservation', 
			remReservationOrder: 'remReservationOrder', 
			getMarketingSuccess: 'getMarketingSuccess', 
			getMarketingFailed: 'getMarketingFailed', 
			getCompaniesSuccess: 'getCompaniesSuccess', 
			getCompaniesFailed: 'getCompaniesFailed', 
			getCompanyBranchOrderreferencesSuccess: 'getCompanyBranchOrderreferencesSuccess', 
			getCompanyBranchOrderreferencesFailed: 'getCompanyBranchOrderreferencesFailed', 
			closeIonRefresher: 'scroll.refreshComplete'
				}
		)
		
.constant(
		'ERROR_MESSAGES', 
		{
			authenticationFailed: 'authentication failed: invalid username/password', 
			getFailed: 'get failed: unable to retrieve data from server', 
			sendFailed: 'send failed: unable to post reservation/orders to server', 
			updateFailed: 'update failed: unable to update reservation/orders', 
			connectionFailed: 'connection failed: unable to connect to MQTT broker', 
			subscriptionFailed: 'subscription failed: unable to subscribe to MQTT topic', 
			sendMqttFailed: 'send failed: unable to send MQTT message'
				}
		)
		
.constant(
		'IS_FEATURED_VALUES', 
		{
			1: 'Y', 
			0: 'N'
				}
		)
		
.constant(
		'KEYS', 
		{
			Customers: 'customers', 
			Companies: 'companies', 
			Branches: 'branches', 
			Menus: 'menus', 
			Tables: 'tables', 
			Menuitems: 'menuitems', 
			Orderreferences: 'orderreferences', 
			Orders: 'orders', 
			Reservations: 'reservations', 
			CustomersCompaniesBranches: 'customers_companies_branches', 
			Marketing: 'marketing', 
			Advertisements: 'advertisements', 
			Blogs: 'blogs', 
			User: 'user', 
			ReservationDetails: 'reservationDetails'
				}
		)
		
.constant(
		'LOADING_MESSAGES', 
		{
			authenticatingUser: 'authenticating user', 
			gettingData: 'getting data', 
			sendingReservation: 'sending reservation', 
			sendingOrder: 'sending order', 
			updatingOrderreference: 'updating orderreference', 
			updatingOrder: 'updating order', 
			connectingToBroker: 'connecting to MQTT broker', 
			subscribingToTopic: 'subscribing to topic'
				}
		)
		
.constant(
		'ORDER_STATUS', 
		{
			queue: 'queue', 
			cooking: 'cooking', 
			to_serve: 'to serve'
				}
		)
		
.constant(
		'ORDERREFERENCE_STATUS', 
		{
			sent: 'sent', 
			in_progress: 'in progress', 
			done: 'done'
				}
		)
		
.constant(
		'PAYMENT_MODES', 
		{
			cash: 'cash', 
			credit_card: 'credit card'
				}
		)
		
.constant(
		'PROMPT_MESSAGES', {
			yesNoExistingOrderreference: 'there\'s an existing orderreference, continue?', 
			yesNoExistingTable: 'there\'s an existing table, change table?'
				}
		)
		
.constant(
		'RESERVATION_STATUS', 
		{
			sent: 'sent', 
			in_progress: 'in progress', 
			done: 'done'
				}
		)
		
.constant(
		'SUCCESS_MESSAGES', {
			postReservationSuccess: 'post success: reservation submitted', 
			postOrderSuccess: 'post success: order submitted'
				}
		)
		
.constant(
		'TABLE_STATUS', 
		{
			vacant: 'vacant', 
			occupied: 'occupied'
				}
		)
		
.constant(
		'USER_GENDERS', 
		{
			male: 'male', 
			female: 'female'
				}
		)
		
.constant(
		'USER_ROLES', 
		{
			administrator: 'administrator', 
			manager: 'manager', 
			cook: 'cook', 
			customer: 'customer', 
			waiter: 'waiter'
				}
		)
		
.constant(
		'WAITER_REQUESTS', 
		{
			callWaiter: 'Call Waiter', 
			billOut: 'Bill Out'
				}
		);