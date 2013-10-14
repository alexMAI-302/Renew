Ext.define('app.view.JointPartner.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.jointPartnerContainer',
	
	requires: [
		'app.view.JointPartner.Grid'
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
			region: 'center',
			split: true,
			flex: 1
		},
		{
			xtype: 'jointPartnerItemGrid',
			region: 'south',
			flex: 1
		}
	]
});