Ext.define('app.view.RequestBudgets.Filter', {
    extend: 'Ext.container.Container',
	alias: 'widget.filterRequestBudgets',
  
    layout: {
		type: 'hbox'
	},
	
	defaults: {
		style: {
			margin: '5px'
		}
	},
	items: 
	[
				{
				id: 'filterRequestBudgetsPerson',
				xtype: 'combobox',
				fieldLabel: 'Сотрудник',
				valueField: 'id',
				displayField: 'name',
				queryMode: 'local',
				allowNull: true,
				width: 250,
				labelWidth: 70,
				store: 'RequestBudgets.Person'
			},
			{
				id: 'filterRequestBudgetsDept',
				xtype: 'combobox',
				fieldLabel: 'Отдел',
				valueField: 'id',
				displayField: 'name',
				queryMode: 'local',
				allowNull: true,
				width: 250,
				labelWidth: 70,
				store: 'RequestBudgets.Dept'
			},
			{
				id: 'filterRequestBudgetsCatManager',
				xtype: 'combobox',
				fieldLabel: 'КМ',
				valueField: 'id',
				displayField: 'name',
				queryMode: 'local',
				allowNull: true,
				width: 250,
				labelWidth: 70,
				store: 'RequestBudgets.CatManager'
			}


			
	]
});
