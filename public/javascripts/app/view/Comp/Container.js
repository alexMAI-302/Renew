Ext.define('app.view.Comp.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.compPanel',
	
	requires: [
		'app.view.Comp.Filter',
		'app.view.Comp.Action',
		'app.view.Lib.Grid.Panel',
		'app.view.Lib.Grid.column.ComboColumn'
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
			store: 'Comp.Components',
			columns: [
				{
					width: 350,
					header: 'Тип',
					dataIndex: 'type',
					xtype: 'combocolumn',
					store: 'Comp.Types'
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
					dataIndex: 'state',
					xtype: 'combocolumn',
					store: 'Comp.CompLocations'
				},
				{
					width: 130,
					header: 'Сотрудник',
					dataIndex: 'person',
					xtype: 'combocolumn',
					store: 'Comp.Persons'
				},
				{
					width: 170,
					header: 'Комментарий',
					dataIndex: 'descr'
				}
			],
	
	                afterButtons: [                                                  //+
			{                                                                //+
				id: 'printSchedules',                                        //+
				icon: '/ext/examples/ux/grid/gridPrinterCss/printer.png',    //+
				tooltip: 'Распечатать'                                       //+
			}                                                                //+
       	   	    ],                                                               //+   
	
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
			store: 'Comp.Operations',
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
					dataIndex: 'source',
					xtype: 'combocolumn',
					store: 'Comp.CompLocations',
					onlyRenderer: true
				},
				{
					width: 170,
					header: 'Куда',
					dataIndex: 'destination',
					xtype: 'combocolumn',
					store: 'Comp.CompLocations',
					onlyRenderer: true
				},
				{
					width: 170,
					header: 'Терминал',
					dataIndex: 'terminal',
					xtype: 'combocolumn',
					store: 'Comp.Terminals',
					onlyRenderer: true
				},
				{
					width: 170,
					header: 'Сотрудник',
					dataIndex: 'person',
					xtype: 'combocolumn',
					store: 'Comp.Persons',
					onlyRenderer: true
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
