//хранилище номеров документов
Ext.define('app.store.movementDiff.ndocsSupClear', {
	extend: 'Ext.data.Store',

    model: 'app.model.valueModel',
	proxy: {
        type: 'memory'
	}
});