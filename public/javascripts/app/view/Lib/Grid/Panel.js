Ext.define('app.view.Lib.Grid.Panel', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.simpleGrid',

	/**
	 * @param {Object} config Config object.
	 * suffix - специальное имя для компонента. используется при построении идентификатора объектов и плагинов
	 * disable* - не использовать данную кнопку или функцию
	 * beforeButtons - дополнительные элементы для панели, располагающиеся перед основными кнопками
	 * afterButtons - дополнительные элементы для панели, располагающиеся после основных кнопок
	 * disableEditing - таблица нередактируемая. По умолчанию используется редактирование ячеек
	 * disableDeleteColumn - не добавлять колонку удаления позиций. По умолчанию добавляется
	 * enableBuffering - использовать плагин для буферизованного вывода записей. когда записей больше 1000, это полезно.
	 * extraPlugins - дополнительные плагины помимо плагинов редактирования и буферизованного вывода.
	 */
	constructor : function(currentConfig) {
		var initConfig = this.getInitialConfig() || {},
			plugins,
			buttons = [],
			i;
		
		currentConfig=currentConfig || {};
		config = {};
		for(i in initConfig){
			config[i]=initConfig[i];
		}
		
		for(i in currentConfig){
			config[i]=currentConfig[i];
		}
		
		plugins = config.plugins || [];
		
		if(config.beforeButtons!=null){
			for(i=0; i<config.beforeButtons.length; i++){
				buttons.push(config.beforeButtons[i]);
			}
		}
		
		if(config.disableRefresh!==true){
			buttons.push(
				{
					id : 'refresh'+config.suffix,
					icon : '/ext/resources/themes/images/default/grid/refresh.gif',
					tooltip: 'Обновить'
				}
			);
		}
		if(config.disableSave!==true){
			buttons.push(
				{
					id : 'save'+config.suffix,
					icon : '/images/save.png',
					tooltip: 'Сохранить'
				}
			);
		}
		if(config.disableAdd!==true){
			buttons.push(
				{
					id : 'add'+config.suffix,
					icon : '/ext/examples/shared/icons/fam/add.gif',
					tooltip: 'Добавить'
				}
			);
		}
		if(config.disableDelete!==true){
			buttons.push(
				{
					id : 'delete'+config.suffix,
					icon : '/ext/examples/shared/icons/fam/delete.gif',
					disabled : true,
					tooltip: 'Удалить'
				}
			);
		}
		
		if(config.afterButtons!=null){
			for(i=0; i<config.afterButtons.length; i++){
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
			var hasEditingPlugin=false,
				hasBufferPlugin=false;
			
			for(i=0; i<plugins.length; i++){
				if(plugins[i].ptype == 'rowediting' || plugins[i].ptype == 'cellediting'){
					hasEditingPlugin=true;
					break;
				}
			}
			if(!hasEditingPlugin){
				plugins.push(
					(config.editing=='row')?
					{
						ptype: 'rowediting',
						clicksToEdit : 2
					}:
					{
						ptype: 'cellediting',
						clicksToEdit : 1
					}
				);
			}
		}
		
		if(config.enableBuffering===true){
			var hasBufferPlugin=false;
			
			for(i=0; i<plugins.length; i++){
				if(plugins[i].ptype == 'bufferedrenderer'){
					hasBufferPlugin=true;
					break;
				}
			}
			if(!hasBufferPlugin){
				plugins.push(
					{
						ptype: 'bufferedrenderer',
						trailingBufferZone: 20,
						leadingBufferZone: 50
					}
				);
			}
		}
		
		if(config.extraPlugins!=null){
			for(i=0; i<config.extraPlugins.length; i++){
				if(
					config.extraPlugins[i].ptype!='rowediting' &&
					config.extraPlugins[i].ptype!='cellediting' &&
					config.extraPlugins[i].ptype!='bufferedrenderer'
				){
					plugins.push(config.extraPlugins[i]);
				}
			}
		}
		
		for(i=0; i<plugins.length; i++){
			if(plugins[i].pluginId==null){
				plugins[i].pluginId = plugins[i].ptype+config.suffix;
			}
		}
		
		config.plugins = plugins;
		
		config.id = config.suffix+'Table';
		
		if(config.disableDeleteColumn!==true){
			config.columns.push({
				xtype:'actioncolumn',
				width:20,
				icon: '/ext/examples/shared/icons/fam/cross.gif',
				tooltip: 'Удалить',
				handler: function(grid, rowIndex){
					grid.store.removeAt(rowIndex);
				}
			});
		}

		Ext.apply(this, config);

		this.callParent(arguments);
	},
	
	makeComboColumn: function(column, storeCombo, allowNull, onlyRenderer){
		function renderer(value){
			var matching = null,
				data=storeCombo.snapshot || storeCombo.data;
			data.each(function(record){
				if(record.get('id')==value){
					matching=record.get('name');
				}
				return matching==null;
			});
			return matching;
		};
		
		if(!onlyRenderer){
			column.field = Ext.create('Ext.form.ComboBox', {
				store: storeCombo,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				value: "",
				autoSelect: (allowNull!==true)
			});
		}
		column.renderer=renderer;
		
		column.doSort = function(state){
			this.store.sort({
				property: column.dataIndex,
				transform: renderer,
				direction: state
			});
			return true;
		};
	}
});
