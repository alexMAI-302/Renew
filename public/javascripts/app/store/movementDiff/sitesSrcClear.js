//хранилище площадок
Ext.define('app.store.movementDiff.sitesSrcClear', {
	extend: 'Ext.data.Store',

    model: 'app.model.valueModel',
	proxy: {
        type: 'memory'
	}
});