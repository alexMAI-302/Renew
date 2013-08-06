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
			ddateb: Ext.getCmp('ddatebRevoke').getValue(),
			ddatee: Ext.getCmp('ddateeRevoke').getValue(),
			salesman_id: Ext.getCmp('palmSalesmanRevoke').getValue(),
			show_all_revoke: Ext.getCmp('showAllRevoke').getValue()
		};
		controller.revokeContainer.setLoading(true);
		controller.dovStore.clearFilter(true);
		Ext.getCmp('filterNdocRevoke').setValue('');
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
		var controller = this,
			datesChanged = {
				select: function(combo, records){
					controller.refreshDov();
					return true;
				},
				change: function(el, newValue, oldValue, eOpts){
					if(el.isValid()){
						controller.refreshDov();
					}
				}
			};
		
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
					}
					return true;
				}
			},
			'#ddatebRevoke': datesChanged,
			'#ddateeRevoke': datesChanged,
			'#showAllRevoke': {
				change: function(field, newValue, oldValue, eOpts){
					controller.refreshDov();
					return true;
				}
			},
			'#filterNdocRevoke': {
				specialkey: function(field, e, eOpts){
					if(e.getKey()==e.ENTER){
						var value = field.getValue();
						if(value==null || value==''){
							controller.dovStore.clearFilter();
						} else {
							controller.dovStore.clearFilter(true);
							controller.dovStore.filter("ndoc", value);
						}
					}
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this,
			palmSalesmanRevoke = Ext.getCmp('palmSalesmanRevoke');
		
		controller.dovStore=Ext.getCmp('DovRevokeTable').store;
		controller.palmSalesmansStore=palmSalesmanRevoke.store;
		
		controller.palmSalesmansStore.add({
			id: -1,
			name: 'ВСЕ'
		});
		palmSalesmanRevoke.setValue(-1);
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
		
		controller.initTables();
	}
});