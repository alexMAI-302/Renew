Ext.define('app.controller.transit', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.transit.transitOrderModel',
		'app.model.transit.transitOrderGoodsModel',
		'app.model.valueModel'],
    init: function() {
	
		var user_id, user_name;
		
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		}
		
		Ext.Ajax.request.failure = showServerError;
		
		function loadTransitOrders(){
			var ddateb = new Date(filterPanel.down('#startDate').getValue());
			var ddatee = new Date(filterPanel.down('#endDate').getValue());
			transitOrdersStore.proxy.extraParams={
				ddateb: Ext.Date.format(ddateb, 'Y-m-d'),
				ddatee: Ext.Date.format(ddatee, 'Y-m-d'),
				agent: agentsCombo.value
			};
			transitOrdersStore.load();
		}
		
		Ext.Ajax.request({
			url: '/util_data/get_user_info',
			success: function(response){
				var response_json=Ext.JSON.decode(response.responseText, true);
				user_id=response_json[0].id;
				user_name=response_json[1].name;
			}
		});
	
		var agentsStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'ajax',
				url : '/transit/get_agents',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true,
			listeners: {
				"load": function(store, records, successful, operation, options ){
					if(successful){
						agentsCombo.select(records[0]);
						mainContainer.setLoading(false);
						loadTransitOrders();
					}
				}
			}
		});
		
		var transitOrdersStore = Ext.create('Ext.data.Store', {
			model: 'app.model.transit.transitOrderModel',
			proxy: {
				type: 'rest',
				url : '/transit/transit_orders',
				batchUpdateMode: 'complete',
				reader: {
					type: 'json'
				},
				writer: {
					type: 'json'
				}
			},
			getBatchListeners: function() {
				var listeners={};//transitOrdersStore.callParent();
				
				listeners.complete = function(batch, operation, options){
					loadTransitOrders();
				};
				
				return listeners;
			}
		});
		
		var transitOrderGoodsStore = Ext.create('Ext.data.Store', {
			model: 'app.model.transit.transitOrderGoodsModel',
			proxy: {
				type: 'rest',
				url : '/transit/transit_order_goods',
				batchUpdateMode: 'complete',
				reader: {
					type: 'json'
				},
				writer: {
					type: 'json'
				}
			},
			getBatchListeners: function() {
				var listeners={};//transitOrdersStore.callParent();
				
				listeners.complete = function(batch, operation, options){
					transitOrderGoodsStore.load();
				};
				
				return listeners;
			}
		});
		
		var measuresStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'ajax',
				url : '/util_data/get_measures',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true
		});
		
		var sitesStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'ajax',
				url : '/util_data/get_sites',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true
		});
		
		var goodsStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'ajax',
				url : '/util_data/get_goods',
				reader: {
					type: 'json'
				}
			}
		});
	
		var mainContainer=Ext.create('Ext.container.Container', {
			width: 1000,
			layout: {
				type: 'anchor'
			},
			renderTo: Ext.get('transit_js'),
			defaults: {
				style: {
					margin: '10px'
				}
			}
		});
		
		var filterPanel=Ext.create('Ext.form.Panel',{
			layout: {
				type: 'hbox'
			},
			defaults: {
				style: {
					margin: '5px'
				}
			},
			items: [{
				id: 'startDate',
				xtype: 'datefield',
				name: 'startDate',
				fieldLabel: 'Начало периода',
				format: 'd.m.Y',
				altFormat: 'd/m/Y|d m Y',
				startDay: 1,
				value: Ext.Date.add(new Date(Ext.Date.now()), Ext.Date.DAY, -3)
			},{
				id: 'endDate',
				xtype: 'datefield',
				name: 'endDate',
				fieldLabel: 'Конец периода',
				format: 'd.m.Y',
				altFormat: 'd/m/Y|d m Y',
				startDay: 1,
				value: new Date(Ext.Date.now())
			}]
		});
		
		var agentsCombo=Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Агент',
			store: agentsStore,
			displayField: 'name',
			valueField: 'id',
			queryMode: 'local',
			autoSelect: true
		});
		
		var filterTransitOrders=Ext.create('Ext.Button', {
			text    : 'Фильтр',
			handler : loadTransitOrders
		});
		
		filterPanel.add(agentsCombo);
		filterPanel.add(filterTransitOrders);
		mainContainer.add(filterPanel);
	
		var cellEditingTransitOrder = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		
		var cellEditingTransitOrderGoods = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		
		var transitOrdersContainer = Ext.create('Ext.container.Container', {
			width: 1000,
			layout: {
				type: 'anchor'
			},
			defaults: {
				style: {
					margin: '10px'
				}
			},
			margin: '-0px'
		});
	
		var transitOrdersPanel=Ext.create('Ext.grid.Panel', {
			id: 'transitOrdersTable',
			title: 'Заявки на перемещение',
			store: transitOrdersStore,
			columns: [
				// {
					// header: 'Идентификатор',
					// dataIndex: 'id',
					// hidden: true,
					// disabled: true
				// },
				{
					header: 'Дата',
					dataIndex: 'ddate',
					width: 100,
					renderer: function(value){
						return (value)?Ext.Date.format(new Date(value), 'd.m.y H:i'):'';
					},
					disabled: true
				},
				{
					width: 200,
					header: 'Агент',
					dataIndex: 'agent_name',
					disabled: true
				},
				{
					width: 30,
					header: 'Г',
					dataIndex: 'status1',
					xtype: 'checkcolumn'
				},
				{
					width: 170,
					header: 'Комментарий',
					dataIndex: 'comments',
					field: {
						xtype: 'textfield'
					}
				}
			],
			selModel: {
				selType: 'rowmodel'
			},
			plugins: [cellEditingTransitOrder],
			height: 200,
			tbar: [{
				text: 'Добавить заявку',
				handler : function() {
					cellEditingTransitOrder.cancelEdit();
					var r = Ext.ModelManager.create({
						agent_id	: user_id,
						agent_name	: user_name
					}, 'app.model.transit.transitOrderModel');
					transitOrdersStore.insert(0, r);
				}
			}, {
				itemId: 'removeTransitOrder',
				text: 'Удалить заявку',
				handler: function() {
					var sm = transitOrdersPanel.getSelectionModel();
					cellEditingTransitOrder.cancelEdit();
					transitOrdersStore.remove(sm.getSelection());
					if (transitOrdersStore.getCount() > 0) {
						sm.select(0);
					} else {
						transitOrderGoodsStore.removeAll(true);
					}
				},
				disabled: true
			}],
			listeners: {
				'selectionchange': function(view, records) {
					var disabled=!records.length;
					
					transitOrdersPanel.down('#removeTransitOrder').setDisabled(disabled);
					transitOrderGoodsContainer.setDisabled(disabled || records[0].dirty || records[0].phantom);
					filePanel.setDisabled(disabled);
					
					if (!disabled) {
						transitOrderGoodsStore.proxy.extraParams={
							transit_order: records[0].get("id")};
						transitOrderGoodsStore.load();
					}
				}
			}
		});
		
		var saveTransitOrders=Ext.create('Ext.Button', {
			text    : 'Сохранить заявки',
			scale: 'small',
			margin: '-10 0 0 10',
			handler : function() {
				var selection=transitOrdersPanel.getSelectionModel().getSelection()[0];
				
				transitOrdersStore.proxy.extraParams={};
				transitOrdersStore.sync();
				if(selection!=null){
					transitOrdersPanel.getSelectionModel().select(transitOrdersStore.getById(selection.data.id));
				}
			}
		});
		
		transitOrdersContainer.add(transitOrdersPanel);
		transitOrdersContainer.add(saveTransitOrders);
		mainContainer.add(transitOrdersContainer);
		
		var transitOrderGoodsContainer = Ext.create('Ext.container.Container', {
			width: 1000,
			layout: {
				type: 'anchor'
			},
			defaults: {
				style: {
					margin: '10px'
				}
			},
			margin: '-0px'
		});
		
		var togGridId='transitOrderGoodsTable';
		var transitOrderGoodsPanel=Ext.create('Ext.grid.Panel', {
			id: togGridId,
			title: 'Товар в заявке',
			store: transitOrderGoodsStore,
			columns: [
				// {
					// header: 'Идентификатор',
					// dataIndex: 'id',
					// hidden: true,
					// disabled: true
				// },
				{
					width: 100,
					header: 'Откуда',
					dataIndex: 'site_from',
					renderer: function(value){
						var matching = sitesStore.queryBy(
							function(record, id){
								return record.get('id') == value;
							});
						return (matching.items[0]) ? matching.items[0].data.name : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: sitesStore,
						displayField: 'name',
						valueField: 'id',
						allowBlank: false,
						queryMode: 'local',
						listeners:{
							"focus": function (obj, options){
								obj.expand();
							}
						}
					})
				},
				{
					width: 100,
					header: 'Куда',
					dataIndex: 'site_to',
					renderer: function(value){
						var matching = sitesStore.queryBy(
							function(record, id){
								return record.get('id') == value;
							});
						return (matching.items[0]) ? matching.items[0].data.name : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: sitesStore,
						displayField: 'name',
						valueField: 'id',
						allowBlank: false,
						queryMode: 'local',
						listeners:{
							"focus": function (obj, options){
								obj.expand();
							}
						}
					})
				},
				{
					width: 250,
					header: 'Товар',
					dataIndex: 'goods_id',
					gridId: togGridId,
					renderer: function(value){
						var goodsName;
						if(value>0){
							var currentRecord = transitOrderGoodsStore.findRecord("goods_id", value);
							goodsName = (currentRecord!=null)?currentRecord.get('goods_name'):null;
						}
						if(goodsName==null || goodsName == "") {
							var matching = goodsStore.queryBy(
								function(record, id){
									return record.get('id') == value;
								});
							return (matching.items[0]) ? matching.items[0].data.name : '';
						} else {
							return goodsName;
						}
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: goodsStore,
						displayField: 'name',
						valueField: 'id',
						allowBlank: false,
						selectOnFocus: true,
						listeners: {
							"select": function(fild, value, options){
								var myWiew=transitOrderGoodsPanel.getView();
								var r=myWiew.getRecord(myWiew.getNode(transitOrderGoodsPanel.rowToDelete));
								goodsStore.removeAll();
								goodsStore.loadData([
									{id: r.get('goods_id'),    name: r.get('goods_name')}]);
								
								return true;
							}
						}
					})
				},
				{
					width: 75,
					header: 'Количество',
					dataIndex: 'volume',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					width: 75,
					header: 'Факт',
					dataIndex: 'fact_volume',
					disabled: true
				},
				{
					width: 120,
					header: 'Единица измерения',
					dataIndex: 'vmeas',
					renderer: function(value){
						var matching = measuresStore.queryBy(
							function(record, id){
								return record.get('id') == value;
							});
						return (matching.items[0]) ? matching.items[0].data.name : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: measuresStore,
						displayField: 'name',
						valueField: 'id',
						allowBlank: false,
						listeners:{
							"focus": function (obj, options){
								obj.expand();
							}
						}
					})
				},
				{
					width: 50,
					header: 'В плане',
					dataIndex: 'in_plan',
					renderer : function(value){
						var cssPrefix = Ext.baseCSSPrefix,
							cls = [cssPrefix + 'grid-checkheader'];

						if (value) {
							cls.push(cssPrefix + 'grid-checkheader-checked');
						}
						return '<div class="' + cls.join(' ') + '">&#160;</div>';
					},
					disabled: true
				},
				{
					width: 100,
					header: 'Дата поступления',
					dataIndex: 'sddate',
					renderer: function(value){
						return (value)?Ext.Date.format(new Date(value), 'd.m.Y'):'';
					},
					disabled: true
				},
				{
					width: 120,
					header: 'Номера заказов',
					dataIndex: 'sndoc',
					disabled: true
				}
			],
			rowToDelete: null,
			selModel : Ext.create('Ext.selection.CellModel', {
				selType: 'cellmodel',
				listeners : {
					select : function(cellModel, record, rowIndex) {
						if(record && (record.get('in_plan')==false || record.get('in_plan')==null)){
							transitOrderGoodsPanel.getView().addRowCls(rowIndex, 'x-grid-row-over');
							transitOrderGoodsPanel.down('#removeTransitOrderGoods').setDisabled(false);
							transitOrderGoodsPanel.rowToDelete=rowIndex;
						} else {
							transitOrderGoodsPanel.getSelectionModel().fireEvent("deselect", cellModel, record, rowIndex);
						}
						
					},
					deselect : function(cellModel, record, rowIndex) {
						transitOrderGoodsPanel.getView().removeRowCls(rowIndex, 'x-grid-row-over');
						transitOrderGoodsPanel.down('#removeTransitOrderGoods').setDisabled(true);
					},
					scope : this
				}
			}),
			plugins: [cellEditingTransitOrderGoods],
			height: 200,
			tbar: [{
				itemId: 'addTransitOrderGoods',
				text: 'Добавить товар',
				handler : function() {
					cellEditingTransitOrderGoods.cancelEdit();
					
					var r = Ext.ModelManager.create({
						vmeas: measuresStore.findRecord("name", "Короб").get("id")
					}, 'app.model.transit.transitOrderGoodsModel');
					transitOrderGoodsStore.insert(0, r);
				}
			}, {
				itemId: 'removeTransitOrderGoods',
				text: 'Удалить товар',
				handler: function() {
					var sm = transitOrderGoodsPanel.getSelectionModel();
					
					var myView=transitOrderGoodsPanel.getView();
					cellEditingTransitOrderGoods.cancelEdit();
					transitOrderGoodsStore.remove(myView.getRecord(myView.getNode(transitOrderGoodsPanel.rowToDelete)));
					
					sm.select(transitOrderGoodsStore.getAt(0), false, false);
					myView.select(transitOrderGoodsStore.getAt(0), false, false);
				},
				disabled: true
			}]
		});
		
		var saveTransitOrderGoods=Ext.create('Ext.Button', {
			text    : 'Сохранить товары',
			scale: 'small',
			margin: '-10 0 0 10',
			handler : function() {
				var error=false;
				transitOrderGoodsStore.each(function(record){
					var msg;
					var data=(record.data!=null)?record.data:{};
					if(!(data.site_from)>0){
						msg="Не заполнено поле \"Площадка Откуда\"";
						error=true;
					} else if (!data.site_to>0) {
						msg="Не заполнено поле \"Площадка Куда\"";
						error=true;
					} else if (!(data.goods_id>0)) {
						msg="Не заполнено поле \"Товар\"";
						error=true;
					} else if (!(data.volume>0)) {
						msg="Количество товара должно быть больше 0";
						error=true;
					} else if (data.site_from==data.site_to) {
						msg="Площадка-отправитель не может совпадать с площадкой-получителем";
						error=true;
					}
					if(error){
						Ext.Msg.alert('Ошибка', msg);
						transitOrderGoodsPanel.getSelectionModel().select(record.id, false, false);
						return false;
					} else {
						return true;
					}
				});
				if(!error){
					transitOrderGoodsStore.proxy.extraParams={
						transit_order:  transitOrdersPanel.getSelectionModel().getSelection()[0].get("id")};
					
					transitOrderGoodsStore.sync();
				}
			}
		});
		
		transitOrderGoodsContainer.add(transitOrderGoodsPanel);
		transitOrderGoodsContainer.add(saveTransitOrderGoods);
		mainContainer.add(transitOrderGoodsContainer);
		
		var filePanel=Ext.create('Ext.form.Panel', {
			title: 'Загрузка данных по товарам',
			bodyPadding: '-10 0 0 10',
			frame: false,
			layout: {
				type: 'hbox'
			},
			items: [{
				xtype: 'filefield',
				name: 'detail_data',
				fieldLabel: 'Файл с данными детализации',
				labelWidth: 180,
				msgTarget: 'side',
				allowBlank: false,
				width: 900,
				buttonText: 'Выберите файл'
			},
			Ext.create('Ext.Button', {
				text: 'Загрузить',
				handler: function() {
					var form = this.up('form').getForm();
					if(form.isValid()){
						form.submit({
							url: '/transit/upload_goods_data',
							params: {
								authenticity_token: window._token,
								transit_order:  transitOrdersPanel.getSelectionModel().getSelection()[0].get("id")
							},
							waitMsg: 'Загрузка данных...',
							success: function(fp, o) {
								transitOrderGoodsStore.loadData(o.result.data, false);
								transitOrderGoodsPanel.doLayout();
							},
							errors: function(fp, o){
								Ext.Msg.alert("Ошибка обработки файла", o.result.errors);
							}
						});
					}
				}
			})
			]
		});
		
		mainContainer.add(filePanel);
		
		mainContainer.setLoading(true);
		transitOrderGoodsContainer.setDisabled(true);
		filePanel.setDisabled(true);
	}
});