Ext.define('app.view.rescheduling.rescheduling' ,{
    extend: 'Ext.form.Panel',

	border: false,
	margin: "5 0 0 5",

	layout: {
		type: 'vbox'
	},
	
	renderTo: Ext.get('rescheduling_js'),

	items: [{
			id: 'personCombo',
			xtype: 'combobox',
			queryMode: 'local',
			displayField: 'name',
			valueField: 'id',
			name: 'personCombo',
			fieldLabel: 'Сотрудник',
			width: 300,
			labelWidth: 75,
			store: 'rescheduling.person'
		
	},{
		xtype: 'radiogroup',
		name: 'reason',
		defaultType: 'radiofield',
		layout : 'hbox',
        items: [  {
				boxLabel  : 'обмен смен',
				name      : 'reason',
				inputValue: 'exchange_shifts',
				id        : 'radio1',
				width		: 150
            },
			{
				boxLabel  : 'отпуск',
				name      : 'reason',
				inputValue: 'leave',
				id        : 'radio2',
				width		: 150
            },
			{
				boxLabel  : 'изменение дня',
				name      : 'reason',
				inputValue: 'day_change',
				id        : 'radio3',
				width		: 150
            }
			]
	},
	{
		xtype: 'datefield',
		name: 'ddate_exchange_shift1',
		fieldLabel: 'Не будет работать:',
		labelWidth: 300,
		hidden: true,
		id: 'ddate_exchange_shift1',
		submitValue: false,
		allowBlank: false,
		value : Ext.Date.add(new Date(), Ext.Date.DAY, 1)
	},
	{
			id: 'shiftWorkerCombo',
			xtype: 'combobox',
			queryMode: 'local',
			displayField: 'name',
			valueField: 'id',
			name: 'shiftWorkerCombo',
			fieldLabel: 'Вместо него отработает сменщик ',
			width: 600,
			labelWidth: 300,
			hidden: true,
			store: 'rescheduling.shiftWorker'
		
	},
	{
		xtype: 'datefield',
		name: 'ddate_exchange_shift2',
		fieldLabel: 'А сотрудник вместо смещника отработает ',
		labelWidth: 300,
		hidden: true,
		id: 'ddate_exchange_shift2',
		submitValue: false,
		allowBlank: false,
		value : Ext.Date.add(new Date(), Ext.Date.DAY,2)
	},
	{
		xtype: 'datefield',
		name: 'ddate_day_change',
		fieldLabel: 'Дата:',
		labelWidth: 85,
		hidden: true,
		id: 'ddate_day_change',
		submitValue: false,
		allowBlank: false,
		value : Ext.Date.add(new Date(), Ext.Date.DAY, 1)
	},
	{
		xtype: 'datefield',
		name: 'ddateb',
		fieldLabel: 'с',
		labelWidth: 20,
		id: 'ddateb',
		submitValue: false,
		allowBlank: false,
		value : Ext.Date.add(new Date(), Ext.Date.DAY, 1),
		hidden: true
	},
	{
		xtype: 'datefield',
		name: 'ddatee',
		fieldLabel: 'по',
		labelWidth: 20,
		disabled: false,
		id: 'ddatee',
		submitValue: false,
		allowBlank: false,
		value : Ext.Date.add(new Date(), Ext.Date.DAY, 1),
		hidden: true
	},
	{
		xtype: 'timefield',
		fieldLabel : 'Приход',
		width : 170,
		id: 'time_start',
		defalutValue: '09:00',
		name: 'time_start',
		format: 'H:i',
		minValue: '6:00',
		submitValue: false,
		anchor: '100%',
		validator: function(v){
				return (v.length > 0);
		},
		hidden: true
		
	},
	{
		xtype: 'timefield',
		fieldLabel : 'Уход',
		width : 170,
		id: 'time_end',
		defalutValue: '09:00',
		name: 'time_end',
		format: 'H:i',
		minValue: '6:00',
		submitValue: false,
		anchor: '100%',
		validator: function(v){
				return (v.length > 0);
		},
		hidden: true
	}],

	dockedItems: {
		xtype: 'toolbar',
		dock: 'bottom',
		ui: 'footer',
		items: [{
			text: 'Подтвердить',
			id: 'submit_button'
		}]
	},

	initComponent: function() {
		var config = {
			url: '/rescheduling/save',
		}

		Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.superclass.initComponent.apply(this);
	}
});
