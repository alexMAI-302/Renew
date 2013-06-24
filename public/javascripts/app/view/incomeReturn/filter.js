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
			xtype: 'combobox',
			fieldLabel: 'Площадка',
			id : 'siteCombo',			
			labelAlign: 'top',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 120,
			width: 120
		},
		{
			id: 'ddate',
			xtype: 'datefield',
			name: 'ddate',
			fieldLabel: 'Дата прихода',
			labelAlign: 'top',
			format: 'd.m.Y',
			altFormat: 'd/m/Y|d m Y',
			startDay: 1,
			width: 90
		},
		{
			xtype: 'combobox',
			fieldLabel: 'Номер документа',
			id : 'incomeCombo',			
			labelAlign: 'top',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 120,
			width: 120
		},
		{
			xtype: 'combobox',
			fieldLabel: 'ИНН получателя платежей',
			id: 'innCombo',
			labelAlign: 'top',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 170,
			width: 170
		},
		{
			xtype: 'combobox',
			fieldLabel: 'Получатель платежей',
			id: 'prCombo',
			labelAlign: 'top',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 180,
			width: 180			
		},
		{
			xtype: 'combobox',
			fieldLabel: 'Поставщик',
			id: 'sellerCombo',
			labelAlign: 'top',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 180,
			width: 180

		},
		{
			xtype: 'combobox',
			fieldLabel: 'Организация',
			id: 'orgCombo',
			labelAlign: 'top',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 170,
			width: 170

		},
		{
			id: 'doc_ddate',
			xtype: 'datefield',
			name: 'doc_ddate',
			fieldLabel: 'Дата документа',
			labelAlign: 'top',
			format: 'd.m.Y',
			altFormat: 'd/m/Y|d m Y',
			startDay: 1,
			width: 100
		}
	]	
});