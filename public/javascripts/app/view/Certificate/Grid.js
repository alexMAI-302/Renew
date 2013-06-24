//таблица
Ext.define('app.view.Certificate.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.certificateGrid',
    
	id: 'certificatesTable',
	store: 'Certificate.Certificates',
	title: 'Сертификаты',
	columns: [
		{
			width: 100,
			header: 'Номер накладной',
			dataIndex: 'ndoc'
		},
		{
			width: 80,
			header: 'Код товара',
			dataIndex: 'goods_code'
		},
		{
			width: 400,
			header: 'Наименование товара',
			dataIndex: 'goods_name'
		},
		{
			width: 100,
			header: 'Сертификат',
			dataIndex: 'certificate_number'
		},
		{
			xtype:'actioncolumn',
			width:20,
			icon: '/images/jpg-16.png',
			altText: 'Открыть как jpg',
			toolTip: 'Открыть как jpg',
			handler: function(grid, rowIndex){
				window.open(grid.store.getAt(rowIndex).get('jpg_url'));
			}
		},
		{
			xtype:'actioncolumn',
			width:20,
			icon: '/images/pdf-16.png',
			altText: 'Открыть как pdf',
			toolTip: 'Открыть как pdf',
			handler: function(grid, rowIndex){
				window.open(grid.store.getAt(rowIndex).get('pdf_url'));
			}
		}
	],
	viewConfig: {
		enableTextSelection: true
	}
});
