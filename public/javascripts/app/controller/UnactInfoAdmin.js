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
			'#addFile': {
				click: function(button, e){
					var r = Ext.ModelManager.create({}, 'app.model.UnactInfoAdmin.ActionModel');
					controller.actionsStore.add(r);
				}
			},
			'#refresh': {
				click: function(button, e){
					controller.mainContainer.setLoading(true);
					controller.actionsStore.load();
					return true;
				}
			},
			'#save': {
				click: function(button, e){
					controller.mainContainer.setLoading(true);
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
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.actionsStore=controller.getUnactInfoAdminActionsStore();
		controller.actionsStore.addListener(
			"load",
			function(){
				controller.mainContainer.setLoading(false);
				return true;
			});
	},
	
	bindStores: function(){
		var controller=this;
		
		controller.mainContainer.reconfigure(controller.actionsStore);
	},
	
	initTables: function(){
		var controller=this,
			columnUpload = controller.mainContainer.columns[4];
		
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
		
		controller.bindStores();
		
		controller.initTables();
	}
});