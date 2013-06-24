Ext.define('app.store.placeunloadSchedule.Schedules', {
	extend: 'Ext.data.Store',
	model: 'app.model.placeunloadSchedule.ScheduleModel',
	proxy: {
		type: 'rest',
		api: {
			update: '/placeunload_schedule/save'
		},
		url : '/placeunload_schedule/get',
		reader: {
			type: 'json'
		}
	}
});
