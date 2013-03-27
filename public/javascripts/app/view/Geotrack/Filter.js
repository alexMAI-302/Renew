//фильтр
Ext.define('app.view.Geotrack.Filter', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.geotrackFilter',
	
	requires: [
		'app.view.Lib.Grid.Panel'
	],
    
    layout: {
		type: 'hbox'
	},
	
	height: '100%',
	width: 200,
	
	tbar: [
		{
			id : 'filterGeotrackDdate',
			xtype : 'datefield',
			fieldLabel : 'Дата',
			format : 'd.m.Y',
			altFormat : 'd/m/Y|d m Y',
			startDay : 1,
			value: Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'),
			width: 135,
			labelWidth : 35
		}
	],
	
	items: [
		{
			xtype: 'simpleGrid',
			suffix: 'GeoTrackAgents',
			disableDeleteColumn: true,
			disableDelete: true,
			disableAdd: true,
			disableSave: true,
			title: 'Агенты',
			columns: [
				{
					width: 190,
					header: 'Имя',
					dataIndex: 'name',
					disabled: true
				}
			]
		}
	]
});