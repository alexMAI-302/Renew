Ext.define('app.controller.Placeunload.Points', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Placeunload.points.Placeunloads',
		'Placeunload.Placecategories',
		'Placeunload.Routes',
		'Placeunload.Schedules',
		'Placeunload.Unloading'
	],
	
	models: [
		'valueModel',
		'Placeunload.points.PlaceunloadModel'
	],
	
	views: [
		'Placeunload.points.Container'
	],
	
	mainContainer: null,
	
	masterStore: null,
	placecategoriesStore: null,
	routesStore: null,
	schedulesStore: null,
	unloadingStore: null,
	
	placeunloadId: null,
	
	map: null,
	placeunloadPoint: null,
	routesCollection: null,
	style1:
	{
		strokeColor: "ffff0055",
		fillColor: "ff000055"
	},
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	setCenter: function(point){
		var controller = this;
		
		if(controller.placeunloadPoint==null){
			controller.placeunloadPoint = new ymaps.Placemark(point);
			controller.map.geoObjects.add(controller.placeunloadPoint);
		}
		controller.placeunloadPoint.geometry.setCoordinates(point);
		controller.map.zoomRange.get(point).then(
			function(range){
				controller.map.setCenter(point, range[1]);
			}
		);
	},
	
	geocode: function(query) {
		var controller = this,
			geocoder = new ymaps.geocode(query, {boundedBy: controller.map.getBounds()}),
			placeunloadsContainer = Ext.getCmp('placeunloadsContainer'),
			savePlaceunload = Ext.getCmp('savePlaceunload');
		
		controller.mainContainer.setLoading(true);
		placeunloadsContainer.setDisabled(true);
		savePlaceunload.setDisabled(true);
        // Создание обработчика для успешного завершения геокодирования
		geocoder.then(
			function (res) {
				var n = res.geoObjects.getLength(),
					geoResultInfo,
					geoResultPoint;
				controller.mainContainer.setLoading(false);
				if (n>0) {
						geoResultInfo = res.geoObjects.get(0).properties.get("metaDataProperty").GeocoderMetaData;
						geoResultPoint = res.geoObjects.get(0).geometry.getCoordinates();
				} else {
					Ext.Msg.alert('Ошибка', "Ничего не найдено!");
					return;
				}
				if (geoResultInfo.kind == "country" || geoResultInfo.kind == "province" || geoResultInfo.kind == "district") {
					Ext.Msg.alert('Ошибка', "Слишком общий адрес!");
					return;
				}
				if (geoResultInfo.kind == 'locality') {
					try {
						if (geoResultInfo.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName == "Москва") {
							Ext.Msg.alert('Ошибка', "Не могу найти улицу в городе!");
							return;
						};
					}
					catch(e) {
							;
					};
				}
								
				controller.masterStore.proxy.extraParams = {
					latitude: geoResultPoint[0],
					longitude: geoResultPoint[1]
				};
				
				controller.masterStore.load(
					function(records, operation, success){
						if(success!==true){
							Ext.Msg.alert("Ошибка", "Ошибка при получении адресов разгрузки");
						} else {
							var placeunloadsTable,
								placeunloadId = Ext.get('placeunload_id').getValue();
							placeunloadsTable = Ext.getCmp('PlaceunloadsTable');
							for(var i=0; i<records.length; i++){
								if(records[i].get('id')==placeunloadId){
									placeunloadsTable.getSelectionModel().select(records[i]);
									break;
								}
							}
						}
						placeunloadsContainer.setDisabled(false);
						savePlaceunload.setDisabled(false);
					}
				);
				
				Ext.getCmp('fulladdressPlaceunload').setValue(geoResultInfo.text);
				
				controller.routesCollection.each(function(o){
					if(o.geometry.contains(geoResultPoint)){
						Ext.getCmp('newPlaceunloadRoute').setValue(o.properties.get('id'));
					}
				});
				
				controller.setCenter(geoResultPoint);
	        },
	        function (error) {
	        	Ext.Msg.alert('Ошибка', "Произошла ошибка: " + error.message);
	        	
	        	controller.mainContainer.setLoading(false);
	        	placeunloadsContainer.setDisabled(false);
				savePlaceunload.setDisabled(false);
			}
		);
	},
	
	loadMaster: function(){
		var controller = this;
		
		controller.mainContainer.setDisabled(true);
		
		controller.masterStore.proxy.extraParams = {
			id: controllerr.placeunloadId,
			placeunload_name: Ext.getCmp('filterNamePlaceunload').getValue(),
			address: Ext.getCmp('filterAddressPlaceunload').getValue(),
			tp: Ext.getCmp('filterTpPlaceunload').getValue(),
			ischeck: Ext.getCmp('filterIscheckPlaceunload').getValue(),
			buyers_route_id: Ext.getCmp('filterBuyersRoutePlaceunload').getValue(),
			ddate: Ext.getCmp('filterDdatePlaceunload').getValue(),
			notgeo: Ext.getCmp('filterNotgeoPlaceunload').getValue()
		};
		
		controller.masterStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при получении точек разгрузки <br/>" + operation.getError().responseText);
				} else {
					if(controller.placeunloadId!=null){
						Ext.getCmp('placeunloadsTable').getSelectionModel().select(records);
						controller.placeunloadId = null;
					}
				}
				controller.mainContainer.setDisabled(false);
			}
		);
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.Placeunload.points.Container');
		
		controller.control({
			"#placeunloadPointsMap": {
				resize: function(){
					controller.map.container.fitToViewport();
				}
			},
			'#findAddressPlaceunload': {
				click: function(){
					controller.geocode(Ext.getCmp('addressPlaceunload').getValue());
				}
			},
			'#filterPlaceunloads': {
				click: controller.loadMaster
			},
			'#savePlaceunloads': {
				click: function(){
					var coords = controller.placeunloadPoint.geometry.getCoordinates(),
						selectedPlaceunload = Ext.getCmp('PlaceunloadsTable').getSelectionModel().getSelection()[0],
						partnerGroupId = Ext.getCmp('partnerGroupCombo').getValue(),
						partnerId = Ext.getCmp('partnerCombo').getValue(),
						partner = controller.partnersStore.findRecord('id', partnerId),
						buyerId = Ext.getCmp('buyerCombo').getValue(),
						buyer = controller.buyersStore.findRecord('id', buyerId),
						modeNewPlaceunload = Ext.getCmp('placeunloadMode').pressed,
						buyerPropertiesGridFields = Ext.ComponentQuery.query('buyerPropertiesGrid > combobox, buyerPropertiesGrid > textfield'),
						buyerPropertiesGridValid = true,
						placeunloadPropertiesGridFields = Ext.ComponentQuery.query('placeunloadPropertiesGrid > combobox, placeunloadPropertiesGrid > textfield'),
						placeunloadPropertiesGridValid = true,
						placeunloadValid = modeNewPlaceunload || selectedPlaceunload!=null,
						errorMsg = '';
					
					for(var i=0; i<buyerPropertiesGridFields.length; i++){
						buyerPropertiesGridValid = buyerPropertiesGridValid && buyerPropertiesGridFields[i].validate();
					}
					
					if(modeNewPlaceunload){
						for(var i=0; i<placeunloadPropertiesGridFields.length; i++){
							placeunloadPropertiesGridValid = placeunloadPropertiesGridValid && placeunloadPropertiesGridFields[i].validate();
						}
					}
					
					if(!buyerPropertiesGridValid){
						errorMsg+="Введите данные по покупателю<br/>";
					}
					
					if(!placeunloadPropertiesGridValid){
						errorMsg+="Введите данные по адресу разгрузки<br/>";
					}
					
					if(!placeunloadValid){
						errorMsg+="Выберите адрес разгрузки<br/>";
					}
					
					if(errorMsg!=''){
						Ext.Msg.alert("Ошибка", errorMsg);
						return;
					}
					
					controller.mainContainer.setLoading(true);
					Ext.Ajax.request({
						url: '/placeunload/add_buyer/save_buyer',
						timeout: 300000,
						jsonData: {
							partner_group_id: partnerGroupId,
							partner_id: (partner!=null)?partnerId:-1,
							partner_name: (partner!=null)?partner.get('name'):partnerId,
					        buyer_id: (buyer!=null)?buyerId:-1,
					        buyer_name: (buyer!=null)?buyer.get('name'):buyerId,
					        placeunload_id: (selectedPlaceunload!=null)?selectedPlaceunload.get('id'):-1,
					        placeunload_name: Ext.getCmp('newPlaceunloadName').getValue(),
					        loadto: Ext.getCmp('addressPlaceunload').getValue(),
					        fulladdress: Ext.getCmp('fulladdressPlaceunload').getValue(),
					        latitude: coords[0],
					        longitude: coords[1],
					        placeunload_descr: Ext.getCmp('newPlacunloadDescr').getValue(),
					        placeunload_unloading: Ext.getCmp('newPlaceunloadUnloading').getValue(),
					        placeunload_delscheduleid: Ext.getCmp('newPlaceunloadDelschedule').getValue(),
					        placeunload_incscheduleid: Ext.getCmp('newPlaceunloadIncschedule').getValue(),
					        placeunload_buyers_route_id: Ext.getCmp('newPlaceunloadRoute').getValue(),
					        placeunload_placecategory_id: Ext.getCmp('newPlaceunloadPlacecategory').getValue(),
					        dow: Ext.getCmp('dow').getValue(),
					        safari_id: Ext.getCmp('safariId').getValue()
						},
						method: "POST",
						callback: function(options, success, response){
							if(success!==true){
								controller.showServerError(response, options);
							} else {
								if(response.responseText!="ok"){
									Ext.Msg.alert('Ошибка', response.responseText);
								} else {
									Ext.Msg.alert('', 'Данные успешно сохранены');
								}
							}
							controller.mainContainer.setLoading(false);
						}
					});
				}
			}
		});
	},
	
	initMap: function(){
		var controller=this;
		
		controller.mainContainer.setLoading(true);
		ymaps.ready(function(){
			var latitude = Ext.get('latitude').getValue(),
				longitude = Ext.get('longitude').getValue();
			controller.map = new ymaps.Map("placeunloadPointsMap",
				{
					center: [55.76, 37.64],
					zoom: 13,
			        behaviors: ["default", "scrollZoom"]
				}
			);
			// Добавление элементов управления
			controller.map.controls.add("zoomControl");
			controller.map.controls.add("typeSelector");
			controller.routesCollection = new ymaps.GeoObjectCollection();
			controller.map.geoObjects.add(controller.routesCollection);
			controller.map.events.add(
				"click",
				function(e){
					var position = e.get('coordPosition');
					controller.geocode(position);
				});
			controller.map.container.fitToViewport();
			controller.mainContainer.setLoading(false);
			
			if(latitude!=null && latitude!='' && longitude!=null && longitude!=''){
				controller.geocode([latitude, longitude]);
			}
		});
	},
	
	initModel: function(){
		var controller = this,
			placeunloadFields = Ext.ModelManager.getModel('app.model.Placeunload.points.PlaceunloadModel').getFields();
		
		function convert_value_to_str(value, store){
			var matching = null,
				data = store.snapshot || store.data;
			data.each(function(record){
				if(record.get('id')==value){
					matching=record.get('name');
				}
				return matching==null;
			});
			return matching;
		};
		
		for(var i=0; i<placeunloadFields.length; i++){
			if(placeunloadFields[i].name=='placecategory_id'){
				placeunloadFields[i].convert = function(v, record){
					record.set('placecategory_name', convert_value_to_str(v, controller.placecategoriesStore));
					return v;
				};
			}else if(placeunloadFields[i].name=='unloading'){
				placeunloadFields[i].convert = function(v, record){
					record.set('unloading_name', convert_value_to_str(v, controller.unloadingStore));
					return v;
				};
			} else if(placeunloadFields[i].name=='delscheduleid'){
				placeunloadFields[i].convert = function(v, record){
					record.set('delschedule_name', convert_value_to_str(v, controller.schedulesStore));
					return v;
				};
			} else if(placeunloadFields[i].name=='incscheduleid'){
				placeunloadFields[i].convert = function(v, record){
					record.set('incschedule_name', convert_value_to_str(v, controller.schedulesStore));
					return v;
				};
			} else if(placeunloadFields[i].name=='buyers_route_id'){
				placeunloadFields[i].convert = function(v, record){
					record.set('buyers_route_name', convert_value_to_str(v, controller.routesStore));
					return v;
				};
			}
			 else if(placeunloadFields[i].name=='ischeck'){
				placeunloadFields[i].convert = function(v, record){
					record.set('ischeck_name', v?'v':'');
					return v;
				};
			}
		}
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore = controller.getPlaceunloadPointsPlaceunloadsStore();
		controller.placecategoriesStore = controller.getPlaceunloadPlacecategoriesStore();
		controller.routesStore = controller.getPlaceunloadRoutesStore();
		controller.schedulesStore = controller.getPlaceunloadSchedulesStore();
		controller.unloadingStore = controller.getPlaceunloadUnloadingStore();
	},
	
	loadStaticData: function(){
		var controller = this,
			placeunloadName = Ext.get('placeunload_name').getValue(),
			address = Ext.get('address').getValue(),
			tp = Ext.get('tp').getValue(),
			ischeck = Ext.get('ischeck').getValue(),
			buyersRouteId = Ext.get('buyers_route_id').getValue(),
			ddate = Ext.get('ddate').getValue(),
			notgeo = Ext.get('notgeo').getValue(),
			filterIscheckPlaceunload = Ext.getCmp('filterIscheckPlaceunload');
		
		
		controller.placeunloadId = Ext.get('placeunload_id').getValue();
			
		Ext.getCmp('filterNamePlaceunload').setValue(placeunloadName);
		Ext.getCmp('filterAddressPlaceunload').setValue(address);
		Ext.getCmp('filterTpPlaceunload').setValue(tp);
		filterIscheckPlaceunload.setValue(filterIscheckPlaceunload.getStore().getAt(filterIscheckPlaceunload.getStore().find('id', ischeck)), true);
		Ext.getCmp('filterBuyersRoutePlaceunload').setValue(buyersRouteId);
		Ext.getCmp('filterDdatePlaceunload').setValue(ddate);
		Ext.getCmp('filterNotgeoPlaceunload').setValue(notgeo);
	},
	
	loadDictionaries: function(){
		var controller=this,
			count=3;
		
		controller.mainContainer.setLoading(true);
		function checkLoading(val){
			if(val==0){
				controller.mainContainer.setLoading(false);
			}
		};
		
		controller.placecategoriesStore.load(
			function(records, operation, success){
				count--;
				checkLoading(count);
			}
		);
		
		controller.routesStore.load(
			function(records, operation, success){
				var polygon,
					points;
				for(var i=0; i<records.length; i++){
					points = records[i].get('points');
					if(points!=null && points!=''){
						polygon = new ymaps.Polygon(
							ymaps.geometry.Polygon.fromEncodedCoordinates(points),
							{
								hintContent: records[i].get('name'),
								id: records[i].get('id')
							},
							{
								strokeColor: controller.style1.strokeColor.toString(),
								fillColor: controller.style1.fillColor.toString()
							}
						);
						polygon.events.add("click", function(mEvent){
							controller.geocode(mEvent.get('coordPosition'));
						});
						controller.routesCollection.add(polygon);
					}
				}
				
				count--;
				checkLoading(count);
			}
		);
		
		controller.schedulesStore.load(
			function(records, operation, success){
				count--;
				checkLoading(count);
			}
		);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initMap();
		
		controller.initModel();
		
		controller.initStores();
		
		controller.loadDictionaries();
		
		controller.loadStaticData();
	}
});