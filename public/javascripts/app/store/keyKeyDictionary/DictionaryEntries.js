Ext.define('app.store.keyKeyDictionary.DictionaryEntries', {
	extend: 'Ext.data.Store',
	model: 'app.model.keyKeyDictionary.DictionaryModel',
	proxy: {
		type: 'rest',
		url : '/key_key_dictionaries/entries_'+Ext.get('dictionary').getValue(),
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});