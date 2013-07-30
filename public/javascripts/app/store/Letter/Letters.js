Ext.define('app.store.Letter.Letters', {
	extend: 'Ext.data.Store',
	model: 'app.model.Letter.LetterModel',
	proxy: {
		type: 'rest',
		url : '/letter/letter',
		reader: {
			type: 'json'
		}
	}
});