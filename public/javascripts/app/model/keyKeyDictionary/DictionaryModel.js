Ext.define('app.model.keyKeyDictionary.DictionaryModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'									, type:'string'}, //идентификатор составной
	{name: Ext.get('property1_name').getValue()	, type:'int'},
	{name: Ext.get('property2_name').getValue()	, type:'int'}]
});
