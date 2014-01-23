Ext.define('app.view.Placeunload.points.UpdatePanel', {
	extend: 'Ext.container.Container',
	alias: 'widget.placeunloadUpdatePanel',
    
    layout: {
		type: 'hbox'
	},
	
	defaults: {
		style: {
			margin: '5px'
		}
	},
	items: [
		{
			width: 200,
			layout: {
				type: 'vbox'
			},
			items: [
				{
					xtype: 'textfield'
				},
				{
					xtype: 'textfield'
				}
			]
			// tpl: '{name}<br/>{descr}'
		},
		{
			width: 350,
			layout: {
				type: 'vbox'
			},
			tpl: '{name}<br/>{descr}'
		},
		{
			width: 50,
			layout: {
				type: 'vbox'
			},
			tpl: '{name}<br/>{descr}'
		},
		{
			width: 100,
			layout: {
				type: 'vbox'
			},
			tpl: '{name}<br/>{descr}'
		},
		{
			width: 100,
			layout: {
				type: 'vbox'
			},
			tpl: '{delscheduleid}<br/>{incscheduleid}'
		},
		{
			width: 190,
			layout: {
				type: 'vbox'
			},
			items: [
				{
					xtype: 'combobox',
					valueField: 'id',
					displayField: 'name',
					queryMode: 'local',
					allowNull: true,
					width: 250,
					labelWidth: 60,
					store: 'Placeunload.Routes'
				},
				{
					xtype: 'checkbox'
				}
			]
		}
	]
});