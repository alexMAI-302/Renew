Ext.define('app.view.Fias.PlaceunloadGrid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.placeunloadGrid',
	
	config: {
		suffix: 'PlaceunloadGrid',
		disableDeleteColumn: true,
		disableDelete: true,
		disableAdd: true,
		disableSave: false,
		disableRefresh: true,
		enableColumnResize: true,
		sortableColumns : true,
		columns: [
			{
				width: 170,
				header: 'Покупатель',
				dataIndex: 'name',
				disabled: false
			},
			{
				width: 450,
				header: 'Адрес',
				dataIndex: 'address',
				disabled: false
			},
			{
				width: 220,
				header: 'Код',
				dataIndex: 'aoguid',
				disabled: false
			}

		]
	}
});