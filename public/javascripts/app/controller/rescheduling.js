Ext.define('app.controller.rescheduling', {
    extend: 'Ext.app.Controller',
	stores: [
		'rescheduling.person',
		'rescheduling.shiftWorker',
		'empSchedule.empSchedule'],
	models: [
		'app.model.valueModel',
		'app.model.rescheduling.personModel',
		'app.model.empSchedule.empScheduleModel'],
	requires: [
		'app.view.rescheduling.rescheduling'
	],
	
	personStore:null,	
	shiftWorkerStore:null,
	mainContainer: null,
	array1: null,
	array2: null,
	array3: null,
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	onChange: function(field, newValue, oldValue) {
		var controller=this;
		
		var array = null;
		
		if (field.getId() == 'radio1') { array=controller.array1};
		if (field.getId() == 'radio2') { array=controller.array2};
		if (field.getId() == 'radio3') { array=controller.array3};
	
		var isVisible=(newValue==1);
		
		for(var i=0; i<array.length; i++) {
				array[i].setVisible(isVisible);
		}
		return true;
	},
	
	onClick: function(button) {
		var controller=this;
		var rows = [];
		
		if (Ext.getCmp('radio1').getValue())
		{
			if (!Ext.getCmp('shiftWorkerCombo').getValue()) {
				Ext.Msg.alert('Ошибка','Для обмена смен должен быть указан сменщик');
				return;
			}
			if (!Ext.getCmp('ddate_exchange_shift1').getValue()) {
				Ext.Msg.alert('Ошибка','Для обмена смен должена указана первая дата');
				return;
			}
			controller.mainContainer.setLoading(true);
		
			rows.push({
				person_id:	Ext.getCmp('personCombo').getValue(),
				shift_worker:	Ext.getCmp('shiftWorkerCombo').getValue(),
				ddate1:		Ext.Date.format(Ext.getCmp('ddate_exchange_shift1').getValue(), 'Y-m-d'),
				ddate2:		Ext.Date.format(Ext.getCmp('ddate_exchange_shift2').getValue(), 'Y-m-d')
			});
			
			Ext.Ajax.request({
				url: '/rescheduling/exchange_shift',
				params: {authenticity_token: window._token},
				jsonData: rows,
				method: 'POST',
				timeout: 300000,
				 success: function(response, opts) {
						if (response.responseText=="ok") 
						{
							Ext.Msg.alert("Сообщение", "Данные сохранены");
							for(var i=0; i<controller.array1.length; i++) {
								controller.array1[i].setValue(null);
							}
							controller.mainContainer.setLoading(false);
						}
						else
						{
							Ext.Msg.alert("Ошибка cохранения", response.responseText);
							controller.mainContainer.setLoading(false);
						}
					},
					failure: function(response, options) {
						Ext.Msg.alert("Ошибка", response.responseText);
						controller.mainContainer.setLoading(false);
					}
			});
		};
		if (Ext.getCmp('radio2').getValue())
		{
			if (!Ext.getCmp('ddateb').getValue()) {
				Ext.Msg.alert('Ошибка','Не задано начало отпуска');
				return;
			};
			if (!Ext.getCmp('ddatee').getValue()) {
				Ext.Msg.alert('Ошибка','Не задано окончание отпуска');
				return;
			};
			if (Ext.getCmp('ddatee').getValue()<=Ext.getCmp('ddateb').getValue()) {
				Ext.Msg.alert('Ошибка','Конец отпуска должен быть позднее начала отпуска');
				return;
			};
			controller.mainContainer.setLoading(true);
		
			rows.push({
				person_id:	Ext.getCmp('personCombo').getValue(),
				ddateb:		Ext.Date.format(Ext.getCmp('ddateb').getValue(), 'Y-m-d'),
				ddatee:		Ext.Date.format(Ext.getCmp('ddatee').getValue(), 'Y-m-d')
			});
			
			Ext.Ajax.request({
				url: '/rescheduling/leave',
				params: {authenticity_token: window._token},
				jsonData: rows,
				method: 'POST',
				timeout: 300000,
				 success: function(response, opts) {
						if (response.responseText=="ok") 
						{
							Ext.Msg.alert("Сообщение", "Данные сохранены");
							for(var i=0; i<controller.array2.length; i++) {
								controller.array2[i].setValue(null);
							};
							controller.mainContainer.setLoading(false);
						}
						else
						{
							Ext.Msg.alert("Ошибка cохранения", response.responseText);
							controller.mainContainer.setLoading(false);
						}
					},
					failure: function(response, options) {
						Ext.Msg.alert("Ошибка", response.responseText);
						controller.mainContainer.setLoading(false);
					}
			});
		};
		if (Ext.getCmp('radio3').getValue())
		{
			if (!Ext.getCmp('ddate_day_change').getValue()) {
				Ext.Msg.alert('Ошибка','Не задана дата для изменения');
				return;
			};
			controller.mainContainer.setLoading(true);
		
			rows.push({
				person_id:	Ext.getCmp('personCombo').getValue(),
				ddate:		Ext.Date.format(Ext.getCmp('ddate_day_change').getValue(), 'Y-m-d'),
				time_start: (Ext.getCmp('time_start').getValue()==null)? null:Ext.getCmp('time_start').getValue().getHours()*60+Ext.getCmp('time_start').getValue().getMinutes(),
				time_end: (Ext.getCmp('time_end').getValue()==null)? null:Ext.getCmp('time_end').getValue().getHours()*60+Ext.getCmp('time_end').getValue().getMinutes()
			});
			
			Ext.Ajax.request({
				url: '/rescheduling/daychange',
				params: {authenticity_token: window._token},
				jsonData: rows,
				method: 'POST',
				timeout: 300000,
				 success: function(response, opts) {
						if (response.responseText=="ok") 
						{
							Ext.Msg.alert("Сообщение", "Данные сохранены");
							for(var i=0; i<controller.array3.length; i++) {
								controller.array3[i].setValue(null);
							};
							controller.mainContainer.setLoading(false);
						}
						else
						{
							Ext.Msg.alert("Ошибка cохранения", response.responseText);
							controller.mainContainer.setLoading(false);
						}
					},
					failure: function(response, options) {
						Ext.Msg.alert("Ошибка", response.responseText);
						controller.mainContainer.setLoading(false);
					}
			});
		};
		
	}, 
    init: function() {
		var controller = this;
		controller.mainContainer=Ext.create('app.view.rescheduling.rescheduling');		
		this.control({
			'#radio1': {
				change: this.onChange
			},
			'#radio2': {
				change: this.onChange
			},
			'#radio3': {
				change: this.onChange
			},			
			'#submit_button' : {
				click: this.onClick
			}
        });		
		
		controller.array1= new Array();
		controller.array1.push(Ext.getCmp('ddate_exchange_shift1'));
		controller.array1.push(Ext.getCmp('ddate_exchange_shift2'));
		controller.array1.push(Ext.getCmp('shiftWorkerCombo'));
		
		controller.array2= new Array();
		controller.array2.push(Ext.getCmp('ddateb'));
		controller.array2.push(Ext.getCmp('ddatee'));
		
		controller.array3= new Array();
		controller.array3.push(Ext.getCmp('ddate_day_change'));
		controller.array3.push(Ext.getCmp('time_start'));
		controller.array3.push(Ext.getCmp('time_end'));
	},
	
	initTables: function(){
		var controller=this;
		Ext.getCmp('personCombo').addListener(
			"select",
			function(field, value, options){
				Ext.getCmp('radio1').setDisabled((value[0].data.schedule_type_id!=2));
				Ext.getCmp('time_start').setValue(value[0].data.time_start);
				Ext.getCmp('time_end').setValue(value[0].data.time_end);
				
			}
		);
		Ext.getCmp('shiftWorkerCombo').addListener(
			"expand",
			function(field, eOpts){
				controller.shiftWorkerStore.proxy.extraParams={
					ddate1: Ext.Date.format(Ext.getCmp('ddate_exchange_shift1').getValue(), 'Y-m-d'),
					ddate2: Ext.Date.format(Ext.getCmp('ddate_exchange_shift2').getValue(), 'Y-m-d'),
				};
				controller.shiftWorkerStore.load(
					function(records, operation, success){
						if(!success) {
							Ext.Msg.alert('Ошибка при выборке сменщика', operation.error.responseText)							
						}
					}
				);
				return true;
			}
		);
		Ext.getCmp('ddate_exchange_shift1').addListener(
			"change",
			function(field, newValue, oldValue, options){
				Ext.getCmp('shiftWorkerCombo').setValue(null);
			}

		);
		Ext.getCmp('ddate_exchange_shift2').addListener(
			"change",
			function(field, newValue, oldValue, options){
				Ext.getCmp('shiftWorkerCombo').setValue(null);
			}

		);

	},
	initStores: function(){
		var controller=this;
		controller.personStore=Ext.getCmp('personCombo').getStore();
		controller.shiftWorkerStore=Ext.getCmp('shiftWorkerCombo').getStore();
		
	},
	onLaunch: function(){
		var controller = this;
		controller.initStores();
		controller.initTables();
	}
});
