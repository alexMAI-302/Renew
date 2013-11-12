Ext.define('app.view.JointPartner.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.jointPartnerContainer',
	
	requires: [
		'app.view.JointPartner.Grid',
		'app.view.JointPartner.ItemGrid',
		'app.view.JointPartner.Pricelist'
	],
	
	renderTo: 'joint_partner_js',
	height: Ext.getBody().getViewSize().height - 120,
	resizable: true,
	 layout: {
		type: 'border'
	},
	
	items: [
		{
			xtype: 'jointPartnerGrid',
			region: 'north',
			split: true,
			height: 163
		},
		{
			xtype: 'jointPartnerItemGrid',
			region: 'center',
			flex: 1

		},
		{
			xtype: 'jointPartnerPricelist',
			region: 'east',
			split: true,
			flex: 1
		}
	]
});