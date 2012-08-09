//хранилище площадок
Ext.define('app.store.movementDiff.sitesDestClearStore', {
	extend: 'Ext.data.Store',

    model: 'app.model.valueModel',
	proxy: {
        type: 'memory'
	}
});