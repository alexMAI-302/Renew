//фильтр
Ext.define('app.view.Geotrack.Filter', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.geotrackFilter',
	
	requires: [
		'app.view.Lib.Grid.Panel'
	],
    
    layout: {
		type: 'border'
	},
	
	height: '100%',
	width: 215,
	
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
			region: 'north',
			height: 250,
			columns: [
				{
					width: 190,
					header: 'Имя',
					dataIndex: 'name',
					disabled: true
				}
			]
		},
		{
			xtype: 'simpleGrid',
			suffix: 'GeoTracks',
			disableDeleteColumn: true,
			disableDelete: true,
			disableAdd: true,
			disableSave: true,
			title: 'Трэки',
			region: 'center',
			disabled: true,
			columns: [
				{
					xtype: 'rownumberer'
				},
				{
					width: 170,
					header: 'Информация',
					dataIndex: 'id',
					renderer: function(v, metaData, r){
						return "Начало: " + Ext.Date.format(r.get('start_time'), 'Y.m.d H:i:s') +
						"<br/> Конец: " + Ext.Date.format(r.get('finish_time'), 'Y.m.d H:i:s') +
						"<br/> Точек: " + r.get('points_quantity');
					},
					disabled: true
				}
			]
		}
	]
});