//проба
Ext.define('app.view.TermDelivery.ItemsGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.terminalsGrid',
	
	cls: 'terminals-grid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'terminalsTable',
			columns: [
				{
					align: 'center',
					xtype: 'checkcolumn'
				},
				{
					xtype: 'rownumberer'
				},
				{
					width: 250,
					header: 'Зона',
					dataIndex: 'name'
				},
				{
					width: 40,
					header: 'Term. Id',
					dataIndex: 'price'
				},
				{
					width: 40,
					header: 'Имя терминала',
					dataIndex: 'price'
				},
				{
					width: 40,
					header: 'Последний<br/>сигнал',
					dataIndex: 'price',
					renderer: function(value, metaData, record){
						return (value)?Ext.Date.format(new Date(value), 'd.m.Y H:i'):'';
					}
				},
				{
					width: 40,
					header: 'Последний<br/>платеж',
					dataIndex: 'price',
					renderer: function(value, metaData, record){
						return (value)?Ext.Date.format(new Date(value), 'd.m.Y H:i'):'';
					}
				},
				{
					width: 40,
					header: 'Кол-во денег<br/>в терминале',
					dataIndex: 'price'
				},
				{
					width: 40,
					header: 'Кол-во купюр<br/>в терминале',
					dataIndex: 'price'
				},
				{
					width: 40,
					header: 'Уровень<br/>сигнала',
					dataIndex: 'price'
				},
				{
					width: 40,
					header: 'Состояние',
					dataIndex: 'price'
				},
				{
					width: 40,
					header: 'Причина включения<br/>в маршрут',
					dataIndex: 'price'
				},
				{
					width: 40,
					header: 'Система',
					dataIndex: 'price'
				},
				{
					width: 40,
					header: 'Вид<br/>поломки',
					dataIndex: 'price'
				},
				{
					width: 40,
					header: 'Отделение<br/>банка',
					dataIndex: 'price'
				},
				{
					width: 40,
					header: 'Комментарий<br/>ОШ',
					dataIndex: 'price'
				}
			],
			tbar: [
				{
					text: 'Сформировать доставки',
					id: 'makeDelivery'
				}
			],
			height: 200,
			viewConfig: {
				enableTextSelection: true
			}
		});
        
        this.callParent(arguments);
    }
});
