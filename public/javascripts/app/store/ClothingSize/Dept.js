Ext.define('app.store.ClothingSize.Dept', {
	extend: 'Ext.data.TreeStore',
	model: 'app.model.valueModel',
	folderSort: true,
	recursive: true,
	storeId: 'DeptStore',
	proxy: {
		type: 'rest',
		url : '/clothing_size/dept',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});