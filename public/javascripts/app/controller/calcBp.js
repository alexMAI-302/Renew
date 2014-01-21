Ext.define('app.controller.calcBp', {
    extend: 'Ext.app.Controller',

	models: [
		'app.model.valueModel'
	],
	
	stores: [
		'calcBp.PartnerGroups',
		'calcBp.Bp'
	],
	
	requires: [
		'app.view.calcBp.CalcBp'
	],
	

	partnerGroupsStore: null,
	bpStore: null,
	
	showServerError: function(response, options) {
		Ext.Msg.alert('Ошибка', response.responseText);
	},
	
	init: function() {		
		var controller = this;
		controller.mainContainer=Ext.create('app.view.calcBp.CalcBp');	
		
		controller.control({
			'#submit_button' : {
				click: this.onClick
			}
        });		
	},


	
	onClick: function() {
		var controller = this;
		
		Ext.Ajax.request({
			url: '/bprog/test',				
			timeout: 600000,
			params: {
				partner_groups_id: Ext.getCmp('partner_groups').getValue(),
				bp_id: Ext.getCmp('bp').getValue(),
				authenticity_token: window._token
			},
				
			success: function(response){
				var response_json=Ext.JSON.decode(response.responseText, true);
				var msg = "Результаты <i>запуска</i> пересчета: " + response_json.result + "<br/>";
					
				msg += "Результаты <i>пересчета</i> бонусных программ придут на почту группы bprog@unact.ru."
				Ext.MessageBox.alert("Сообщение", msg)
			},
			failure: controller.showServerError
		});		
	},
		

	initStores: function(){
		var controller=this;
		console.log (controller);
		controller.partnerGroupsStore=controller.getCalcBpPartnerGroupsStore();

		controller.bpStore=controller.getCalcBpBpStore();
		controller.bpStore.load();
	},
	
	bindStores: function(){
		var controller=this;
		Ext.getCmp('partner_groups').bindStore(controller.partnerGroupsStore);
		Ext.getCmp('bp').bindStore(controller.bpStore);
	},

	loadStores: function(){
		var controller=this,
		    finishGroups = false,
		    finishBp = false; 
		
		controller.mainContainer.setLoading(true)
		
		controller.partnerGroupsStore.load(function(records, operation, success) {
			finishGroups=true;
			Ext.getCmp('partner_groups').select(records[0]);
			
			if (finishGroups && finishBp)
			 	controller.mainContainer.setLoading(false);
		});
		
		controller.bpStore.load(function(records, operation, success) {
			finishBp=true;
			Ext.getCmp('bp').select(records[0]);
			
			if (finishGroups && finishBp)
			 	controller.mainContainer.setLoading(false);
		});
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		controller.bindStores();
		controller.loadStores();
	},
});