Ext.define('app.view.AutoTransport.Nomenclature.Grid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.nomenclatureGroupsGrid',
	
	config: {
		suffix: 'NomenclatureGroup',
		disableSave: true,
		disableRefresh: true,
		disableDeleteColumn: true,
		features: [
			{
				id: 'group',
				ftype:'grouping',
				groupHeaderTpl: '{name}'
			}
		],
		title: 'Группы',
		header: false,
		columns: [
			{
				width: 200,
				header: 'Наименование',
				dataIndex: 'name',
				field: {
					xtype: 'textfield'
				}
			},
			{
				width: 90,
				header: 'Тип',
				dataIndex: 'at_ggtype',
				hidden: true
			}
		]
	}
});