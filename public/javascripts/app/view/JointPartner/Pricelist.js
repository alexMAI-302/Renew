Ext.define('app.view.JointPartner.Pricelist', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.jointPartnerPricelist',
	requires: [
		'app.view.Lib.Grid.Panel'
	],

	config: {
		store: 'JointPartner.Pricelist',
		suffix: 'Pricelist',
		title: 'Прайслисты',
		disableSave: false,
		disableRefresh: false,
		disableAdd: true,
		disableDelete: true,
		disableDeleteColumn: true,
		disableAddColumn: true,
		columns: [
			{
				hidden: true,
				dataIndex: 'id'
			},
			{
				hidden: true,
				dataIndex: 'podr'
			},
			{
				hidden: true,
				dataIndex: 'placeunload'
			},
			{
				width: 200,
				header: 'Набор',
				dataIndex: 'name'
			},
			{
				width: 200,
				header: 'Прайслист',
				dataIndex: 'pricelist'
			}
		]
	}
});