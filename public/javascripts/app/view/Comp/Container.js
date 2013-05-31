Ext.define('app.view.Comp.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.compPanel',
	
	requires: [
		'app.view.Comp.Filter',
		'app.view.Lib.Grid.Panel',
		'app.view.Comp.Action'
	],
	
	layout: {
		type: 'border'
	},
	
	renderTo: 'comp_js',
	height: Ext.getBody().getViewSize().height - 120,
	resizable: true,
	
	items: [
		{
			xtype: 'compFilter',
			region: 'north'
		},
		{
			xtype: 'simpleGrid',
			suffix: 'Comp',
			disableSave: true,
			disableRefresh: true,
			disableDelete: true,
			disableDeleteColumn: true,
			title: 'Комплектующие',
			editing: 'row',
			columns: [
				{
					width: 350,
					header: 'Тип',
					dataIndex: 'type'
				},
				{
					width: 100,
					header: 'Номер',
					dataIndex: 'serial',
					field: {
						xtype: 'textfield'
					}
				},
				{
					width: 110,
					header: 'Местонахождение',
					dataIndex: 'state'
				},
				{
					width: 130,
					header: 'Сотрудник',
					dataIndex: 'person'
				},
				{
					width: 170,
					header: 'Комментарий',
					dataIndex: 'descr'
				}
			],
			selModel: {
				mode: "MULTI"
			},
			region: 'center',
			flex: 1
		},
		{
			xtype: 'simpleGrid',
			suffix: 'Operations',
			title: 'Местонахождение',
			disabled: true,
			disableSave: true,
			disableAdd: true,
			disableDelete: true,
			disableDeleteColumn: true,
			columns: [
				{
					xtype:'actioncolumn',
					width:20,
					icon: '/ext/examples/ux/grid/gridPrinterCss/printer.png',
					handler: function(grid, rowIndex){
						var r=grid.store.getAt(rowIndex);
						window.open('/comp/print_operation?id='+r.get('id'));
					}
				},
				{
					width: 150,
					header: 'Дата и время',
					xtype: 'datecolumn',
					format: 'd.m.Y H:i:s',
					dataIndex: 'ddate'
				},
				{
					width: 170,
					header: 'Откуда',
					dataIndex: 'source'
				},
				{
					width: 170,
					header: 'Куда',
					dataIndex: 'destination'
				},
				{
					width: 170,
					header: 'Терминал',
					dataIndex: 'terminal'
				},
				{
					width: 170,
					header: 'Сотрудник',
					dataIndex: 'person'
				},
				{
					width: 170,
					header: 'Комментарий',
					dataIndex: 'descr'
				},
				{
					xtype:'actioncolumn',
					width:20,
					icon: '/images/empty-16.png',
					getClass: function(v, metaData, r){
						return (r.get('can_delete'))?'del-col':'empty-col';
					},
					handler: function(grid, rowIndex){
						var r=grid.store.getAt(rowIndex);
						if(r.get("can_delete")){
							grid.store.removeAt(rowIndex);
							grid.store.sync({
								callback: function(batch){
									if(batch.exceptions.length>0){
										Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
									}
									grid.store.load();
								}
							});
						}
					}
				}
			],
			region: 'south',
			flex: 1,
			split: true
		},
		{
			xtype: 'compAction',
			region: 'east'
		}
	]
});