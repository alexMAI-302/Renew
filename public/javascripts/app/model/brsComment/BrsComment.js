Ext.define('app.model.brsComment.BrsComment', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'id',   type: 'int'},
		{name: 'name', type: 'string'}
	],
	
	proxy: {
		type: 'rest',
		url : '/brs_comment/brs_comment',
		
		reader: {
			type: 'json',
			messageProperty: 'msg' //Что бы автоматически заполниь значениями operation.error (используется в контроллере в методе onSubmit)
		},
		writer: {
			type: 'json'
		},
	},
});