//проба
Ext.define('app.view.TermDelivery.MakeAutoSetup.Common.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.terminalsGrid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'terminalsTable',
			columns: [
				{
					width: 250,
					header: 'Наименование',
					dataIndex: 'name',
					tdCls: 'x-wrap_cells'
				},
				{
					width: 50,
					header: 'Код',
					dataIndex: 'code'
				},
				{
					width: 250,
					header: 'Адрес',
					dataIndex: 'address',
					tdCls: 'x-wrap_cells'
				},
				{
					width: 80,
					header: 'Понедельник',
					align: 'center',
					dataIndex: 'monday',
					xtype: 'checkcolumn'
				},
				{
					width: 60,
					header: 'Вторник',
					align: 'center',
					dataIndex: 'tuesday',
					xtype: 'checkcolumn'
				},
				{
					width: 50,
					header: 'Среда',
					align: 'center',
					dataIndex: 'wednesday',
					xtype: 'checkcolumn'
				},
				{
					width: 60,
					header: 'Четверг',
					align: 'center',
					dataIndex: 'thursday',
					xtype: 'checkcolumn'
				},
				{
					width: 60,
					header: 'Пятница',
					align: 'center',
					dataIndex: 'friday',
					xtype: 'checkcolumn'
				},
				{
					width: 60,
					header: 'Суббота',
					align: 'center',
					dataIndex: 'saturday',
					xtype: 'checkcolumn'
				},
				{
					width: 80,
					header: 'Воскресение',
					align: 'center',
					dataIndex: 'sunday',
					xtype: 'checkcolumn'
				}
			],
			viewConfig: {
				enableTextSelection: true
			}
		});
        
        this.callParent(arguments);
    }
});
