Ext.define('app.store.dictionary.DictionaryEntries', {
	extend: 'Ext.data.Store',
	model: 'app.model.dictionary.DictionaryModel',
	proxy: {
		type: 'rest',
		url : '/user_dictionaries/entries_'+Ext.get('dictionary').getValue(),
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});