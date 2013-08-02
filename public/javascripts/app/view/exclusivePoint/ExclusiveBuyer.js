Ext.define('app.view.exclusivePoint.ExclusiveBuyer', {
	extend:  'app.view.Lib.Grid.Panel',
	alias: 'widget.exclusivePointExclusiveBuyer',

	requires: [
		'app.store.exclusivePoint.ExclusiveBuyer'
	],

	config: {
		suffix: 'exclusivePointExclusiveBuyer',
		store: 'app.store.exclusivePoint.ExclusiveBuyer', 
		disableRefresh: true,
		disableDeleteColumn: true,
		disableDelete: true,
		disableAdd: true,
		disableSave: true,
		title: 'Эксклюзивные покупатели',

		columns: [
			{
				dataIndex: 'id',
				text: 'id',
				disabled: true,
				hidden: true
			},
			{
				dataIndex: 'podr',
				text: 'Подразделение',
				sortable: true,
				hideable: false,
				width: '15%'
			},
			{
				dataIndex: 'super',
				text: 'Супервайзер',
				sortable: true,
				hideable: false,
				width: '15%'
			},
			{
				dataIndex: 'tp',
				text: 'ТП',
				sortable: true,
				hideable: false,
				width: '15%'
			},
			{
				dataIndex: 'name',
				text: 'Покупатель',
				sortable: true,
				hideable: false,
				width: '30%'
			},
			{
				dataIndex: 'loadto',
				text: 'Адрес',
				sortable: true,
				hideable: false,
				width: '25%'
			},
		]
	}
});