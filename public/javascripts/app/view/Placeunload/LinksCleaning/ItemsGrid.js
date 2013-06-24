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
				icon: '/images/tree_hierarchy.png',
				tooltip: 'Сделать главным',
				disabled: true
			}
		],
		columns: [
			{
				width: 500,
				header: 'Наименование',
				dataIndex: 'name'
			}
		]
	}
});