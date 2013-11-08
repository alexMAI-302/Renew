Ext.define('app.view.JointPartner.Grid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.jointPartnerGrid',
	//requires: 'app.view.Lib.Grid.column.ComboColumn',
	
	config: {
		store: 'JointParner.Partner',
		suffix: 'Partner',
		title: 'Партнёры',
		store: 'JointPartner.Partner',
		disableSave: true,
		disableRefresh: false,
		disableAdd: true,
		disableDelete: true,
		disableDeleteColumn: true,
		disableAddColumn: true,
		beforeButtons: [
			{
				id: 'filterName',
				xtype: 'textfield',
				fieldLabel: 'Название',
				labelWidth : 300,
				labelAlign : 'left',
				width: 200,
				labelWidth: 40
			},
			{
				id: 'filterInn',
				xtype: 'textfield',
				fieldLabel: 'ИНН',
				width: 200,
				labelWidth: 40
			}
				
		],
		columns: [
			{
				width: 200,
				header: 'Партнёр',
				dataIndex: 'name'
			},
			{
				width: 200,
				header: 'ИНН',
				dataIndex: 'inn'
			}
		],
		 addcol: function() {
		   var newColumn = Ext.create('Ext.grid.column.Column', {
		   header: 'new1',
		   dataIndex: 'newdata',
		   });
		   this.headerCt.insert(this.columns.length, eColumn);
		   this.getView().refresh();
		 }
	}
});