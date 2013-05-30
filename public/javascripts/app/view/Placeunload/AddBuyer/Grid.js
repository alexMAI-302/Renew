Ext.define('app.view.Placeunload.AddBuyer.Grid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.placeunloadsGrid',
	
	config: {
		store: 'Placeunload.AddBuyer.Placeunloads',
		suffix: 'Placeunloads',
		disableSave: true,
		disableAdd: true,
		disableDelete: true,
		disableDeleteColumn: true,
		disableRefresh: true,
		selModel: {
			mode: "SINGLE"
		},
		selType: 'checkboxmodel',
		columns: [
			{
				width: 90,
				header: 'Наименование',
				dataIndex: 'name',
					tdCls: 'x-wrap_cells'
			},
			{
				width: 240,
				header: 'Адрес/Полный адрес',
				renderer: function(v, metaData, rec){
					return rec.get('address')+"<br/>"+rec.get('fulladdress');
				},
				tdCls: 'x-wrap_cells'
			},
			{
				width: 60,
				header: 'ТП',
				dataIndex: 'tp',
				tdCls: 'x-wrap_cells'
			},
			{
				icon: '/images/edit.png',
				tooltip: 'Редактировать',
				xtype: 'actioncolumn',
				width: 25,
				handler: function(view, rowIndex, colIndex, item, e, record, row){
					window.open('/placeunload/points/index/'+record.get('id'), '_blank');
				}
			}
		]
	}
});