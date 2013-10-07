Ext.define('app.view.goodsCatalog.FileWindow', {
	extend: 'Ext.window.Window',

	id: 'fileWindow',
	modal: true,
	resizable: false,
	closeAction: 'hide',
	items:
	[
		{
			xtype: 'form',
			enctype: 'utf-8',
			items: [
				{
					xtype: 'filefield',
					name: 'image',
					fieldLabel: 'Картинка',
					labelWidth: 60,
					msgTarget: 'side',
					allowBlank: false,
					width: 600,
					buttonText: 'Выберите файл'
				}
			],
			buttons: [
				{
					id: 'uploadFile',
					xtype: 'button',
					text: 'Загрузить'
				}
			]
		}
	]
});