Ext.define('app.store.JointPartner.Partner', {
	extend: 'Ext.data.Store',
	model: 'app.model.JointPartner.PartnerModel',
	proxy: {
		type: 'rest',
		url : '/joint_partner/partner',
		reader: {
			type: 'json'
		}
	}
});