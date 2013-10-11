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
	
Ext.define('app.model.BuyersRoute.BuyersRouteModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'name'			, type: 'string',	persist: false},
	{name: 'site_id'		, type: 'int',		persist: false},
	{name: 'site_name'		, type: 'string',	persist: false},
	{name: 'site_latitude'	, type: 'float',	persist: false},
	{name: 'site_longitude'	, type: 'float',	persist: false},
	{name: 'points'			, type: 'string'},
	{name: 'points_str'		, type: 'string'},
	{
		name: 'color',
		type: 'string',
		convert: function(v, r){
			return colors[r.get('site_id')].hex;
		}
	}]
});
