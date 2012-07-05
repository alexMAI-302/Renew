Ext.define('app.view.mag.magTabs', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.magTabs',
    
    requires: ['app.view.mag.currentPalmSaleOrder.Grid'],
	requires: ['app.view.mag.goods.Grid'],
    
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
			items:
			[
				{
					xtype: 'orderGrid',
					title: 'Текущий заказ'
				},{
					xtype: 'goodsGrid',
					title: 'Товары в наличии'
				},
			]
		});
        
        this.callParent(arguments);
    }
});