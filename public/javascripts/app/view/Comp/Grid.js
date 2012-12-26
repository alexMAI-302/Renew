//таблица
Ext.define('app.view.Comp.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.compGrid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'compTable',
			title: 'Комплектующие',
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
					width: 170,
					header: 'Комментарий',
					dataIndex: 'descr'
				}
			],
			selModel: {
				mode: "MULTI"
			},
			viewConfig: {
				enableTextSelection: true
			},
			plugins: [Ext.create('Ext.grid.plugin.RowEditing', {
				clicksToEdit: 2,
				pluginId: 'rowEditingComp'
			})],
			tbar: [
				{
					id: 'addComp',
					icon: '/ext/examples/shared/icons/fam/add.gif'
				}
			]
		});
        
        this.callParent(arguments);
    }
});
