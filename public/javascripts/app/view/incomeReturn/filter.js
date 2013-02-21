//фильтр
Ext.define('app.view.incomeReturn.filter', {
	extend: 'Ext.form.Panel',
	alias: 'widget.incomeReturnFilter',
    
	layout: {
			type: 'hbox'
	},
	defaults: {
		style: {
			margin: '5px'
		}
	},
	items: [
		{
			id: 'ddate',
			xtype: 'datefield',
			name: 'ddate',
			fieldLabel: 'Дата',
			labelAlign: 'top',
			format: 'd.m.Y',
			altFormat: 'd/m/Y|d m Y',
			startDay: 1,
			width: 100
		},
		{
			xtype: 'combobox',
			fieldLabel: 'Номер документа',
			id : 'incomeCombo',			
			labelAlign: 'top',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 150,
			width: 150
		},
		{
			xtype: 'combobox',
			fieldLabel: 'ИНН получателя платежей',
			id: 'innCombo',
			labelAlign: 'top',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 180,
			width: 180
		},
		{
			xtype: 'combobox',
			fieldLabel: 'Получатель платежей',
			id: 'prCombo',
			labelAlign: 'top',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 200,
			width: 200			
		},
		{
			xtype: 'combobox',
			fieldLabel: 'Поставщик',
			id: 'sellerCombo',
			labelAlign: 'top',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 200,
			width: 200

		},
		{
			xtype: 'combobox',
			fieldLabel: 'Организация',
			id: 'orgCombo',
			labelAlign: 'top',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 180,
			width: 180

		}
	]	
});