Ext.define('app.view.AutoTransport.Nomenclature.ItemsGrid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.nomenclatureGrid',
	requires: 'app.view.Lib.Grid.column.ComboColumn',
	
	config: {
		suffix: 'Nomenclature',
		disableSave: true,
		disableRefresh: true,
		disableDeleteColumn: true,
		disabled: true,
		store: 'AutoTransport.Nomenclature.Nomenclature',
		columns: [
			{
				width: 400,
				header: 'Наименование',
				dataIndex: 'name',
				field: {
					xtype: 'textfield'
				}
			},
			{
				width: 110,
				header: 'Единица измерения',
				dataIndex: 'measure',
				xtype: 'combocolumn',
				store: 'app.store.AutoTransport.Measure'
			},
			{
				width: 200,
				header: 'Группа',
				dataIndex: 'at_ggroup'
			},
			{
				width: 60,
				header: 'Остаток',
				dataIndex: 'cnt'
			}
		]
	}
});