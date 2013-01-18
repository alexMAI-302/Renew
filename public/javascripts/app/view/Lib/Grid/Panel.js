Ext.define('app.view.Lib.Grid.Panel', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.simpleGrid',

	/**
	 * Creates the Proxy
	 * @param {Object} config Config object.
	 * suffix - специальное имя для компонента. используется при построении идентификатора объектов
	 * disable* - не использовать данную кнопку
	 * extraButtons - дополнительные кнопки для панели
	 * disableEditing - таблица нередактируемая. По умолчанию используется редактирование ячеек
	 * disableDeleteColumn - не добавлять колонку удаления позиций. По умолчанию добавляется
	 */
	constructor : function(config) {
		config = config || {};
		config.columns = config.columns || [];
		
		var buttons = [];
		if(config.disableRefresh!==true){
			buttons.push(
				{
					id : 'refresh'+config.suffix,
					icon : '/ext/examples/shared/icons/fam/table_refresh.png'
				}
			);
		}
		if(config.disableSave!==true){
			buttons.push(
				{
					id : 'save'+config.suffix,
					icon : '/images/save.png'
				}
			);
		}
		if(config.disableAdd!==true){
			buttons.push(
				{
					id : 'add'+config.suffix,
					icon : '/ext/examples/shared/icons/fam/add.gif'
				}
			);
		}
		if(config.disableDelete!==true){
			buttons.push(
				{
					id : 'delete'+config.suffix,
					icon : '/ext/examples/shared/icons/fam/delete.gif',
					disabled : true
				}
			);
		}
		
		if(config.extraButtons!=null){
			for(var i=0; i<config.extraButtons.length; i++){
				buttons.push(extraButtons);
			}
		}
		
		config.dockedItems = [{
			xtype: 'toolbar',
			dock: config.buttonsDock || 'top',
			items: buttons
		}];
		
		config.viewConfig = config.viewConfig || {
			enableTextSelection : true
		};
		
		if(config.disableEditing!==true){
			config.plugins = config.plugins || [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				pluginId : 'cellEditing'+config.suffix
			})];
		}
		
		config.id = config.suffix+'Table';
		
		if(config.disableDeleteColumn!==true){
			config.columns.push({
				xtype:'actioncolumn',
				width:20,
				icon: '/ext/examples/shared/icons/fam/cross.gif',
				handler: function(grid, rowIndex){
					grid.store.removeAt(rowIndex);
				}
			});
		}

		Ext.apply(this, config);

		this.callParent(arguments);
	}
});
