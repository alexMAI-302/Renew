Ext.define('app.controller.ExclusivePoint', {
    extend: 'Ext.app.Controller',

	stores: [
		'app.store.exclusivePoint.Point',
		'app.store.exclusivePoint.ExclusiveBuyer',
		'app.store.exclusivePoint.MultiBuyer',
		'app.store.exclusivePoint.Supervisor',
		'app.store.exclusivePoint.Tp',
		'app.store.exclusivePoint.BuyerCB'
	],

	map: null,
	center: [55.752767, 37.622642],
	clusterer: null,
	
	pointStore:      null,
	buyerStore:      null,
	multiBuyerStore: null,
	supervisorStore: null,		
	tpStore:         null,
	buyerCBstore:    null,

	init: function() {
		controller = this;
		
		panel = Ext.create('app.view.exclusivePoint.Container', {
			renderTo: Ext.get('main_js'),
		});
		
		controller.control({
			'#refreshButton': {
				click: controller.refreshMap
			},
			
			'#map': {
				resize: function(){
					controller.map.container.fitToViewport();
				}
			},

			'#exclusivePointMultiBuyerTable': {
				selectionchange: controller.onSelectionchange
			},

			'#deleteexclusivePointMultiBuyer': {
				click: controller.onDeleteMultiBuyer
			},

			'#addexclusivePointMultiBuyer': {
				click: controller.onAddMultiBuyer
			},
			
			'#saveexclusivePointMultiBuyer': {
				click: controller.onSaveMultiBuyer
			},
		})
	},
	
	onLaunch: function() {
		this.initMap();
		this.initStores();
		
		this.refreshMap();
	},
	
	initMap: function() {
		controller = this;
		
		ymaps.ready(function(){
			controller.map = new ymaps.Map("map",
				{
					center: controller.center,
					zoom: 13,
			        behaviors: ["default", "scrollZoom"]
				}
			);
			
			// Добавление элементов управления
			controller.map.controls.add("zoomControl");
			
			controller.clusterer = new ymaps.Clusterer({
				maxZoom: 13
			});
			controller.map.geoObjects.add(controller.clusterer);
		})
	},

	initStores: function(){
		this.pointStore      = Ext.create ('app.store.exclusivePoint.Point');
		this.buyerStore      = Ext.getCmp('exclusivePointExclusiveBuyerTable').getStore();
		this.multiBuyerStore = Ext.getCmp('exclusivePointMultiBuyerTable').getStore();
		this.supervisorStore = Ext.getCmp('exclusivePointMultiBuyerTable').columns[1].store;
		this.tpStore         = Ext.getCmp('exclusivePointMultiBuyerTable').columns[2].store;
		this.buyerCBStore    = Ext.getCmp('exclusivePointMultiBuyerTable').columns[3].store;


		this.supervisorStore.load({
			callback: function(records, operation, success) {
				if (!success)
					Ext.Msg.alert('Ошибка', 'Ошибка загрузки супервайзеров<br/>' + operation.getError().responseText)
			}
		});
		this.tpStore.load({
			callback: function(records, operation, success) {
				if (!success)
					Ext.Msg.alert('Ошибка', 'Ошибка загрузки ТП<br/>' + operation.getError().responseText)
			}
		});
		
		
		
		//event
		colSuper = Ext.getCmp('exclusivePointMultiBuyerTable').columns[1].field;
		colSuper.addListener(
			"select",
			function(combo, records, eOpts)  {
				var recordTable = Ext.getCmp('exclusivePointMultiBuyerTable').getSelectionModel().getSelection()[0]

				recordTable.set("tp_id", null);
				recordTable.set("podr", records[0].get('podr'));
				
				controller.filterTpCB(records[0].get('id'))
			}
		)

		colTp = Ext.getCmp('exclusivePointMultiBuyerTable').columns[2].field;
		colTp.addListener(
			"select",
			function(combo, records, eOpts) {
				controller.filterBuyerCB(records[0].get('id'))
			}
		)

		colBuyer = Ext.getCmp('exclusivePointMultiBuyerTable').columns[3].field;
		colBuyer.addListener(
			"select",
			function(combo, records, eOpts)  {
				var recordTable = Ext.getCmp('exclusivePointMultiBuyerTable').getSelectionModel().getSelection()[0]

				recordTable.set("loadto", records[0].get('loadto'));
				recordTable.set("name", records[0].get('name')); //Запомним имя покупателя. когда произойдет соранение строка перестанет быть фантомной. 
				                                                 //а для таких cтрочеr название покупателя берется не из combobox, и из колонки name
			}
		);
		
		cellEdit = Ext.getCmp('exclusivePointMultiBuyerTable').getPlugin('celleditingexclusivePointMultiBuyer')
		cellEdit.addListener(
			"beforeedit",
			function( editor, e ) {
				
				//Редактировать можно только фантомные строчки
				e.cancel = !e.record.phantom
				return e.record.phantom 				
			}
		)
	},

	createPlacemarks: function() {
		var controller   = this,
		    points = []
		    collection   = null,
		    maxLatitude=-180, maxLongitude=-90, minLatitude=180, minLongitude=90;  //Костыль пока Яндекс не научится нормально определять границы
  
		//Саначала очистим карту от предыдущих меток
		controller.clusterer.removeAll(); 
	 
		controller.pointStore.each(function(r){
			var latitude  = r.get('latitude'),
			    longitude = r.get('longitude'),
			    hasMulti  = r.get('hasMulti'),
			    hint      = r.get('hint'),
			    
			point = new ymaps.Placemark([latitude, longitude],
				{
					balloonContent: "Вы тут",
					hintContent: "<ul><li>" + hint.replace(new RegExp(",",'g'),"</li><li>") + "</li></ul>"
				},
				{
					preset: hasMulti?'twirl#darkblueDotIcon':'twirl#redDotIcon'
				}
			);
			point.events.add("click", controller.loadBuyers) 
			
			
			points.push(point);
			
			minLatitude = (minLatitude>latitude)?latitude:minLatitude;
			minLongitude = (minLongitude>longitude)?longitude:minLongitude;
			maxLatitude = (maxLatitude<latitude)?latitude:maxLatitude;
			maxLongitude = (maxLongitude<longitude)?longitude:maxLongitude;
			return true;
		});
		
		controller.clusterer.add(points)
		controller.map.setBounds([[minLatitude, minLongitude], [maxLatitude, maxLongitude]]);
		panel.setLoading(false);
	},
	
	refreshMap: function() {
		var meterControl = Ext.getCmp('meterField'),
		    controller = this;
		
		controller.pointStore.proxy.extraParams = {
			meter: meterControl.getValue()
		};
		
		panel.setLoading(true);
		
		controller.pointStore.load(
			function(records, operation, success){
				if(!success) {
					Ext.Msg.alert('Ошибка загрузки точек', operation.getError().responseText)
					panel.setLoading(false);
				} else {
					controller.createPlacemarks();
				}				
			}
		);
	},
	
	loadBuyers: function(mEvent) {
		var meterControl = Ext.getCmp('meterField'),
		    coordinates,
		    multiBuyersTable = Ext.getCmp('exclusivePointMultiBuyerTable') ;
		
		coordinates = mEvent.get("target").geometry.getCoordinates();
				
		controller.buyerStore.proxy.extraParams = {
			latitude: coordinates[0],
			longitude: coordinates[1],			
			meter: meterControl.getValue()
		};

		
		multiBuyersTable.setLoading(true); //Эксклюзивщики лоадятся из-за load его стора, а мальтиков надо явно лоадить 
		controller.buyerStore.load(
			function(records, operation, success){
				if(!success)
					Ext.Msg.alert('Ошибка загрузки покупателей', operation.getError().responseText)
				else
					controller.loadMultiBuyers()
					
				multiBuyersTable.setLoading(false);
			}
		)
	},

	loadMultiBuyers: function() {
		var multiBuyerStore = controller.multiBuyerStore,
		    exclBuyerStore  = controller.buyerStore,
		    panel = Ext.getCmp('exclusivePointExclusiveBuyerTable')

		//Очистить мультиков
		multiBuyerStore.loadData([], false)  		//multiBuyerStore.removeAll();

		//Заполнить таблицу мультивок строками
		exclBuyerStore.each(
			function(record) {
				if ('Мульти' == record.get('type')) {
					multiBuyerStore.add(record)					
				}
			}
		);

		//Удалить из таблицы эксклюзивщиков мультиков
		multiBuyerStore.each(
			function(record) {
				exclBuyerStore.remove(record)
			}
		)

		//установить выделение на первую строку экслкюзивщиков (она всегода должна быть)
		panel.getSelectionModel().select(0);
	},
	
	onAddMultiBuyer: function() {
		var panel = Ext.getCmp('exclusivePointMultiBuyerTable'),
			sm = panel.getSelectionModel(),
		    store = panel.getStore(),
		    index = store.indexOf(sm.getLastSelected()),
		    cellEditing = panel.getPlugin('celleditingexclusivePointMultiBuyer'); //('cellEditing'),
		    model = new store.model;
		
		cellEditing.cancelEdit();
		store.insert(Math.max(index, 0), model);
		sm.select(model)
		cellEditing.startEdit(model, 0);
	},
	
	onDeleteMultiBuyer: function() {
		var sm = Ext.getCmp('exclusivePointMultiBuyerTable').getSelectionModel();
				
		controller.multiBuyerStore.remove(sm.getSelection()[0]);
		if (controller.multiBuyerStore.getCount() > 0) {
			sm.select(0);
		}
	},
	
	onSaveMultiBuyer: function() {
		var store  = controller.multiBuyerStore,
		    panel  = Ext.getCmp('exclusivePointMultiBuyerTable'),
		    sm     = Ext.getCmp('exclusivePointExclusiveBuyerTable').getSelectionModel(),
		    exclId;
		    
		    
		//Найдем id эксклюзивного покупателя
		if(1 != sm.getCount()) {
			Ext.Msg.alert("Ошибка", "Не выбран эксклюзивный покупатель")
			return
		}
		else
		    exclId = sm.getLastSelected().get("id") 
		
		Ext.getCmp('exclusivePointExclusiveBuyerTable').getSelectionModel()
		
		if (
			(store.getNewRecords().length > 0) ||
			(store.getUpdatedRecords().length > 0) ||
			(store.getRemovedRecords().length > 0)){
				
			store.proxy.extraParams={
				exclId: exclId
			};	
				
			panel.setLoading(true);
			store.sync({
				callback: function(batch){
					if(batch.exceptions.length>0){
						Ext.Msg.alert("Ошибка", batch.exceptions[0].getError());
					}
					panel.setLoading(false);
				}
			});
		}	
	},

	
	onSelectionchange: function(sm, records, eOpts) {
		Ext.getCmp('deleteexclusivePointMultiBuyer').setDisabled(records==null || records.length==0);

		if (records!=null && records.length == 1) {
			
			//Если перешли на фантомную строку, то надо пообновлять списки
			if (records[0].phantom) {
				
				//Если супервайзер не выбран (2-я строка для случая ТП), то передается null и ТП очишаются. 
				//(полезно, когда создается новая строка, т.к. срабатывает event или когда создали строку и начали кликать с одной строки на другую, не выбрав супервайзера)
				controller.filterTpCB(records[0].get("super_id"))
				controller.filterBuyerCB(records[0].get("tp_id"))			
			}
		}		
	},
	
	
	filterBuyerCB: function(tp_id) {
		if (typeof (tp_id) == 'number') {
			controller.buyerCBStore.proxy.extraParams={
				tp: tp_id
			};
			controller.buyerCBStore.load({
				callback: function(records, operation, success) {
					if (!success)
						Ext.Msg.alert('Ошибка', 'Ошибка загрузки покупателей<br/>' + operation.getError().responseText)
	  				}					
			})	
		}
		else
			controller.buyerCBStore.loadData([], false)  
	},
	
	filterTpCB: function(super_id) {
		controller.tpStore.clearFilter();
		controller.tpStore.filter('super_id', super_id);
	}
})