Ext.define('app.controller.GoogleLikes', {
    extend: 'Ext.app.Controller',
	
	views: [
		'GoogleLikes.Container',
		'GoogleLikes.FileWindow'
	],
	
	stores: [
		'GoogleLikes.Actions'
	],
	
	actionsStore: null,
	fileWindow: null,
	actionId: null,
	
	filterActions: function(){
		var controller=this;
		controller.actionsStore.proxy.extraParams = {
			ddate: Ext.getCmp('ddate').getValue()
		};
		controller.actionsStore.load();
	},
	
    init: function() {
    	var controller=this;
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		};
		
		Ext.Ajax.request.failure = showServerError;
		
		controller.mainContainer=Ext.create('app.view.GoogleLikes.Container');
		controller.fileWindow=Ext.create('app.view.GoogleLikes.FileWindow');
		
		controller.control({
			'#refreshGoogleLikes':{
				click: function(){
					controller.fileWindow.show();
				}
			},
			'#filterGoogleLikes': {
				click: function(button, e){
					controller.mainContainer.setLoading(true);
					controller.filterActions();
					return true;
				}
			},
			'#uploadFile': {
				click: function(button) {
					var form = button.up('form').getForm();
					controller.mainContainer.setLoading(true);
					if(form.isValid()){
						form.submit({
							url: '/google_likes/upload_file',
							params: {
								authenticity_token: window._token
							},
							waitMsg: 'Загрузка данных...',
							success: function(fp, o) {
								controller.filterActions();
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
		
		controller.actionsStore=controller.getGoogleLikesActionsStore();
		controller.actionsStore.addListener(
			"load",
			function(){
				controller.mainContainer.setLoading(false);
				return true;
			});
	},
	
	bindStores: function(){
		var controller=this;
		
		Ext.getCmp('googleLikesTable').reconfigure(controller.actionsStore);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		controller.bindStores();
	}
});