Ext.define('app.model.TerminalKey.TerminalKeyLogModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'terminal_key_id'				, type: 'int'},
	{name: 'type_op'				, type: 'string'},
	{name: 'old_strvalue'				, type: 'string'},
	{name: 'new_strvalue'				, type: 'string'},
	{name: 'renew_user'				, type: 'string'},
	{
		name: 'ts',
		type:'date',
		convert: function(v, record){
			if(Ext.isDate(v)){
				return v
			} else {
				var val=Ext.Date.parse(v, 'Y-m-d H:i:s');
				val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d\\TH:i:s") : val;
				val = (val==null || val==undefined) ? Ext.Date.parse(v, "d.m.Y H:i") : val;
				return val;
			}
	}
	}
]
});
