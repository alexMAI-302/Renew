Ext.define('app.controller.BrsComment', {
    extend: 'Ext.app.Controller',

	views: ['app.view.brsComment.BrsComment'],
	models: ['app.model.brsComment.BrsComment'],

	panel: undefined,
	store: undefined,
	cellEditing: undefined,
	sm: undefined,

    init: function() {

		store = Ext.create('Ext.data.Store', {
			itemId: 'store',
			model: 'app.model.brsComment.BrsComment',

			listeners: {
				beforesync: function()  {
					panel.setLoading(true)
				}
			}
		});
	
		panel = Ext.create('app.view.brsComment.BrsComment', {
			renderTo: Ext.get('brs_comment_js'),
			layut: 'fit',
			store: store,
		});

		store       = panel.getStore()
		cellEditing = panel.getPlugin('cellEditing')
		sm          = panel.getSelectionModel();
		
		panel.setLoading(true)
		
		store.load(
			function(records, operation, success){
				if(!success) {
					Ext.Msg.alert('Ошибка', operation.error)
				}

				panel.setLoading(false);
			}
		)
		
		this.control({
			'#add': {
				click: this.onAdd
			},
			'#remove': {
				click: this.onRemove
			},
			'#submit': {
				click: this.onSubmit
			}
        });
	},
	
	onAdd: function(button) {
		var index = store.indexOf(sm.getLastSelected())
		var model = new store.model

		cellEditing.cancelEdit();		
		
		store.insert(Math.max(index, 0), model);
		sm.select(model)
		cellEditing.startEdit(model, 0);
	},
	
	onRemove: function(button) {
		var index = store.indexOf(sm.getLastSelected())

		if (index>=0) {
			cellEditing.cancelEdit();

			store.remove(sm.getSelection());

			if (store.getCount() > 0) {
				sm.select(Math.min(index, store.getCount() - 1))
			}
		}
	},
	
	onSubmit: function(button) {
		store.sync({
			success: function(batch, options) {
				panel.setLoading(false)
			},

			failure: function(batch, options) {
				Ext.Msg.alert('Ошибка', batch.exceptions[0].error + '<br/>Всего ошибок: ' + batch.exceptions.length)
				panel.setLoading(false)
			},
		});
	}
});