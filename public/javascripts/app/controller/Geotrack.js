Ext.define('app.controller.Geotrack', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Geotrack.RoutePoints',
		'Geotrack.Agents',
	],
	
	models: [
		'valueModel',
		'Geotrack.PointModel'
	],
	
	views: [
		'Geotrack.Container'
	],
	
	mainContainer: null,
	
	masterStore: null,
	pointsStore: null,
	
	map: null,
	center: [55.7, 37.6],
	trackLine: null,
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	refreshMapData: function(ddate, agentId){
		var controller = this;
		
		if(controller.trackLine!=null){
			controller.map.geoObjects.remove(controller.trackLine);
			controller.trackLine = null;
		}
		
		if(ddate!=null && ddate!="" && agentId>0){
			controller.mainContainer.setLoading(true);
			controller.pointsStore.proxy.extraParams = {
				ddate: ddate,
				agent_id: agentId
			};
			controller.pointsStore.load(
				function(records, operation, success){
					if(success!==true){
						Ext.Msg.alert("Ошибка", "Ошибка при получении координат точек маршрута");
					} else {
						var points=[];
						for(var i=0; i<records.length; i++){
							points.push([records[i].get('latitude'), records[i].get('longitude')]);
						}
						
						controller.trackLine = new ymaps.Polyline(
							points,
							{}, {
								strokeWidth : 3,
								opacity : 0.5,
								strokeColor : '0000FF'
							}
						)
						
						controller.map.geoObjects.add(controller.trackLine);
						
						if(controller.map.geoObjects.getBounds()!=null){
							controller.map.setBounds(controller.map.geoObjects.getBounds());
						}
					}
					
					controller.mainContainer.setLoading(false);
				}
			);
		}
	},
	
	loadGeotrack: function(){
		var controller=this,
			ddate = Ext.getCmp('filterGeotrackDdate').getValue(),
			agent = Ext.getCmp('GeoTrackAgentsTable').getSelectionModel().getSelection()[0];
		
		controller.refreshMapData(ddate, agent.get('id'));
	},
	
	filterMaster: function(){
		var controller = this;
		
		var controller = this;
		
		controller.mainContainer.setLoading(true);
		
		controller.masterStore.proxy.extraParams = {
			ddate: Ext.getCmp('filterGeotrackDdate').getValue()
		};
		controller.masterStore.load(
			function(records, operation, success){
				if(success!==true){
					Ext.Msg.alert("Ошибка", "Ошибка при получении списка агентов");
				}
				controller.mainContainer.setLoading(false);
			}
		)
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.Geotrack.Container');
		
		controller.control({
			'#refreshGeoTrackAgents': {
				click: controller.filterMaster
			},
			'#refreshGeotrack': {
				click: controller.loadGeotrack
			},
			'#GeoTrackAgentsTable': {
				selectionchange: function(sm, selected, eOpts){
					Ext.getCmp('refreshGeotrack').setDisabled(selected[0]==null);
				}
			},
			"#geotrackMap": {
				resize: function(){
					controller.map.container.fitToViewport();
				}
			}
		});
	},
	
	initMap: function(){
		var controller=this;
		
		controller.mainContainer.setLoading(true);
		ymaps.ready(function(){
			controller.map = new ymaps.Map("geotrackMap",
				{
					center: controller.center,
					zoom: 13,
			        behaviors: ["default", "scrollZoom"]
				}
			);
			
			// Добавление элементов управления
			controller.map.controls.add("zoomControl");
			controller.map.controls.add("typeSelector");
			
			if(controller.masterStore!=null && controller.masterStore.getCount()>0){
				controller.initPageData();
			}
			
			controller.mainContainer.setLoading(false);
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore = controller.getGeotrackAgentsStore();
		controller.pointsStore = controller.getGeotrackRoutePointsStore();
	},
	
	bindStores: function(){
		var controller=this,
			agentTable = Ext.getCmp('GeoTrackAgentsTable');
		
		agentTable.reconfigure(controller.masterStore);
	},
	
	loadDictionaries: function(){
		var controller = this,
			ddate = Ext.get('ddate').getValue();
			
		if(ddate==null || ddate==""){
			ddate = Ext.Date.format(new Date(), 'Y.m.d');
		}
		
		controller.mainContainer.setLoading(true);
		controller.masterStore.proxy.extraParams = {
			ddate: ddate
		};
		controller.masterStore.load(
			function(records, operation, success){
				if(success!==true){
					Ext.Msg.alert("Ошибка", "Ошибка при получении списка агентов");
				} else {
					if(controller.map!=null){
						controller.initPageData();
					}
				}
				controller.mainContainer.setLoading(false);
			}
		);
	},
	
	initPageData: function(){
		var controller=this,
			ddate = Ext.get('ddate').getValue(),
			agent = parseInt(Ext.get('agent_id').getValue()),
			ddateFilter = Ext.getCmp('filterGeotrackDdate'),
			sm = Ext.getCmp('GeoTrackAgentsTable').getSelectionModel();
		
		if(ddate!=null && ddate!=""){
			ddateFilter.setValue(ddate);
		}
		if(agent>0){
			sm.select(controller.masterStore.getById(agent));
		}
			
		controller.refreshMapData(ddate, agent);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initMap();
		
		controller.initStores();
		
		controller.bindStores();
		
		controller.loadDictionaries();
	}
});