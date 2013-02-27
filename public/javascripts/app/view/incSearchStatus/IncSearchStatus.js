Ext.define('app.view.incSearchStatus.IncSearchStatus' ,{
	extend: 'app.view.Lib.Grid.Panel',

	height: 400,

	columns: [{
		dataIndex: 'id',
		text: 'Идентификатор',
		hidden: true,
		disabled: true
	}, {
		dataIndex: 'name',
		text: 'Название',
		width: 255,
		sortable: true,
		hideable: false,
		editor: {
			xtyte: 'textfield',
			allowBlank: false
		}
	}]
});
