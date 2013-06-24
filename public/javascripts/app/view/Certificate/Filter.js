//фильтр
Ext.define('app.view.Certificate.Filter', {
	extend: 'Ext.form.Panel',
	alias: 'widget.certificateFilter',
    
	defaults: {
		border: false,
		style: {
			margin: '5px'
		},
		width: 350,
		labelWidth: 150
	},
	
	items: [
		{
			id: 'innCertificate',
			xtype: 'textfield',
			fieldLabel: 'ИНН',
			msgTarget: 'side'
		},
		{
			id: 'ndocCertificate',
			xtype: 'textfield',
			msgTarget: 'side',
			fieldLabel: 'Номер накладной'
		},
		{
			id: 'goodsCodeCertificate',
			xtype: 'textfield',
			msgTarget: 'side',
			fieldLabel: 'Артикул товара'
		},
		{
			layout: 'vbox',
			bodyBorder: false,
			defaults: {
				style: {
					margin: '5px'
				}
			},
			items: [
				{
					xtype: 'button',
					id: 'filterCertificate',
					text: 'Поиск'
				},
				{
					id: 'errorCertificates',
					xtype: 'tbtext',
					hidden: true
				}
			]
		}
	],
	
	bbar: [
	]
});