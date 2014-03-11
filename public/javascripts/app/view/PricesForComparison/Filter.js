Ext.define('app.view.PricesForComparison.Filter', {
    extend: 'Ext.container.Container',
	alias: 'widget.filterPricesForComparison',
  
    layout: {
		type: 'hbox'
	},
	
	defaults: {
		style: {
			margin: '5px'
		}
	},
	items: 
	[
				{
				id: 'filterPricesForComparisonKM',
				xtype: 'combobox',
				fieldLabel: 'КМ',
				valueField: 'id',
				displayField: 'name',
				queryMode: 'local',
				allowNull: true,
				width: 250,
				labelWidth: 70,
				store: 'PricesForComparison.Catmanager'
			}


			
	]
});
