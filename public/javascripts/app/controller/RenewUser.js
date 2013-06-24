Ext.define('app.controller.RenewUser', {
    extend: 'Ext.app.Controller' ,

	models: ['app.model.renewUser.RenewUser',
	         'app.model.renewUser.RenewUsersGroups',
			 'app.model.renewUser.RenewGroup'],

	views: ['app.view.renewUser.RenewUser',
	        'app.view.renewUser.RenewUsersGroups'],


    init: function() {
		masterStore = Ext.create('Ext.data.Store', {
			itemId: 'store',
			model: 'app.model.renewUser.RenewUser'
		});

		detailStore = Ext.create('Ext.data.Store', {
			itemId: 'detailStore',
			model: 'app.model.renewUser.RenewUsersGroups',

			//Синхронизация выполняется из двух мест (из коллбека синхронизации мастера или (если в мастере нечего синхронихировать) самостоятельно по кнопке "Сохранить")
			//что бы не прописывать каждый раз коллбеки создадим новый метод detailSync()
			detailSync: function(id_name, id) {
				//Установить новым строкам ссылку на мастре
				for(i=0; i<this.getNewRecords().length; i++) {
					this.getNewRecords()[i].set(id_name, id);
				};
			
				if ((this.getNewRecords().length > 0) || (this.getUpdatedRecords().length > 0) || (this.getRemovedRecords().length > 0))
					this.sync({
						success: function(batch, options) {
							mainPanel.setLoading(false)
						},
						failure: function(batch, options) {
							Ext.Msg.alert('Ошибка', batch.exceptions[0].error + '<br/>Всего ошибок: ' + batch.exceptions.length)
							mainPanel.setLoading(false)
						}
					});
				else
					mainPanel.setLoading(false)
			},
		});

		mainPanel = Ext.create('Ext.panel.Panel', {
			renderTo: Ext.get('renew_user_js'),

			height: 500,
			layout: 'border',

			tbar: [{
				itemId: 'submit',
				text: 'Сохранить',
			}]
		});

		panel = Ext.create('app.view.renewUser.RenewUser', {
			store: masterStore,
			region: 'center',
			split: true,
		});

		detailPanel = Ext.create('app.view.renewUser.RenewUsersGroups', {
			store: detailStore,
			height: 300,
			region: 'south',
			split: true
		});

		detailPanel.store.sort(detailPanel.sorterName); //Сортировка по умолчанию - по возрастанию

		mainPanel.add(panel);
		mainPanel.add(detailPanel);


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
			'#submit': {
				click: this.onSubmit
			},
        });
	},

	onMasterSelectionchange: function(view, records) {
		var store = detailPanel.getStore();

		if (records!=null && records.length == 1) {
			if (!records[0].phantom) {
				if (detailNeedLoading)
					detailPanel.setLoading(true);

				masterId = records[0].get("id");

				store.proxy.extraParams = {
					user_master_id: masterId //будет слаться на сервак при всех типах запросов, но нужен  только при get
				};

				store.load(
					function(records, operation, success){
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
							mainPanel.setLoading(false);
							detailNeedLoading = true;
						}
					}
				)
			}
			else {  //У фантомных строк не может быть записей в базе, поэтому просто очищаем детей. Например, строка сменилась в результате добавления строки
				store.proxy.extraParams = {} //Параметры нужны только для ретрива. у новых строк нечего ретривить. очистим параметры
				store.loadData([], false)    //Раньше был store.removeAdd(), но с переходом на Sencha 4.2 он стал не очищать store, а физически удалять (при Sync шлются delete на сервер)
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

	onSubmit: function(button) {
		var masterStore = panel.getStore()
		    detailStore = detailPanel.getStore(),

		mainPanel.setLoading(true);

		//Если требуется синхронизация мастера, то синхрим его, и в случае успешного завершения - синхрим детейл, иначе синхрим тольк детейл
		//Синхрим детейл в двух местах, потому что если нечего синхрить в мастере, что коллбэки не вызовутся.
		if ((masterStore.getNewRecords().length > 0) || (masterStore.getUpdatedRecords().length > 0) || (masterStore.getRemovedRecords().length > 0))
			masterStore.sync({
				success: function(batch, options) {
					detailStore.detailSync(
						"renew_user_id",
						panel.getSelectionModel().getLastSelected().get("id")
					);
				},
				failure: function(batch, options) {
					Ext.Msg.alert('Ошибка', batch.exceptions[0].error + '<br/>Всего ошибок: ' + batch.exceptions.length)
					mainPanel.setLoading(false)
				}
			})
		else
		{
			detailStore.detailSync(
				"renew_user_id",
				panel.getSelectionModel().getLastSelected().get("id")
			);
		}
	}
});