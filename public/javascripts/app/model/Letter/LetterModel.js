Ext.define('app.model.Letter.LetterModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'period'		, type: 'int', persists: false},
	{name: 'cterm'	, type: 'int', persists: false},
	{name: 'issue', type: 'boolean'},
	{name: 'info', type: 'string'},
	{name: 'cname', type: 'string'},
	{name: 'name', type: 'string'},
	{name: 'status', type: 'boolean'},
	{name: 'issued', type: 'boolean'},
	{name: 'info_issued', type: 'string'},
	{
		name: 'ddate_issued', 
		type: 'date',
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
		
	},
	{name: 'user_issued', type: 'string'},
	{name: 'manager_id', type: 'int'}
]
});
