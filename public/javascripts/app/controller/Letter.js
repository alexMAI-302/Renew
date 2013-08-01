Ext.define('app.controller.Letter', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Periods',
		'Letter.Letters'
	],
	
	models: [
		'valueModel',
		'app.model.Letter.LetterModel'
	],
	
	views: [
		'Letter.Container',
		'Letter.Filter'
	],
	
	mainContainer: null,

	periodsStore: null,
				
	filterLetter: function( combo, records, eOpts){
		var controller=this;
		
		controller.masterStore.proxy.extraParams={
			period: Ext.getCmp('periodCombo').getValue()
		};
		controller.masterStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при получении данных");
				}
				return true;
			}
		);
	},
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.Letter.Container');
		
		controller.control({
			'#filterLetterLetters': {
				click: controller.filterLetter
			}
		});
	},
	
	loadDictionaries: function(){
		var controller=this,
			count=1;
		
		controller.mainContainer.setLoading(true);
		function checkLoading(val){
			if(val==0){
				controller.mainContainer.setLoading(false);
			}
		};
		
		controller.periodStore.load(
			function(success){
				count--;
				checkLoading(count);
			}
		);
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore=controller.getLetterLettersStore();
		controller.periodStore=controller.getPeriodsStore();
		controller.loadDictionaries();
	},
	
	bindStores: function(){
		var controller=this,
			lettersTable = Ext.getCmp('LetterTable');
		
		lettersTable.reconfigure(controller.masterStore);
		Ext.getCmp('periodCombo').bindStore(controller.periodStore);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		controller.bindStores();
		
	}
});