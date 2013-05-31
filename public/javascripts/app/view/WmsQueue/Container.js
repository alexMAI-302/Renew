Ext.define('app.view.WmsQueue.Container', {
    extend: 'app.view.Lib.Grid.Panel',
	
	requires: [
		'app.view.WmsQueue.Filter'
	],
	
	renderTo: 'wms_queue_js',
	height: Ext.getBody().getViewSize().height - 120,
	
	config: {
		suffix: 'WmsQueue',
		disableRefresh: true,
		disableAdd: true,
		disableDelete: true,
		disableSave: true,
		disableDeleteColumn: true,
		title: 'Очередь WMS',
		columnLines: true,
		beforeButtons: [
			{
				xtype: 'filterWmsQueue'
			}
		],
		columns: [
			{
				xtype: 'actioncolumn',
				width: 25,
				tooltip: 'Обработать',
				dataIndex: 'status',
				getClass: function(v, metaData){
					return (v==1)?'x-in_process':'x-ready_for_process';
				},
				handler: function(grid, rowIndex, colIndex, item, e, record, row){
					record.set('status', 1);
					Ext.Ajax.request({
						url: '/wms_queue/process_wms_queue_entry',
						timeout: 600000,
						method: 'POST',
						params: {
							authenticity_token: window._token,
							xid: record.get('xid')
						},
						callback: function(options, success, response){
							if(success!==true){
								
							} else {
								var data = eval('('+response.responseText+')'),
									store = grid.getStore();
								
								store.remove(record);
								store.add(data[0]);
								store.sort();
							}
							record.set('status', 0);
						}
					});
				}
			},
			{
				width: 60,
				header: 'id',
				dataIndex: 'id'
			},
			{
				width: 60,
				header: 'trans_id',
				dataIndex: 'trans_id'
			},
			{
				width: 60,
				header: 'Результат',
				dataIndex: 'result'
			},
			{
				width: 200,
				header: 'Запрос',
				dataIndex: 'request',
				renderer: function(v){
					v=Ext.String.htmlEncode(v);
					return v.substr(0, 255);
				},
				editor: {
					xtype: 'textarea'
				}
			},
			{
				width: 200,
				header: 'Ответ',
				dataIndex: 'reply',
				renderer: function(v){
					v=Ext.String.htmlEncode(v);
					return v.substr(0, 255);
				},
				editor: {
					xtype: 'textarea'
				}
			},
			{
				width: 50,
				header: 'Имя<br/>польз.',
				dataIndex: 'username'
			},
			{
				width: 85,
				header: 'Соединение',
				dataIndex: 'conn'
			},
			{
				width: 100,
				header: 'IP',
				dataIndex: 'ip'
			},
			{
				width: 120,
				header: 'Время изменения',
				dataIndex: 'ts'
			},
			{
				width: 120,
				header: 'Время создания',
				dataIndex: 'cts'
			},
			{
				width: 220,
				header: 'xid',
				dataIndex: 'xid'
			}
		]
	}
});