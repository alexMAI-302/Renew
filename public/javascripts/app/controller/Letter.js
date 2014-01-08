Ext.define('app.controller.Letter', {
	extend : 'Ext.app.Controller',

	stores : ['Periods', 'Letter.Letters', 'Letter.Groups', 'Letter.Managers', 'Letter.Agents'],

	models : ['valueModel', 'app.model.Letter.LetterModel'],

	views : ['Letter.Container', 'Letter.Filter'],

	mainContainer : null,

	periodsStore : null,

	groupsStore : null,

	managersStore : null,

	agentsStore : null,
	
	isdisp : 0,

	filterLetter : function(combo, records, eOpts) {
		var controller = this;
		
		controller.mainContainer.setLoading(true);
		
		controller.masterStore.proxy.extraParams = {
			period : Ext.getCmp('periodCombo').getValue(),
			prefix : Ext.getCmp('prefixTextfield').getValue(),
			manager : Ext.getCmp('managerCombo').getValue()
		};
		controller.masterStore.load(function(records, operation, success) {
			controller.mainContainer.setLoading(false);
			if (!success) {
				Ext.Msg.alert("Ошибка", "Ошибка при получении данных");
			}
			return true;
		});
	},
	init : function() {
		var controller = this;

		controller.mainContainer = Ext.create('app.view.Letter.Container');

		controller.control({
			'#filterLetterLetters' : {
				click : controller.filterLetter
			},
			'#printLetterLetters' : {
				click : function() {
					var p = Ext.getCmp('periodCombo').getValue();
					window.open('https://rs3.unact.ru/ReportServer/Pages/ReportViewer.aspx?%2f%d0%91%d1%83%d1%85%d0%b3%d0%b0%d0%bb%d1%82%d0%b5%d1%80%d0%b8%d1%8f%2f%d0%90%d1%80%d0%b5%d0%bd%d0%b4%d0%b0+%d0%9c%d0%b5%d0%b3%d0%b0%d0%bf%d0%be%d1%80%d1%82%2f%d0%92%d0%ba%d0%bb%d0%b0%d0%b4%d1%8b%d1%88%d0%b8+%d0%9c%d0%b5%d0%b3%d0%b0%d0%bf%d0%be%d1%80%d1%82%2f%d0%92%d0%b5%d0%b4%d0%be%d0%bc%d0%be%d1%81%d1%82%d1%8c+%d1%83%d1%87%d0%b5%d1%82%d0%b0+%d0%b2%d1%8b%d0%b4%d0%b0%d1%87%d0%b8+%d0%ba%d0%be%d0%bd%d0%b2%d0%b5%d1%80%d1%82%d0%be%d0%b2&period=' + p, '_blank');
				}
			},
			'#saveLetter' : {
				click : function() {
					controller.masterStore.sync({
						callback : function(batch) {
							if (batch.exceptions.length > 0) {
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							}
						}
					});
					return true;
				}
			}
		});

		Ext.getCmp('LetterTable').getPlugin('celleditingLetter').addListener("beforeedit", function(editor, e, eOpts) {
			var r = Ext.getCmp('LetterTable').getSelectionModel().getSelection()[0], res = false;
			if (r.get('issue') == true) {
				switch(e.field) {
					case 'info':
						res = (controller.isdisp == 0 && r.get('issued') == false) ? true : false;
						break;
					case 'info_issued':
						res = controller.isdisp == 1 ? true : false;
						break;
					default:
						res = false;
						break;
				}
			} else {
				if (e.field == 'info_issued') {
					res = controller.isdisp == 1 ? true : false;
				} else {
					res = false;
				}
			}

			return res;
		});


		Ext.getCmp('LetterTable').columns[7].addListener("beforecheckchange", function(grid, rowIndex, checked, eOpts) {
			var r = controller.masterStore.getAt(rowIndex), res = false;
			if (controller.isdisp == 0 && r.get('issued') == false) {
				res = true;
			}
			if (r.get('issue')) {
				Ext.MessageBox.confirm('Внимание', 'Вы действительно хотите запретить выдачу конверта?', function(button) {
					var r = Ext.getCmp('LetterTable').getSelectionModel().getSelection()[0];
					if (button === 'no') {
						r.set('issue', true);
					}
				});
			}

			return res;
		}); 

		Ext.getCmp('LetterTable').columns[9].addListener("beforecheckchange", function(grid, rowIndex, checked, eOpts) {
			var r = controller.masterStore.getAt(rowIndex);
			var res = false;
			if (r.get('issue') == true && controller.isdisp == 1) {
				res = true;
			}
			return res;
		});
		Ext.getCmp('periodCombo').on("select", function(combo, records, eOpts) {

			controller.managersStore.proxy.extraParams = {
				period : records[0].get('id')
			};
			Ext.getCmp('managerCombo').clearValue( );
			controller.mainContainer.setLoading(true);
			controller.managersStore.load(function(success) {
			controller.mainContainer.setLoading(false);
			});
			
			//console.log('Record value: ' + records[0].get('id'));
		});
	},

	loadDictionaries : function() {
		var controller = this, count = 3;

		controller.mainContainer.setLoading(true);
		function checkLoading(val) {
			if (val == 0) {
				controller.mainContainer.setLoading(false);
			}
		};

		controller.periodStore.load(function(success) {
			count--;
			checkLoading(count);
		});

		controller.groupsStore.load(function(success) {
			count--;
			checkLoading(count);
			controller.isdisp = controller.groupsStore.count() > 0 ? 1 : 0;
		});

		controller.agentsStore.load(function(success) {
			count--;
			checkLoading(count);
		});

	},

	initStores : function() {
		var controller = this, lettersTable = Ext.getCmp('LetterTable');

		controller.masterStore = controller.getLetterLettersStore();
		controller.periodStore = controller.getPeriodsStore();
		controller.groupsStore = controller.getLetterGroupsStore();
		controller.managersStore = controller.getLetterManagersStore();
		controller.agentsStore = lettersTable.columns[13].store;
		controller.loadDictionaries();
	},

	bindStores : function() {
		var controller = this, lettersTable = Ext.getCmp('LetterTable');

		Ext.getCmp('periodCombo').bindStore(controller.periodStore);
		Ext.getCmp('managerCombo').bindStore(controller.managersStore);
		lettersTable.reconfigure(controller.masterStore);
	},

	onLaunch : function() {
		var controller = this;

		controller.initStores();
		controller.bindStores();
	}
});
