//фильтр
Ext.define('app.view.GoogleLikes.Filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.googleLikesFilter',
    
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
			id: 'ddate',
			xtype: 'datefield',
			fieldLabel: 'Дата',
			format: 'd.m.Y',
			altFormat: 'd/m/Y|d m Y',
			startDay: 1,
			value: Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'),
			width: 125,
			labelWidth: 25
		},
		{
			id: 'filterGoogleLikes',
			xtype: 'button',
			text: 'Фильтр'
		},
		{
			id: 'refreshGoogleLikes',
			xtype: 'button',
			text: 'Обновить статистику'
		}
	]
});