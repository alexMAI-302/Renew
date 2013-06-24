Ext.define('app.store.ContentEditor.Urls', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/content_editor/get_urls',
		reader: {
			type: 'json'
		}
	}
});