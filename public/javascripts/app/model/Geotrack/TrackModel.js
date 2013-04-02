Ext.define('app.model.Geotrack.TrackModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'start_time'		, type: 'date',		useNull: true, persists: false},
	{name: 'finish_time'	, type: 'date',		useNull: true, persists: false},
	{name: 'points_quantity', type: 'int',		useNull: true, persists: false},
	{
		name: 'points',
		type: 'string',
		useNull: true,
		persists: false,
		convert: function(v, r){
			if(v!=null && v.length>0){
				var data=[];
				for(var i=0; i<v.length; i++){
					data.push([v[i].latitude, v[i].longitude]);
				}
				r.pointsArray = data;
			}
			return "";
		}
	}]
});
