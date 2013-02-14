Ext.define('app.store.RenewPlan.SiteToStorages', {
	extend: 'Ext.data.Store',
	model: 'app.model.RenewPlan.SiteStorageModel',
	proxy: {
		type: 'rest',
		url : '/renew_plan/get_site_to_storages',
		reader: {
			type: 'json'
		}
	}
});