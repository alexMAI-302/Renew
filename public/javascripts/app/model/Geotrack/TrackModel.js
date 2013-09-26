Ext.define('app.model.Geotrack.TrackModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'start_time'		, type: 'date',		useNull: true, persists: false},
	{name: 'finish_time'	, type: 'date',		useNull: true, persists: false},
	{name: 'points_quantity', type: 'int',		useNull: true, persists: false},
	{name: 'track_distance'	, type: 'float',	useNull: true, persists: false},
	{
		name: 'points',
		type: 'string',
		useNull: true,
		persists: false,
		convert: function(v, r){
			if(v!=null && v.length>0){
				var data=[];
				for(var i=0; i<v.length; i++){
					data.push({
						coords: [v[i].latitude, v[i].longitude],
						ts: Ext.Date.parse(v[i].ts, 'Y-m-d H:i:s')
					});
				}
				r.pointsArray = data;
			}
			return "";
		}
	}]
});
