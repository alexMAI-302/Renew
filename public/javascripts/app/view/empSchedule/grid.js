Ext.define('app.view.empSchedule.grid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.empScheduleGrid',
	
	requires: [
		'app.view.Lib.DateIntervalFilter'
	],
	
	config: {
		suffix: 'EmpSchedule',
		disableDeleteColumn: true,
		title: 'Графики сотрудников',
		beforeButtons: [
			{
				xtype: 'dateIntervalFilter',
				suffix: 'Filter',
				shiftBegin: -30,
				shiftEnd: 30,
				filterButton: true,
				filterItems: [
					{
						id: 'deptCombo',
						xtype: 'combobox',
						//queryMode: 'local',
						displayField: 'name',
						valueField: 'id',
						name: 'deptCombo',
						fieldLabel: 'Отдел',
						width: 300,
						labelWidth: 50
					},
					{
						id: 'personCombo',
						xtype: 'combobox',
						queryMode: 'local',
						displayField: 'name',
						valueField: 'id',
						name: 'personCombo',
						fieldLabel: 'Сотрудник',
						width: 300,
						labelWidth: 75
					}
				]
			}
		],
		columns: [
			{
				header: 'Уникальный идентификатор',
				dataIndex: 'id',
				hidden: true,
				disabled: true
			},
			{
				width: 300,
				header: 'Отдел',
				dataIndex: 'dept_name'
			},
			{
				width: 200,
				header: 'Сотрудник',
				dataIndex: 'person_id'
			},
			{
				xtype: 'datecolumn',
				width: 85,
				header: 'Начало',
				dataIndex: 'ddateb',
				format: 'd.m.Y',
				field: {
					xtype: 'datefield'
				}
			},
			{
				xtype: 'datecolumn',
				width: 85,
				header: 'Конец',
				dataIndex: 'ddatee',
				format: 'd.m.Y',
				field: {
					xtype: 'datefield'
				}
			},
			{
				width: 100,
				header: 'График',
				dataIndex: 'schedule_type_id'
			},
			{
				width: 100,
				header: 'Приоритет',
				dataIndex: 'priority',
				field:{
					xtype: 'numberfield'
				}
					
			},
			{
				xtype: 'datecolumn',
				width: 85,
				header: 'Приход',
				dataIndex: 'time_start',
				format: 'H:i',
				field: {
					xtype: 'timefield',
					format: 'H:i',
					minValue: '6:00 AM'
				}
			},
			{
				xtype: 'datecolumn',
				width: 85,
				header: 'Уход',
				dataIndex: 'time_end',
				format: 'H:i',
				field: {
					xtype: 'timefield',
					format: 'H:i',
					minValue: '6:00 AM'
				}
			},
			{
				width: 100,
				header: 'Норма, мин.',
				dataIndex: 'min_worktime',
				field:{
					xtype: 'numberfield'
				}
					
			},
			{
				width: 200,
				header: 'Руководитель',
				dataIndex: 'manager'
			}
		],
		plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1,
				 pluginId: 'cellEditingEmpSchedule'
			})]

	}
});