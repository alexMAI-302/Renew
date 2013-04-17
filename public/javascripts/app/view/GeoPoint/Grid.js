Ext.define('app.view.GeoPoint.Grid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.geoPointPanel',
	
	config: {
		suffix: 'GeoPoint',
		disableDeleteColumn: true,
		disableDelete: true,
		disableAdd: true,
		title: 'Терминалы',
		enableBuffering: true,
		columns: [
			{
				width: 100,
				header: 'Код',
				dataIndex: 'code',
				disabled: true
			},
			{
				width: 85,
				header: 'terminalID',
				dataIndex: 'terminalID',
				disabled: true
			},
			{
				width: 250,
				header: 'Имя',
				dataIndex: 'name',
				disabled: true,
					tdCls: 'x-wrap_cells'
			},
			{
				width: 200,
				header: 'Адрес',
				dataIndex: 'srcaddress',
				tdCls: 'x-wrap_cells',
				field: {
					xtype: 'textfield'
				}
			},
			{
				width: 200,
				header: 'Геокодированный адрес',
				dataIndex: 'fulladdress',
				tdCls: 'x-wrap_cells',
				disabled: true
			},
			{
				xtype: 'numbercolumn',
				width: 85,
				format: '0.000000',
				header: 'Широта',
				dataIndex: 'latitude',
				field: {
					xtype: 'numberfield',
					decimalPrecision: 6,
					decimalSeparator: ',',
					minValue: -180,
					maxValue: 180
				}
			},
			{
				xtype: 'numbercolumn',
				width: 85,
				format: '0.000000',
				header: 'Долгота',
				dataIndex: 'longitude',
				field: {
					xtype: 'numberfield',
					decimalPrecision: 6,
					decimalSeparator: ',',
					minValue: -90,
					maxValue: 90
				}
			},
			{
				xtype: 'checkcolumn',
				width: 60,
				dataIndex: 'ismaunual',
				header: 'Задано<br/>вручную'
			}
		]
	}
});