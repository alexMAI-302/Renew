Ext.define('app.store.JointPartner.PricelistCombo', {
	extend: 'Ext.data.Store',
	model: 'app.model.JointPartner.PricelistComboModel',
	proxy: {
		type: 'rest',
		url : '/joint_partner/pricelistCombo',
		reader: {
			type: 'json'
		},
		server: {timeout:60000},
		buffered : false
	}
});