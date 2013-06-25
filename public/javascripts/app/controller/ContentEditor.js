Ext.define('app.controller.ContentEditor', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'ContentEditor.Urls'
	],
	
	models: [
		'valueModel'
	],
	
	views: [
		'ContentEditor.Container'
	],
	
	mainContainer: null,
	
	urlsStore:null,
	contentId: null,
	
	filterContentEditor: function(){
		var controller=this,
			editor=Ext.getCmp('editorFieldContentEditor');
		
		editor.setLoading(true);
		Ext.Ajax.request({
			url: '/content_editor/content',
			timeout: 300000,
			params: {
				page_part_id: 1,
				url_id: Ext.getCmp('urlContentEditor').getValue()
			},
			method: "GET",
			callback: function(options, success, response){
				if(success===true){
					var data = eval('('+response.responseText+')');
					if(data!=null){
						editor.setHeight(data.height+25);
						editor.resizer.resizeTo(editor.getWidth(), data.height+25);
						editor.setValue(data.html);
						controller.contentId=data.id;
					} else {
						editor.setHeight(100);
						editor.resizer.resizeTo(editor.getWidth(), 100);
						editor.setValue('');
						controller.contentId=null;
					}
				} else {
					Ext.Msg.alert("Ошибка при загрузке данных", response.responseText)
				}
				editor.setLoading(false);
			}
		});
	},
	
	saveContentEditor: function(){
		var controller=this,
			editor=Ext.getCmp('editorFieldContentEditor');
		
		editor.setLoading(true);
		Ext.Ajax.request({
			url: '/content_editor/content',
			timeout: 300000,
			params: {
				id: controller.contentId,
				html: editor.getValue(),
				url_id: Ext.getCmp('urlContentEditor').getValue(),
				height: editor.getHeight()-25,
				authenticity_token: window._token
			},
			method: "POST",
			callback: function(options, success, response){
				if(success!==true){
					Ext.Msg.alert("Ошибка при загрузке сохранении", response.responseText)
				} else {
					var data = eval('('+response.responseText+')');
					controller.contentId=data.id;
				}
				editor.setLoading(false);
			}
		});
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.ContentEditor.Container');
		
		controller.control({
			'#filterContentEditor': {
				click: controller.filterContentEditor
			},
			'#saveContentEditor': {
				click: controller.saveContentEditor
			}
		});
		
	},
	
	initStores: function(){
		var controller=this;
		
		controller.urlsStore=Ext.getCmp('urlContentEditor').getStore();
		
		controller.urlsStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке списка страниц");
				}
			}
		);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});