Ext.define('app.model.Geotrack.AgentModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'name'			, type: 'string'},
	{name: 'position_id'	, type: 'int',		useNull: true, persists: false},
	{name: 'position_name'	, type: 'string',	useNull: true, persists: false}]
});
