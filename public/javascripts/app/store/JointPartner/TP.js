Ext.define('app.store.JointPartner.TP', {
	extend: 'Ext.data.Store',
	model: 'app.model.JointPartner.TPModel',
	proxy: {
		type: 'rest',
		url : '/joint_partner/tp',
		reader: {
			type: 'json'
		}
	}
});
	