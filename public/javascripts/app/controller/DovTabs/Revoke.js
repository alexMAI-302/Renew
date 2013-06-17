Ext.define('app.controller.DovTabs.Revoke', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Dov.PalmSalesmans',
		'Dov.Revoke.Dov'
	],
	
	views: [
		'Dov.Revoke.Container'
	],
	
	models: [
		'valueModel'
	],
	
	revokeContainer: null,
	
	refreshDov: function(){
		var controller=this;
		
		controller.dovStore.proxy.extraParams={
			salesman_id: Ext.getCmp('palmSalesmanRevoke').getValue(),
			show_all_revoke: Ext.getCmp('showAllRevoke').getValue()
		};
		
		controller.dovStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке доверенностей");
				}
				controller.revokeContainer.setLoading(false);
			}
		);
	},
	
	init: function() {
		var controller = this;
		
		controller.revokeContainer=Ext.create('app.view.Dov.Revoke.Container');
		Ext.getCmp('DovMain').add(controller.revokeContainer);
		
		controller.revokeContainer.addListener(
			"show",
			function(){
				controller.refreshDov();
			}
		);
		
		controller.control({
			'#palmSalesmanRevoke': {
				select: function(combo, records){
					if(records!=null && records.length>0){
						controller.refreshDov();
						Ext.getCmp('filterNdocRevoke').setValue('');
					}
					return true;
				}
			},
			'#showAllRevoke': {
				change: function(field, newValue, oldValue, eOpts){
					controller.refreshDov();
					return true;
				}
			},
			'#filterNdocRevoke': {
				change: function(field, newValue, oldValue, eOpts){
					if(newValue==null || newValue==''){
						controller.dovStore.clearFilter();
					} else {
						if(oldValue!=null && newValue.substring(0, oldValue.length-1)!=oldValue){
							controller.dovStore.clearFilter(true);
						}
						controller.dovStore.filter("ndoc", newValue);
					}
					return true;
				},
				focus: function(field, e, eOpts){
					field.setValue('');
					return true;
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.dovStore=controller.getDovRevokeDovStore();
		controller.palmSalesmansStore=Ext.create('app.store.Dov.PalmSalesmans');
		
		controller.palmSalesmansStore.add({
			id: -1,
			name: 'ВСЕ'
		});
		Ext.getCmp('palmSalesmanRevoke').setValue(-1);
		controller.palmSalesmansStore.addListener({
			load: function(store, records, successful, eOpts){
				if(successful!==true){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке списка торговых представителей. Попробуйте обновить страницу.")
				}
			}
		});
		
		controller.palmSalesmansStore.load({
			addRecords: true
		});
	},
	
	bindStores: function(){
		var controller=this;
		
		Ext.getCmp('DovRevokeTable').reconfigure(controller.dovStore);
		Ext.getCmp('palmSalesmanRevoke').bindStore(controller.palmSalesmansStore);
	},
	
	initTables: function(){
		var controller=this,
			dovTable=Ext.getCmp('DovRevokeTable'),
			revokeColumn=dovTable.columns[4],
			unusedColumn=dovTable.columns[5];
		
		function getClass(v){
			switch(v){
				case 1:
					return 'x-checked';
				case 0:
					return 'x-unchecked';
				case -1:
					return 'x-wait';
			}
		};
		
		revokeColumn.getClass=function(v, metadata, r){
			return getClass(r.get('status'));
		};
		unusedColumn.getClass=function(v, metadata, r){
			return getClass(r.get('unused'));
		};
		
		revokeColumn.handler=function(view, rowIndex, colIndex, item, e){
			var r = view.store.getAt(rowIndex),
				status=r.get('status');
			if(status!=-1 && r.get('unused')!=-1){
				r.set('status', -1);
				r.set('message', '');
				dovTable.updateLayout();
				Ext.Ajax.request({
					url: '/dov/set_dov_status',
					timeout: 300000,
					method: "POST",
					params: {
						id: r.get('id'),
						status: 1-Math.abs(status),
						authenticity_token: window._token
					},
					success: function(response, e){
						var data = eval('('+response.responseText+')');
						r.set('status', data.status);
						if(data.status==1){
							r.set('message', 'Принято');
						} else {
							r.set('message', '');
							r.set('unused', 0);
						}
						r.set('renew_user', data.renew_user);
						dovTable.updateLayout();
					},
					failure: function(response, e){
						Ext.Msg.alert('Ошибка', response.responseText);
						controller.refreshDov();
					}
				});
			}
		};
		
		unusedColumn.handler=function(view, rowIndex, colIndex, item, e){
			var r = view.store.getAt(rowIndex),
				status=r.get('status'),
				unused=r.get('unused');
			
			if(status!=-1 && unused!=-1){
				r.set('status', -1);
				r.set('unused', -1);
				r.set('message', '');
				dovTable.updateLayout();
				Ext.Ajax.request({
					url: '/dov/set_dov_unused',
					timeout: 300000,
					method: "POST",
					params: {
						id: r.get('id'),
						unused: 1-Math.abs(unused),
						authenticity_token: window._token
					},
					success: function(response, e){
						var data = eval('('+response.responseText+')');
						r.set('unused', data.unused);
						if(data.unused==1){
							r.set('message', 'Принято');
							r.set('status', 1);
						} else {
							r.set('message', '');
							r.set('status', status);
						}
						r.set('renew_user', data.renew_user);
						dovTable.updateLayout();
					},
					failure: function(response, e){
						Ext.Msg.alert('Ошибка', response.responseText);
						controller.refreshDov();
					}
				});
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