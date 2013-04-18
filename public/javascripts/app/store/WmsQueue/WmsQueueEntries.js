Ext.define('app.store.WmsQueue.WmsQueueEntries', {
	extend: 'Ext.data.Store',
	model: 'app.model.WmsQueue.WmsQueueEntryModel',
	proxy: {
		type: 'rest',
		url : '/wms_queue/wms_queue_entries',
		reader: {
			type: 'json'
		}
	}
});