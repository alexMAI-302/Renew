Ext.define('app.controller.Placeunload.LinksCleaning', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Placeunload.LinksCleaning.Sites',
		'Placeunload.LinksCleaning.Buyers',
		'Placeunload.LinksCleaning.Placeunloads'
	],
	
	models: [
		'valueModel'
	],
	
	views: [
		'Placeunload.LinksCleaning.Container'
	],
	
	mainContainer: null,
	
	detailStore: null,
	masterStore: null,
	sitesStore: null,
	
	showServerError: function(responseText) {
		Ext.Msg.alert('Ошибка', responseText);
	},
	
	loadDetail: function(masterId, detailTable){
		var controller=this;
		
		controller.detailStore.proxy.extraParams={
			master_id: masterId
		};
		controller.detailStore.load(
			function(){
				detailTable.setDisabled(false);
			}
		);
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.Placeunload.LinksCleaning.Container');
		
		function getId(r){
			return (r!=null)?
					((r.getId()!=null && r.getId()!=0)?
						r.getId():
						r.get('id')
					):
					null;
		};
		
		controller.control({
			'#filterBuyers': {
				click: function(button){
					controller.masterStore.proxy.extraParams={
						ddateb: Ext.getCmp('ddatebBuyers').getValue(),
						ddatee: Ext.getCmp('ddateeBuyers').getValue(),
						site_id: Ext.getCmp('siteBuyers').getValue()
					};
					controller.masterStore.load(
						function(records, operation, success){
							if(!success){
								Ext.Msg.alert("Ошибка", "Ошибка при получении покупателей");
							}
							return true;
						}
					);
				}
			},
			'#BuyersTable': {
				selectionchange: function(sm, selected, eOpts){
					if(selected!=null && selected.length>0){
						controller.loadDetail(
							getId(selected[0]),
							Ext.getCmp('PlaceunloadsTable')
						);
					} else {
						controller.detailStore.removeAll();
						Ext.getCmp('PlaceunloadsTable').setDisabled(true);
					}
					Ext.getCmp('makeMainPlaceunloads').setDisabled(true);
					return true;
				}
			},
			'#PlaceunloadsTable': {
				selectionchange: function(sm, selected, eOpts){
					Ext.getCmp('makeMainPlaceunloads').setDisabled(selected==null || selected.length==0);
					return true;
				}
			},
			'#refreshPlaceunloads': {
				click: function(){
					var selected=Ext.getCmp('BuyersTable').getSelectionModel().getSelection();
					if(selected!=null && selected.length>0){
						controller.loadDetail(
							getId(selected[0]),
							Ext.getCmp('PlaceunloadsTable')
						);
					}
				}
			},
			'#makeMainPlaceunloads': {
				click: function(){
					var buyer=Ext.getCmp('BuyersTable').getSelectionModel().getSelection()[0],
						placeunload=Ext.getCmp('PlaceunloadsTable').getSelectionModel().getSelection()[0].copy();
					if(buyer!=null && placeunload!=null){
						Ext.Ajax.request({
							url: '/placeunload/links_cleaning/clean',
							timeout: 300000,
							method: 'POST',
							jsonData: {
								buyers: getId(buyer),
								placeunloads: controller.detailStore.collect('id'),
								main_placeunload: placeunload.get('id')
							},
							callback: function(options, success, response){
								if(success===true){
									controller.detailStore.removeAll();
									controller.detailStore.add(placeunload);
								} else {
									controller.showServerError(response.responseText);
								}
							}
						});
					}
				}
			}
		});
	},
	
	loadDictionaries: function(){
		var controller=this;
		
		controller.sitesStore.load();
	},
	
	initStores: function(){
		var controller=this;
		
		controller.detailStore=controller.getPlaceunloadLinksCleaningPlaceunloadsStore();
		controller.masterStore=controller.getPlaceunloadLinksCleaningBuyersStore();
		controller.sitesStore=controller.getPlaceunloadLinksCleaningSitesStore();
		
		controller.loadDictionaries();
	},
	
	bindStores: function(){
		var controller=this;
		
		Ext.getCmp('BuyersTable').reconfigure(controller.masterStore);
		Ext.getCmp('PlaceunloadsTable').reconfigure(controller.detailStore);
		Ext.getCmp('siteBuyers').bindStore(controller.sitesStore);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
	}
});