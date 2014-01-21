Ext.define('app.store.calcBp.PartnerGroups', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/bprog/get_partner_groups',
		reader: {
			type: 'json'
		},
	}
});