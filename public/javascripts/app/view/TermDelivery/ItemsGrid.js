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
					xtype: 'checkcolumn',
					width: 25
				},
				{
					xtype: 'rownumberer'
				},
				{
					width: 150,
					header: 'Зона',
					dataIndex: 'name'
				},
				{
					width: 50,
					header: 'Term. Id',
					dataIndex: 'price'
				},
				{
					width: 100,
					header: 'Имя терминала',
					dataIndex: 'price'
				},
				{
					width: 70,
					header: 'Последний<br/>сигнал',
					dataIndex: 'price',
					renderer: function(value, metaData, record){
						return (value)?Ext.Date.format(new Date(value), 'd.m.Y H:i'):'';
					}
				},
				{
					width: 70,
					header: 'Последний<br/>платеж',
					dataIndex: 'price',
					renderer: function(value, metaData, record){
						return (value)?Ext.Date.format(new Date(value), 'd.m.Y H:i'):'';
					}
				},
				{
					width: 70,
					header: 'Кол-во<br/>денег<br/>в терминале',
					dataIndex: 'price'
				},
				{
					width: 70,
					header: 'Кол-во<br/>купюр<br/>в терминале',
					dataIndex: 'price'
				},
				{
					width: 55,
					header: 'Уровень<br/>сигнала',
					dataIndex: 'price'
				},
				{
					width: 65,
					header: 'Состояние',
					dataIndex: 'price'
				},
				{
					width: 70,
					header: 'Причина<br/>включения<br/>в маршрут',
					dataIndex: 'price'
				},
				{
					width: 55,
					header: 'Система',
					dataIndex: 'price'
				},
				{
					width: 50,
					header: 'Вид<br/>поломки',
					dataIndex: 'price'
				},
				{
					width: 65,
					header: 'Отделение<br/>банка',
					dataIndex: 'price'
				},
				{
					width: 80,
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
			height: 400,
			viewConfig: {
				enableTextSelection: true
			}
		});
        
        this.callParent(arguments);
    }
});
