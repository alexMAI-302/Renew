Ext.define('app.controller.GitSearch', {
	extend: 'Ext.app.Controller',
    
	views: ['app.view.gitSearch.Container'],
    
    models: ['app.model.gitSearch.SearchResult'],
    
	init: function() {
		/*
		 * Store создается в app.view.gitSearch.Grid, а не тут, 
		 * потому что если его создать тут (в контроллере), а потом выполнить  
		 * onLaunch: function(){
		 *   Ext.getCmp("gitSearchGrid").reconfigure(store);
		 * },
		 * 
		 * то группа хоть и появится, но сворачивание/разворачивание групп рабтать не будет. 
		 */
		
		panel = Ext.create('app.view.gitSearch.Container', {
			renderTo: Ext.get('main_js'),
		});

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