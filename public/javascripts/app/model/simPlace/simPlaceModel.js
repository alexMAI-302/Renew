Ext.define('app.model.simPlace.simPlaceModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'	  , type: 'int'},
        {name: 'simka_id' , type: 'int'},
	{name: 'ddate'    , type: 'date', dateFormat: 'Y-m-d'},
	{name: 'person_id', type: 'int'}
    ]
});
