//хранилище площадок
Ext.define('app.store.movementDiff.sitesDestClear', {
	extend: 'Ext.data.Store',

    model: 'app.model.valueModel',
	proxy: {
        type: 'memory'
	}
});