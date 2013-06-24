Ext.define('app.view.Placeunload.LinksCleaning.Grid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.buyersGrid',
	
	config: {
		suffix: 'Buyers',
		disableSave: true,
		disableAdd: true,
		disableDelete: true,
		disableDeleteColumn: true,
		disableRefresh: true,
		store: 'Placeunload.LinksCleaning.Buyers',
		beforeButtons: [
			{
				xtype: 'dateIntervalFilter',
				suffix: 'Buyers',
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
				width: 500,
				header: 'Покупатели',
				dataIndex: 'name'
			}
		]
	}
});