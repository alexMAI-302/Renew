//проба
Ext.define('app.view.movementDiff.diffs.Filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.diffsFilter',
	
	cls: 'diffsFilter',
	
	layout: {
		type: 'table',
		columns: 3,
		rows:2
	},
	items: [{
		id: 'startDate',
		xtype: 'datefield',
		name: 'startDate',
		fieldLabel: 'Начало периода',
		format: 'd.m.Y',
		altFormat: 'd/m/Y|d m Y',
		startDay: 1,
		value: Ext.Date.add(new Date(Ext.Date.now()), Ext.Date.DAY, -3),
		width: 300
	},{
		id: 'endDate',
		xtype: 'datefield',
		name: 'endDate',
		fieldLabel: 'Конец периода',
		format: 'd.m.Y',
		altFormat: 'd/m/Y|d m Y',
		startDay: 1,
		value: new Date(Ext.Date.now()),
		width: 300
	},
	{
		xtype	: 'button',
		text    : 'Фильтр',
		id		: 'filterDiff',
		rowspan	: 2
	},
	{
		id: 'siteFrom',
		xtype: 'combobox',
		queryMode: 'local',
		displayField: 'name',
		valueField: 'id',
		name: 'siteFrom',
		fieldLabel: 'Площадка отправителя',
		width: 300,
		labelWidth: 150
	},
	{
		id: 'siteTo',
		xtype: 'combobox',
		queryMode: 'local',
		displayField: 'name',
		valueField: 'id',
		name: 'siteTo',
		fieldLabel: 'Площадка получателя',
		width: 300,
		labelWidth: 150
	}]
});