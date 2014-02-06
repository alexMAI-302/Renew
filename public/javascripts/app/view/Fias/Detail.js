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
		title: 'Детали адреса',
		//enableBuffering: true,
		columns: [
			{
				width: 220,
				header: 'Код',
				dataIndex: 'aoguid',
				disabled: true
			},
			{
				width: 300,
				header: 'Имя',
				dataIndex: 'name',
				disabled: true
			},
			{
				width: 160,
				header: 'Административная единица',
				dataIndex: 'shortname',
				disabled: true
			},
			{
				width: 50,
				header: 'Уровень',
				dataIndex: 'aolevel',
				disabled: true
			}
		]
	}
});