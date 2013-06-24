Ext.define('app.store.keyValueDictionary.DictionaryEntries', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/key_value_dictionaries/entries_'+Ext.get('dictionary').getValue(),
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});