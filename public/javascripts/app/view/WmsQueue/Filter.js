Ext.define('app.view.WmsQueue.Filter', {
    extend: 'app.view.Lib.DateIntervalFilter',
	alias: 'widget.filterWmsQueue',
	
	config: {
		suffix: 'WmsQueue',
		shiftBegin: -1,
		filterItems: [
			{
				id: 'filterRequest',
				xtype: 'textfield',
				fieldLabel: 'Запрос',
				width: 250,
				labelWidth: 40
			},
			{
				id: 'filterReply',
				xtype: 'textfield',
				fieldLabel: 'Ответ',
				width: 250,
				labelWidth: 40
			},
			{
				id: 'filterResult',
				xtype: 'combobox',
				fieldLabel: 'Код ответа',
				valueField: 'id',
				displayField: 'name',
				queryMode: 'local',
				value: 0,
				store: {
					fields: ["id", "name"],
					data: [
						{id: -2, name: 'Не важно'},
						{id: -1, name: '-1'},
						{id: -0, name: '0'},
						{id:  1, name: '1'}
					]
				},
				width: 155,
				labelWidth: 65
			}
		]
	}
});