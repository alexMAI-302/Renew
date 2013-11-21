Ext.define('app.view.TermDelivery.MakeAutoCommonSetup.Grid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.terminalsGrid',
    
    config: {
	    suffix: 'Terminals',
	    disableRefresh: true,
		disableDelete: true,
		disableDeleteColumn: true,
		disableAdd: true,
		disableSave: true,
		store: 'TermDelivery.MakeAutoCommonSetup.Terminals',
		columns: [
			{
				width: 250,
				header: 'Наименование',
				dataIndex: 'name',
				tdCls: 'x-wrap_cells'
			},
			{
				width: 50,
				header: 'Код',
				dataIndex: 'code'
			},
			{
				width: 250,
				header: 'Адрес',
				dataIndex: 'address',
				tdCls: 'x-wrap_cells'
			},
			{
				
				header: 'Понедельник',
				columns: [
				{
					header: 'П',
					width: 20,
					align: 'center',
					dataIndex: 'monday',
					xtype: 'checkcolumn',
					tdCls: 'x-nopad_cells'
				},
				{
					xtype: 'datecolumn',
					tdCls: 'x-nopad_cells',
					width: 45,
					header: 'Нач.',
					dataIndex: 'monday_time_begin',
					format: 'H:i',
					id: 'monday_time_begin',
					field: {
						xtype: 'timefield',
						format: 'H:i',
						submitValue: false,
						anchor: '100%',
						validator: function(v){
								return (v.length > 0);
						}
					}
				},
				{
					xtype: 'datecolumn',
					tdCls: 'x-nopad_cells',
					width: 45,
					header: 'Кон.',
					dataIndex: 'monday_time_end',
					format: 'H:i',
					id: 'monday_time_end',
					field: {
						xtype: 'timefield',
						format: 'H:i',
						submitValue: false,
						anchor: '100%',
						validator: function(v){
								return (v.length > 0);
						}
					}
				}
				]
			},
			{
				
				header: 'Вторник',
				columns: [
				{
					header: 'П',
					width: 20,
					align: 'center',
					dataIndex: 'tuesday',
					xtype: 'checkcolumn',
					tdCls: 'x-nopad_cells'
				},
				{
					xtype: 'datecolumn',
					tdCls: 'x-nopad_cells',
					width: 45,
					header: 'Нач.',
					dataIndex: 'tuesday_time_begin',
					format: 'H:i',
					id: 'tuesday_time_begin',
					field: {
						xtype: 'timefield',
						format: 'H:i',
						submitValue: false,
						anchor: '100%',
						validator: function(v){
								return (v.length > 0);
						}
					}
				},
				{
					xtype: 'datecolumn',
					tdCls: 'x-nopad_cells',
					width: 45,
					header: 'Кон.',
					dataIndex: 'tuesday_time_end',
					format: 'H:i',
					id: 'tuesday_time_end',
					field: {
						xtype: 'timefield',
						defalutValue: '09:00',
						format: 'H:i',
						minValue: '6:00',
						submitValue: false,
						anchor: '100%',
						validator: function(v){
								return (v.length > 0);
						}
					}
				}
				]
			},
			{
				
				header: 'Среда',
				columns: [
				{
					header: 'П',
					width: 20,
					align: 'center',
					dataIndex: 'wednesday',
					xtype: 'checkcolumn',
					tdCls: 'x-nopad_cells'
				},
				{
					xtype: 'datecolumn',
					tdCls: 'x-nopad_cells',
					width: 45,
					header: 'Нач.',
					dataIndex: 'wednesday_time_begin',
					format: 'H:i',
					id: 'wednesday_time_begin',
					field: {
						xtype: 'timefield',
						format: 'H:i',
						submitValue: false,
						anchor: '100%',
						validator: function(v){
								return (v.length > 0);
						}
					}
				},
				{
					xtype: 'datecolumn',
					tdCls: 'x-nopad_cells',
					width: 45,
					header: 'Кон.',
					dataIndex: 'wednesday_time_end',
					format: 'H:i',
					id: 'wednesday_time_end',
					field: {
						xtype: 'timefield',
						defalutValue: '09:00',
						format: 'H:i',
						minValue: '6:00',
						submitValue: false,
						anchor: '100%',
						validator: function(v){
								return (v.length > 0);
						}
					}
				}
				]
			},
			{
				header: 'Четверг',
				columns: [
				{
					header: 'П',
					width: 20,
					align: 'center',
					dataIndex: 'thursday',
					xtype: 'checkcolumn',
					tdCls: 'x-nopad_cells'
				},
				{
					xtype: 'datecolumn',
					tdCls: 'x-nopad_cells',
					width: 45,
					header: 'Нач.',
					dataIndex: 'thursday_time_begin',
					format: 'H:i',
					id: 'thursday_time_begin',
					field: {
						xtype: 'timefield',
						format: 'H:i',
						submitValue: false,
						anchor: '100%',
						validator: function(v){
								return (v.length > 0);
						}
					}
				},
				{
					xtype: 'datecolumn',
					tdCls: 'x-nopad_cells',
					width: 45,
					header: 'Кон.',
					dataIndex: 'thursday_time_end',
					format: 'H:i',
					id: 'thursday_time_end',
					field: {
						xtype: 'timefield',
						defalutValue: '09:00',
						format: 'H:i',
						minValue: '6:00',
						submitValue: false,
						anchor: '100%',
						validator: function(v){
								return (v.length > 0);
						}
					}
				}
				]
			},
			{
				header: 'Пятница',
				columns: [
				{
					header: 'П',
					width: 20,
					align: 'center',
					dataIndex: 'friday',
					xtype: 'checkcolumn',
					tdCls: 'x-nopad_cells'
				},
				{
					xtype: 'datecolumn',
					tdCls: 'x-nopad_cells',
					width: 45,
					header: 'Нач.',
					dataIndex: 'friday_time_begin',
					format: 'H:i',
					id: 'friday_time_begin',
					field: {
						xtype: 'timefield',
						format: 'H:i',
						submitValue: false,
						anchor: '100%',
						validator: function(v){
								return (v.length > 0);
						}
					}
				},
				{
					xtype: 'datecolumn',
					tdCls: 'x-nopad_cells',
					width: 45,
					header: 'Кон.',
					dataIndex: 'friday_time_end',
					format: 'H:i',
					id: 'friday_time_end',
					field: {
						xtype: 'timefield',
						defalutValue: '09:00',
						format: 'H:i',
						minValue: '6:00',
						submitValue: false,
						anchor: '100%',
						validator: function(v){
								return (v.length > 0);
						}
					}
				}
				]
			},
			{
				header: 'Суббота',
				columns: [
				{
					header: 'П',
					width: 20,
					align: 'center',
					dataIndex: 'saturday',
					xtype: 'checkcolumn',
					tdCls: 'x-nopad_cells'
				},
				{
					xtype: 'datecolumn',
					tdCls: 'x-nopad_cells',
					width: 45,
					header: 'Нач.',
					dataIndex: 'saturday_time_begin',
					format: 'H:i',
					id: 'saturday_time_begin',
					field: {
						xtype: 'timefield',
						format: 'H:i',
						submitValue: false,
						anchor: '100%',
						validator: function(v){
								return (v.length > 0);
						}
					}
				},
				{
					xtype: 'datecolumn',
					tdCls: 'x-nopad_cells',
					width: 45,
					header: 'Кон.',
					dataIndex: 'saturday_time_end',
					format: 'H:i',
					id: 'saturday_time_end',
					field: {
						xtype: 'timefield',
						defalutValue: '09:00',
						format: 'H:i',
						minValue: '6:00',
						submitValue: false,
						anchor: '100%',
						validator: function(v){
								return (v.length > 0);
						}
					}
				}
				]
			},
			{
				header: 'Воскресение',
				columns: [
				{
					header: 'П',
					width: 20,
					align: 'center',
					dataIndex: 'sunday',
					xtype: 'checkcolumn',
					tdCls: 'x-nopad_cells'
				},
				{
					xtype: 'datecolumn',
					tdCls: 'x-nopad_cells',
					width: 45,
					header: 'Нач.',
					dataIndex: 'sunday_time_begin',
					format: 'H:i',
					id: 'sunday_time_begin',
					field: {
						xtype: 'timefield',
						format: 'H:i',
						submitValue: false,
						anchor: '100%',
						validator: function(v){
								return (v.length > 0);
						}
					}
				},
				{
					xtype: 'datecolumn',
					tdCls: 'x-nopad_cells',
					width: 45,
					header: 'Кон.',
					dataIndex: 'sunday_time_end',
					format: 'H:i',
					id: 'sunday_time_end',
					field: {
						xtype: 'timefield',
						defalutValue: '09:00',
						format: 'H:i',
						minValue: '6:00',
						submitValue: false,
						anchor: '100%',
						validator: function(v){
								return (v.length > 0);
						}
					}
				}
				]
			},
			{
				width: 70,
				header: 'Исключить из маршрута',
				align: 'center',
				dataIndex: 'exclude',
				xtype: 'checkcolumn'
			},
			{
				width: 150,
				header: 'Инфо для инкассаторов',
				dataIndex: 'info',
				editor: {
					xtyte: 'textfield',
				}
			}
		]
    }
});
