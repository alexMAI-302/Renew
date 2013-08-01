Ext.define('app.view.ClothingSize.ItemsGrid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.clothingsizeGrid',
	
	config: {
		suffix: 'ClothingSize',
		disableSave: false,
		disableRefresh: true,
		disableAdd: true,
		disableDelete: true,
		disableDeleteColumn: true,
		disableAddColumn: true,
		disabled: true,
		store: 'ClothingSize.ClothingSize',
		columns: [
			{
				dataIndex: 'id',
				hidden : true
			},
			{
				width: 200,
				header: 'Сотрудник',
				dataIndex: 'shortened'
			},
			{
				width: 300,
				header: 'Отдел',
				dataIndex: 'dept'
			},
			{
				width: 300,
				header: 'Должность',
				dataIndex: 'pos'
			},
			{
				width: 100,
				header: 'Размер (плечи)',
				dataIndex: 'size_shoulders',
				field: {
					xtype: 'textfield'
				}
			},
			{
				width: 100,
				header: 'Размер (бёдра)',
				dataIndex: 'size_hips',
				field: {
					xtype: 'textfield'
				}
			}
		]
	}
});