Ext.define('app.view.UnactInfoAdmin.FileWindow', {
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
					name: 'action_data',
					fieldLabel: 'Файл с информационными данными',
					labelWidth: 200,
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