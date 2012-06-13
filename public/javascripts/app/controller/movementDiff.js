Ext.define('app.controller.movementDiff', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.valueModel',
		'app.model.movementDiff.movementDiffModel'],
    init: function() {
		var currentGoodsPricesData=[];
	
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		}
		
		Ext.Ajax.request.failure = showServerError;
		
		function loadMovementDiff(){
			var ddateb = new Date(filterPanel.down('#startDate').getValue());
			var ddatee = new Date(filterPanel.down('#endDate').getValue());
			var siteFrom = filterPanel.down('#siteFrom').getValue();
			var siteTo = filterPanel.down('#siteTo').getValue();

			movementDiffStore.proxy.extraParams={
				ddateb: Ext.Date.format(ddateb, 'Y-m-d'),
				ddatee: Ext.Date.format(ddatee, 'Y-m-d'),
				site_from: siteFrom,
				site_to: siteTo
			};
			movementDiffStore.load(
				function(records, operation, success){
					if(success){
						movementDiffContainer.setDisabled(false);
						mainContainer.setLoading(false);
					}
				});
		};
		
		var movementDiffStore = Ext.create('Ext.data.Store', {
			model: 'app.model.movementDiff.movementDiffModel',
			proxy: {
				type: 'rest',
				url : '/movement_diff/movement_diff',
				reader: {
					type: 'json'
				}
			}
		});
		
		var sitesStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'rest',
				url : '/util_data/get_sites',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true
		});
		
		var mainContainer=Ext.create('Ext.container.Container', {
			width: 1100,
			layout: {
				type: 'anchor'
			},
			renderTo: Ext.get('movement_diff_js'),
			defaults: {
				style: {
					margin: '10px'
				}
			}
		});
		
		var filterPanel=Ext.create('Ext.form.Panel',{
			layout: {
				type: 'table',
				columns: 3,
				rows:2
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
			},
			{
				xtype	: 'button',
				text    : 'Фильтр',
				handler : loadMovementDiff,
				rowspan	: 2
			},
			{
				id: 'siteFrom',
				xtype: 'combobox',
				store: sitesStore,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				name: 'siteFrom',
				fieldLabel: 'Площадка отправителя'
			},
			{
				id: 'siteTo',
				xtype: 'combobox',
				store: sitesStore,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				name: 'siteTo',
				fieldLabel: 'Площадка отправителя'
			}]
		});
		
		mainContainer.add(filterPanel);
	
		var cellEditingSellPrices = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		
		var movementDiffContainer = Ext.create('Ext.container.Container', {
			width: 1100,
			layout: {
				type: 'anchor'
			},
			defaults: {
				style: {
					margin: '10px'
				}
			},
			margin: '-0px',
			disabled: true
		});
	
		var mdId='movementDiffTable';
		
		var movementDiffPanel=Ext.create('Ext.grid.Panel', {
			id: mdId,
			title: 'Скидки',
			store: movementDiffStore,
			columns: [
				{
					header: 'Идентификатор',
					dataIndex: 'id',
					hidden: true,
					disabled: true
				},
				{
					text: 'Площадка-отправитель',
					dataIndex: 'site_src_id',
					disabled: true,
					renderer: function(value){
						var matching=null;
						sitesStore.each(function(record){
							if(record.get('id')==value){
								matching=record.get('name');
							}
							return !matching;
						});
						return matching;
					}
				},
				{
					header: 'Площадка-<br/>получатель',
					dataIndex: 'site_dest_id',
					disabled: true,
					renderer: function(value){
						var matching=null;
						sitesStore.each(function(record){
							if(record.get('id')==value){
								matching=record.get('name');
							}
							return !matching;
						});
						return matching;
					}
				},
				{
					header: 'Номер заказа',
					dataIndex: 'ndoc_so',
					disabled: true
				},
				{
					header: 'Дата заказа',
					dataIndex: 'ddate_so',
					width: 100,
					renderer: function(value, metaData, record){
						return (value)?Ext.Date.format(new Date(value), 'd.m.Y'):'';
					}
				},
				{
					header: 'Номер поставки',
					dataIndex: 'ndoc_sup',
					disabled: true
				},
				{
					header: 'Дата поставки',
					dataIndex: 'ddate_sup',
					width: 100,
					renderer: function(value, metaData, record){
						return (value)?Ext.Date.format(new Date(value), 'd.m.Y'):'';
					}
				},
				{
					header: 'Наименование товара',
					dataIndex: 'goods_name',
					disabled: true
				},
				{
					header: 'Заказ',
					columns: [
						{
							header: 'Количество',
							dataIndex: 'volume_so',
							disabled: true
						},
						{
							header: 'Факт',
							dataIndex: 'donevol_so',
							disabled: true
						}
					]
				},
				{
					header: 'Поставка',
					columns: [
						{
							header: 'Количество',
							dataIndex: 'volume_sup',
							disabled: true
						},
						{
							header: 'Факт',
							dataIndex: 'donevol_sup',
							disabled: true
						}
					]
				}
			],
			selModel: {
				selType: 'rowmodel'
			},
			plugins: [cellEditingSellPrices],
			height: 400,
			tbar: [{
				text: 'Добавить скидку',
				handler : function() {
					cellEditingSellPrices.cancelEdit();
					
					var r = Ext.ModelManager.create({
						partner_id	: partnersCombo.value
					}, 'app.model.sellPrice.sellPriceModel');
					sellPricesStore.insert(0, r);
				}
			}, {
				itemId: 'removeSellPrice',
				text: 'Удалить скидку',
				handler: function() {
					var sm = sellPricesPanel.getSelectionModel();
					cellEditingSellPrices.cancelEdit();
					sellPricesStore.remove(sm.getSelection());
					if (sellPricesStore.getCount() > 0) {
						sm.select(0);
					} else {
						sellPricesStore.removeAll(true);
					}
				},
				disabled: true
			}],
			bbar: [{
				text    : 'Сохранить',
				handler : function() {
					var selection=sellPricesPanel.getSelectionModel().getSelection()[0];
					
					var error=false, errorTxt;
					sellPricesStore.each(function(record){
						var msg="";
						var data=(record.data!=null)?record.data:{};
						if(!(data.goods_id)>0){
							msg+="Не заполнено поле \"Товар\"\n";
							error=true;
						}
						
						if(!(data.sell_reason_id)>0){
							msg+="Не заполнено поле \"Причина скидки\"\n";
							error=true;
						}
						
						errorTxt=checkDateError(data.goods_id, (data.ddateb)?data.ddateb:(new Date('0000-01-01')));
						if(errorTxt){
							msg+="Дата начала действия скидки должна лежать в интервалах: "+errorTxt+"\n";
							error=true;
						}
						
						errorTxt=checkDateError(data.goods_id, (data.ddatee)?data.ddatee:(new Date('9999-01-01')));
						if(errorTxt){
							msg+="Дата окончания действия скидки  должна лежать в интервалах: "+errorTxt+"\n";
							error=true;
						}
						
						if(error){
							Ext.Msg.alert('Ошибка', msg);
							sellPricesPanel.getSelectionModel().select(record.id);
							return false;
						} else {
							return true;
						}
					});
					if(!error){
						sellPricesStore.proxy.extraParams={};
						sellPricesStore.sync();
					}
					if(selection!=null && selection.date!=null){
						partnersCombo.value=selection.data.partner_id;
						sellPricesPanel.getSelectionModel().select(sellPricesStore.getById(selection.data.id));
					}
				}
			}],
			listeners: {
				'selectionchange': function(view, records) {
					var disabled=!records.length;
					
					sellPricesPanel.down('#removeSellPrice').setDisabled(disabled);
				}
			}
		});
		
		movementDiffContainer.add(movementDiffPanel);
		mainContainer.add(movementDiffContainer);
	}
});