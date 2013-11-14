Ext.define('app.view.EmpDutyroster.Container', {
    extend: 'app.view.Lib.Grid.Panel',

	requires: [
		'app.view.Lib.Grid.column.ComboColumn',
		'app.view.Lib.DateIntervalFilter'
	],

	title: 'График дежурств',
	
	renderTo: 'emp_dutyroster_js',
	
	config:{
		suffix: 'EmpDutyroster',
		store: 'EmpDutyroster.EmpDutyroster',
		disableDelete: true,
		disableRefresh: true,
		beforeButtons: [
			{
				xtype: 'dateIntervalFilter',
				suffix: 'EmpDutyroster',
				beginDate: Ext.Date.format(Ext.Date.getFirstDateOfMonth (new Date()), 'Y.m.d'),
				endDate: Ext.Date.format(Ext.Date.getLastDateOfMonth (new Date()), 'Y.m.d'),
				filterbutton: false,
				filterItems: [
					{
						id: 'dutytypeCombo',
						xtype: 'combobox',
						displayField: 'name',
						valueField: 'id',
						name: 'dutytypeCombo',
						fieldLabel: 'Тип дежурства',
						width: 300,
						labelWidth: 100
					}]
			},
				
		],
		columns : [
			{
				width : 150,
				header : 'Сотрудник',
				dataIndex : 'person_id',
				xtype: 'combocolumn',
				store: 'app.store.EmpDutyroster.Person'
			},
			{
				xtype: 'datecolumn',
				width: 100,
				header: 'дата начала',
				dataIndex: 'ddateb',
				name: 'ddateb',
				format: 'd.m.Y',
				field: {
					xtype: 'datefield'
				}
			},
			
			{
				xtype: 'datecolumn',
				width: 100,
				header: 'дата конца',
				dataIndex: 'ddatee',
				name: 'ddatee',
				format: 'd.m.Y',
				field: {
					xtype: 'datefield'
				}
			},
			{
				width : 200,
				header : 'тип дежурства',
				dataIndex : 'dutytype',
				xtype: 'combocolumn',
				store: 'app.store.EmpDutyroster.EmpDutytype'
			},
			
		]
	}
});