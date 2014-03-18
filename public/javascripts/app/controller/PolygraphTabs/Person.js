Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
	'Ext.ux.DataView.LabelEditor'
]);
Ext.define('app.controller.PolygraphTabs.Person', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Polygraph.PolygraphPerson',
		'Polygraph.Person',
		'Polygraph.PersonResult',
		'Polygraph.PersonAnswer',
		'Polygraph.Person_questions',
		'Polygraph.MaritalStatus',
		'Polygraph.Pictures'
		
	],
	
	models: [
		'valueModel',
		'Polygraph.PolygraphPerson',
		'Polygraph.PersonAnswer',
		'Polygraph.PictureModel'
	],
	
	views: [
		'Polygraph.Container',
		'goodsCatalog.FileWindow'
	],
	
	mainContainer: null,
	
	masterStore: null,
	PersonStore: null,
	PolygraphPersonResultStore:null,
	detailStore: null,         
	detailStore2: null, 
	Person_questionsStore:null,
	Polygraph_PersonFoto:null,
	fileWindow: null,
	picturesStore: null,
	
	storeHasChanges: function(store){
		return (store.getNewRecords().length > 0) ||
			(store.getUpdatedRecords().length > 0) ||
			(store.getRemovedRecords().length > 0)
	},
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	syncMaster: function(container, selectedMasterId){
		var controller=this;
		function syncDetail(container, masterId)
		{
		    
			
			 container.setLoading(true);
			if(masterId == null || masterId == 0 )
			{
					var selected = Ext.getCmp('PolygraphPersonTable').getSelectionModel().getSelection()[0];
					masterId = ((selected != null) ? selected.get('id') : null);

			};
			if(masterId == null || masterId == 0 )
			{
			  Ext.Msg.alert("Внимание", "Ваши данные в таблице с детализацией были утеряны. Сначала сохраняйте данные в основной таблице, затем вводите детализацию.");
			  container.setLoading(false);
			  return;
			};
		
			
			
			if (controller.storeHasChanges(controller.detailStore2))
			{
			controller.detailStore2.proxy.extraParams={master_id: masterId};
					
					controller.detailStore2.sync({
						callback: function(batch){
							if(batch.exceptions.length>0)
							{
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
								container.setLoading(false);
							}
							
						}
					});
			};
			container.setLoading(false);
			
			

		};
		
		container.setLoading(true);
		if (controller.storeHasChanges(controller.masterStore)){
			controller.masterStore.sync({
				callback: function(batch){
					if(batch.exceptions.length>0){
						Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
						container.setLoading(false);
					} else {
						syncDetail(container, selectedMasterId);
					}
				}
			});
		} else {
			syncDetail(container, selectedMasterId);
		}
	},
	
	loadDetail2: function(masterId, detailTable)
	{
		var controller=this;
		controller.detailStore2.proxy.extraParams={master_id: masterId};
		controller.detailStore2.load(function(){detailTable.setDisabled(false);});
	},
	
	
	
	loadDetail: function(store, masterId, errorString){
		var controller = this;
		
		
			store.proxy.extraParams={
				master_id: masterId
			};
			store.load(
				function(records, operation, success){
					if(success!==true){
						Ext.Msg.alert("Ошибка", errorString);
					} 
				}
			)
		
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.Polygraph.Person.Container');
		controller.fileWindow=Ext.create('app.view.Polygraph.FileWindow');
		controller.mainContainer.addListener(
			"show",
			function(){
				controller.loadDictionaries();
			}
		);
		Ext.getCmp('PolygraphMain').add(controller.mainContainer);
		function getId(r){
			return (r!=null)?
					((r.getId()!=null && r.getId()!=0)?
						r.getId():
						r.get('id')
					):
					null;
		}
		
		controller.control({
		
		'#addPolygraphPerson': {
				click: function(){
					var sm=Ext.getCmp('PolygraphPersonTable').getSelectionModel(),
					r = Ext.ModelManager.create({ddate: new Date()}, 'app.model.Polygraph.PolygraphPerson');
					controller.masterStore.insert(0, r);
					sm.select(r);
					


				}
			
			},
			'#savePolygraphPerson' : {
				click : function() {
					var selected = Ext.getCmp('PolygraphPersonTable').getSelectionModel().getSelection()[0];
					controller.syncMaster(controller.mainContainer, (selected != null) ? selected.get('id') : null);
					return true;
				}
			},
			'#refreshPolygraphPerson': {
				click: function(){
					controller.masterStore.load();
				}
			},
			'#deletePolygraphPerson': {
				click: function(button)
				{
					var sm = Ext.getCmp('PolygraphPersonTable').getSelectionModel();
					
					controller.masterStore.remove(sm.getSelection()[0]);
					if (controller.masterStore.getCount() > 0) {
						sm.select(0);
					}
				}
			},
			'#PolygraphPersonTable': 
			{
				selectionchange: function(sm, selected, eOpts)
				{
				    
  					if(selected!=null && selected.length>0)
					{
						controller.loadDetail2(getId(selected[0]),Ext.getCmp('PersonAnswersTable'));
						Ext.getCmp('deletePolygraphPerson').setDisabled(false);  //кнопку удалить активируем
						Ext.getCmp('PolygraphPersonLoadFoto').setDisabled(false);  //кнопку загрузить фото активируем
						controller.loadDetail(controller.picturesStore,getId(selected[0]),'1');
					} 
					else {
					

						controller.detailStore2.removeAll();
						Ext.getCmp('PersonAnswersTable').setDisabled(true);
						Ext.getCmp('deletePolygraphPerson').setDisabled(true);
						Ext.getCmp('deletePersonAnswers').setDisabled(true);
						
						
					}
					return true;
				}

			    
			},
			'#addPersonAnswers': {
				click: function()
				{
						var sm=Ext.getCmp('PolygraphPersonTable').getSelectionModel(),
						id = sm.getSelection()[0].getId();
						r = Ext.ModelManager.create({master_id: id}, 'app.model.Polygraph.PersonAnswer');
					    controller.detailStore2.insert(0, r);
						
				}
			},
				'#deletePersonAnswers': {
				click: function(button){
					var sm = Ext.getCmp('PersonAnswersTable').getSelectionModel();
					
					controller.detailStore2.remove(sm.getSelection()[0]);
					if (controller.detailStore2.getCount() > 0) {
						sm.select(0);
					}
				}
			},
			'#PersonAnswersTable': {
				selectionchange: function(sm, selected, eOpts){
					Ext.getCmp('deletePersonAnswers').setDisabled(selected==null || selected.length==0);
					return true;
				}
			},
			'#PolygraphPersonLoadFoto': {
				click: function(button){
				controller.fileWindow.setTitle("Загрузка фото для сотрудника");
					controller.fileWindow.show();

					}
				},
			'#uploadFile': {
				click: function(button) {
					var form = button.up('form').getForm();
					
					if(form.isValid())
					{
						
						var sm=Ext.getCmp('PolygraphPersonTable').getSelectionModel(),
						masterId = sm.getSelection()[0].getId();
									if(masterId == null || masterId == 0 )
						{
						
						   controller.fileWindow.hide();
						   Ext.Msg.alert('Внимание', 'Сначало сохраните данные');
						}
						else
						{

						
						

						form.submit({
							url: '/polygraph/upload_person_picture',
							params: {
								authenticity_token: window._token,
								master_id: masterId
							},
							waitMsg: 'Загрузка данных...',
							success: function(fp, o) {
								
								controller.loadDetail(controller.picturesStore,masterId,'1');
								controller.fileWindow.hide();
							},
							errors: function(fp, o){
								controller.fileWindow.hide();
								Ext.Msg.alert("Ошибка обработки файла", o.result.errors);
							}
						})};
						
						
					}
				}
			}	
			
			
	})},
	
		//загружаем словари
		loadDictionaries: function(){
		var controller=this;
		controller.PersonStore.load();
		controller.masterStore.load();
		controller.PolygraphPersonResult.load();
		controller.Person_questionsStore.load();
		
	},

	//инициируем сторки
	initStores: function(){
		var controller=this,
		PersonTable = Ext.getCmp('PolygraphPersonTable');
		controller.masterStore = PersonTable.getStore();
		controller.PersonStore = PersonTable.columns[1].store;
		controller.PolygraphPersonResult = PersonTable.columns[5].store;
		
		
		PersonAnswersTable = Ext.getCmp('PersonAnswersTable');
		controller.detailStore2 = PersonAnswersTable.getStore();
		controller.Person_questionsStore = PersonAnswersTable.columns[0].store;
		controller.picturesStore=Ext.getCmp('PolygraphPicturesList').getStore();
		Ext.getCmp('PolygraphPersonLoadFoto').setDisabled(true);
		

		
		
		
		controller.loadDictionaries();
	},
	
	
	
	
	onLaunch: function(){
		var controller = this;
		controller.initStores();
		
	
	}
	

});
