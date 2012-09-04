Ext.define('app.model.delordDelMisc.DelordDelMisc', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'id',   type: 'int'},
		{name: 'name', type: 'string'}
	],
	
	proxy: {
		type: 'rest',
		url : '/delord_del_misc/delord_del_misc',
		
		reader: {
			type: 'json',
			messageProperty: 'msg' //Что бы автоматически заполниь значениями operation.error (используется в контроллере в методе onSubmit)
		},
		writer: {
			type: 'json'
		},
	},
});