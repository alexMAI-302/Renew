//таблица
Ext.define('app.view.SalesmanRoutes.Grid', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.dataGrid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'dataTable',
			rootVisible: false,
			useArrows: true,
			collapsible: true,
			hideHeaders: true,
			width: 360,
			store: Ext.create('Ext.data.TreeStore', {
				model: 'app.model.SalesmanRoutes.GeoDataModel',
				proxy: {
					type: 'ajax',
					url : '/salesman_routes/get_geo_data',
					reader: {
						type: 'json'
					}
				}
			}),
			columns: [
				{
					xtype: 'treecolumn',
					width: 700,
					dataIndex: 'name',
					renderer: function(value, metaData, record){
						var str="";
						//для торговых точек показываем адрес, количество покупателей и заказов
						if(record.get("level")==2){
							str = '<p style="color: '+record.parentNode.colorHex+';">' + record.get("name") + "<br/>["+ record.point.ts +"]<p/>" +
							record.get("address")+"<br/>"+
							"Заказов: " + record.get("order_cnt") + "<br/>"+
							"Сумма: " + record.get("order_summ");
						} else if(record.get("level")==1){
							str = '<p style="color: '+record.colorHex+';">' + record.get("name") +
							"<br/>["+ (record.start_ts?record.start_ts:"Нет данных") + "; " + (record.end_ts?record.end_ts:"Нет данных") +"]<p/>" +
							"Адресов: " + record.get("buyer_cnt") + "<br/>"+
							"Накладных: " + record.get("order_cnt") + "<br/>"+
							"На сумму: " + record.get("order_summ");
						} else if(record.get("level")==0){
							str = "<p>" + record.get("name") + "<p/>" +
							"Адресов: " + record.get("buyer_cnt") + "<br/>"+
							"Накладных: " + record.get("order_cnt") + "<br/>"+
							"На сумму: " + record.get("order_summ");
						}
						
						str="<div style='display: inline-block;'>"+str+"<div/>";
						
						return str;
					}
				}
			]
		});
        
        this.callParent(arguments);
    }
});
