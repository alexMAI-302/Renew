Ext.define('app.store.WifiInfo.WifiInfo', {
	extend : 'Ext.data.Store',
	model : 'app.model.WifiInfo.WifiInfoModel',
	proxy : {
		type : 'rest',
		url : '/wifi_info/wifi_info',
		reader : {
			type : 'json'
		}
	}
});
