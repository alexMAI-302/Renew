Ext.define('app.store.ClothingSize.ClothingSize', {
	extend: 'Ext.data.Store',
	model: 'app.model.ClothingSize.ClothingSizeModel',
	proxy: {
		type: 'rest',
		url : '/clothing_size/clothing_size',
		reader: {
			type: 'json'
		}
	}
});