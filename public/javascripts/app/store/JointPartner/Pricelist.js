Ext.define('app.store.JointPartner.Pricelist', {
	extend: 'Ext.data.Store',
	model: 'app.model.JointPartner.PricelistModel',
	proxy: {
		type: 'rest',
		url : '/joint_partner/pricelist',
		reader: {
			type: 'json'
		}
	}
});