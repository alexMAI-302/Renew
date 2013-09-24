Ext.define('app.view.Geotrack.ItemsGrid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.geotrackItemsGrid',
	
	config: {
		store: 'Geotrack.Tracks',
		suffix: 'GeoTracks',
		disableDeleteColumn: true,
		disableDelete: true,
		disableAdd: true,
		disableSave: true,
		title: 'Трэки',
		afterButtons: [
			{
				id: 'GeoTracksTsFinder',
				fieldLabel: 'Время',
				xtype: 'timefield',
				width: 100,
				labelWidth: 35
			},
			{
				id: 'GeoTracksTs',
				icon: '/images/clock.png',
				tooltip: 'Показать/скрыть время в точках',
				enableToggle: true
			},
			{
				id: 'GeoTracksDistance'
			}
		],
		disabled: true,
		columns: [
			{
				xtype: 'rownumberer'
			},
			{
				width: 250,
				header: 'Информация',
				dataIndex: 'id',
				renderer: function(v, metaData, r){
					return "Начало: " + Ext.Date.format(r.get('start_time'), 'H:i:s') +
					"<br/> Конец: " + Ext.Date.format(r.get('finish_time'), 'H:i:s') +
					"<br/> Точек: " + r.get('points_quantity') +
					"<br/> Длина: " + Ext.Number.toFixed(r.get('track_distance'), 0) + ' м';
				},
				disabled: true
			}
		]
	}
});