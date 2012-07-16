Ext.define('app.view.scheduleRequest.ScheduleRequest' ,{
    extend: 'Ext.form.Panel',

	border: false,
	margin: "5 0 0 5",

	layout: {
		type: 'table',
		columns: 2
	},

	items: [{
		xtype: 'displayfield',
		fieldLabel: '',
		name: 'label_name',
		value: '.',
		colspan: 2,
		id: 'label_name'
	}, {
		xtype: 'datefield',
		name: 'ddateb_ddate',
		fieldLabel: 'с',
		labelWidth: 20,
		value: Ext.Date.add(new Date(Ext.Date.now()), Ext.Date.DAY, 1),
		id: 'ddateb_ddate',
		submitValue: false
	}, {
		xtype: 'timefield',
		name: 'ddateb_time',
		fieldLabel: 'с',
		minValue: '8:00',
		maxValue: '19:00',
		increment: 15,
		labelWidth: 20,
		value: "9:00",
		margin: "0 0 0 10",
		id: 'ddateb_time',
		submitValue: false
	}, {
		xtype: 'datefield',
		name: 'ddatee_ddate',
		fieldLabel: 'по',
		labelWidth: 20,
		value: Ext.Date.add(new Date(Ext.Date.now()), Ext.Date.DAY, 1),
		id: 'ddatee_ddate',
		submitValue: false,
	}, {
		xtype: 'timefield',
		name: 'ddatee_time',
		fieldLabel: 'до',
		minValue: '8:00',
		maxValue: '19:00',
		increment: 15,
		labelWidth: 20,
		value: "18:00",
		margin: "0 0 0 10",
		id: 'ddatee_time',
		submitValue: false
	}, {
		colspan: 2,
		xtype: 'radiofield',
		name: 'reason',
		inputValue: 'r1',
		fieldLabel: 'По причине',
		boxLabel: 'работаю дома',
		id: 'r1',
		checked: true
	}, {
		xtype: 'radiofield',
		name: 'reason',
		inputValue: 'r2',
		fieldLabel: '',
		hideEmptyLabel: false,
		boxLabel: 'отпуск',
		colspan: 2,
		id: 'r2'
	}, {
		xtype: 'radiofield',
		name: 'reason',
		inputValue: 'r0',
		fieldLabel: '',
		hideEmptyLabel: false,
		boxLabel: 'иное',
		colspan: 2,
		id: 'r0'
	}, {
		xtype: 'textareafield',
		name: 'comments',
		fieldLabel: 'Укажите причину',
		colspan: 2,
		id: 'comments',
		disabled: true,
		allowBlank: false
	}, {
		xtype: 'displayfield',
		fieldLabel: 'Обязуюсь отработать это время',
		name: 'label_ddate_future',
		labelWidth: 250,
		disabled: true,
		colspan: 2,
		id: 'label_ddate_future'
	}, {
		xtype: 'datefield',
		name: 'ddateb_future_ddate',
		fieldLabel: 'с',
		labelWidth: 20,
		disabled: true,
		id: 'ddateb_future_ddate',
		submitValue: false,
		allowBlank: false
	}, {
		xtype: 'timefield',
		name: 'ddateb_future_time',
		fieldLabel: 'с',
		minValue: '0:00',
		maxValue: '23:45',
		increment: 15,
		labelWidth: 20,
		disabled: true,
		id: 'ddateb_future_time',
		margin: "0 0 0 10",
		submitValue: false,
		allowBlank: false
	}, {
		xtype: 'datefield',
		name: 'ddatee_future_ddate',
		fieldLabel: 'по',
		labelWidth: 20,
		disabled: true,
		id: 'ddatee_future_ddate',
		submitValue: false,
		allowBlank: false
	}, {
		xtype: 'timefield',
		name: 'ddatee_future_time',
		fieldLabel: 'до',
		minValue: '0:00',
		maxValue: '23:45',
		increment: 15,
		labelWidth: 20,
		disabled: true,
		id: 'ddatee_future_time',
		margin: "0 0 0 10",
		submitValue: false,
		allowBlank: false
	}],


	dockedItems: {
		xtype: 'toolbar',
		dock: 'bottom',
		ui: 'footer',
		items: [{
			text: 'Отправить руководителю',
			id: 'submit_button'
		}]
	},

	initComponent: function() {
		var config = {
			url: '/schedule_request/sending',
		}

		Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.superclass.initComponent.apply(this);
	}
});
