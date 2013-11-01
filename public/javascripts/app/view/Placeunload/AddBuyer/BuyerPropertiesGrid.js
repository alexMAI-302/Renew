Ext.define('app.view.Placeunload.AddBuyer.BuyerPropertiesGrid', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.buyerPropertiesGrid',
	
	title: 'Покупатель и партнер',
	
	layout: 'vbox',
	
	items: [
		{
			xtype: 'combobox',
			valueField: 'id',
			displayField: 'name',
			id: 'partnerGroupCombo',
			minChars: 0,
			store: 'Placeunload.AddBuyer.PartnersGroups',
			fieldLabel: "Группа партнеров",
			width: '100%',
			labelWidth: 110,
			triggerAction: 'query',
			listConfig: {
				getInnerTpl: function(){
					return '<div data-qtip="{tip}">{name}</div>';
				}
			}
		},
		{
			xtype: 'combobox',
			valueField: 'id',
			displayField: 'name',
			id: 'partnerCombo',
			minChars: 0,
			store: 'Placeunload.AddBuyer.Partners',
			fieldLabel:'Партнер',
			width: '100%',
			labelWidth: 110,
			triggerAction: 'query',
			listConfig: {
				getInnerTpl: function(){
					return '<div data-qtip="{tip}">{name}</div>';
				}
			}
		},
		{
			xtype: 'combobox',
			valueField: 'id',
			displayField: 'name',
			id: 'buyerCombo',
			minChars: 0,
			store: 'Placeunload.AddBuyer.Buyers',
			fieldLabel: "Покупатель",
			width: '100%',
			labelWidth: 110,
			triggerAction: 'query',
			allowBlank: false
		},
		{
			xtype: 'textfield',
			id: 'safariId',
			fieldLabel: "SAFARI_ID",
			width: '100%',
			labelWidth: 110,
			disabled: true
		}
	]
});