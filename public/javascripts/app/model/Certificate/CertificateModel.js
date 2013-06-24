Ext.define('app.model.Certificate.CertificateModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'					, type:'string'},
	{name: 'ndoc'				, type:'string'},
	{name: 'goods_code'			, type:'string'},
	{name: 'goods_name'			, type:'string'},
	{name: 'certificate_number'	, type:'string'},
	{name: 'jpg_url'			, type:'string'},
	{name: 'pdf_url'			, type:'string'}]
});
