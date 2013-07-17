Ext.define('app.view.Placeunload.LinksCleaning.Grid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.buyersGrid',
	
	config: {
		suffix: 'Deliveries',
		disableSave: true,
		disableAdd: true,
		disableDelete: true,
		disableDeleteColumn: true,
		disableRefresh: true,
		store: 'Placeunload.LinksCleaning.Deliveries',
		beforeButtons: [
			{
				xtype: 'dateIntervalFilter',
				suffix: 'Deliveries',
				shiftInterval: Ext.Date.DAY,
				shiftBegin: -7,
				filterItems: [
					{
						id: 'site',
						xtype: 'combobox',
						fieldLabel: 'Площадка',
						valueField: 'id',
						displayField: 'name',
						queryMode: 'local',
						width: 200,
						labelWidth: 60,
						store: 'Placeunload.LinksCleaning.Sites'
					}
				],
				region: 'north'
			}
		],
		columns: [
			{
				width: 100,
				header: 'Номер доставки',
				dataIndex: 'ndoc'
			},
			{
				width: 70,
				header: 'Дата',
				dataIndex: 'ddate',
				xtype: 'datecolumn',
				format: 'd.m.Y'
			},
			{
				width: 120,
				header: 'Сопровождающий',
				dataIndex: 'securer_name'
			},
			{
				width: 60,
				header: 'Порядок',
				dataIndex: 'ord'
			},
			{
				width: 210,
				header: 'Покупатель',
				dataIndex: 'buyer_name'
			}
		]
	}
});