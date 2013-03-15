Ext.define('app.model.RenewPlan.InfoTableModel', {
	extend: 'Ext.data.Model',
	fields: [
    	{
    		name: 'name',
    		type: 'string'
    	},
    	{
    		name: 'volume',
    		type: 'float',
    		useNull: true
    	},
		{
			name: 'pans',
    		type: 'float',
    		useNull: true
		},
		{
			name: 'weight',
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
