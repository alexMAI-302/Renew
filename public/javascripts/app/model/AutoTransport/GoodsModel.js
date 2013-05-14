Ext.define('app.model.AutoTransport.GoodsModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'int',	useNull: true},
	{name: 'master_id'	, type:'int',	useNull: true},
	{name: 'at_ggroup'	, type:'int',	useNull: true},
	{name: 'at_goods'	, type:'int',	useNull: true},
	{name: 'measure'	, type:'int',	useNull: true},
	{name: 'vol'		, type:'float',	useNull: true},
	{name: 'price'		, type:'float',	useNull: true},
	{
		name: 'sum',
		type:'float',
		convert: function(value, record){
			if(!isNaN(value) && value>0){
				return value;
			} else {
				var sum=record.get('sum');
				if(!isNaN(sum) && sum>0){
					return sum;
				} else {
					return record.get('vol')*record.get('price')
				}
			}
		}
	}]
});
