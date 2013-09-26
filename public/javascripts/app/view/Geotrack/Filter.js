//фильтр
Ext.define('app.view.Geotrack.Filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.geotrackFilter',
	
	layout: {type: 'vbox'},
	defaults: {
		width: 300
	},
	items: [
		{
			id : 'filterGeotrackDdate',
			xtype : 'datefield',
			fieldLabel : 'Дата',
			format : 'd.m.Y',
			altFormat : 'd/m/Y|d m Y',
			startDay : 1,
			value: Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'),
			labelWidth : 35
		},
		{
			id : 'filterGeotrackPosition',
			xtype : 'combobox',
			queryMode: 'local',
			fieldLabel : 'Должность',
			store: Ext.create('app.store.Geotrack.Positions'),
			valueField: 'id',
			displayField: 'name',
			labelWidth: 70
		}
	]
});