Ext.define('app.view.JointPartner.ItemGrid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.jointPartnerItemGrid',
	
	config: {
		suffix: 'TP',
		disabled: true,
		disableSave: false,
		disableAdd: false,
		disableDelete: true,
		disableDeleteColumn: true,
		disableAddColumn: false,
		autoScroll: true,
		title: 'Торговые предстваители',
		store: 'JointPartner.TP',
		columns:  [
			{
				width: 200,
				header: 'Подразделение',
				dataIndex: 'id'
			}
		]
	}
});