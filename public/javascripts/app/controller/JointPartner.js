Ext.define('app.controller.JointPartner', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'JointPartner.Partner',
		'JointPartner.Pricelist',
		'JointPartner.PricelistCombo',
		'JointPartner.TP',
		'JointPartner.TPCombo'
	],
	
	models: [
		'valueModel',
		'JointPartner.PartnerModel',
		'JointPartner.PlAllModel',
		'JointPartner.PricelistModel',
		'JointPartner.TPComboModel',
		'JointPartner.PricelistComboModel',
		'JointPartner.TPModel'
	],
	
	views: [
		'JointPartner.Container'
		
	],
	
	Container: null,
	partnerStore: null,
	detailStore: null,
	podrStore: null,
	records: null,
	tpComboStore: null,
	plAllComboStore: null,
	plComboStore: null,
	pricelistStore:null,
	lastPodr:null,
	lastPlaceunload:null,
	
		
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	syncMaster: function(container, selectedMasterId){
		var controller=this;
		function syncDetail(container, masterId){
			if (
				(controller.detailStore.getNewRecords().length > 0) ||
				(controller.detailStore.getUpdatedRecords().length > 0) ||
				(controller.detailStore.getRemovedRecords().length > 0)){
				
				if(masterId!=null){
					controller.detailStore.proxy.extraParams={
						master_id: masterId
					};
					
					controller.detailStore.sync({
						callback: function(batch){
							if(batch.exceptions.length>0){
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							}
							container.setLoading(false);
						}
					});
				} else {
					Ext.Msg.alert("Внимание", "Ваши данные в таблице с детализацией были утеряны. Сначала сохраняйте данные в основной таблице, затем вводите детализацию.");
					container.setLoading(false);
				}
			} else {
				container.setLoading(false);
			}
		};
		
		if (
			(controller.masterStore.getNewRecords().length > 0) ||
			(controller.masterStore.getUpdatedRecords().length > 0) ||
			(controller.masterStore.getRemovedRecords().length > 0)){
				
			container.setLoading(true);
			controller.masterStore.sync({
				callback: function(batch){
					if(batch.exceptions.length>0){
						Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
						container.setLoading(false);
					} else {
						syncDetail(container, selectedMasterId);
					}
				}
			});
		} else {
			syncDetail(container, selectedMasterId);
		}
	},
	saveTP : function ()	{
		var controller=this,
			rows=[];
		
		controller.Container.setLoading(true);
		
		controller.detailStore.each(function(r){
			if(r.dirty){
				for (var i = 0; i < controller.records.length; i++) 
				{
					if (r.modified['tp_'+controller.records[i].id]!==undefined)
					{
						rows.push({
							contractant : Ext.getCmp('PartnerTable').getSelectionModel().getSelection()[0].get('id'),
							podr	: r.get('id'),
							placeunload	: controller.records[i].id,
							value	: r.get('tp_'+controller.records[i].id),
						});
					};
				}
			}
			
			return true;
		});
		
		Ext.Ajax.request({
			url: '/joint_partner/tp',
			params: {authenticity_token: window._token},
			jsonData: rows,
			method: 'POST',
			timeout: 300000,
			success: function(response){
				controller.refreshTP();
				controller.Container.setLoading(false);
			},
			failure: function(response){
				controller.Container.setLoading(false);
				controller.showServerError(response);
			}
		});
	},
	savePricelist : function ()	{
		var controller=this,
			rows=[];
		
		controller.Container.setLoading(true);
		
		controller.pricelistStore.each(function(r){
			if(r.dirty){
				rows.push({
					contractant : Ext.getCmp('PartnerTable').getSelectionModel().getSelection()[0].get('id'),
					plset	: r.get('id'),
					podr	: r.get('podr'),
					placeunload	: r.get('placeunload'),
					pricelist	: r.get('pricelist')
				});
			}
		});
		
		Ext.Ajax.request({
			url: '/joint_partner/pricelist',
			params: {authenticity_token: window._token},
			jsonData: rows,
			method: 'POST',
			timeout: 300000,
			success: function(response){
				controller.refreshPricelist();
				controller.Container.setLoading(false);
			},
			failure: function(response){
				controller.Container.setLoading(false);
				controller.showServerError(response);
			}
		});
	},
	loadDetail: function(masterId){
		var controller=this;
		var columns = null;
		var fields = null;
		controller.Container.setLoading(true);
		Ext.Ajax.request({
			url: '/joint_partner/placeunload',	
			params: {contractant: masterId,
					authenticity_token: window._token
				},	
			method : "GET",
			async: false,
			success: function(response){
				var response_json=Ext.JSON.decode(response.responseText, true);
				controller.records=response_json;
			return response.responseText;
		
			}
		});	
		
		columns = [
					{
						width: 200,
						header: 'Подразделение',
						dataIndex: 'id'
					}
				];
		
		
		fields = [{
			name: 'id',
			type: 'int'
			}];
		
		for (var i = 0; i < controller.records.length; i++) {

			fields[i+1] =  {
				name: 'tp_'+controller.records[i].id,
				type: 'int'	
			};
					
			columns[i+1] = {
				header: controller.records[i].name,
				dataIndex: 'tp_'+controller.records[i].id,
				width: 150
			};
			
		};
		
		
		Ext.define('app.model.JointPartner.TPModel', {
					extend: 'Ext.data.Model',
					fields: fields,
			});	
				
		controller.detailStore.proxy.setModel('app.model.JointPartner.TPModel',true);
		Ext.getCmp('TPTable').reconfigure(controller.detailStore, columns); 
		
		podrColumn=Ext.getCmp('TPTable').getView().getGridColumns()[0];;
		controller.makeComboColumn(podrColumn,controller.podrStore,controller.detailStore);
		for (var i = 0; i < controller.records.length; i++) {
			col=Ext.getCmp('TPTable').getView().getGridColumns()[i+1];
			controller.makeComboColumn(col,controller.tpComboStore,controller.detailStore);
			col.field.addListener(
			"focus",
			function(field, eOpts){
				var r = Ext.getCmp('TPTable').getSelectionModel().getSelection()[0];
				controller.tpComboStore.clearFilter(true);
				controller.tpComboStore.filter("podr",r.get('id'));
				return true;
			}
		);

		
		};
				
				
		
		controller.refreshTP(masterId);
		
	},
	refreshPartner: function(){
		var controller = this;
		

		controller.partnerStore.proxy.extraParams={
			inn: Ext.getCmp('filterInn').getValue(),
			name: Ext.getCmp('filterName').getValue()
		};
		controller.Container.setLoading(true);
		controller.partnerStore.load(
			function(records, operation, success){
							controller.Container.setLoading(false);
							if(!success){
								Ext.Msg.alert("Ошибка выборки данных");
							};							
							return true;
						}
		);
		
	},
	refreshTP: function(masterId){
		var controller = this,
			selected=Ext.getCmp('PartnerTable').getSelectionModel().getSelection();
		
		controller.Container.setLoading(true);
		if (masterId==null)
		{
			if(selected!=null && selected.length>0){
				masterId=selected[0].get('id');
			} else
			{
				masterId=-1
			}
		}
		
		controller.detailStore.proxy.extraParams={
			master_id: masterId
		};
		controller.detailStore.load(
			function(){
				controller.Container.setLoading(false);
				Ext.getCmp('TPTable').setDisabled(false);
			}
		);
		
		
	},
	refreshPricelist: function(podr,placeunload){
		var controller = this,
			selected=Ext.getCmp('PartnerTable').getSelectionModel().getSelection();
		
		if (podr==null) {
			podr=controller.lastPodr;
			placeunload=controller.lastPlaceunload;		
		}
		else{
			controller.lastPodr=podr;
			controller.lastPlaceunload=placeunload;
		};
		
		controller.pricelistStore.proxy.extraParams={
			podr: podr,
			placeunload: placeunload
		};
		controller.pricelistStore.load(
			function(){
				Ext.getCmp('PricelistTable').setDisabled(false);
			}
		);
		
		
	},
	
	
	init: function() {
		var controller = this;
		controller.plComboStore = Ext.create('app.store.JointPartner.PricelistCombo');
		controller.plComboStore.load();
		Ext.define('app.model.JointPartner.TPComboModel', {
			extend: 'Ext.data.Model',
			fields: [
			{name: 'id'			, type: 'int'},
			{name: 'name',   type: 'string'},
			{name: 'podr',   type: 'int'}
			]
		});

		controller.tpComboStore = Ext.create('app.store.JointPartner.TPCombo');
		controller.tpComboStore.load();	

		controller.Container=Ext.create('app.view.JointPartner.Container');
		controller.Container.addListener(
				"show",
				function(){
					//controller.loadDictionaries();
				}
		);
				
				
				
		function getId(r){
			return (r!=null)?
					((r.getId()!=null && r.getId()!=0)?
						r.getId():
						r.get('id')
					):
					null;
		}
				
		controller.control({
			'#PartnerTable': {
				selectionchange: function(sm, selected, eOpts){
					if(selected!=null && selected.length>0){
						controller.loadDetail(
							getId(selected[0]),
							Ext.getCmp('TPTable')
						);
					} else {
						controller.detailStore.removeAll();
						Ext.getCmp('TPTable').setDisabled(true);
					}
					return true;
				}
			},
			'#refreshPartner': {
				click: function() {
					controller.refreshPartner();
				}

			},
			'#filterName': {
				specialkey: function(field, e, eOpts){
					if(e.getKey()==e.ENTER){
						controller.refreshPartner();
					}
				}
			},
			'#filterInn': {
				specialkey: function(field, e, eOpts){
					if(e.getKey()==e.ENTER){
						controller.refreshPartner();
					}
				}
			},
			'#TPTable': {
				cellclick: function( sm, td, cellIndex, record, tr, rowIndex, e, eOpts ){
					if(record!=null && cellIndex>0){
						controller.refreshPricelist(
							record.get('id'),
							record.fields.items[cellIndex].name.substr(3)
						);
					} else {
						controller.pricelistStore.removeAll();
						Ext.getCmp('PricelistTable').setDisabled(true);
					}
					return true;
				}
			},
			'#saveTP': {
				click: function(){
					controller.saveTP();
					return true;
				}
			},
			'#addTP': {
				click: function(){
					var r = Ext.ModelManager.create({
						}, 'app.model.JointPartner.TPModel');
					controller.detailStore.insert(0, r);
					return true;
				}
			},
			'#refreshTP': {
				click: function(){
					controller.refreshTP();
				}
			},
			'#savePricelist': {
				click: function(){
					controller.savePricelist();
					return true;
				}
			},
		});
		
		
	controller.initStores();
	},
	
	loadDictionaries: function(){
		var controller=this;
		
		/*controller.partnerStore.load();
		controller.detailStore.proxy.extraParams={
			master_id: -1
		};
		controller.detailStore.load();*/
		
		/*for (var i = 0; i < controller.records.length; i++) {
			col=Ext.getCmp('TPTable').columns[i+2];
			controller.makeComboColumn(col,controller.tpComboStore,controller.detailStore, '');
		}*/
	},
	
	initStores: function(){
		var controller=this,
			partnerTable = Ext.getCmp('PartnerTable'),
			TPTable=Ext.getCmp('TPTable'),
			pricelistTable = Ext.getCmp('PricelistTable'),
			podrColumn=TPTable.columns[0],
			pricelistColumn=pricelistTable.columns[4];
			

		controller.detailStore=TPTable.store;
		controller.partnerStore=partnerTable.store;
		controller.pricelistStore=pricelistTable.store;
		controller.podrStore=Ext.create('Ext.data.Store', {
			extend: 'Ext.data.Store',
			model: 'app.model.valueModel',
			proxy: {
				type: 'rest',
				url : '/joint_partner/podr',
				reader: {
					type: 'json'
				}
			}
		});
		controller.podrStore.load();
		
		controller.makeComboColumn(pricelistColumn,controller.plComboStore,controller.pricelistStore);
		Ext.getCmp('PricelistTable').columns[4].field.addListener(
			"focus",
			function(field, eOpts){
				var r = Ext.getCmp('PricelistTable').getSelectionModel().getSelection()[0];
				controller.plComboStore.clearFilter(true);
				controller.plComboStore.filter("plset",r.get('id'));
				return true;
			}
		);
		
		//controller.loadDictionaries();
	},
	
	makeComboColumn: function(column, storeCombo, tableStore, property, allowNull, onlyRenderer){
		function renderer(value){
			var matching = null,
				data=storeCombo.snapshot || storeCombo.data;
			data.each(function(record){
				if(record.get('id')==value){
					matching=record.get('name');
				}
				return matching==null;
			});
			return matching;
		};
		
		if(!onlyRenderer){
			column.field = Ext.create('Ext.form.ComboBox', {
				store: storeCombo,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				value: "",
				autoSelect: (allowNull!==true)
			});
		}
		column.renderer=renderer;
		
		
	}
});