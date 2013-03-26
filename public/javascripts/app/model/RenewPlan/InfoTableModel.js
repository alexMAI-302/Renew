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
    		useNull: true
    	},
		{
			name: 'num1',
    		type: 'float',
    		useNull: true
		},
		{
			name: 'num2',
    		type: 'float',
    		useNull: true
		},
		{
			name: 'siteRemains',
    		type: 'float',
    		useNull: true
		},
		{
			name: 'truckRemains',
    		type: 'float',
    		useNull: true
		},
		{
			name: 'positions',
    		type: 'float',
    		useNull: true
		},
		{
			name: 'donevol',
    		type: 'float',
    		useNull: true
		},
		{
			name: 'pansAll',
    		type: 'float',
    		useNull: true
		},
		{
			name: 'weightAll',
    		type: 'float',
    		useNull: true
		},
		{
			name: 'volumeAll',
    		type: 'float',
    		useNull: true
		}
    ]
});
