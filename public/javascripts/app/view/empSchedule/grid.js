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
		autoScroll: true,
		height: 500,
		beforeButtons: [
			{
				xtype: 'dateIntervalFilter',
				suffix: 'Filter',
				shiftBegin: -30,
				shiftEnd: 30,
				filterButton: true,
				layout: {
					type : 'table',
					columns: 4
				},
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
					},
					{
						id: 'managerCombo',
						xtype: 'combobox',
						queryMode: 'local',
						displayField: 'name',
						valueField: 'id',
						name: 'managerCombo',
						fieldLabel: 'Руководитель',
						width: 300,
						labelWidth: 75,
						colspan : 3
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
				width: 200,
				header: 'Отдел',
				dataIndex: 'dept_name'
			},
			{
				width: 150,
				header: 'Сотрудник',
				dataIndex: 'person_id'
			},
			{
				xtype: 'datecolumn',
				width: 85,
				header: 'Начало',
				dataIndex: 'ddateb',
				name: 'ddateb',
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
				name: 'ddatee',
				format: 'd.m.Y',
				field: {
					xtype: 'datefield'
				}
			},
			{
				width: 75,
				header: 'График',
				dataIndex: 'schedule_type_id'
			},
			{
				width: 100,
				header: 'Приоритет',
				dataIndex: 'priority',
				hidden: true,
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
				//valueField: 'time_start',
				id: 'time_start',
				field: {
					xtype: 'timefield',
					defalutValue: '09:00',
					//valueField: 'time_start',
					name: 'time_start',
					format: 'H:i',
					minValue: '6:00',
					submitValue: false,
					anchor: '100%',
					validator: function(v){
							return (v.length > 0);
					}
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
					defalutValue: '18:00',
					name: 'time_end',
					format: 'H:i',
					minValue: '6:00',
					submitValue: false,
					anchor: '100%',
					validator: function(v){
							return (v.length > 0);
					}
				}
			},
			{
				width: 100,
				header: 'Норма, мин.',
				dataIndex: 'min_worktime',
				hidden: true,
				field:{
					xtype: 'numberfield'
				}
					
			},
			{
				width: 150,
				header: 'Руководитель',
				dataIndex: 'manager'
			},
			{
				width: 100,
				header: 'Прчина изм.',
				dataIndex: 'reason'
			}
		]/*,
		plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1,
				 pluginId: 'cellEditingEmpSchedule'
			})]*/

	}
});