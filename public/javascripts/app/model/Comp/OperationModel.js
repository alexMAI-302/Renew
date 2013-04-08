Ext.define('app.model.Comp.OperationModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type:'int'},
	{
		name: 'ddate',
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
	{name: 'source'			, type:'int',	allowNull: true},
	{name: 'destination'	, type:'int',	allowNull: true},
	{name: 'terminal'		, type:'int'},
	{name: 'person'			, type:'int',	allowNull: true},
	{name: 'descr'			, type:'string'},
	{name: 'can_delete'		, type:'boolean'}]
});
