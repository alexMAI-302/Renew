Ext.define('app.controller.ScheduleRequest', {
    extend: 'Ext.app.Controller',

	views: ['app.view.scheduleRequest.ScheduleRequest'],
	
	config: {
		mainPanel: null
	},

    init: function() {
		var panel = Ext.create('app.view.scheduleRequest.ScheduleRequest', {
			renderTo: Ext.get('schedule_request_js'),
			layut: 'fit'
		});
		panel.setLoading(true)
		this.setMainPanel(panel)
		
		this.setFields();
		
		this.control({
			'panel > radiofield': {
				change: this.onChange
			},
			
			'#submit_button' : {
				click: this.onClick
			}
        });		
	},
	
	onChange: function(field, newValue, oldValue) {
		var isDisabled = (field.getId() != 'r0');

		if (newValue) {
			var array = new Array();
			array.push(Ext.getCmp('comments'));
			array.push(Ext.getCmp('ddateb_future_ddate'));
			array.push(Ext.getCmp('ddateb_future_time'));
			array.push(Ext.getCmp('ddatee_future_ddate'));
			array.push(Ext.getCmp('ddatee_future_time'));
			array.push(Ext.getCmp('label_ddate_future'));

			for(var i=0; i<array.length; i++) {
				array[i].setDisabled(isDisabled);
				array[i].reset()
			}
		}
	},
	
	onClick: function(button) {
		var form = button.up('form').getForm();
		var panel = this.getMainPanel()
		
		if (form.isValid()) {
			var ddateb     = Ext.getCmp('ddateb_ddate').getValue();
			var ddatebTime = Ext.getCmp('ddateb_time').getValue();
			var ddatee     = Ext.getCmp('ddatee_ddate').getValue();
			var ddateeTime = Ext.getCmp('ddatee_time').getValue();

			var ddatebF     = Ext.getCmp('ddateb_future_ddate').getValue();
			var ddatebTimeF = Ext.getCmp('ddateb_future_time').getValue();
			var ddateeF     = Ext.getCmp('ddatee_future_ddate').getValue();
			var ddateeTimeF = Ext.getCmp('ddatee_future_time').getValue();
			
			ddateb.setHours(ddatebTime.getHours(), ddatebTime.getMinutes());
			ddatee.setHours(ddateeTime.getHours(), ddateeTime.getMinutes());
			
			if (ddatebF!== null & ddatebTimeF!== null)
				ddatebF.setHours(ddatebTimeF.getHours(), ddatebTimeF.getMinutes());
			else {
				ddatebF = null;
				ddatebTimeF = null;
			}

			if (ddateeF!== null & ddateeTimeF!== null)
				ddateeF.setHours(ddateeTimeF.getHours(), ddateeTimeF.getMinutes());
			else {
				ddateeF = null;
				ddateeTimeF = null;
			}			
		
			if (ddateb > ddatee) {
				Ext.Msg.alert('Ошибка', "Дата начала отсутствия больше даты окончания отсутствия");
				return;
			}

			if (ddatebF > ddateeF) {
				Ext.Msg.alert('Ошибка', "Дата начала отработки больше даты окончания отработки");
				return;
			}			
			
			panel.setLoading(true)
		
			form.submit({			
				submitEmptyText: false,
				
				params: {
					ddateb:  Ext.Date.format(ddateb, 'Y-m-d H:i'),
					ddatee:  Ext.Date.format(ddatee, 'Y-m-d H:i'),
					ddatebF: Ext.Date.format(ddatebF, 'Y-m-d H:i'),
					ddateeF: Ext.Date.format(ddateeF, 'Y-m-d H:i'),

					authenticity_token: window._token
				},
				
				success: function(form, action) {
					panel.setLoading(false)
					Ext.Msg.alert('Сообщение', action.result.msg);					
				},
				
				failure: function(form, action) {
					panel.setLoading(false)
					Ext.Msg.alert('Ошибка', action.result.msg);
				}
			});
		}
		else {
			Ext.Msg.alert('Ошибка', "Форма не заполнена");
		}
	},
	
	setFields: function() {
		var panel = this.getMainPanel();
	
		Ext.Ajax.request({
			url: '/schedule_request/get_name',
			success: function(response){
				var response_json=Ext.JSON.decode(response.responseText, true);
				
				var label = Ext.getCmp('label_name');
				var ddateb_time = Ext.getCmp('ddateb_time');
				var ddatee_time = Ext.getCmp('ddatee_time');

				label.setValue('Я, ' + response_json.displayname + ' (' + response_json.mail + '), буду отсутствовать в офисе:');
				ddateb_time.setValue(response_json.ddateb);
				ddatee_time.setValue(response_json.ddatee);
				
				panel.setLoading(false)
			},
			failure: function(response) {
				Ext.Msg.alert('Ошибка', response.responseText);
				mainContainer.setLoading(false);
			}
		});			
	},
});

	
