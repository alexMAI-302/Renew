Ext.define('app.controller.empSchedule', {
    extend: 'Ext.app.Controller',
	stores: [
		'empSchedule.dept',
		'empSchedule.person',
		'empSchedule.personAll',
		'empSchedule.manager',
		'empSchedule.managerFilter',
		'empSchedule.scheduleType',
		'empSchedule.empSchedule'],
	models: [
		'app.model.valueModel',
		'app.model.valueStrModel',
		'app.model.empSchedule.personModel',
		'app.model.empSchedule.empScheduleModel'],
	requires: [
		'app.view.empSchedule.container'
	],
	
	deptStore:null,
	personStore:null,	
	personAllStore:null,
	managerStore:null,
	managerFilterStore:null,
	empScheduleStore:null,
	scheduleTypeStore:null,
	mainContainer: null,
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	refreshEmpSchedule: function(){
		var controller = this;
		if (Ext.getCmp('ddatebFilter').getValue()==null)
		{
			Ext.Msg.alert('Ошибка', 'Необходимо задать начальную дату');
			return;
		};
		
		if (Ext.getCmp('ddateeFilter').getValue()==null)
		{
			Ext.Msg.alert('Ошибка', 'Необходимо задать конечную дату дату');
			return;
		};


		controller.empScheduleStore.proxy.extraParams={
			dept_id: Ext.getCmp('deptComboFilter').getValue(),
			person_id: Ext.getCmp('personComboFilter').getValue(),
			ddateb:		Ext.Date.format(Ext.getCmp('ddatebFilter').getValue(), 'Y-m-d'),
			ddatee:		Ext.Date.format(Ext.getCmp('ddateeFilter').getValue(), 'Y-m-d'),
			manager: 	Ext.getCmp('managerComboFilter').getValue()
		};
		controller.mainContainer.setLoading(true);
		controller.empScheduleStore.load();
		controller.mainContainer.setLoading(false);
	},
	saveEmpSchedule: function(){
		var controller=this;
		var rows = [];
		controller.mainContainer.setLoading(true);
	
		controller.empScheduleStore.each(function(r){
			if(r.dirty){
				if (r.get('person_id')==null)
				{
					Ext.Msg.alert('Ошибка', 'Необходимо выбрать сотрудника');
					return;
				};
				if (r.get('ddateb')==null)
				{
					Ext.Msg.alert('Ошибка', 'Необходимо задать начальную дату');
					return;
				};
				
				if (r.get('manager')==null)
				{
					Ext.Msg.alert('Ошибка', 'Необходимо выбрать руководителя');
					return;
				};
				
				if (r.get('time_start')==null)
				{
					Ext.Msg.alert('Ошибка', 'Необходимо задать время прихода');
					return;
				};
				
				if (r.get('time_end')==null)
				{
					Ext.Msg.alert('Ошибка', 'Необходимо задать время ухода');
					return;
				};
		
				if (r.get('schedule_type_id')==null)
				{
					Ext.Msg.alert('Ошибка', 'Необходимо выбрать график');
					return;
				};
			
				rows.push({
					oper	: 'update',
					id		: r.get('id'),
					person_id:	r.get('person_id'),
					ddateb:		Ext.Date.format(r.get('ddateb'), 'Y-m-d'),
					ddatee:		Ext.Date.format(r.get('ddatee'), 'Y-m-d'),
					schedule_type_id:		r.get('schedule_type_id'),
					priority:	r.get('priority'),
					time_start: (r.get('time_start')==null)? null:r.get('time_start').getHours()*60+r.get('time_start').getMinutes(),
					time_end: (r.get('time_end')==null)? null:r.get('time_end').getHours()*60+r.get('time_end').getMinutes(),
					min_worktime:		r.get('min_worktime'),
					manager: r.get('manager')
				});
			}
		});	
		
		for(var i=0; i<controller.empScheduleStore.getRemovedRecords().length; i++){
			r=controller.empScheduleStore.getRemovedRecords()[i];
			rows.push({
					oper : 'delete',
					id		: r.get('id'),
					person_id:	r.get('person_id'),
					ddateb:		Ext.Date.format(r.get('ddateb'), 'Y-m-d'),
					ddatee:		Ext.Date.format(r.get('ddatee'), 'Y-m-d'),
					schedule_type_id:		r.get('schedule_type_id'),
					priority:	r.get('priority'),
					time_start: (r.get('time_start')==null)? null:r.get('time_start').getHours()*60+r.get('time_start').getMinutes(),
					time_end: (r.get('time_end')==null)? null:r.get('time_end').getHours()*60+r.get('time_end').getMinutes(),
					min_worktime:		r.get('min_worktime'),
					manager: r.get('manager')
				});
		}
		
		Ext.Ajax.request({
			url: '/emp_schedule/save_doc',
			params: {authenticity_token: window._token},
			jsonData: rows,
			method: 'POST',
			timeout: 300000,
			 success: function(response, opts) {
					if (response.responseText=="ok") 
					{
						//Ext.Msg.alert("Сообщение", "Данные сохранены");
						controller.refreshEmpSchedule();
						controller.mainContainer.setLoading(false);
					}
					else
					{
						Ext.Msg.alert("Ошибка cохранения", response.responseText);
						controller.mainContainer.setLoading(false);
					}
				},
				failure: function(response, options) {
					Ext.Msg.alert("Ошибка", response.responseText);
					controller.mainContainer.setLoading(false);
				}
		});
	},
	
    init: function() {
		var controller = this;
		controller.mainContainer=Ext.create('app.view.empSchedule.container');		
		
		controller.control({
			'#EmpScheduleTable': {
				'selectionchange': function(view, records) {
					var disabled=!records.length;
					Ext.getCmp('deleteEmpSchedule').setDisabled(disabled);
				}
			},
			'#refreshEmpSchedule': {
				click: function() {
					controller.refreshEmpSchedule();
				}
			},
			'#saveEmpSchedule': {
				click: function() {
					controller.saveEmpSchedule();
				}
			},
			'#addEmpSchedule': {
				click: function() {
					var r = Ext.ModelManager.create({
						}, 'app.model.empSchedule.empScheduleModel');
					controller.empScheduleStore.insert(0, r);
					r.set("priority","1");
					r.set("time_start","09:00");
					r.set("time_end","18:00");
					r.set("manager",Ext.getCmp('managerComboFilter').getValue());
				}
			},
			'#deleteEmpSchedule': {
				click: function() {
					var sm = Ext.getCmp('EmpScheduleTable').getSelectionModel();
					controller.empScheduleStore.remove(sm.getSelection());
					if (controller.empScheduleStore.getCount() > 0) {
						sm.select(0);
					} else {
						controller.empScheduleStore.removeAll(true);
					}
				}
			}
		});
			
	},
	
	initTables: function(){
		var controller=this,
			EmpScheduleTable = Ext.getCmp('EmpScheduleTable'),
			personColumn=EmpScheduleTable.columns[2],
			scheduleTypeColumn=EmpScheduleTable.columns[5],
			managerColumn=EmpScheduleTable.columns[10];
		
		controller.makeComboColumn(personColumn, controller.personAllStore, controller.empScheduleStore, 'person_id');
		controller.makeComboColumn(scheduleTypeColumn, controller.scheduleTypeStore, controller.empScheduleStore, 'schedule_type_id');
		controller.makeComboColumn(managerColumn, controller.managerStore, controller.empScheduleStore, 'manager');
		
			
		Ext.getCmp('deptComboFilter').addListener(
			"select",
			function(field, value, options){
				controller.personStore.proxy.extraParams={
					dept_id: value[0].data.id
				};
				controller.mainContainer.setLoading(true);
				controller.personStore.load();
				Ext.getCmp('personComboFilter').value=null
									
				controller.mainContainer.setLoading(false);
			}
		);
		
	},
	initStores: function(){
		var controller=this;
		controller.deptStore=controller.getEmpScheduleDeptStore();
		controller.personStore=controller.getEmpSchedulePersonStore();
		controller.personAllStore=controller.getEmpSchedulePersonAllStore();
		controller.personAllStore.proxy.extraParams={
					dept_id: 0
				};
		controller.personAllStore.load();
		controller.managerStore=controller.getEmpScheduleManagerStore();
		controller.managerStore.proxy.extraParams={
					dept_id: 0
				};
		controller.managerStore.load();
		controller.managerFilterStore=controller.getEmpScheduleManagerFilterStore();

		controller.scheduleTypeStore=controller.getEmpScheduleScheduleTypeStore();
		controller.empScheduleStore=controller.getEmpScheduleEmpScheduleStore();

	},
	bindStores: function(){
		var controller=this;
		Ext.getCmp('deptComboFilter').bindStore(controller.deptStore);
		Ext.getCmp('personComboFilter').bindStore(controller.personStore);
		Ext.getCmp('managerComboFilter').bindStore(controller.managerFilterStore);
		Ext.getCmp('EmpScheduleTable').reconfigure(controller.empScheduleStore);
	},
	onLaunch: function(){
		var controller = this;
		controller.initStores();
		controller.bindStores();
		controller.initTables();
	},
	makeComboColumn: function(column, storeCombo, tableStore, property, allowNull, onlyRenderer){
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
		
		
	}	
});
