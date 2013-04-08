Ext.define('app.model.RenewPlan.InfoTableModel', {
	extend: 'Ext.data.Model',
	fields: [
    	{
    		name: 'name',
    		type: 'string'
    	},
    	{
    		name: 'all',
    		type: 'float',
    		useNull: true,
    		persists: false
    	},
		{
			name: 'num1',
    		type: 'float',
    		useNull: true,
    		persists: false
		},
		{
			name: 'num2',
    		type: 'float',
    		useNull: true,
    		persists: false
		},
		{
			name: 'siteRemains',
    		type: 'float',
    		useNull: true,
    		persists: false
		},
		{
			name: 'truckRemains',
    		type: 'float',
    		useNull: true,
    		persists: false
		},
		{
			name: 'positions',
    		type: 'float',
    		useNull: true,
    		persists: false
		},
		{
			name: 'donevol',
    		type: 'float',
    		useNull: true,
    		persists: false
		},
		{
			name: 'pansAll',
    		type: 'float',
    		useNull: true,
    		persists: false
		},
		{
			name: 'weightAll',
    		type: 'float',
    		useNull: true,
    		persists: false
		},
		{
			name: 'volumeAll',
    		type: 'float',
    		useNull: true,
    		persists: false
		}
    ]
});
