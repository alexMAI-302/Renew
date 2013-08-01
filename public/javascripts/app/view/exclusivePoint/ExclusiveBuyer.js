Ext.define('app.view.exclusivePoint.ExclusiveBuyer', {
	extend:  'app.view.Lib.Grid.Panel',
	alias: 'widget.exclusivePointExclusiveBuyer',    //'widget.exclusivePointPanel',

	requires: [
		'app.store.exclusivePoint.ExclusiveBuyer'
	],

	plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
			pluginId: 'cellEditing',
            clicksToEdit: 1
        })
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
		//enableBuffering: true,
	/*	
		beforeButtons: [
			{
				id: 'currentBuyer',
				xtype: 'combobox',
				fieldLabel: 'Покупатель:',
				displayField: 'name',
				valueField: 'id',
				allowBlank: false,
				labelWidth: 140,
				width: 380,
				queryMode: 'local',
				store: 'app.store.exclusivePoint.BuyerComboBox', //Ext.create ('app.store.exclusivePoint.Buyer'), //'app.store.exclusivePoint.Buyer'
				listConfig: {
					getInnerTpl: function(){
						return '<div data-qtip="{podr}/{super}/{tp}/{name}/{loadto}">{name}</div>';
					}
				}
			}
		],
				*/
		columns: [
			{
				dataIndex: 'id',
				text: 'id',
				disabled: true,
				hidden: true
			},
			/*
			{
				dataIndex: 'type',
				text: 'Экскл/Мульти',
				sortable: true,
				hideable: false,
				//width: '100%'
			},
			*/
			{
				dataIndex: 'podr',
				text: 'Подразделение',
				sortable: true,
				hideable: false,
				//width: '100%'
			},
			{
				dataIndex: 'super',
				text: 'Супервайзер',
				sortable: true,
				hideable: false,
				//width: '100%'

               // xtype: 'combocolumn',
               // store: 'app.store.exclusivePoint.Supervisor'
			},
			{
				dataIndex: 'tp',
				text: 'ТП',
				sortable: true,
				hideable: false,
				//width: '100%'
				//editor: {
                //    allowBlank: false
               // }
			},
			{
				dataIndex: 'name',
				text: 'Покупатель',
				sortable: true,
				hideable: false,
				//width: '100%'
			},
			{
				dataIndex: 'loadto',
				text: 'Адрес',
				sortable: true,
				hideable: false,
				//width: '100%'
			},
		]
	}
});