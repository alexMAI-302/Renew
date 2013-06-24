//таблица
Ext.define('app.view.GoogleLikes.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.googleLikesGrid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'googleLikesTable',
			title: 'Статистика',
			columns: [
				{
					width: 700,
					dataIndex: 'title',
					text: 'Краткое содержание'
				},
				{
					width: 100,
					dataIndex: 'ddate',
					xtype: 'datecolumn',
					format: 'd.m.Y H:i',
					text: 'Дата записи'
				},
				{
					width: 90,
					dataIndex: 'likes',
					text: 'Плюсы'
				}
			],
			width: 900,
			viewConfig: {
				enableTextSelection: true
			}
		});
        
        this.callParent(arguments);
    }
});
