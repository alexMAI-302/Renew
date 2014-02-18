Ext.define('app.view.TermDelivery.MonitorTabs.MonitorTab.ItemsGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.terminalsGrid',
	
	requires: [
		'app.view.Lib.Grid.column.ComboColumn'
	],
	
	cls: 'terminals-grid',
    
    id: 'terminalsTable',
    store: 'TermDelivery.MonitorTabs.MonitorTab.Terminals',
	columns: [
		{
			xtype: 'rownumberer'
		},
		{
			align: 'center',
			xtype: 'checkcolumn',
			dataIndex: 'should_include_in_route',
			id: 'includeInRoute',
			width: 25,
			sortable: false,
			hideable: false,
			menuDisabled: true,
			draggable: false
		},
		{
			width: 75,
			header: 'Term. Id',
			dataIndex: 'info_terminal_id'
		},
		{
			width: 250,
			header: 'Имя терминала',
			dataIndex: 'name',
			tdCls: 'x-wrap_cells'
		},
		{
			width: 70,
			header: 'Последний<br/>сигнал',
			dataIndex: 'last_connect_time',
			renderer: function(value, metaData, record){
				metaData.tdCls += record.get('last_connect_time_class');
				return (value)?Ext.Date.format(value, 'd.m.Y H:i'):'';
			},
			tdCls: 'x-wrap_cells'
		},
		{
			width: 70,
			header: 'Последний<br/>платеж',
			dataIndex: 'last_payment_time',
			renderer: function(value, metaData, record){
				metaData.tdCls += record.get('last_payment_time_class');
				return (value)?Ext.Date.format(value, 'd.m.Y H:i'):'';
			},
			tdCls: 'x-wrap_cells'
		},
		{
			width: 70,
			header: 'Кол-во<br/>денег<br/>в терминале',
			dataIndex: 'summ'
		},
		{
			width: 70,
			header: 'Кол-во<br/>купюр<br/>в терминале',
			dataIndex: 'cnt'
		},
		{
			width: 55,
			header: 'Уровень<br/>сигнала',
			dataIndex: 'signal_level'
		},
		{
			width: 180,
			header: 'Состояние',
			dataIndex: 'error_text',
			tdCls: 'x-wrap_cells'
		},
		{
			width: 70,
			header: 'Причина<br/>включения<br/>в маршрут',
			dataIndex: 'incass_reason',
			tdCls: 'x-wrap_cells'
		},
		{
			width: 70,
			header: 'Система',
			dataIndex: 'src_system_name'
		},
		{
			width: 130,
			header: 'Вид<br/>поломки',
			dataIndex: 'terminal_break_id',
			xtype: 'combocolumn',
			store: 'app.store.TermDelivery.MonitorTabs.MonitorTab.TerminalBreaks'
		},
		{
			width: 80,
			header: 'Комментарий<br/>ОШ',
			dataIndex: 'techinfo',
			field: {
				xtype: 'textfield'
			}
		},
		{
			align: 'center',
			xtype: 'checkcolumn',
			dataIndex: 'serv_status',
			header: 'Сделано',
			width: 50
		},
		{
			align: 'center',
			xtype: 'checkcolumn',
			dataIndex: 'penalty_status',
			header: 'ОШ',
			width: 30
		}
	],
	tbar: [
		{
			text: 'Сформировать доставки',
			id: 'makeDelivery'
		},
		{
			id: 'refreshTerminals',
			icon: '/ext/examples/shared/icons/fam/table_refresh.png',
			text: 'Обновить информацию о терминалах'
		}
	],
	height: 400,
	viewConfig: {
		enableTextSelection: true,
		getRowClass: function(record, rowIndex, rowParams, store){
			return record.get('row_class');
		}
	},
	plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit: 1,
		pluginId: 'cellEditingTerminal'
	})],
	checkIncludeInRoute: true
});