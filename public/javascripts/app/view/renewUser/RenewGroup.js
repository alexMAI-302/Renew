Ext.define('app.view.renewUser.RenewGroup' ,{
	extend: 'app.view.BasePanel',
	
	itemId: 'masterPanelId',
	height: 400,


	plugins: [
		Ext.create('Ext.grid.plugin.CellEditing', {
			pluginId: 'cellEditing',
			clicksToEdit: 1
		})
	],

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