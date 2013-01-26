Ext.define('app.controller.DovTabs.Revoke', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Dov.PalmSalesmans',
		'Dov.Revoke.Dov'
	],
	
	views: [
		'Dov.Revoke.Container'
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
		
		controller.control({
			'#palmSalesmanRevoke': {
				select: function(combo, records){
					if(records!=null && records.length>0){
						controller.refreshDov();
					}
					return true;
				},
				change: function(field, newValue, oldValue, eOpts){
					Ext.getCmp('operations').setDisabled(true);
					return true;
				}
			},
			'#filterNdocRevoke': {
				change: function(field, newValue, oldValue, eOpts){
					if(newValue.substring(0, oldValue.length)!=oldValue){
						controller.dovStore.clearFilter(true);
					}
					controller.dovStore.filter("ndoc", new Regexp(newValue+'*'));
					return true;
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.dovStore=controller.getDovDovStore();
		controller.palmSalesmansStore=controller.getDovPalmSalesmansStore();
	},
	
	bindStores: function(){
		var controller=this;
		
		Ext.getCmp('DovTable').reconfigure(controller.dovStore);
		Ext.getCmp('palmSalesman').bindStore(controller.palmSalesmansStore);
	},
	
	initTables: function(){
		var controller=this,
			dovTable=Ext.get('DovTable'),
			revokeColumn=dovTable.columns[3],
			unusedColumn=dovTable.columns[4];
		
		function getClass(v){
			switch(v){
				case '1':
					return 'x-checked';
				break;
				case '0':
					return 'x-unchecked';
				break;
				case '-1':
					return 'x-wait';
				break;
			}
		};
		
		revokeColumn.getClass=getClass;
		unusedColumn.getClass=getClass;
		
		revokeColumn.handler=function(view, rowIndex, colIndex, item, e){
			var r = view.store.getAt(rowIndex),
				status=r.get('status');
			if(status!=-1 && r.get('unused')!=-1){
				r.set('status', -1);
				Ext.Ajax.request({
					url: '/dov/set_dov_status',
					timeout: 300000,
					method: "POST",
					params: {
						status: 1-abs(status)
					},
					success: function(response, e){
						var data = eval('('+response.responseText+')');
						r.set('status', data.status);
						if(data.status==1){
							r.set('message', 'Принято');
						}
					},
					failure: function(response, e){
						r.set('message', response.responseText);
					}
				});
			}
		};
		
		unusedColumn.handler=function(view, rowIndex, colIndex, item, e){
			var r = view.store.getAt(rowIndex),
				status=r.get('status'),
				unused=r.get('unused');
			
			if(oldStatus!=-1 && unused!=-1){
				r.set('status', -1);
				r.set('unused', -1);
				Ext.Ajax.request({
					url: '/dov/set_dov_unused',
					timeout: 300000,
					method: "POST",
					params: {
						unused: 1-abs(unused)
					},
					success: function(response, e){
						var data = eval('('+response.responseText+')');
						r.set('unused', data.unused);
						if(data.unused==1 && status==0){
							r.set('message', 'Принято');
							r.set('status', 1);
						} else {
							r.set('message', '');
							r.set('status', status);
						}
					},
					failure: function(response, e){
						r.set('message', response.responseText);
					}
				});
			}
		}
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
		
		controller.initTables();
	}
});