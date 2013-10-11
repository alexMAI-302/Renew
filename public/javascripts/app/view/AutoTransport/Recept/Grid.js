Ext.define('app.view.AutoTransport.Recept.Grid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.receptGrid',
	requires: 'app.view.Lib.Grid.column.ComboColumn',
	
	config: {
		title: 'Расход',
		disableSave: true,
		disableDeleteColumn: true,
		disableRefresh: true,
		suffix: 'Recept',
		store: 'AutoTransport.Recept.Recept',
		columns: [
			{
				width: 120,
				header: 'Дата',
				dataIndex: 'ddate',
				xtype: 'datecolumn',
				format: 'd.m.Y H:i',
				field: {
					xtype: 'datefield',
					format: 'd.m.Y H:i',
					value: Ext.Date.parse(Ext.Date.format(new Date(), 'd.m.Y H:i'), 'd.m.Y H:i')
				}
			},
			{
				width: 240,
				header: 'Машина',
				dataIndex: 'truck_id'
			}
		]
	}
});