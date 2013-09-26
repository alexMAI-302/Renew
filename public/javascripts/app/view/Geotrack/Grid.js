Ext.define('app.view.Geotrack.Grid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.geotrackGrid',
	
	config: {
		store: 'Geotrack.Agents',
		suffix: 'GeoTrackAgents',
		disableDeleteColumn: true,
		disableDelete: true,
		disableAdd: true,
		disableSave: true,
		title: 'Агенты',
		height: 250,
		columns: [
			{
				width: 275,
				header: 'Имя',
				dataIndex: 'name',
				disabled: true
			}
		]
	}
});