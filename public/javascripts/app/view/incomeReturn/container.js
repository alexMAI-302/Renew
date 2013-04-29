Ext.define('app.view.incomeReturn.container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.incomeReturnPanel',
	
	requires: [
		'app.view.incomeReturn.filter',
		'app.view.Lib.Grid.Panel'
	],
	
	layout: {
		type: 'anchor'
	},
	
	width: 1350,
	renderTo: Ext.get('income_return_js'),
	defaults: {
		style: {
			margin: '10px'
		}
	},
	
	items:[
		{
			xtype: 'incomeReturnFilter'
		},
		{
			xtype: 'simpleGrid',
			suffix: 'IncomeReturn',
			disableRefresh: true,
			region: 'center',
			height: 400,
			viewConfig: {
				enableTextSelection: true,
				listeners: {
					itemkeydown: function(view, record, item, index, e, eOpts){
						if(e.getKey()==e.ENTER){
							var sm=Ext.getCmp('IncomeReturnTable').getSelectionModel(),
								r=sm.getSelection()[0],
								 store = Ext.getCmp('IncomeReturnTable').getStore(),
								 cellEditingIncomeReturn = Ext.getCmp('IncomeReturnTable').getPlugin('celleditingIncomeReturn');
							if (store.getCount() > index + 1 ) {
								e.stopEvent();
								cellEditingIncomeReturn.cancelEdit();
								sm.select(index + 1, true,true);
								cellEditingIncomeReturn.startEdit(index + 1, 9);
							}
						}
						return true;
					}
				}
				
			},
				
			columns: [
				{
					header: 'Идентификатор',
					dataIndex: 'subid',
					hidden: true,
					disabled: true
				},
				{
					header: 'Товар',
					dataIndex: 'goods',
					id: 'goods',
					disabled: true,
					width: 350
				},
				{
					header: 'Количество<br/>по документу',
					dataIndex: 'doc_vol',
					disabled: true,
					width: 90,
					align: 'right',
					renderer: Ext.util.Format.numberRenderer('0'),
					field:{
						xtype: 'numberfield',
						decimalSeparator : ',',
						minValue: 0,
						selectOnFocus : true,
						listeners:{
							"change": function(t, newValue, oldValue, options){
								var r = Ext.getCmp('IncomeReturnTable').getSelectionModel().getSelection()[0];
								r.beginEdit();
								r.set("summ", r.get("vrel")*r.get("measure_price")*parseFloat(newValue));
								r.set("nds_summ", r.get("summ")*r.get("nds")/(100+r.get("nds")));
								r.endEdit(true);
								return true;
							},
							"specialkey": function(field, e){
								if(e.getKey()==e.ENTER){
									var sm=Ext.getCmp('IncomeReturnTable').getSelectionModel(),
										 store = Ext.getCmp('IncomeReturnTable').getStore(),
										cellEditingIncomeReturn = Ext.getCmp('IncomeReturnTable').getPlugin('celleditingIncomeReturn'),
										index=sm.getSelection()[0].index;
									if (store.getCount() > index + 1 ) {
										cellEditingIncomeReturn.cancelEdit();
										cellEditingIncomeReturn.startEdit(index + 1, 9);
									}
								}
							}
						}
					}
				},
				
				{
					width: 100,
					header: 'Единица</br>измерения',
					dataIndex: 'doc_measure'
				},
				{
					width: 75,
					header: 'Цена',
					dataIndex: 'doc_price',
					align: 'right',
					renderer: Ext.util.Format.numberRenderer('0.0000'),
					field:{
						xtype: 'numberfield',
						minValue: 0,
						decimalPrecision : 4,
						decimalSeparator : ',',
						selectOnFocus : true,
						listeners:{
							"change": function(t, newValue, oldValue, options){
							var r = Ext.getCmp('IncomeReturnTable').getSelectionModel().getSelection()[0];
								r.beginEdit();
								r.set("summ", r.get("doc_vol")*parseFloat(newValue));
								r.set("nds_summ", r.get("summ")*r.get("nds")/(100+r.get("nds")));
								r.set("measure_price", parseFloat(newValue)/r.get("vrel"));
								r.endEdit(true);
								return true;
							},
							"specialkey": function(field, e){
								if(e.getKey()==e.ENTER){
									var sm=Ext.getCmp('IncomeReturnTable').getSelectionModel(),
										 store = Ext.getCmp('IncomeReturnTable').getStore(),
										cellEditingIncomeReturn = Ext.getCmp('IncomeReturnTable').getPlugin('celleditingIncomeReturn'),
										index=sm.getSelection()[0].index;
									if (store.getCount() > index + 1 ) {
										cellEditingIncomeReturn.cancelEdit();
										cellEditingIncomeReturn.startEdit(index + 1, 9);
									}
								}
							}
						}
					}
				},
				{
					width: 50,
					header: 'Валюта',
					dataIndex: 'currency'
				},
				{
					width: 100,
					header: 'Цена за</br>единицу',
					align: 'right',
					dataIndex: 'measure_price',
					renderer: Ext.util.Format.numberRenderer('0.0000'),
					field:{
						xtype: 'numberfield',
						selectOnFocus : true,
						minValue: 0,
						decimalPrecision : 4,
						decimalSeparator : ',',
						listeners:{
							"change": function(t, newValue, oldValue, options){
							var r = Ext.getCmp('IncomeReturnTable').getSelectionModel().getSelection()[0];
								r.beginEdit();
								r.set("summ", r.get("vrel")*r.get("doc_vol")*parseFloat(newValue));
								r.set("nds_summ", r.get("summ")*r.get("nds")/(100+r.get("nds")));
								r.set("doc_price", parseFloat(newValue)*r.get("vrel"));
								r.endEdit(true);
								return true;
							},
							"specialkey": function(field, e){
								if(e.getKey()==e.ENTER){
									var sm=Ext.getCmp('IncomeReturnTable').getSelectionModel(),
										 store = Ext.getCmp('IncomeReturnTable').getStore(),
										cellEditingIncomeReturn = Ext.getCmp('IncomeReturnTable').getPlugin('celleditingIncomeReturn'),
										index=sm.getSelection()[0].index;
									if (store.getCount() > index + 1 ) {
										cellEditingIncomeReturn.cancelEdit();
										cellEditingIncomeReturn.startEdit(index + 1, 9);
									}
								}
							}
						}
					}
				},
				{
					width: 50,
					header: 'Ставка</br>НДС',
					dataIndex: 'nds',
					renderer: Ext.util.Format.numberRenderer('00%')
				},
				{
					width: 100,
					header: 'Сумма НДС',
					align: 'right',
					dataIndex: 'nds_summ',
					renderer: Ext.util.Format.numberRenderer('0.00'),
					summaryType: 'sum'
				},
				{
					width: 100,
					header: 'Сумма c</br>учётом НДС',
					align: 'right',
					dataIndex: 'summ',
					renderer: Ext.util.Format.numberRenderer('0.00'),
					field:{
						xtype: 'numberfield',
						minValue: 0,
						selectOnFocus : true,
						decimalSeparator : ',',
						listeners:{
							"change": function(t, newValue, oldValue, options){
							var r = Ext.getCmp('IncomeReturnTable').getSelectionModel().getSelection()[0];
								r.beginEdit();
								r.set("measure_price", parseFloat(newValue)/r.get("vrel")/r.get("doc_vol"));
								r.set("doc_price", parseFloat(newValue)/r.get("doc_vol"));
								r.set("nds_summ", parseFloat(newValue)*r.get("nds")/(100+r.get("nds")));
								r.endEdit(true);
								return true;
							},
							"specialkey": function(field, e){
								if(e.getKey()==e.ENTER){
									var sm=Ext.getCmp('IncomeReturnTable').getSelectionModel(),
										 store = Ext.getCmp('IncomeReturnTable').getStore(),
										cellEditingIncomeReturn = Ext.getCmp('IncomeReturnTable').getPlugin('celleditingIncomeReturn'),
										index=sm.getSelection()[0].index;
									if (store.getCount() > index + 1 ) {
										cellEditingIncomeReturn.cancelEdit();
										cellEditingIncomeReturn.startEdit(index + 1, 9);
									}
								}
							}
						}
					},
					summaryType: 'sum'
				},
				{
					width: 75,
					header: 'Кол-во<br>по факту',
					align: 'right',
					dataIndex: 'vol',
					summaryType: 'sum'
				},
				{
					width: 100,
					header: 'Единица</br>измерения факта',
					dataIndex: 'measure'
				}
				
			],
			features: [{
				ftype: 'summary'
			}]
		}
	]
});