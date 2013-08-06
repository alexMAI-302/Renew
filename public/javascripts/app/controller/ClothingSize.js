+Ext.define('app.controller.ClothingSize', {
    extend: 'Ext.app.Controller',
	
	views: [
		'ClothingSize.Container'
	],
	
	stores: [
		'ClothingSize.Dept',
		'ClothingSize.ClothingSize'
	],
	DeptStore:null,
	ClothingSizeStore:null,
	mainContainer: null,
	
	init: function() {
		var controller = this;
		controller.mainContainer = Ext.create('app.view.ClothingSize.Container');
		
		controller.control({
			'#DeptTable': {
				selectionchange: function(sm, selected, eOpts){
					if(selected!=null && selected.length>0){
						controller.ClothingSizeStore.proxy.extraParams={
							dept_id: selected[0].get('id')
						};
						controller.ClothingSizeStore.load();
						Ext.getCmp('ClothingSizeTable').setDisabled(false);
					} else {
						Ext.getCmp('ClothingSizeTable').setDisabled(true);
					}
					return true;
				}
			},
			'#saveClothingSize': {
				click: function(){
					controller.mainContainer.setLoading(true);
					controller.ClothingSizeStore.sync({
						callback: function(batch){
							if(batch.exceptions.length>0){
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							}
							controller.mainContainer.setLoading(false);
						}
					});
					controller.mainContainer.setLoading(false);
					return true;
				}
			},
			
		});
	},
	initStores: function(){
		var controller=this;
		controller.ClothingSizeStore=controller.getClothingSizeClothingSizeStore();
	},
	bindStores: function(){
		var controller=this;
	},
	initTables: function(){
		var controller=this;
	},
	onLaunch: function(){
		var controller = this;
		controller.initStores();
		controller.bindStores();
		controller.initTables();
	},

});