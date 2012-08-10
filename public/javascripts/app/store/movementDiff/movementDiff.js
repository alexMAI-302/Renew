//хранилище расхождений межплощадочных перемещений
Ext.define('app.store.movementDiff.movementDiff', {
	extend: 'Ext.data.Store',

	model: 'app.model.movementDiff.movementDiffModel',
	proxy: {
		type: 'rest',
		url : '/movement_diff/movement_diff',
		reader: {
			type: 'json'
		}
	}
});