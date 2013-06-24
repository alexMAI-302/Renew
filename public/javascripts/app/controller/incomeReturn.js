Ext.define('app.controller.incomeReturn', {
    extend: 'Ext.app.Controller',
	stores: [
		'incomeReturn.income',
		'incomeReturn.inn',
		'incomeReturn.pr',
		'incomeReturn.seller',
		'incomeReturn.org',
		'incomeReturn.goods',
		'incomeReturn.measure',
		'incomeReturn.mrs',
		'incomeReturn.site',
		'incomeReturn.incomeReturn'],
	models: [
		'app.model.valueModel',
		'app.model.valueStrModel',
		'app.model.incomeReturn.incomeModel',
		'app.model.incomeReturn.incomeReturnModel',
		'app.model.incomeReturn.goodsModel',
		'app.model.incomeReturn.measureModel',
		'app.model.incomeReturn.mrsModel'],
	requires: [
		'app.view.incomeReturn.container'
	],
	
	incomeStore:null,
	innStore:null,	
	prStore:null,
	sellerStore:null,
	orgStore: null,
	goodsStore: null,
	measureStore: null,
	currentMeasureStore: null,
	mrsStore: null,
	siteStore: null,
	incomeReturnStore:null,
	mainContainer: null,
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	rowNavigation: function (field, e, eOpts){
			var controller = this;
			var irStore=field.up().up().store;
			var key=e.getKey(),
				sm=Ext.getCmp('IncomeReturnTable').getSelectionModel(),
				r=sm.getSelection()[0];
				
			if(key==e.UP || key==e.DOWN || key==e.ENTER ){
				var direction = (key==e.UP)? -1 : (key==e.DOWN || key==e.ENTER ? 1 : 0),
					index = irStore.indexOf(r) + direction,
					editingPlugin = Ext.getCmp('IncomeReturnTable').getPlugin('celleditingIncomeReturn');
				
				e.stopEvent();
				if(index>=0 && index<irStore.getCount()){
					var newR = irStore.getAt(index);
					sm.select(newR, true);
					editingPlugin.startEdit(newR, 9);
				}
			}
			
			return true;
		},
	loadMeasureStore: 	function (goods,msrh_id){
		var controller=this;
		var currentMeasureData=[];
		var ms_id;
		var measureRecord;
		
		if(goods!=null){
			if(msrh_id!=null){
				controller.mrsStore.clearFilter();
				controller.mrsStore.filter([{property:"msrh_id", value: msrh_id}]);
				controller.mrsStore.each(
					function(record){
						ms_id=record.get('ms_id');
						measureRecord = controller.measureStore.findRecord('id',ms_id);
						currentMeasureData.push({
								id: ms_id,
								name: measureRecord.get('name'),
								rel: record.get('rel')
							});						
						return true;
					}
				);
			}	
		}
		
		controller.currentMeasureStore.loadData(currentMeasureData, false);
	},
		
	saveIncomeReturn: function(){
		var controller=this;
		var rows = [];

		if (Ext.getCmp('incomeCombo').getValue()==null)
		{
			Ext.Msg.alert('Ошибка', 'Необходимо выбрать приход');
			return;
		};
		
		if (Ext.getCmp('prCombo').getValue()==null)
		{
			Ext.Msg.alert('Ошибка', 'Необходимо выбрать получателя платежей');
			return;
		};
		
		if (Ext.getCmp('sellerCombo').getValue()==null)
		{
			Ext.Msg.alert('Ошибка', 'Необходимо выбрать поставщика');
			return;
		};
		
		if (Ext.getCmp('orgCombo').getValue()==null)
		{
			Ext.Msg.alert('Ошибка', 'Необходимо выбрать организацию');
			return;
		};
		
		if (Ext.getCmp('doc_ddate').getValue()==null)
		{
			Ext.Msg.alert('Ошибка', 'Необходимо задать дату документа');
			return;
		};
		controller.mainContainer.setLoading(true);
	
		controller.incomeReturnStore.each(function(r){
			rows.push({
				ddate:		Ext.Date.format(Ext.getCmp('doc_ddate').getValue(), 'Y-m-d'),
				income:		Ext.getCmp('incomeCombo').getValue(),
				inn:		Ext.getCmp('innCombo').getValue(),
				pr :		Ext.getCmp('prCombo').getValue(),
				seller:		Ext.getCmp('sellerCombo').getValue(),
				org :		Ext.getCmp('orgCombo').getValue(),
				subid:		r.get('subid'),
				goods:		r.get('goods'),
				doc_vol:	r.get('doc_vol'),
				doc_measure:r.get('doc_measure'),
				doc_price:	r.get('doc_price'),
				price:		r.get('measure_price')
			});
		});	
		
		Ext.Ajax.request({
			url: '/income_return/save_doc',
			params: {authenticity_token: window._token},
			jsonData: rows,
			method: 'POST',
			timeout: 300000,
			 success: function(response, opts) {
					if (response.responseText=="ok") 
					{
						Ext.Msg.alert('Сообщение', 'Документы сформированы');
						controller.mainContainer.setLoading(false);
					}
					else
					{
						Ext.Msg.alert('Ошибка cохранения', response.responseText);
						controller.mainContainer.setLoading(false);
					}
				},
				failure: function(response, options) {
					Ext.Msg.alert('Ошибка', response.responseText);
					controller.mainContainer.setLoading(false);
				}
		});
	},
	
    init: function() {
		var controller = this;
		controller.mainContainer=Ext.create('app.view.incomeReturn.container');		
		
		controller.control({
			'#IncomeReturnTable': {
				'selectionchange': function(view, records) {
					var disabled=!records.length;
					Ext.getCmp('deleteIncomeReturn').setDisabled(disabled);
				}
			},
			'#saveIncomeReturn': {
				click: function() {
					controller.saveIncomeReturn();
				}
			},
			'#addIncomeReturn': {
				click: function() {
					var r = Ext.ModelManager.create({
							id	: incomeCombo.value
						}, 'app.model.incomeReturn.incomeReturnModel');
					controller.incomeReturnStore.insert(0, r);
					r.set("currency","рубли");
				}
			},
			'#deleteincomeReturn': {
				click: function() {
					var sm = Ext.getCmp('IncomeReturnTable').getSelectionModel();
					controller.incomeReturnStore.remove(sm.getSelection());
					if (controller.incomeReturnStore.getCount() > 0) {
						sm.select(0);
					} else {
						controller.incomeReturnStore.removeAll(true);
					}
				}
			},
			'#IncomeReturnTable': {
				selectionchange: function(sm, selected, eOpts){
					var s=(selected!=null)?selected[0]:null,
						row=Ext.getCmp('IncomeReturnTable').getSelectionModel().getSelection()[0];
					if (s!=null){
						cellEditingIncomeReturn = Ext.getCmp('IncomeReturnTable').getPlugin('celleditingIncomeReturn');
						cellEditingIncomeReturn.startEdit(s.index, 9);								
					}
					return true;
				}
			},

		});
			
	},
	
	initTables: function(){
		var controller=this,
			IncomeReturnTable = Ext.getCmp('IncomeReturnTable'),
			goodsColumn=IncomeReturnTable.columns[1],
			docMeasureColumn=IncomeReturnTable.columns[3]
			measureColumn=IncomeReturnTable.columns[11];
			col2=IncomeReturnTable.columns[2];
			col4=IncomeReturnTable.columns[4];
			col6=IncomeReturnTable.columns[6];
		
		controller.goodsMakeComboColumn(goodsColumn, controller.goodsStore, controller.incomeReturnStore, 'goods');
		
		controller.makeComboColumn(docMeasureColumn, controller.measureStore, controller.incomeReturnStore, 'doc_measure');
		docMeasureColumn.field.store=controller.currentMeasureStore;
		controller.makeComboColumn(measureColumn, controller.measureStore, controller.incomeReturnStore, 'measure', true, true);
		
		Ext.getCmp('ddate').addListener(
			"change",
			function(field, newValue, oldValue, options){
				controller.incomeStore.proxy.extraParams={
					ddate: Ext.Date.format(newValue, 'Y-m-d'),
					site: Ext.getCmp('siteCombo').getValue()
				};
				controller.incomeStore.load();
				Ext.getCmp('incomeCombo').setValue(null);
			}

		);
		Ext.getCmp('siteCombo').addListener(
			"select",
			function(field, value, options){
				controller.incomeStore.proxy.extraParams={
					ddate: Ext.Date.format(Ext.getCmp('ddate').getValue(), 'Y-m-d'),
					site: value[0].data.id
				};
				controller.incomeStore.load();
				Ext.getCmp('incomeCombo').setValue(null);
			}
		);
		Ext.getCmp('incomeCombo').addListener(
			"select",
			function(field, value, options){
				if(value!=null){
					controller.mainContainer.setLoading(true);
		
					controller.incomeReturnStore.proxy.extraParams={
						inc_id: value[0].data.id
					};
					controller.incomeReturnStore.load(
						function(records, operation, success){
							if(!success) {
								Ext.Msg.alert('Ошибка', operation.error.responseText)							
							}
							var disabled=!records.length;
							controller.mainContainer.setLoading(false);
						}
					);
					Ext.getCmp('doc_ddate').setValue(value[0].data.ddate);
				}
			}
		);
		Ext.getCmp('innCombo').addListener(
			"select",
			function(field, value, options){
				controller.prStore.proxy.extraParams={
					inn: value[0].data.name
				};
				controller.mainContainer.setLoading(true);
				controller.prStore.load();
				Ext.getCmp('prCombo').value=null
									
				controller.orgStore.proxy.extraParams={
					inn: value[0].data.name
				};
				controller.orgStore.load();
				controller.mainContainer.setLoading(false);
			}
		);
		Ext.getCmp('prCombo').addListener(
			"change",
			function(field, newValue, oldValue, options){
						controller.sellerStore.proxy.extraParams={
							pr: newValue
						};
						controller.sellerStore.load();
				}
		);
		
		
		docMeasureColumn.field.addListener(
			"select",
			function(field, value, options){
				var r = Ext.getCmp('IncomeReturnTable').getSelectionModel().getSelection()[0];
				r.beginEdit();
				r.set("vrel",value[0].data.rel);
				r.set("doc_price",r.get("measure_price")*r.get("vrel"));
				r.set("summ", r.get("vrel")*r.get("measure_price")*r.get("doc_vol"));
				r.set("nds_summ", r.get("summ")*r.get("nds")/(100+r.get("nds")));
				r.endEdit(true);
				return true;
			}
		);
		docMeasureColumn.field.addListener(
			"expand",
			function(field, eOpts){
				var r = Ext.getCmp('IncomeReturnTable').getSelectionModel().getSelection()[0];
				controller.loadMeasureStore(r.get('goods'),r.get('msrh_id'));
				return true;
			}
		);
		docMeasureColumn.field.addListener(
			"focus",
			function(field, e, eOpts){
				var r = Ext.getCmp('IncomeReturnTable').getSelectionModel().getSelection()[0],
						cellEditing = Ext.getCmp('IncomeReturnTable').getPlugin('celleditingIncomeReturn'),
						index=r.index
				controller.loadMeasureStore(r.get('goods'),r.get('msrh_id'));
				cellEditing.startEdit(index,3);
				return true;
				}
		);
		
	/*	col2.field.addListener(
			"specialkey",
			function(field, e, eOpts){
				controller.rowNavigation(field,e,eOpts);
				return true;
			}
		);
		
		col4.field.addListener(
			"specialkey",
			function(field, e, eOpts){
				controller.rowNavigation(field,e,eOpts);
				return true;
			}
		);
		
		col6.field.addListener(
			"specialkey",
			function(field, e, eOpts){
				controller.rowNavigation(field,e,eOpts);
				return true;
			}
		);*/
		
	},
	initStores: function(){
		var controller=this;
		controller.siteStore=controller.getIncomeReturnSiteStore();
		controller.incomeStore=controller.getIncomeReturnIncomeStore();
		controller.innStore=controller.getIncomeReturnInnStore();
		controller.prStore=controller.getIncomeReturnPrStore();
		controller.sellerStore=controller.getIncomeReturnSellerStore();
		controller.orgStore=controller.getIncomeReturnOrgStore();
		controller.goodsStore=controller.getIncomeReturnGoodsStore();
		controller.measureStore=controller.getIncomeReturnMeasureStore();
		controller.mrsStore=controller.getIncomeReturnMrsStore();
		controller.incomeReturnStore=controller.getIncomeReturnIncomeReturnStore();
		controller.currentMeasureStore = Ext.create('Ext.data.Store', {
				model: 'app.model.incomeReturn.measureModel',
				proxy: {
			        type: 'memory'
				}
			});
		
	},
	bindStores: function(){
		var controller=this;
		Ext.getCmp('siteCombo').bindStore(controller.siteStore);
		Ext.getCmp('incomeCombo').bindStore(controller.incomeStore);
		Ext.getCmp('innCombo').bindStore(controller.innStore);
		Ext.getCmp('prCombo').bindStore(controller.prStore);
		Ext.getCmp('sellerCombo').bindStore(controller.sellerStore);
		Ext.getCmp('orgCombo').bindStore(controller.orgStore);
		
		Ext.getCmp('IncomeReturnTable').reconfigure(controller.incomeReturnStore);
	},
	onLaunch: function(){
		var controller = this;
		controller.initStores();
		controller.bindStores();
		controller.initTables();
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
		
		
	},
	goodsMakeComboColumn: function(column, storeCombo, tableStore, property, allowNull, onlyRenderer){
		var controller=this;
		function renderer(value, metaData, record){
			return record.get('goods_name');
		};
		
		
		function rowNavigation2 (field, e, eOpts){
			var irStore=tableStore;
			var key=e.getKey(),
				sm=Ext.getCmp('IncomeReturnTable').getSelectionModel(),
				r=sm.getSelection()[0];
				
			if(key==e.UP || key==e.DOWN || key==e.ENTER ){
				var direction = (key==e.UP)? -1 : (key==e.DOWN || key==e.ENTER ? 1 : 0),
					index = irStore.indexOf(r) + direction,
					editingPlugin = Ext.getCmp('IncomeReturnTable').getPlugin('celleditingIncomeReturn');
				
				e.stopEvent();
				if(index>=0 && index<irStore.getCount()){
					var newR = irStore.getAt(index);
					sm.select(newR, true);
					editingPlugin.startEdit(newR, eOpts.colId);
				}
			}
			
			return true;
		};
		
		column.field = Ext.create('Ext.form.ComboBox', {
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			selectOnFocus: true,
			store: storeCombo,
			listeners: {
				"select": function(field, e, eOpts){
					var r = Ext.getCmp('IncomeReturnTable').getSelectionModel().getSelection()[0];
							r.set('goods_name', value[0].data.name);
							r.set('msrh_id', value[0].data.msrh_id);
							r.set('nds', value[0].data.nds);
							r.set("nds_summ", r.get("summ")*r.get("nds")/(100+r.get("nds")));
							return true;
				},
				"focus": function(field, e, eOpts){
					var store=field.store,
						r = Ext.getCmp('IncomeReturnTable').getSelectionModel().getSelection()[0],
						cellEditing = Ext.getCmp('IncomeReturnTable').getPlugin('celleditingIncomeReturn'),
						index=r.index
					l_name = r.get('goods_name');
					l_id=	r.get('goods');
					if (store.find("name",l_name)==-1)
					{
						store.add({id: l_id, name: l_name, nds: r.get('nds'), msrh_id: r.get('msrh_id')});
						cellEditing.startEdit(index,1);
					}
					return true;
				},
				"specialkey": {fn: controller.rowNavigation}

			}
		});
		
		column.renderer=renderer;
		
		
	}
	
});