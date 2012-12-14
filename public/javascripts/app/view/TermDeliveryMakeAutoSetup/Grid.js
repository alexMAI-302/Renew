//проба
Ext.define('app.view.TermDeliveryMakeAutoSetup.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.zonesGrid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'zonesTable',
			title: 'Зоны',
			columns: [
				{
					width: 150,
					header: 'Зона',
					dataIndex: 'name'
				},
				{
					width: 25,
					dataIndex: 'selected',
					xtype: 'checkcolumn'
				}
			],
			viewConfig: {
				enableTextSelection: true
			},
			bbar: [
				{
					id: 'saveZones',
					text: 'Сохранить зоны',
					icon: '/images/save.png'
				}
			]
		});
        
        this.callParent(arguments);
    }
});
