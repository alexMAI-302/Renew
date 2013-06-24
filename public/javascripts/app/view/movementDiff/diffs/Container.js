Ext.define('app.view.movementDiff.diffs.Container', {
    extend: 'Ext.container.Container',
	alias: 'widget.diffsContainer',
	
	requires: [
		'app.view.Lib.DateIntervalFilter',
		'app.view.movementDiff.diffs.Grid'
	],

	layout: {
		type: 'anchor'
	},
	
	items: [
        {
			xtype: 'dateIntervalFilter',
			suffix: 'Diffs',
			shiftInterval: Ext.Date.DAY,
			shiftBegin: -3,
			filterItems: [
				{
					id: 'siteFrom',
					xtype: 'combobox',
					queryMode: 'local',
					displayField: 'name',
					valueField: 'id',
					name: 'siteFrom',
					fieldLabel: 'Отправитель',
					width: 180,
					labelWidth: 75
				},
				{
					id: 'siteTo',
					xtype: 'combobox',
					queryMode: 'local',
					displayField: 'name',
					valueField: 'id',
					name: 'siteTo',
					fieldLabel: 'Получатель',
					width: 180,
					labelWidth: 75
				}
			]
		},
		{
			xtype: 'diffsGrid'
		}
    ]
});