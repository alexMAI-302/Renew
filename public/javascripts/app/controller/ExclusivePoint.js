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
			
			'#addexclusivePointMultiBuyer': {
				click: controller.onAddMultiBuyer
			},
			
			'#exclusivePointMultiBuyerTable': {
				selectionchange: controller.filterTp
			},
			
			'#celleditingexclusivePointMultiBuyer':			
			{
				beforeedit: function() {console.log('beforeedit')}
			}
			/*
			'#exclusivePointMultiBuyerTpId': {
				expand: function( field, eOpts ) {
					console.log('expand');
				},
				
				select: function( combo, records, eOpts ) {
					console.log('select');
				}
			}
			*/
		})
	},
	
	onLaunch: function() {
		this.initMap();
		this.initStores();
		
		this.refreshMap();
		
	/*
		this.bindStores();
		
		panel.setLoading(true);
		this.siteStore.load(
			function() {
				panel.setLoading(false);
			}	
		);
		*/
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
		this.supervisorStore = Ext.getCmp('exclusivePointMultiBuyerTable').columns[2].store;
		this.tpStore         = Ext.getCmp('exclusivePointMultiBuyerTable').columns[3].store;
		this.buyerCBStore    = Ext.getCmp('exclusivePointMultiBuyerTable').columns[4].store;
		


		this.supervisorStore.load();
		this.tpStore.load();
		
		
		
		//event
		colSuper = Ext.getCmp('exclusivePointMultiBuyerTable').columns[2].field;
		/*
		colSuper.addListener(
			"change",
			function(combo, newValue, oldValue, eOpts)  {
				console.log('change')
				var record = Ext.getCmp('exclusivePointMultiBuyerTable').getSelectionModel().getSelection()[0]
				
				
				record.set("tp_id", null);
				record.set("podr", null);
			}
		)
		*/
		colSuper.addListener(
			"select",
			function(combo, records, eOpts)  {
				var recordTable = Ext.getCmp('exclusivePointMultiBuyerTable').getSelectionModel().getSelection()[0]

				recordTable.set("tp_id", null);
				recordTable.set("podr", records[0].get('podr'));
			}
		)
		
	
		
		colTp = Ext.getCmp('exclusivePointMultiBuyerTable').columns[3].field;
		colTp.addListener(
			"expand",
			function( field, eOpts ) {
				console.log('expand');
				
				var super_id =Ext.getCmp('exclusivePointMultiBuyerTable').getSelectionModel().getSelection()[0].get("super_id");
				controller.tpStore.filter('super_id', super_id);
			}
		)
		
		
		//v1
		//colBuyer = Ext.getCmp('exclusivePointMultiBuyerTable').columns[4].field;
		colTp.addListener(
			"select",
			function(combo, records, eOpts) {
				console.log('select tp');
							
				controller.buyerCBStore.proxy.extraParams={
					tp: records[0].get('id') //get('tp')
				};
				controller.buyerCBStore.load() //collback дописать
				//controller.buyerCBStore.removeAll();
				//console.log(controller.buyerCBStore)
				
				//console.log(Ext.getCmp('exclusivePointMultiBuyerTable').columns[4])
				
				//console.log(Ext.getCmp('exclusivePointMultiBuyerTable').columns[4])
				/*
				var store = Ext.getCmp('exclusivePointMultiBuyerTable').columns[4].field.store
				store.proxy.extraParams={
					tp: records[0].get('id')
				};
				
				store.removeAll()
				*/
			}
		)
		
		cellEdit = Ext.getCmp('exclusivePointMultiBuyerTable').getPlugin('celleditingexclusivePointMultiBuyer')
		cellEdit.addListener(
			"beforeedit",
			function( editor, e ) {
				//Редактировать можно только фантомные строчки
				//console.log('beforeedit' + e.record.phantom)
				
				e.cancel = !e.record.phantom
				return e.record.phantom 				
			}
		)
		
		
		
//		Ext.getCmp('ExclusivePointBuyerTable').getStore();
/*
		console.log(this.buyerStore)
		console.log(Ext.getCmp('currentBuyer').getStore())
		console.log(this.buyerStore == Ext.getCmp('currentBuyer').getStore())
*/
	},
/*	
	bindStores: function(){
		var siteFilter = Ext.getCmp('siteFilter');
		
		siteFilter.bindStore(this.siteStore);
		Ext.getCmp('DeliveryRouteTable').reconfigure(this.masterStore);
		
		siteFilter.setValue(1);
	},
*/


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
			    
			point = new ymaps.Placemark([latitude, longitude],
				{
					//iconContent: ord,
					//balloonContent: ord,
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
					Ext.Msg.alert('Ошибка загрузки маршрутов', operation.getError().responseText)
					panel.setLoading(false);
				} else {
					controller.createPlacemarks();
				}				
			}
		);
	},
	
	loadBuyers: function(mEvent) {
		var meterControl = Ext.getCmp('meterField'),
		    //controller = this,
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
		console.log('add');
		
		var panel = Ext.getCmp('exclusivePointMultiBuyerTable'),
			sm = panel.getSelectionModel(),
		    store = panel.getStore(),
		    index = store.indexOf(sm.getLastSelected()),
		    cellEditing = panel.getPlugin('celleditingexclusivePointMultiBuyer'); //('cellEditing'),
		    model = new store.model;
		
		console.log(panel)

		cellEditing.cancelEdit();

		store.insert(Math.max(index, 0), model);
		sm.select(model)
		cellEditing.startEdit(model, 0);
	},
	
	filterTp: function(sm, records, eOpts) {
		console.log('selectionchange')
		console.log(records)
		
		if (records!=null && records.length == 1) {
			var super_id = records[0].get("super_id");
			
			controller.tpStore.filter('super_id', super_id);
			
			console.log(controller.tpStore)					
		}
	}
})