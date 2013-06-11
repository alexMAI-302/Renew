Ext.define('app.store.keyKeyDictionary.Properties1', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	autoLoad: true,
	proxy: {
		type: 'rest',
		url : '/key_key_dictionaries/property_table_'+Ext.get('property1_table').getValue(),
		reader: {
			type: 'json'
		}
	}
});