Ext.define('app.model.salesmanCash.SalesmanCashModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type:'string'},
	{name: 'ndoc'			, type:'string'},
	{name: 'ddate'			, type:'date'},
	{name: 'summ'			, type:'float', useNull: true},
	{name: 'cash'			, type:'float', useNull: true},
	{name: 'doc_id'			, type:'int'},
	{name: 'status1'		, type:'int'},
	{name: 'buyer_name'		, type:'string'},
	{name: 'address'		, type:'int'}]
});