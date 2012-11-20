Ext.define('app.controller.UnactInfoAdmin', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.UnactInfoAdmin.ActionModel'],
    init: function() {
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		};
		
		Ext.Ajax.request.failure = showServerError;
	
		var actionsStore = Ext.create('Ext.data.Store', {
				model: 'app.model.UnactInfoAdmin.ActionModel',
				proxy: {
					type: 'rest',
					url : '/unact_info/admin/actions',
					appendId: false,
					reader: {
						type: 'json'
					},
					writer: {
						type: 'json'
					}
				},
				autoLoad: true,
				listeners: {
					load: function(){
						actionsPanel.setLoading(false);
						return true;
					}
				}
			}),
			cellEditingActions = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1
			}),
			fileWindow = Ext.create(
				'Ext.window.Window',
				{
					modal: true,
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
									labelWidth: 180,
									msgTarget: 'side',
									allowBlank: false,
									width: 900,
									buttonText: 'Выберите файл',
									validator: function(value){
										return (value!=null &&
											value.substring(value.length-4, value.length)!=null &&
											value.substring(value.length-4, value.length).toLowerCase()=='.pdf')?
											true:
											'Файл должен быть в формате pdf';
									}
								}
							],
							buttons: [
								{
									xtype: 'button',
									text: 'Загрузить',
									handler: function() {
										var form = this.up('form').getForm();
										if(form.isValid()){
											var selectedAction = actionsPanel.getSelectionModel().getSelection()[0];
												actionName = (selectedAction!=null)?selectedAction.get("id"):(fileWindow.down('filefield').getValue());
											form.submit({
												url: '/unact_info/admin/upload_file',
												params: {
													authenticity_token: window._token,
													action_name: actionName
												},
												waitMsg: 'Загрузка данных...',
												success: function(fp, o) {
													actionsStore.load();
													fileWindow.hide();
												},
												errors: function(fp, o){
													fileWindow.hide();
													Ext.Msg.alert("Ошибка обработки файла", o.result.errors);
												}
											});
										}
									}
								}
							]
						}
					]
				}
			),
			actionsPanel=Ext.create('Ext.grid.Panel', {
				id: 'actionsTable',
				title: 'Информационные материалы',
				store: actionsStore,
				renderTo: Ext.get('unact_info_js'),
				columns: [
					{
						header: 'Наименование',
						dataIndex: 'name',
						field: {
							xtype: 'textfield'
						},
						width: 300
					},
					{
						header: 'Размер, Байт',
						dataIndex: 'size'
					},
					{
						xtype:'actioncolumn',
						width:40,
						icon: '/images/view.png',
						handler: function(grid, rowIndex, colIndex){
							var name=grid.store.getAt(rowIndex).get("id");
							window.open("/unact_info/pdf/"+name, name, "target: '_blank'");
							return true;
						}
					},
					{
						xtype:'actioncolumn',
						width:40,
						icon: '/images/upload.png',
						handler: function(grid, rowIndex, colIndex){
							var name=grid.store.getAt(rowIndex).get("id");
							fileWindow.setTitle("Обновить содержимое "+name);
							fileWindow.show();
							return true;
						}
					},
					{
						xtype:'actioncolumn',
						width:40,
						icon: '/ext/examples/shared/icons/fam/cross.gif',
						handler: function(grid, rowIndex, colIndex){
							var currentRecord=grid.store.getAt(rowIndex);
							cellEditingActions.cancelEdit();
							
							actionsStore.remove(currentRecord);
						}
					}
				],
				plugins: [cellEditingActions],
				tbar: [
					{
						text: 'Добавить файл',
						handler: function(button, e){
							fileWindow.setTitle("Добавить новый файл");
							fileWindow.show();
							return true;
						}
					},
					{
						text: 'Обновить',
						icon: '/ext/examples/shared/icons/fam/table_refresh.png',
						handler: function(button, e){
							actionsPanel.setLoading(true);
							actionsStore.load();
							return true;
						}
					},
					{
						text: 'Сохранить',
						icon: '/images/save.png',
						handler: function(button, e){
							actionsPanel.setLoading(true);
							actionsStore.sync({
								callback: function(batch){
									if(batch.exceptions.length>0){
										Ext.Msg.alert("В процессе сохранения возникли ошибки: "+batch.exceptions);
									}
									actionsPanel.setLoading(false);
								}
							});
							return true;
						}
					}
				]
			});
	}
});