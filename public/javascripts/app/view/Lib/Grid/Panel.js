Ext.define('app.view.Lib.Grid.Panel', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.simpleGrid',

	/**
	 * Creates the Proxy
	 * @param {Object} config Config object.
	 * suffix - специальное имя для компонента. используется при построении идентификатора объектов
	 * disable* - не использовать данную кнопку
	 * beforeButtons - дополнительные элементы для панели, располагающиеся перед основными кнопками
	 * afterButtons - дополнительные элементы для панели, располагающиеся после основных кнопок
	 * disableEditing - таблица нередактируемая. По умолчанию используется редактирование ячеек
	 * disableDeleteColumn - не добавлять колонку удаления позиций. По умолчанию добавляется
	 */
	constructor : function(currentConfig) {
		var initConfig = this.getInitialConfig() || {};
		currentConfig=currentConfig || {};
		config = {};
		for(var i in initConfig){
			config[i]=initConfig[i];
		}
		
		for(var i in currentConfig){
			config[i]=currentConfig[i];
		}
		
		var buttons = [];
		if(config.beforeButtons!=null){
			for(var i=0; i<config.beforeButtons.length; i++){
				buttons.push(config.beforeButtons[i]);
			}
		}
		
		if(config.disableRefresh!==true){
			buttons.push(
				{
					id : 'refresh'+config.suffix,
					icon : '/ext/resources/themes/images/default/grid/refresh.gif'
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
		
		if(config.afterButtons!=null){
			for(var i=0; i<config.afterButtons.length; i++){
				buttons.push(config.afterButtons[i]);
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
			config.plugins = config.plugins || [
				(config.editing=='row')?
				Ext.create('Ext.grid.plugin.RowEditing', {
					clicksToEdit : 2,
					pluginId : 'rowEditing'+config.suffix
				}):
				Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1,
					pluginId : 'cellEditing'+config.suffix
				})
			];
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
