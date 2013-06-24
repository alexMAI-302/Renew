Ext.define('app.view.renewUser.RenewUsersGroups', {
	extend: 'app.view.BasePanel',
	
	uses: [
		'Ext.data.Store',
		'Ext.form.ComboBox' ,
		'Ext.util.Sorter'	   
    ],
	
	models: ['app.model.renewUser.RenewGroup'],

	itemId: 'detailPanelId',
	height: 400,

	dropDownEditor: undefined,
	sorterName: undefined,

	plugins: [
		Ext.create('Ext.grid.plugin.CellEditing', {
			pluginId: 'cellEditing',
			clicksToEdit: 1
		})
	],


	constructor: function(config) {
		var store = Ext.create('Ext.data.Store', {
			storeId: 'dropDownStore',
			model: 'app.model.renewUser.RenewGroup',
			autoLoad: true
		});
		
	
		this.dropDownEditor = Ext.create('Ext.form.ComboBox', {
			store: store,
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			queryMode: 'local'
		});
		
		//Объект используется для сортировки: 1. по нажатию на заголовок колонки, 2. для первоначальной сортировки (см. контроллер)
		//Передадим в Sorter созданные ранее Store, что бы по renew_user_group_id определять название группы
		//Поскольлу, по renew_user_group_id мы определяем название группы, то этот же объект можно использовать в функции renserer
		this.sorterName = Ext.create('Ext.util.Sorter',{
			store: store,
		
			root: 'data',
			property: 'renew_user_group_id',
			transform: function(value) {
				var matching = store.queryBy(
					function(record, id){
						return record.get('id') == value;
					}
				);

				return (matching.items[0]) ? matching.items[0].data.name : '';
			}
		});

		this.columns[1].editor = this.dropDownEditor;
		this.callParent(arguments);
	},

	columns: [{
		dataIndex: 'renew_user_id',
		text: 'Пользователь',
		hidden: true,
		disabled: true
	}, {
		dataIndex: 'renew_user_group_id',
		text: 'Название',
		width: 255,
		sortable: true,
		hideable: false,

		doSort: function(state) {
			var panel = this.up('tablepanel'),
			    ds = panel.store;
			
			panel.sorterName.setDirection(state);
			ds.sort(panel.sorterName);
		},

		renderer: function(value){
			return this.sorterName.transform(value)
		}
	}, {
		dataIndex: 'id',
		text: 'Идунтификатор',
		hidden: true,
		disabled: true
	}]
});