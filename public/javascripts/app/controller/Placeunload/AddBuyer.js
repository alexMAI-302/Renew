Ext.define('app.controller.Placeunload.AddBuyer', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Placeunload.AddBuyer.PartnersGroups',
		'Placeunload.AddBuyer.Partners',
		'Placeunload.AddBuyer.Buyers',
		'Placeunload.AddBuyer.Placeunloads',
		'Placeunload.AddBuyer.Placecategories',
		'Placeunload.AddBuyer.Routes',
		'Placeunload.AddBuyer.Schedules',
		'Placeunload.AddBuyer.Sites'
	],
	
	models: [
		'valueModel'
	],
	
	views: [
		'Placeunload.AddBuyer.Container'
	],
	
	mainContainer: null,
	
	masterStore: null,
	partnersGroupsStore: null,
	partnersStore: null,
	buyersStore: null,
	placecategoriesStore: null,
	routesStore: null,
	schedulesStore: null,
	sitesStore: null,
	
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
	
	onChangeBuyerData: function(){
		var controller = this;
		
		controller.masterStore.removeAll();
		Ext.getCmp('placeunloadsContainer').setDisabled(true);
		Ext.getCmp('savePlaceunload').setDisabled(true);
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.Placeunload.AddBuyer.Container');
		
		controller.control({
			'#placeunloadMode': {
				toggle: function(button, pressed, eOpts){
					Ext.getCmp('placeunloadsContainer').getLayout().setActiveItem(pressed?1:0);
				}
			},
			"#placeunloadAddBuyerMap": {
				resize: function(){
					controller.map.container.fitToViewport();
				}
			},
			'#partnerGroupCombo': {
				select: function(combo, records, eOpts){
					controller.partnersStore.proxy.extraParams = {
						partner_group_id: records[0].get('id')
					};
					controller.partnersStore.removeAll();
					controller.buyersStore.removeAll();
					Ext.getCmp('partnerCombo').setValue(null);
					Ext.getCmp('buyerCombo').setValue(null);
					return true;
				},
				change: controller.onChangeBuyerData
			},
			'#partnerCombo': {
				select: function(combo, records, eOpts){
					var newPlaceunloadUnloading = Ext.getCmp('newPlaceunloadUnloading');
					
					controller.buyersStore.proxy.extraParams = {
						partner_id: records[0].get('id')
					};
					controller.buyersStore.removeAll();
					Ext.getCmp('buyerCombo').setValue(null);
					
					newPlaceunloadUnloading.setValue(newPlaceunloadUnloading.getStore().findRecord('name', records[0].get['unloading']));
					return true;
				},
				change: controller.onChangeBuyerData
			},
			'#buyerCombo': {
				select: function(combo, records, eOpts){
					Ext.getCmp('addressPlaceunload').setValue(records[0].get('loadto'));
					Ext.getCmp('safariId').setValue(records[0].get('safari_id'));
					return true;
				},
				change: controller.onChangeBuyerData
			},
			'#findAddressPlaceunload': {
				click: function(){
					controller.geocode(Ext.getCmp('addressPlaceunload').getValue());
				}
			},
			'#savePlaceunload': {
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
			controller.map = new ymaps.Map("placeunloadAddBuyerMap",
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
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore = controller.getPlaceunloadAddBuyerPlaceunloadsStore();
		controller.partnersGroupsStore = controller.getPlaceunloadAddBuyerPartnersGroupsStore();
		controller.partnersStore = controller.getPlaceunloadAddBuyerPartnersStore();
		controller.buyersStore = controller.getPlaceunloadAddBuyerBuyersStore();
		controller.placecategoriesStore = controller.getPlaceunloadAddBuyerPlacecategoriesStore();
		controller.routesStore = controller.getPlaceunloadAddBuyerRoutesStore();
		controller.schedulesStore = controller.getPlaceunloadAddBuyerSchedulesStore();
		controller.sitesStore = controller.getPlaceunloadAddBuyerSitesStore();
	},
	
	loadStaticData: function(){
		var controller=this,
			count=4,
			buyerId = Ext.get('buyer_id').getValue(),
			partnerId = Ext.get('partner_id').getValue(),
			showSafariId = Ext.get('show_safari_id').getValue();
		
		if(buyerId>0 || partnerId>0){
			var partnerGroupId = Ext.get('partner_group_id').getValue(),
				partnerGroupName = Ext.get('partner_group_name').getValue(),
				partnerGroup = Ext.ModelManager.create(
					{
						id: partnerGroupId,
						name: partnerGroupName
					},
					'app.model.Placeunload.AddBuyer.PartnerModel'
				),
				partnerName = Ext.get('partner_name').getValue(),
				partner = Ext.ModelManager.create(
					{
						id: partnerId,
						name: partnerName
					},
					'app.model.Placeunload.AddBuyer.PartnerModel'
				);
			
			controller.partnersGroupsStore.removeAll();
			controller.partnersGroupsStore.add(partnerGroup);
			Ext.getCmp('partnerGroupCombo').select(partnerGroup);
			controller.partnersStore.removeAll();
			controller.partnersStore.add(partner);
			Ext.getCmp('partnerCombo').select(partner);
			
			controller.partnersStore.proxy.extraParams = {
				partner_group_id: partnerGroupId
			};
			
			if(buyerId>0){
				var	buyerName = Ext.get('buyer_name').getValue(),
					loadto = Ext.get('loadto').getValue(),
					buyer = Ext.ModelManager.create(
						{
							id: buyerId,
							name: buyerName,
							loadto: loadto
						},
						'app.model.Placeunload.AddBuyer.BuyerModel'
					);
				
				controller.buyersStore.removeAll();
				controller.buyersStore.add(buyer);
				Ext.getCmp('buyerCombo').select(buyer);
				Ext.getCmp('addressPlaceunload').setValue(loadto);
				
				controller.buyersStore.proxy.extraParams = {
					partner_id: partnerId
				};
			}
			
			if(partnerId>0){
				var unloading = Ext.get('unloading').getValue(),
					newPlaceunloadUnloading = Ext.getCmp('newPlaceunloadUnloading');
				
				if(!(buyerId>0)){
					Ext.getCmp('buyerCombo').setRawValue(partnerName);
				}
				newPlaceunloadUnloading.setValue(newPlaceunloadUnloading.getStore().findRecord('id', unloading));
				Ext.getCmp('newPlaceunloadName').setValue(partnerName);
			}
			
			if(showSafariId>0){
				var safariId = Ext.get('safari_id').getValue(),
					safariIdCmp = Ext.getCmp('safariId');
				
				safariIdCmp.setValue(safariId);
			}
		}
	},
	
	loadDictionaries: function(){
		var controller=this,
			count=4;
		
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
				Ext.getCmp('newPlaceunloadIncschedule').setValue(4384);
				Ext.getCmp('newPlaceunloadDelschedule').setValue(4384);
			}
		);
		
		controller.sitesStore.load(
			function(records, operation, success){
				var sitesPointsPlaceunload = Ext.getCmp('sitesPointsPlaceunload'),
					point;
				
				sitesPointsPlaceunload.removeAll();
				for(var i=0; i<records.length; i++){
					point = [records[i].get('latitude'), records[i].get('longitude')];
					sitesPointsPlaceunload.add(
						Ext.create("Ext.Button", {
							text: records[i].get('name'),
							point: point,
							handler: function(button){
								controller.geocode(button.point);
								Ext.getCmp('placeunloadMode').toggle();
							}
						})
					);
				}
				
				count--;
				checkLoading(count);
			}
		);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initMap();
		
		controller.initStores();
		
		controller.loadDictionaries();
		
		controller.loadStaticData();
	}
});