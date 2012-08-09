//хранилище площадок
Ext.define('app.store.movementDiff.sitesSrcClearStore', {
	extend: 'Ext.data.Store',

    model: 'app.model.valueModel',
	proxy: {
        type: 'memory'
	}
});