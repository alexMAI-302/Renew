Ext.define('app.view.placeunloadSchedule.Container', {
    extend: 'app.view.Lib.Grid.Panel',
	
	resizable: true,
	renderTo: 'placeunload_schedule_js',
	height: Ext.getBody().getViewSize().height - 120,
	
	config: {
		suffix: 'Schedules',
		store:'placeunloadSchedule.Schedules', 
		disableAdd: true,
		disableDelete: true,
		disableDeleteColumn: true,
		title: 'График доставок',
		beforeButtons: [
			{
				id: 'salesmansSchedulesFilter',
				xtype: 'combobox',
				fieldLabel: 'Торговый представитель',
				displayField: 'name',
				valueField: 'id',
				allowBlank: false,
				labelWidth: 140,
				width: 380,
				store: 'placeunloadSchedule.Salesmans'
			},
			{
				id: 'ddateSchedulesFilter',
				xtype: 'datefield',
				fieldLabel: 'Конец периода',
				width: 190,
				labelWidth: 90,
				format: 'd.m.Y',
				altFormat: 'd/m/Y|d m Y',
				startDay: 1,
				value: new Date(Ext.Date.now())
			},
			{
				id: 'onlyWithoutSchedule',
				xtype: 'checkbox',
				fieldLabel: 'Точки без графика',
				width: 130,
				labelWidth: 100
			}
		],
		afterButtons: [
			{
				id: 'printSchedules',
				icon: '/ext/examples/ux/grid/gridPrinterCss/printer.png',
				tooltip: 'Распечатать'
			}
		],
		columns: [
			{
				width: 300,
				header: 'Торговая точка',
				dataIndex: 'name'
			},
			{
				width: 300,
				header: 'Адрес',
				dataIndex: 'address'
			},
			{
				width: 80,
				header: 'Понедельник',
				align: 'center',
				dataIndex: 'monday',
				xtype: 'checkcolumn'
			},
			{
				width: 70,
				header: 'Вторник',
				align: 'center',
				dataIndex: 'tuesday',
				xtype: 'checkcolumn'
			},
			{
				width: 70,
				header: 'Среда',
				align: 'center',
				dataIndex: 'wednesday',
				xtype: 'checkcolumn'
			},
			{
				width: 70,
				header: 'Четверг',
				align: 'center',
				dataIndex: 'thursday',
				xtype: 'checkcolumn'
			},
			{
				width: 70,
				header: 'Пятница',
				align: 'center',
				dataIndex: 'friday',
				xtype: 'checkcolumn'
			},
			{
				width: 300,
				header: 'Подразделение (ТП)',
				dataIndex: 'podr',
				renderer: function (value, meta, record) {
					meta.tdAttr = 'data-qtip="' + record.get("podr_tooltip") + '"'; //Всплывающее окно
					return value;
                }
			},
		]
	}
});