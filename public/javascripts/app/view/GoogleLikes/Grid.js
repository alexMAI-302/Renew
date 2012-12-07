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
					dataIndex: 'title'
				},
				{
					width: 100,
					dataIndex: 'ddate',
					xtype: 'datecolumn',
					format: 'd.m.Y H:i'
				},
				{
					width: 90,
					dataIndex: 'likes'
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
