//таблица
Ext.define('app.view.TermDelivery.MakeAutoSetup.Inc.GridNormes', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.normesGrid',
	
	requires: [
		'app.view.TermDelivery.MakeAutoSetup.Inc.FilterNormes'
	],
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'normesTable',
			title: 'Нормативы',
			height: 300,
			columns: [
				{
					width: 150,
					header: 'Зона',
					dataIndex: 'zone',
					field: {
						xtype: 'combo',
						displayField: 'name',
						valueField: 'id'
					}
				},
				{
					width: 70,
					header: 'Период',
					dataIndex: 'period',
					field: {
						xtype: 'combo',
						displayField: 'name',
						valueField: 'id'
					}
				},
				{
					width: 60,
					xtype: 'numbercolumn',
					header: 'Рабочие',
					dataIndex: 'wdvalue',
					format: '0',
					field: {
						xtype: 'numberfield',
						allowDecimal: false
					}
				},
				{
					width: 60,
					xtype: 'numbercolumn',
					header: 'Суббота',
					dataIndex: 'satvalue',
					format: '0',
					field: {
						xtype: 'numberfield',
						allowDecimal: false
					}
				},
				{
					width: 75,
					xtype: 'numbercolumn',
					header: 'Воскресение',
					dataIndex: 'sunvalue',
					format: '0',
					field: {
						xtype: 'numberfield',
						allowDecimal: false
					}
				},
				{
					xtype:'actioncolumn',
					width:20,
					icon: '/ext/examples/shared/icons/fam/cross.gif',
					handler: function(grid, rowIndex){
						grid.store.removeAt(rowIndex);
					}
				}
			],
			viewConfig: {
				enableTextSelection: true
			},
			plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1,
				pluginId: 'cellEditingNorm'
			})],
			tbar: [
				{
					xtype: 'normesFilter'
				},
				{
					id: 'saveNormes',
					icon: '/images/save.png'
				},
				{
					id: 'addNorm',
					icon: '/ext/examples/shared/icons/fam/add.gif'
				}
			]
		});
        
        this.callParent(arguments);
    }
});