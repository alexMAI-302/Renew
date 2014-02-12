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
//		manageHeight: true,
//		autoscroll:true,
		//enableBuffering: true,
		columns: [
			{
				width: 170,
				header: 'Покупатель',
				dataIndex: 'name',
				disabled: true
			},
			{
				width: 400,
				header: 'Адрес',
				dataIndex: 'address',
				disabled: true
			},
			{
				width: 400,
				header: 'Полный адрес',
				dataIndex: 'fulladdress',
				disabled: true
			},
			{
				width: 220,
				header: 'Код',
				dataIndex: 'aoguid',
				disabled: true
			}

		]
	}
});