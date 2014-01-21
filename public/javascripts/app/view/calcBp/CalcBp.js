Ext.define('app.view.calcBp.CalcBp' ,{
    extend: 'Ext.form.Panel',

	border: false,
	margin: "5 0 0 5",

	layout: {
		type: 'vbox',
	},

	renderTo: 'calc_bp_js',

	items: [{
		id: 'partner_groups',
		xtype: 'combobox',
		fieldLabel: 'Подразделение',
		valueField: 'id',
		displayField: 'name',
		queryMode: 'local',
		allowBlank: false,
		width: '25%',
	}, {
		id: 'bp',
		xtype: 'combobox',
		fieldLabel: 'БП',
		valueField: 'id',
		displayField: 'name',
		queryMode: 'local',
		allowBlank: false,
		width: '25%',
	}],
	
	dockedItems: {
		xtype: 'toolbar',
		dock: 'bottom',
		ui: 'footer',
		items: [{
			text: 'Пересчитать',
			id: 'submit_button'
		}]
	},
});
