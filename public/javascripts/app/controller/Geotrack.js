Ext.define('app.controller.Geotrack', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Geotrack.Tracks',
		'Geotrack.Agents'
	],
	
	models: [
		'valueModel',
		'Geotrack.TrackModel'
	],
	
	views: [
		'Geotrack.Container'
	],
	
	mainContainer: null,
	
	masterStore: null,
	detailStore: null,
	
	map: null,
	center: [55.7, 37.6],
	trackLines: null,
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	refreshMapData: function(ddate, agentId){
		var controller = this;
		
		controller.trackLines.removeAll();
		
		if(ddate!=null && ddate!="" && agentId>0){
			controller.mainContainer.setLoading(true);
			controller.detailStore.proxy.extraParams = {
				ddate: ddate,
				agent_id: agentId
			};
			controller.detailStore.load(
				function(records, operation, success){
					if(success!==true){
						Ext.Msg.alert("Ошибка", "Ошибка при получении трэков");
					} else {
						var points=[],
							trackLine,
							data;
						
						for(var i=0; i<records.length; i++){
							if(records[i].pointsArray!=null && records[i].pointsArray.length>0){
								trackLine = new ymaps.Polyline(
									records[i].pointsArray,
									{
										id: records[i].get('id'),
										num: i+1,
										start_time: Ext.Date.format(records[i].get('start_time'), 'Y.m.d H:i:s'),
										finish_time: Ext.Date.format(records[i].get('finish_time'), 'Y.m.d H:i:s')
									},
									{
										strokeWidth : 2,
										opacity : 0.4,
										strokeColor : '555555'
									}
								);
								controller.trackLines.add(trackLine);
							}
						}
						
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
			'#refreshGeoTracks': {
				click: controller.loadGeotrack
			},
			'#GeoTrackAgentsTable': {
				selectionchange: function(sm, selected, eOpts){
					Ext.getCmp('GeoTracksTable').setDisabled(selected[0]==null);
					controller.loadGeotrack();
				}
			},
			'#GeoTracksTable': {
				selectionchange: function(sm, selected, eOpts){
					var id=(selected[0]!=null)?selected[0].get('id'):null;
					controller.trackLines.each(
						function(o){
							if(o.properties.get('id')==id){
								o.options.set('strokeColor', '0000FF');
								o.options.set('strokeWidth', '4');
								o.options.set('opacity', '0.5');
								controller.map.setBounds(o.geometry.getBounds());
								o.balloon.open(o.geometry.get(0));
							} else {
								o.options.set('strokeColor', '555555');
								o.options.set('strokeWidth', '2');
								o.options.set('opacity', '0.4');
								o.balloon.close();
							}
						}
					)
				}
			},
			'#filterGeotrackDdate': {
				change: function(field, newValue, oldValue, eOpts){
					if(newValue instanceof Date){
						controller.filterMaster();
					}
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
			
			controller.trackLines = new ymaps.GeoObjectCollection(
				{},
				{
					balloonContentLayout: ymaps.templateLayoutFactory.createClass(
						'<h3>$[properties.num]</h3>' +
						'<p>Начало: $[properties.start_time]</p>' +
						'<p>Конец: $[properties.finish_time]</p>'
					)
				}
			);
			
			controller.map.geoObjects.add(controller.trackLines);
			
			controller.mainContainer.setLoading(false);
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore = controller.getGeotrackAgentsStore();
		controller.detailStore = controller.getGeotrackTracksStore();
	},
	
	bindStores: function(){
		var controller=this,
			agentTable = Ext.getCmp('GeoTrackAgentsTable');
		
		agentTable.reconfigure(controller.masterStore);
		Ext.getCmp('GeoTracksTable').reconfigure(controller.detailStore);
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