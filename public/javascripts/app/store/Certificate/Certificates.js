Ext.define('app.store.Certificate.Certificates', {
	extend: 'Ext.data.Store',
	model: 'app.model.Certificate.CertificateModel',
	proxy: {
		type: 'ajax',
		url : '/certificate/get_certificates',
		reader: {
			type: 'json'
		}
	}
});