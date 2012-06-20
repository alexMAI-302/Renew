Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn'
]);
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
			mainContainer.setLoading(true);
			movementDiffStore.load(
				function(records, operation, success){
					if(success){
						var siteSrcArray=movementDiffStore.collect('site_src_id'),
							siteDestArray=movementDiffStore.collect('site_dest_id'),
							ndocSOArray=movementDiffStore.collect('ndoc_so'),
							ndocSupArray=movementDiffStore.collect('ndoc_sup');
						var ndocSO, ndocSup;
							
						sitesSrcClearStore.removeAll();
						sitesDestClearStore.removeAll();
						ndocsSOClearStore.removeAll();
						ndocsSupClearStore.removeAll();
						
						sitesStore.each(function(record){
							for(var i=0; i<siteSrcArray.length; i++){
								if(record.get('id')==siteSrcArray[i] || record.get('id')==-1){
									sitesSrcClearStore.add(record);
								}
							}
							return true;
						});
						
						sitesStore.each(function(record){
							for(var i=0; i<siteDestArray.length; i++){
								if(record.get('id')==siteDestArray[i] || record.get('id')==-1){
									sitesDestClearStore.add(record);
								}
							}
							return true;
						});
						
						for(var i=0; i<ndocSOArray.length; i++){
							ndocSO = Ext.ModelManager.create({
								id	: ndocSOArray[i],
								name: ndocSOArray[i]
							}, 'app.model.valueModel');
							ndocsSOClearStore.add(ndocSO);
						}
						
						for(var i=0; i<ndocSupArray.length; i++){
							ndocSup = Ext.ModelManager.create({
								id	: ndocSupArray[i],
								name: ndocSupArray[i]
							}, 'app.model.valueModel');
							ndocsSupClearStore.add(ndocSup);
						}
						
						movementDiffContainer.setDisabled(false);
						mainContainer.setLoading(false);
					}
				});
		};
		
		function onActionComboEvent(field){
			if(field.getValue() != null){
				field.ownerCt.down('#clearDiff').show();
			}
		};
		
		var actionTypeStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name'],
			data: [
				{'id': 1, 'name': 'На площадке отправителя'},
				{'id': 2, 'name': 'На площадке получателя'},
				{'id': 3, 'name': 'По номеру документа заказа'},
				{'id': 4, 'name': 'По номеру документа поставки'},
				{'id': 5, 'name': 'Одиночные позиции'}
			]
		});
		
		var sitesSrcClearStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel'
		});
		
		var sitesDestClearStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel'
		});
		
		var ndocsSOClearStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel'
		});
		
		var ndocsSupClearStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel'
		});
		
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
			autoLoad: true,
			listeners: {
				"load": function(store, records, successful, operation, options ){
					if(successful==true){
						sitesStore.insert(0, Ext.ModelManager.create({id: -1, name : 'ВСЕ'}, 'app.model.valueModel'));
					}
				}
			}
		});
		
		var mainContainer=Ext.create('Ext.container.Container', {
			width: 1300,
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
				value: Ext.Date.add(new Date(Ext.Date.now()), Ext.Date.DAY, -3),
				width: 300
			},{
				id: 'endDate',
				xtype: 'datefield',
				name: 'endDate',
				fieldLabel: 'Конец периода',
				format: 'd.m.Y',
				altFormat: 'd/m/Y|d m Y',
				startDay: 1,
				value: new Date(Ext.Date.now()),
				width: 300
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
				fieldLabel: 'Площадка отправителя',
				width: 300,
				labelWidth: 150
			},
			{
				id: 'siteTo',
				xtype: 'combobox',
				store: sitesStore,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				name: 'siteTo',
				fieldLabel: 'Площадка отправителя',
				width: 300,
				labelWidth: 150
			}]
		});
		
		mainContainer.add(filterPanel);
		
		var movementDiffContainer = Ext.create('Ext.container.Container', {
			width: 1280,
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
			title: 'Расхождения межплощадочных перемещений',
			store: movementDiffStore,
			enableColumnHide: false,
			enableColumnMove: false,
			enableColumnResize: false,
			columns: [
				{
					header: 'Идентификатор',
					dataIndex: 'id',
					hidden: true
				},
				{
					text: 'Отправитель',
					width: 85,
					dataIndex: 'site_src_id',
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
					header: 'Получатель',
					width: 85,
					dataIndex: 'site_dest_id',
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
					width: 80
				},
				{
					header: 'Дата заказа',
					dataIndex: 'ddate_so',
					width: 110,
					renderer: function(value, metaData, record){
						return (value)?Ext.Date.format(new Date(value), 'd.m.Y H:i'):'';
					}
				},
				{
					header: 'Номер поставки',
					dataIndex: 'ndoc_sup',
					width: 90
				},
				{
					header: 'Дата поставки',
					dataIndex: 'ddate_sup',
					width: 110,
					renderer: function(value, metaData, record){
						return (value)?Ext.Date.format(new Date(value), 'd.m.Y H:i'):'';
					}
				},
				{
					header: 'Наименование товара',
					dataIndex: 'goods_name',
					width: 400
				},
				{
					header: 'Заказ',
					columns: [
						{
							header: 'Количество',
							dataIndex: 'volume_so',
							width: 70
						},
						{
							header: 'Факт',
							dataIndex: 'donevol_so',
							width: 40
						}
					]
				},
				{
					header: 'Поставка',
					columns: [
						{
							header: 'Количество',
							dataIndex: 'volume_sup',
							width: 70
						},
						{
							header: 'Факт',
							dataIndex: 'donevol_sup',
							width: 40
						}
					]
				},
				{
					id: 'selectedDiffs',
					header: 'К<br/>списанию',
					width: 60,
					align: 'center',
					hidden: true,
					dataIndex: 'to_clear',
					xtype: 'checkcolumn',
					listeners: {
						"checkchange": function(){
							if(movementDiffStore.collect('to_clear').length>1){
								movementDiffPanel.down('#clearDiff').show();
							} else {
								movementDiffPanel.down('#clearDiff').hide();
							}
						}
					}
				}
			],
			bbar: [
			{
				id: 'actionType',
				xtype: 'combobox',
				store: actionTypeStore,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				name: 'actionType',
				fieldLabel: 'Списание остатков',
				labelWidth: 130,
				width: 350,
				listeners: {
					"change": function(field, newValue, oldValue, eOpts){
						this.ownerCt.items.each(function(i){
							i.hide();
						});
						movementDiffPanel.down('#selectedDiffs').hide();
						this.ownerCt.down('#actionType').show();
						switch(newValue){
							case 1:
								this.ownerCt.down('#siteSrcAction').show();
							break;
							case 2:
								this.ownerCt.down('#siteDestAction').show();
							break;
							case 3:
								this.ownerCt.down('#ndocSOAction').show();
							break;
							case 4:
								this.ownerCt.down('#ndocSupAction').show();
							break;
							case 5:
								movementDiffPanel.down('#selectedDiffs').show();
								if(newValue==5){
									//если больше одного уникального значения, т.е. если есть выбранные для списания позиции
									if(movementDiffStore.collect('to_clear').length>1){
										this.ownerCt.down('#clearDiff').show();
									}
								}
							break;
						}
					}
				}
			},
			{
				id: 'siteSrcAction',
				xtype: 'combobox',
				store: sitesSrcClearStore,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				name: 'siteSrcAction',
				hidden: true,
				listeners: {
					"show": onActionComboEvent,
					"change": onActionComboEvent
				}
			},
			{
				id: 'siteDestAction',
				xtype: 'combobox',
				store: sitesDestClearStore,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				name: 'siteDestAction',
				hidden: true,
				listeners: {
					"show": onActionComboEvent,
					"change": onActionComboEvent
				}
			},
			{
				id: 'ndocSOAction',
				xtype: 'combobox',
				store: ndocsSOClearStore,
				queryMode: 'local',
				displayField: 'id',
				valueField: 'id',
				name: 'ndocSOAction',
				hidden: true,
				listeners: {
					"show": onActionComboEvent,
					"change": onActionComboEvent
				}
			},
			{
				id: 'ndocSupAction',
				xtype: 'combobox',
				store: ndocsSupClearStore,
				queryMode: 'local',
				displayField: 'id',
				valueField: 'id',
				name: 'ndocSupAction',
				hidden: true,
				listeners: {
					"show": onActionComboEvent,
					"change": onActionComboEvent
				}
			},
			{
				id		: 'clearDiff',
				xtype	: 'button',
				text    : 'Списать остатки',
				hidden	: true,
				handler : function(button, e){
					var siteSrc, siteDest, ndocSO, ndocSup, ids = null;
					var ddateb = new Date(filterPanel.down('#startDate').getValue()),
						ddatee = new Date(filterPanel.down('#endDate').getValue());
					
					switch(button.ownerCt.down('#actionType')){
						case 1:
							siteSrc = button.ownerCt.down('#siteSrcAction').getValue;
						break;
						case 2:
							siteDest = button.ownerCt.down('#siteDestAction').getValue;
						break;
						case 3:
							ndocSO = button.ownerCt.down('#ndocSOAction').getValue;
						break;
						case 4:
							ndocSup = button.ownerCt.down('#ndocSupAction').getValue;
						break;
						case 5:
							movementDiffStore.each(function(record){
								if(record.get('to_clear')){
									ids.push(record.get('id'));
								}
								return true;
							});
						break;
					}
					
					mainContainer.setLoading(true);
					Ext.Ajax.request({
						params:{
							authenticity_token: window._token,
							site_src: siteSrc,
							site_dest: siteDest,
							ndoc_so: ndocSO,
							ndoc_sup: ndocSup,
							ids: ids.toString(),
							ddateb: Ext.Date.format(ddateb, 'Y-m-d'),
							ddatee: Ext.Date.format(ddatee, 'Y-m-d')
						},
						method: 'post',
						url: '/movement_diff/clear_diff',
						success: function(response){
							loadMovementDiff();
						}
					});
				}
			}
			],
			selModel: {
				selType: 'rowmodel'
			},
			height: 400
		});
		
		movementDiffContainer.add(movementDiffPanel);
		mainContainer.add(movementDiffContainer);
	}
});