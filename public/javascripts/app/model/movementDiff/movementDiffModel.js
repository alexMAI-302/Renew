Ext.define('app.model.movementDiff.movementDiffModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'						, type: 'string'},
	{name: 'site_src_id'			, type: 'int',		persist: false},
	{name: 'site_dest_id'			, type: 'int',		persist: false},
	{name: 'ndoc_so'				, type: 'string',	persist: false},
	{name: 'ndoc_sup'				, type: 'string',	persist: false},
    {name: 'ddate_so'				, type: 'date',		dateFormat: 'Y-m-d'},
    {name: 'ddate_sup'				, type: 'date',		dateFormat: 'Y-m-d'},
	{name: 'goods_name'				, type: 'string',	persist: false},
    {name: 'volume_so'				, type: 'float',	persist: false},
    {name: 'donevol_so'				, type: 'float',	persist: false},
    {name: 'volume_sup'				, type: 'float',	persist: false},
    {name: 'donevol_sup'			, type: 'float',	persist: false}]
});
