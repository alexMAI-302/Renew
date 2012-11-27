Ext.define('app.controller.RenewGroup', {
    extend: 'Ext.app.Controller' ,

	models: ['app.model.renewUser.RenewGroupsUrls',
	         'app.model.renewUser.RenewUsersGroups',
			 'app.model.renewUser.RenewGroup',
			 'app.model.renewUser.RenewUser',
			 'app.model.renewUser.RenewUrl'],

	views: ['app.view.renewUser.RenewGroup',
	        'app.view.renewUser.RenewGroupsUsers',
			'app.view.renewUser.RenewGroupsUrls'],


    init: function() {
		masterStore = Ext.create('Ext.data.Store', {
			itemId: 'store',
			model: 'app.model.renewUser.RenewGroup'
		});

		detailStore = Ext.create('Ext.data.Store', {
			itemId: 'detailStore',
			model: 'app.model.renewUser.RenewUsersGroups',

			//Синхронизация выполняется из двух мест (из коллбека синхронизации мастера или (если в мастере нечего синхронихировать) самостоятельно по кнопке "Сохранить")
			//что бы не прописывать каждый раз коллбеки создадим новый метод detailSync()
			detailSync: function() {
				if ((this.getNewRecords().length > 0) || (this.getUpdatedRecords().length > 0) || (this.getRemovedRecords().length > 0)) 
					this.sync({
						success: function(batch, options) {
							storeDone = true;
							if (storeDone && urlStoreDone)
								mainPanel.setLoading(false);
						},
						failure: function(batch, options) {
							Ext.Msg.alert('Ошибка', batch.exceptions[0].error + '<br/>Всего ошибок: ' + batch.exceptions.length)
							storeDone = true;
							if (storeDone && urlStoreDone)
								mainPanel.setLoading(false);
						}
					});
				else
					storeDone = true;
					if (storeDone && urlStoreDone)
						mainPanel.setLoading(false);
			}
		});

		detailUrlStore = Ext.create('Ext.data.Store', {
			itemId: 'detailUrlStore',
			model: 'app.model.renewUser.RenewGroupsUrls',

			//Синхронизация выполняется из двух мест (из коллбека синхронизации мастера или (если в мастере нечего синхронихировать) самостоятельно по кнопке "Сохранить")
			//что бы не прописывать каждый раз коллбеки создадим новый метод detailSync()
			detailSync: function() {
				if ((this.getNewRecords().length > 0) || (this.getUpdatedRecords().length > 0) || (this.getRemovedRecords().length > 0)) 
					this.sync({
						success: function(batch, options) {
							urlStoreDone = true
							if (storeDone && urlStoreDone)
								mainPanel.setLoading(false);
						},
						failure: function(batch, options) {
							Ext.Msg.alert('Ошибка', batch.exceptions[0].error + '<br/>Всего ошибок: ' + batch.exceptions.length)
							urlStoreDone = true
							if (storeDone && urlStoreDone)
								mainPanel.setLoading(false);
						}
					});
				else
					urlStoreDone = true
					if (storeDone && urlStoreDone)
						mainPanel.setLoading(false);
			}
		});
		

		storeDone = false;
		urlStoreDone = false;


		mainPanel = Ext.create('Ext.panel.Panel', {
			renderTo: Ext.get('renew_group_js'),
			
			height: 500,
			layout: 'border',

			tbar: [{
				itemId: 'submit',
				text: 'Сохранить',
			}]
		});
		
		southPanel = Ext.create('Ext.panel.Panel', {
			height: 300,
			region: 'south',
			layout: 'border',
			split: true,
		})

		panel = Ext.create('app.view.renewUser.RenewGroup', {
			store: masterStore,
			region: 'center',
			split: true,
		});

		detailPanel = Ext.create('app.view.renewUser.RenewGroupsUsers', {
			store: detailStore,
			height: 300,
			region: 'center',
			split: true,
			minWidth: 80,
			flex: 1
		});
		
		detailUrlPanel = Ext.create('app.view.renewUser.RenewGroupsUrls', {
			store: detailUrlStore,
			height: 300,
			region: 'east',
			split: true,
			minWidth: 80,
			flex: 1
		});

		detailPanel.store.sort(detailPanel.sorterName); //Сортировка по умолчанию - по возрастанию
		detailUrlPanel.store.sort(detailUrlPanel.sorterName); //Сортировка по умолчанию - по возрастанию

		southPanel.add(detailPanel);
		southPanel.add(detailUrlPanel);
		
		mainPanel.add(panel)
		mainPanel.add(southPanel);
		
		mainPanel.setLoading(true);
		detailNeedLoading = false; //false означает, что идет первый load. в этом случае setLoading общий для мастера и для детейла 
		                           //и не надо отдельно setLoading детейл, когда selectionchange мастер

		masterStore.load(
			function(records, operation, success){
				if(success) {
					if (this.getCount() > 0)
						panel.getSelectionModel().select(0);
				}
				else {
					Ext.Msg.alert('Ошибка', operation.error);
					mainPanel.setLoading(false);
				}
			}
		);


		this.control({	
			'#masterPanelId': {				
				selectionchange: this.onMasterSelectionchange
			},		
			'#masterPanelId > toolbar > #add': {
				click: this.onMasterAdd
			},
			
			'#masterPanelId > toolbar > #delete': {
				click: this.onMasterDelete
			},
			'#detailPanelId > toolbar > #add': {
				click: this.onDetailAdd
			},
			'#detailPanelId > toolbar > #delete': {
				click: this.onDetailDelete
			},
			'#detailUrlPanelId > toolbar > #add': {
				click: this.onDetailUrlAdd
			},
			'#detailUrlPanelId > toolbar > #delete': {
				click: this.onDetailUrlDelete
			},
			'#submit': {
				click: this.onSubmit
			},
        });
	},
	

	onMasterSelectionchange: function(view, records) {
		var store = detailPanel.getStore(),
		    urlStore = detailUrlPanel.getStore();


		if (records.length == 1) {
			masterId = records[0].get("id");
			
			if (!records[0].phantom) {				
				if (detailNeedLoading) {
					detailPanel.setLoading(true);
					detailUrlPanel.setLoading(true);
				}

				store.proxy.extraParams = {
					renew_user_group_id: masterId
				};
				
				urlStore.proxy.extraParams = {
					renew_user_group_id: masterId
				};

				store.load(
					function(records, operation, success){
						storeDone = true

						if(success) {
							if (this.getCount() > 0)
								detailPanel.getSelectionModel().select(0);
						}
						else {
							Ext.Msg.alert('Ошибка', operation.error)
						}

						if (detailNeedLoading)
							detailPanel.setLoading(false);
						else {				
							if (storeDone && urlStoreDone) {
								mainPanel.setLoading(false);
								detailNeedLoading = true;
							}
						}						
					}
				)
				
				urlStore.load(
					function(records, operation, success){
						urlStoreDone = true
					
						if(success) {
							if (this.getCount() > 0)
								detailUrlPanel.getSelectionModel().select(0);
						}
						else {
							Ext.Msg.alert('Ошибка', operation.error)
						}

						if (detailNeedLoading)
							detailUrlPanel.setLoading(false);
						else {				
							if (storeDone && urlStoreDone) {
								mainPanel.setLoading(false);
								detailNeedLoading = true;
							}
						}						
					}
				)
			}
			else {  //У фантомных строк не может быть записей в базе, поэтому просто очищаем детей. Например, строка сменилась в результате добавления строки
				store.removeAll(false);
				urlStore.removeAll(false)
				
				store.proxy.extraParams = {};
				urlStore.proxy.extraParams = {};
			}
		}
	},

	onMasterAdd: function(button) {
		var sm = panel.getSelectionModel(),
		    store = panel.getStore(),
		    index = store.indexOf(sm.getLastSelected()),
		    cellEditing = panel.getPlugin('cellEditing'),
		    model = new store.model;

		cellEditing.cancelEdit();

		//Сгенерить новый id
		model.set('id',this.getId());

		store.insert(Math.max(index, 0), model);
		sm.select(model)
		cellEditing.startEdit(model, 0);
	},

	onMasterDelete: function(button) {
		var sm = panel.getSelectionModel(),
		    store = panel.getStore(),
		    index = store.indexOf(sm.getLastSelected()),
		    cellEditing = panel.getPlugin('cellEditing');

		if (index>=0) {
			cellEditing.cancelEdit();

			store.remove(sm.getSelection());                        //Событие selectionchange с records.length == 0

			if (store.getCount() > 0) {
				sm.select(Math.min(index, store.getCount() - 1))    //Событие selectionchange с records.length == 1
			}
		}
	},

	onDetailAdd: function(button) {
		var sm = detailPanel.getSelectionModel(),
		    store = detailPanel.getStore(),
		    index = store.indexOf(sm.getLastSelected()),
		    cellEditing = detailPanel.getPlugin('cellEditing')
		    model = new store.model


		cellEditing.cancelEdit();

		//Установить id из мастера
		model.set('renew_user_group_id', masterId);

		store.insert(Math.max(index, 0), model);
		sm.select(model)
		cellEditing.startEdit(model, 0);
	},

	onDetailDelete: function(button) {
		var sm = detailPanel.getSelectionModel(),
		    store = detailPanel.getStore(),
		    index = store.indexOf(sm.getLastSelected()),
		    cellEditing = detailPanel.getPlugin('cellEditing')

		if (index>=0) {
			cellEditing.cancelEdit();

			store.remove(sm.getSelection());

			if (store.getCount() > 0) {
				sm.select(Math.min(index, store.getCount() - 1))
			}
		}
	},
	
	onDetailUrlAdd: function(button) {
		var sm = detailUrlPanel.getSelectionModel(),
		    store = detailUrlPanel.getStore(),
		    index = store.indexOf(sm.getLastSelected()),
		    cellEditing = detailUrlPanel.getPlugin('cellEditing')
		    model = new store.model


		cellEditing.cancelEdit();

		//Установить id из мастера
		model.set('renew_user_group_id', masterId);

		store.insert(Math.max(index, 0), model);
		sm.select(model)
		cellEditing.startEdit(model, 0);
	},
	
	onDetailUrlDelete: function(button) {
		var sm = detailUrlPanel.getSelectionModel(),
		    store = detailUrlPanel.getStore(),
		    index = store.indexOf(sm.getLastSelected()),
		    cellEditing = detailUrlPanel.getPlugin('cellEditing')

		if (index>=0) {
			cellEditing.cancelEdit();

			store.remove(sm.getSelection());

			if (store.getCount() > 0) {
				sm.select(Math.min(index, store.getCount() - 1))
			}
		}
	},

	onSubmit: function(button) {
		var masterStore = panel.getStore(),
		    detailStore = detailPanel.getStore(),
			detailUrlStore = detailUrlPanel.getStore();
			
		mainPanel.setLoading(true);
		storeDone = false;
		urlStoreDone = false;
	
		//Если требуется синхронизация мастера, то синхрим его, и в случае успешного завершения - синхрим детейл, иначе синхрим тольк детейл
		//Синхрим детейл в двух местах, потому что если нечего синхрить в мастере, что коллбэки не вызовутся.
		if ((masterStore.getNewRecords().length > 0) || (masterStore.getUpdatedRecords().length > 0) || (masterStore.getRemovedRecords().length > 0))
			masterStore.sync({
				success: function(batch, options) {
					detailStore.detailSync();
					detailUrlStore.detailSync();					
				},
				failure: function(batch, options) {
					Ext.Msg.alert('Ошибка', batch.exceptions[0].error + '<br/>Всего ошибок: ' + batch.exceptions.length)
					mainPanel.setLoading(false)
				}
			})
		else {
			detailStore.detailSync();
			detailUrlStore.detailSync();
		}
	},

	getId: function() {
		var ret;

		panel.setLoading(true);

		Ext.Ajax.request({
			async: false,
			url: '/renew_users/get_group_id',
			success: function(response){
				var response_json = Ext.JSON.decode(response.responseText, true);
				ret = response_json.id;
				panel.setLoading(false)
			},
			failure: function(response) {
				Ext.Msg.alert('Ошибка', response.responseText);
				ret = null;
				panel.setLoading(false)
			}
		});
		return ret;
	},
});
