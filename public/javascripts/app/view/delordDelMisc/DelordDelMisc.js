Ext.define('app.view.delordDelMisc.DelordDelMisc' ,{
    extend: 'Ext.grid.Panel',

	itemId: 'gridId',
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
	}],

	tbar: [{
		itemId: 'add',
		text: 'Добавить',
	}, {
		itemId: 'remove',
		text: 'Удалить',
	}],

	bbar: [{
		itemId: 'submit',
		text: 'Сохранить',
	}],
});
