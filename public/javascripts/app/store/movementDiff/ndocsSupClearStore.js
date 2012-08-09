//хранилище номеров документов
Ext.define('app.store.movementDiff.ndocsSupClearStore', {
	extend: 'Ext.data.Store',

    model: 'app.model.valueModel',
	proxy: {
        type: 'memory'
	}
});