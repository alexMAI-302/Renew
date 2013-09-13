Ext.define('app.store.Geotrack.Positions', {
	extend: 'Ext.data.Store',

    model: 'app.model.valueModel',
	proxy: {
        type: 'memory'
	}
});