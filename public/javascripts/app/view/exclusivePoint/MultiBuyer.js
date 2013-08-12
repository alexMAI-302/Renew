Ext.define('app.view.exclusivePoint.MultiBuyer', {
	extend:  'app.view.Lib.Grid.Panel',
	alias: 'widget.exclusivePointMultiBuyer',

	requires: [
		'app.view.Lib.Grid.column.ComboColumn',
		'app.store.exclusivePoint.MultiBuyer',
		'app.store.exclusivePoint.Supervisor',
		'app.store.exclusivePoint.Tp',
		'app.store.exclusivePoint.BuyerCB'
	],

	plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ],

	config: {
		suffix: 'exclusivePointMultiBuyer',
		store: 'app.store.exclusivePoint.MultiBuyer', 
		disableRefresh: true,
		disableDeleteColumn: true,
		title: 'Мультиассортиментные покупатели',

		columns: [

			{
				dataIndex: 'podr',
				text: 'Подразделение',
				sortable: true,
				hideable: false,
				disabled: true,
				width: '15%'
			},
			{
				dataIndex: 'super_id',
				text: 'Супервайзер',
				sortable: true,
				hideable: false,
				width: '15%',

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
	            fieldListeners: false,

				width: '15%',
				editor: {
                    allowBlank: false
                }
			},
			{
				dataIndex: 'buyer_id',
				text: 'Покупатель',
				sortable: true,
				hideable: false,
				xtype: 'combocolumn',
	            store: 'app.store.exclusivePoint.BuyerCB',
	            width: '30%',
	            
	            listConfig : {
        			getInnerTpl : function() {
            			return '<div data-qtip="{loadto}">{name}</div>';
        			}
    			},
	            
	            renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
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
				}
			},		
			{
				dataIndex: 'loadto',
				text: 'Адрес',
				sortable: true,
				hideable: false,
				disabled: true,
				width: '25%',
			},
			{
				dataIndex: 'id',
				text: 'id',
				disabled: true,
				hidden: true
			},
		]
	}
});