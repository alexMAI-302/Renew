Ext.define('app.view.Lib.Grid.column.ComboColumn', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.combocolumn',
	
	constructor: function(config){
		var me=this;
		
		me.callParent(arguments);
		
		me.store = Ext.data.StoreManager.lookup(config.store);
		
		function renderer(value){
			var matching = null,
				data=me.store.snapshot || me.store.data;
			data.each(function(record){
				if(record.get('id')==value){
					matching=record.get('name');
				}
				return matching==null;
			});
			return matching;
		};
		
		me.renderer = renderer;
		
		if(!config.onlyRenderer){
			me.field = Ext.create('Ext.form.ComboBox', {
				store: me.store,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				value: "",
				autoSelect: (config.allowNull!==true),
				listeners: {
					beforequery: function(queryEvent, eOpts){
						queryEvent.forceAll=true;
						return true;
					}
				}
			});
		}
		
		me.doSort = function(state){
			me.up('tablepanel').store.sort({
				property: me.dataIndex,
				transform: renderer,
				direction: state
			});
			return true;
		};
	}
	
});