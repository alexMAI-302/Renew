Ext.define('app.view.mag.magTabs', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.magTabs',
    
    requires: [
		'app.view.mag.currentPalmSaleOrder.Grid',
		'app.view.mag.goods.Grid',
		'app.view.mag.palmSaleOrders.container'
	],
    
    activeTab: 0,
    margins: '5 5 5 5',
    
    cls: 'preview',
	
	height: 500,
	plain: true,
	defaults :{
		autoScroll: true
	},
	
	listeners: {
		'tabchange' : function(tabPanel, newCard, oldCard, options){
			newCard.doLayout();
		}
	},
    
    initComponent: function() {
        Ext.apply(this, {
			activeItem: 0,
			activeTab: 0,
			items:
			[
				{
					xtype: 'orderGrid',
					title: 'Текущий заказ'
				},{
					xtype: 'ordersContainer',
					title: 'Оформленные заказы'
				},
				{
					xtype: 'goodsGrid',
					title: 'Товары в наличии'
				}
			]
		});
        
        this.callParent(arguments);
    }
});