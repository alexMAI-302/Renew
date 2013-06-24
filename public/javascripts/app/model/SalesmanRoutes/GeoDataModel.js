var colors = [
		{
			str: 'blue',
			hex: '#0969c5'
		},
		{
			str: 'darkorange',
			hex: '#ca6725'
		},
		{
			str: 'pink',
			hex: '#e869df'
		},
		{
			str: 'darkgreen',
			hex: '#168e02'
		},
		{
			str: 'red',
			hex: '#df3531'
		},
		{
			str: 'orange',
			hex: '#d0aa34'
		},
		{
			str: 'violet',
			hex: '#a11cde'
		},
		{
			str: 'darkblue',
			hex: '#3e4be9'
		},
		{
			str: 'green',
			hex: '#19b500'
		},
		{
			str: 'white',
			hex: '#ffffff'
		},
		{
			str: 'grey',
			hex: '#979791'
		},
		{
			str: 'yellow',
			hex: '#d9cb33'
		},
		{
			str: 'lightblue',
			hex: '#4797e9'
		},
		{
			str: 'brown',
			hex: '#8b592d'
		},
		{
			str: 'night',
			hex: '#143868'
		},
		{
			str: 'black',
			hex: '#2c3645'
		}
	];
Ext.define('app.model.SalesmanRoutes.GeoDataModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type:'string'},
	{name: 'name'			, type:'string'},
	//адрес для торговой точки
	{name: 'address'		, type:'string'},
	{name: 'buyer_cnt'		, type:'int'},
	{name: 'order_cnt'		, type:'int'},
	{name: 'order_summ'		, type:'float'},
	//уровень иерархии: 0 - Супервайзер, 1 - ТП, 2 - адреса
	{name: 'level'			, type:'int'},
	{name: 'row_num'		, type:'int'},
	{
		name: 'point_str',
		type: 'string',
		//сделано, чтобы создать по строке точку
		//структура объекта точки: point:{row_num, latitude, longitude, ts}
		convert: function(value, record){
			if(value!=null && value!=''){
				record.point=eval('('+value+')');
			}
			return value;
		}
	},
	{
		name: 'route_str',
		type: 'string',
		//сделано, чтобы создать по строке массив геообъекта
		//структура геообъекта: route:[{row_num, latitude, longitude, ts}]
		convert: function(value, record){
			if(value!=null && value!=''){
				record.route=eval('('+value+')');
				if(record.route.length>0){
					record.showRoute=true;
					record.start_ts = record.route[0].ts;
					record.end_ts = record.route[record.route.length - 1].ts;
				}
				if(record.get("level")==1){
					record.colorStr=colors[record.get("row_num")].str;
					record.colorHex=colors[record.get("row_num")].hex;						
				}
			}
			return value;
		}
	},
	{name: 'checked'		, type:'boolean', defaultValue: true},
	{name: 'show_on_map'	, type:'boolean', defaultValue: true}]
});
