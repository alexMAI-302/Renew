Ext.define('app.store.GoogleLikes.Actions', {
	extend: 'Ext.data.Store',
	model: 'app.model.GoogleLikes.ActionModel',
	proxy: {
		type: 'rest',
		url : '/google_likes/likes',
		appendId: false,
		reader: {
			type: 'json'
		}
	}
});