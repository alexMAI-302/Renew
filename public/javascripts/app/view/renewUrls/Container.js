Ext.define('app.view.renewUrls.Container', {
    extend: 'app.view.Lib.Grid.Panel',
    requires: 'app.view.Lib.Grid.column.ComboColumn',
	
	title: 'Шаблоны страниц',
	
	renderTo: 'renew_urls_js',
	
	config:{
		suffix: 'RenewUrls',
		store: 'renewUrls.RenewUrls',
		disableDeleteColumn: true,
		beforeButtons: [
			{
				id: 'filterRenewUrlTypeRenewUrls',
				xtype: 'combobox',
				store: 'renewUrls.RenewUrlTypes',
				queryMode: 'local',
				fieldLabel: 'Тип шаблона',
				displayField: 'name',
				valueField: 'id',
				listeners: {
					beforequery: function(queryEvent){
						queryEvent.combo.store.clearFilter();
						queryEvent.combo.store.filter(queryEvent.combo.displayField, queryEvent.query);
						return true;
					}
				}
			}
		],
		columns : [
			{
				width : 200,
				header : 'Наименование',
				dataIndex : 'name',
				field: {
					xtype: 'textfield'
				}
			},
			{
				width : 300,
				header : 'Шаблон',
				dataIndex : 'url_pattern',
				field: {
					xtype: 'textfield'
				}
			},
			{
				width : 150,
				header : 'Тип',
				dataIndex : 'url_type_id',
				xtype: 'combocolumn',
				store: 'renewUrls.RenewUrlTypes'
			},
			{
				width : 80,
				header : 'Порядковый<br/>номер',
				dataIndex : 'sorder',
				xtype: 'numbercolumn',
				format: '0',
				field: {
					xtype: 'numberfield',
					allowDecimals: false
				}
			}
		]
	}
});