Ext.define('app.controller.UnactInfoAdmin', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.UnactInfoAdmin.ActionModel'
	],
	
	stores: [
		'UnactInfoAdmin.Actions'
	],
	
	views: [
		'UnactInfoAdmin.Container',
		'UnactInfoAdmin.FileWindow'
	],
	
	actionsStore: null,
	fileWindow: null,
	actionId: null,
	
    init: function() {
    	var controller=this;
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		};
		
		Ext.Ajax.request.failure = showServerError;
		
		controller.mainContainer=Ext.create('app.view.UnactInfoAdmin.Container');
		controller.fileWindow=Ext.create('app.view.UnactInfoAdmin.FileWindow');
		
		controller.control({
			'#addActions': {
				click: function(button, e){
					var r = Ext.ModelManager.create({}, 'app.model.UnactInfoAdmin.ActionModel');
					controller.actionsStore.add(r);
				}
			},
			'#refreshActions': {
				click: function(button, e){
					controller.actionsStore.load();
					return true;
				}
			},
			'#saveActions': {
				click: function(button, e){
					controller.actionsStore.sync({
						callback: function(batch){
							if(batch.exceptions.length>0){
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							}
							controller.actionsStore.load();
						}
					});
					return true;
				}
			},
			'#uploadFile': {
				click: function(button) {
					var form = button.up('form').getForm();
					if(form.isValid()){
						form.submit({
							url: '/unact_info/admin/upload_file',
							params: {
								authenticity_token: window._token,
								action_id: controller.actionId
							},
							waitMsg: 'Загрузка данных...',
							success: function(fp, o) {
								controller.actionsStore.load();
								controller.fileWindow.hide();
							},
							errors: function(fp, o){
								controller.fileWindow.hide();
								Ext.Msg.alert("Ошибка обработки файла", o.result.errors);
							}
						});
					}
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.actionsStore=Ext.getCmp('ActionsTable').getStore();
	},
	
	initTables: function(){
		var controller=this,
			columnUpload = Ext.getCmp('ActionsTable').columns[4];
		
		columnUpload.handler = function(grid, rowIndex, colIndex){
			var r=grid.store.getAt(rowIndex);
			if(r.get('id')>0){
				controller.actionId=r.get('id');
				
				controller.fileWindow.setTitle("Обновить содержимое "+r.get("path"));
				controller.fileWindow.show();
				return true;
			} else {
				Ext.Msg.alert("Внимание", "Сохраните введенные данные, после этого загружайте файл");
				return false;
			}
		};
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.initTables();
	}
});