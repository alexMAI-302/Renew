Ext.define('app.view.Placeunload.LinksCleaning.ItemsGrid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.placeunloadsGrid',
	
	config: {
		suffix: 'Placeunloads',
	    disabled: true,
	    disableSave: true,
		disableAdd: true,
		disableDelete: true,
		disableDeleteColumn: true,
		store: 'Placeunload.LinksCleaning.Placeunloads',
		afterButtons: [
			{
				id: 'makeMainPlaceunloads',
				icon: '/images/save.png',
				tooltip: 'Сохранить',
				disabled: true
			}
		],
		columns: [
			{
				width: 200,
				header: 'Наименование',
				dataIndex: 'name'
			},
			{
				width: 300,
				header: 'Адрес',
				dataIndex: 'address'
			},
			{
				width: 25,
				xtype: 'checkcolumn',
				header: 'Гл.',
				dataIndex: 'main'
			},
			{
				width: 30,
				xtype: 'checkcolumn',
				header: 'Доп.',
				dataIndex: 'extra'
			}
		]
	}
});