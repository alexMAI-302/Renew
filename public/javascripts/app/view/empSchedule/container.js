Ext.define('app.view.empSchedule.container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.empSchedulePanel',
	
	requires: [
		'app.view.empSchedule.grid'
	],
	
	renderTo: 'emp_schedule_js',
	width: '100%',
	height: 700,
	
	layout: {
		type: 'border'
	},
	
	items: [
		{
			xtype: 'empScheduleGrid'
		}
	]
});