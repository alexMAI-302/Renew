//таблица
Ext.define('app.view.TermDelivery.MakeAutoSetup.Inc.GridWorkdays', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.workdaysGrid',
	
	requires: [
		'app.view.TermDelivery.MakeAutoSetup.Inc.FilterWorkdays'
	],
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'workdaysTable',
			title: 'Типы дней для посещения',
			height: 300,
			columns: [
				{
					width: 120,
					header: 'Дата',
					dataIndex: 'ddate',
					xtype: 'datecolumn',
					format: 'Y-m-d',
					field: {
						xtype: 'datefield',
						format: 'Y-m-d'
					}
				},
				{
					width: 110,
					header: 'Тип',
					dataIndex: 'type',
					field: {
						xtype: 'combo',
						displayField: 'name',
						valueField: 'id'
					}
				}
			],
			viewConfig: {
				enableTextSelection: true
			},
			plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1,
				pluginId: 'cellEditingWorkday'
			})],
			tbar: [
				{
					xtype: 'workdaysFilter'
				},
				{
					id: 'saveWorkdays',
					icon: '/images/save.png'
				},
				{
					id: 'addWorkday',
					icon: '/ext/examples/shared/icons/fam/add.gif'
				}
			]
		});
        
        this.callParent(arguments);
    }
});