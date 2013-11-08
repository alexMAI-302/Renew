Ext.define('app.store.JointPartner.TPCombo', {
	extend: 'Ext.data.Store',
	model: 'app.model.JointPartner.TPComboModel',
	proxy: {
		type: 'rest',
		url : '/joint_partner/podr_tp',
		reader: {
			type: 'json'
		}
	}
});