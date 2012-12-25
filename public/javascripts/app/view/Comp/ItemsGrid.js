Ext.define('app.view.Comp.ItemsGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.operationsGrid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'operationsTable',
			title: 'Местонахождение',
			disabled: true,
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
			viewConfig: {
				enableTextSelection: true
			}
		});
        
        this.callParent(arguments);
    }
});
