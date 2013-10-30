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
			},
			'#printLetterLetters': {
				click: function(){
					var p=Ext.getCmp('periodCombo').getValue();
					window.open(
						'https://rs3.unact.ru/ReportServer/Pages/ReportViewer.aspx?%2f%d0%91%d1%83%d1%85%d0%b3%d0%b0%d0%bb%d1%82%d0%b5%d1%80%d0%b8%d1%8f%2f%d0%90%d1%80%d0%b5%d0%bd%d0%b4%d0%b0+%d0%9c%d0%b5%d0%b3%d0%b0%d0%bf%d0%be%d1%80%d1%82%2f%d0%92%d0%ba%d0%bb%d0%b0%d0%b4%d1%8b%d1%88%d0%b8+%d0%9c%d0%b5%d0%b3%d0%b0%d0%bf%d0%be%d1%80%d1%82%2f%d0%92%d0%b5%d0%b4%d0%be%d0%bc%d0%be%d1%81%d1%82%d1%8c+%d1%83%d1%87%d0%b5%d1%82%d0%b0+%d0%b2%d1%8b%d0%b4%d0%b0%d1%87%d0%b8+%d0%ba%d0%be%d0%bd%d0%b2%d0%b5%d1%80%d1%82%d0%be%d0%b2&period='+
						p,
						'_blank'
					);
				}
			},
			'#saveLetter': {
				click: function(){
					controller.masterStore.sync({
						callback: function(batch){
							if(batch.exceptions.length>0){
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							}
						}
					});
					return true;
				}
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