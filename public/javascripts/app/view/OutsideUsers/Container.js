Ext.define('app.view.OutsideUsers.Container', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.outsideUsersContainer',
	
	title: 'Внешние пользователи',
	
	renderTo: 'outside_users_js',
	
	config:{
		suffix: 'OutsideUsers',
		disableAdd: true,
		disableDelete: true,
		columns : [
			{
				width : 150,
				header : 'Пользователь renew',
				dataIndex : 'renew_user_id'
			},
			{
				width : 60,
				header : 'system_id',
				dataIndex : 'system_id'
			},
			{
				width : 150,
				header : 'Почта',
				dataIndex : 'email'
			},
			{
				width : 450,
				header : 'Информация о пользователе в виде XML',
				dataIndex : 'account_info'
			}
		]
	}
});