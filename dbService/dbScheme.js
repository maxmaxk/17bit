/*****************************************
* DB scheme
*
* Схема БД
*****************************************/

const dbScheme = {
	users: {
		userId: {
			type: 'serial',
			primKey: true,
		},
		login: {
			type: 'text',
			unique: true,
		},
		password: {
			type: 'text',
		},
		email: {
			type: 'text',
		},	
		activate: {
			type: 'boolean',
			default: false,
		},	
		sessionId: {
			type: 'text',
		},	
		activateCode: {
			type: 'text',
		},
		changePassCode: {
			type: 'text',
		},
	},
	
	orders: {
		orderId: {
			type: 'serial',
			primKey: true,
		},
		userId: {
			type: 'integer',
			references: {
				table: 'users',
				field: 'userId',
			}
		},
		name: {
			type: 'text',
		}
	},
	
	specs: {
		specId: {
			type: 'serial',
			primKey: true,
		},
		orderId: {
			type: 'integer',
			references: {
				table: 'orders',
				field: 'orderId',
			}
		},
		name: {
			type: 'text',
		},
		weight: {
			type: 'integer', // in milligramms
		},		
		square: {
			type: 'integer', // m2 x 1000
		},
		length: {
			type: 'integer', // in millimeters
		},
		price: {
			type: 'money',
		},
		quantity: {
			type: 'integer',
		}
	},
	

	
	
}

module.exports.dbScheme = dbScheme