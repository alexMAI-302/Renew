Ext.define('app.model.increquestReason.IncrequestReason', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'id',   type: 'int'},
		{name: 'name', type: 'string'}
	],
	
	proxy: {
		type: 'rest',
		url : '/increquest_reason/increquest_reason',
		
		reader: {
			type: 'json',
			messageProperty: 'msg' //Что бы автоматически заполниь значениями operation.error (используется в контроллере в методе onSubmit)
		},
		writer: {
			type: 'json'
		},
	},
});