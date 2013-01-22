Ext.define('app.view.AutoTransport.Nomenclature.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.nomenclatureTab',
	
	requires: [
		'app.view.Lib.Grid.Panel'
	],
	
	layout: {
		type: 'border'
	},
	
	title: 'Номенклатура',
	
	items: [
		{
			xtype: 'toolbar',
			region: 'north',
			items:[
				{
					id: 'saveNomenclatureGroup',
					icon: '/images/save.png'
				},
				{
					id: 'refreshNomenclatureGroup',
					icon: '/ext/examples/shared/icons/fam/table_refresh.png'
				}
			]
		},
		{
			xtype: 'simpleGrid',
			suffix: 'NomenclatureGroup',
			disableSave: true,
			disableRefresh: true,
			disableDeleteColumn: true,
			features: [
				{
					id: 'nomenclatureGroupsFeature',
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
			],
			width: 210,
			region: 'west',
			split: true,
		},
		{
			xtype: 'simpleGrid',
			suffix: 'Nomenclature',
			disableSave: true,
			disableRefresh: true,
			disableDeleteColumn: true,
			disabled: true,
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
					dataIndex: 'measure'
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
			],
			region: 'center'
		}
	]
});