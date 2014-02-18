Ext.define('app.view.Fias.Detail', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.fiasDetail',
	
	config: {
		suffix: 'FiasDetail',
		disableDeleteColumn: true,
		disableDelete: true,
		disableAdd: true,
		disableSave: true,
		disableRefresh: true,
		columns: [
			{
				width: 50,
				header: 'Тип',
				dataIndex: 'shortname',
				disabled: true
			},
			{
				width: 150,
				header: 'Имя',
				dataIndex: 'name',
				disabled: true
			}
		]
	}
});