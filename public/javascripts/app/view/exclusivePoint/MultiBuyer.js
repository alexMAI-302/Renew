Ext.define('app.view.exclusivePoint.MultiBuyer', {
	extend:  'app.view.Lib.Grid.Panel',
	alias: 'widget.exclusivePointMultiBuyer',    //'widget.exclusivePointPanel',

	requires: [
		'app.view.Lib.Grid.column.ComboColumn'
	],




	plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
			//pluginId: 'cellEditing',
            clicksToEdit: 1
        })
    ],

	config: {
		suffix: 'exclusivePointMultiBuyer',
		store: 'app.store.exclusivePoint.MultiBuyer', 
		disableRefresh: true,
		disableDeleteColumn: true,

		title: 'Мультиассортиментные покупатели',
		//enableBuffering: true,

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
				//width: '100%'
			},
			{
				dataIndex: 'super_id',
				text: 'Супервайзер',
				sortable: true,
				hideable: false,
				//width: '100%'

                xtype: 'combocolumn',
                store: 'app.store.exclusivePoint.Supervisor',
                
                editor: {
                	allowBlank: false
                }
			},
			{
				dataIndex: 'tp_id',
				text: 'ТП',
				sortable: true,
				hideable: false,
				id: 'exclusivePointMultiBuyerTpId',
				
	            xtype: 'combocolumn',
	            store: 'app.store.exclusivePoint.Tp',                

				//width: '100%'
				editor: {
                    allowBlank: false
                }
			},
			{
				dataIndex: 'buyer_id',
				text: 'Покупатель',
				sortable: true,
				hideable: false,
				//queryMode: 'remote',
				//width: '100%',
				
				xtype: 'combocolumn',
	            store: 'app.store.exclusivePoint.BuyerCB',
	            
	            renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
	            	console.log('renderer (colIndex='+colIndex+')')

					var comboBoxStore = this.columns[colIndex].store 
					
					if (!record.phantom)
						return(record.get('name'))
					else {
						var matching = null,
						
						data = comboBoxStore.data;
						data.each(function(r){
							if(r.get('id')==value){
								matching=r.get('name');
							}
							return matching==null;
						});
						return matching;
					}
				},
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