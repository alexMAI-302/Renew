Ext.define('app.controller.GitSearch', {
	extend: 'Ext.app.Controller',
    
	views: ['app.view.gitSearch.Container'],
    
    models: ['app.model.gitSearch.SearchResult'],
    
    stores: ['gitSearch.Search'],
    
	init: function() {
		panel = Ext.create('app.view.gitSearch.Container');

		this.control({
			'#searchButton':{
				click: this.onSearch
			}
		})
	},

	
	onSearch: function() {
		searchPanel = panel.getComponent("gitSearchGrid");
		store = searchPanel.getStore();
		
		store.proxy.extraParams = {
			searchStr: Ext.getCmp('messageText').getValue()
		};

		searchPanel.setLoading(true);
		
		store.load(
			function(records, operation, success){
				if(!success) {
					Ext.Msg.alert('Ошибка', operation.error)
				}

				searchPanel.setLoading(false);
			}
		);
	}
})