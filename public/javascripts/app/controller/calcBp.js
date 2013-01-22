Ext.define('app.controller.calcBp', {
    extend: 'Ext.app.Controller',

	models: [
		'app.model.valueModel'
	],

    init: function() {

		var finishFilials = false;
		var finishGroups  = false;

		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		}
	
		function calc() {
			Ext.Ajax.request({
				url: '/bprog/test',				
				timeout: 600000,
				params: {
					partner_groups_id: partnerGroupsCombo.getValue(),
					authenticity_token: window._token
				},
				
				success: function(response){
					var response_json=Ext.JSON.decode(response.responseText, true);
					var msg = "Результаты <i>запуска</i> пересчета:<br/>" + response_json.result;
					
					msg += "Результаты <i>пересчета</i> бонусных программ придут на почту группы bprog@unact.ru."
					Ext.MessageBox.alert("Сообщение", msg)
				},
				failure: showServerError
			});		
		};

		var partnerGroupsStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'rest',
				url : '/bprog/get_partner_groups',
				reader: {
					type: 'json'
				}
			}
		});

		var mainContainer=Ext.create('Ext.container.Container', {
			width: 1000,
			layout: {
				type: 'anchor'
			},
			renderTo: Ext.get('calc_bp_js'),
			defaults: {
				style: {
					margin: '10px'
				}
			}
		});
		
		var filterPanel=Ext.create('Ext.form.Panel', {
			layout: {
				type: 'hbox'
			},
			defaults: {
				style: {
					margin: '5px'
				}
			}
		});
	
		var partnerGroupsCombo=Ext.create('Ext.form.ComboBox', {
			id: 'partner_groups',
			fieldLabel: 'Подразделение',
			store: partnerGroupsStore,
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			queryMode: 'local'
		});

		var calcButton=Ext.create('Ext.Button', {
			text    : 'Пересчитать',
			handler : calc
		});

		filterPanel.add(partnerGroupsCombo);
		filterPanel.add(calcButton)
		mainContainer.add(filterPanel);
	

		mainContainer.setLoading(true);

		partnerGroupsStore.load(function(records, operation, success) {
			finishGroups=true;
			partnerGroupsCombo.select(records[0]);
			if (finishFilials){
				mainContainer.setLoading(false);
			}
		});
	}

});