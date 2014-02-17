Ext.define('app.view.WifiInfo.Container', {
	extend : 'app.view.Lib.Grid.Panel',
	requires : ['app.view.Lib.Grid.column.ComboColumn'],
	title : 'просмотр ключей wifi',

	renderTo : 'wifi_info_js',
	height : Ext.getBody().getViewSize().height - 150,

	config : {
		suffix : 'WifiInfo',
		store : 'WifiInfo.WifiInfo',
		disableSave : true,
		disableRefresh : true,
		disableAdd : true,
		disableDelete : true,
		disableDeleteColumn : true,
		disableAddColumn : true,

		columns : [{
			width : 200,
			header : 'Имя wifi',
			dataIndex : 'wifi_name'
		}, {
			width : 200,
			header : 'Ключ',
			dataIndex : 'psk_key',

		}]
	}
});
