Ext.define('app.view.Fias.Container', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.fiasPanel',

	requires : ['app.view.Fias.Detail', 'app.view.Fias.PlaceunloadGrid'],
	renderTo : 'fias_js',
	width : '100%',
	height : Ext.getBody().getViewSize().height - 120,

	layout : {
		type : 'border'
	},
	items : [{
		region : 'north',
		xtype : 'panel',
		height: 32,
		items : [{

			xtype : 'combobox',
			fieldLabel : 'Группа партнеров',
			id : 'partnersgroupsCombo',
			labelAlign : 'left',
			displayField : 'name',
			valueField : 'id',
			editable : true,
			allowBlank : false,
			queryMode : 'remote',
			labelWidth : 110,
			width : 450,
			margin : {
				top : 5,
				right : 5,
				bottom : 5,
				left : 5
			}
		}]
	}, {
		region : 'center',
		xtype : 'panel',
		layout : 'border',
		items : [{
			region : 'center',
			xtype : 'panel',
			width : 100,
			title : 'Точки отгрузки',
			items : [{
				xtype : 'placeunloadGrid',
				width : Ext.getBody().getViewSize().width - 497,
				height : Ext.getBody().getViewSize().height - 182

			}]
		}, {
			region : 'east',
			xtype : 'panel',
			width : 490,
			title : 'ФИАС',
			items : [{
				xtype : 'panel',
				region : 'north',
				collapsible : true,
				height : 60,
				items : [{
					xtype : 'combobox',
					fieldLabel : '',
					id : 'fiasCombo',
					labelAlign : 'left',
					displayField : 'name',
					valueField : 'id',
					editable : true,
					allowBlank : false,
					width : 480,
					emptyText : 'Кронштадтский бульвар 18',
					margin : '5 5 5 5'
				}]
			}, {
				xtype : 'panel',
				region : 'center',
				items : [{
					title : 'Детали адреса',
					xtype : 'fiasDetail'
				}, {
					xtype : 'button',
					id : 'saveFias',
					text : 'Сохранить ФИАС',
					disabled : true
				}]
			}]

		}]

	}]
});

