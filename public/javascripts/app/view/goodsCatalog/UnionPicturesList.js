Ext.define('app.view.goodsCatalog.UnionPicturesList', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.unionPicturesList',
	
	title: 'Картинки',
	disabled: true,
	id: 'UnionPicturesPanel',
	tbar: [
		{
			id : 'refreshPicture',
			icon : '/ext/resources/themes/images/default/grid/refresh.gif',
			tooltip: 'Обновить'
		},
		{
			id : 'savePicture',
			icon : '/images/save.png',
			tooltip: 'Сохранить'
		},
		{
			id : 'addPicture',
			icon : '/ext/examples/shared/icons/fam/add.gif',
			tooltip: 'Добавить'
		},
		{
			id : 'deletePicture',
			icon : '/ext/examples/shared/icons/fam/delete.gif',
			disabled : true,
			tooltip: 'Удалить'
		}
	],
	autoScroll: true,
	items: [
		{
			id: 'UnionPicturesList',
			xtype: 'dataview',
			store: 'goodsCatalog.Pictures',
			emptyText: 'Нет изображений',
			itemSelector: 'div.picture',
			multiSelect: true,
			autoScroll: true,
			overItemCls: 'picture-hover',
			plugins: [
				Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'name'})
			],
			tpl : Ext.create(
				'Ext.XTemplate',
				'<tpl for=".">',
				'<div class="picture">',
				(!Ext.isIE6 ?
					'<img width="{small_width}" height="{small_height}" src="/goods_catalog/get_union_picture_small/{id}" />' :
					'<div style="width:{small_width}px;height:{small_height}px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'\',sizingMethod=\'scale\')"></div>'),
				'<span class="x-editable">{name}</span>',
				'</div>',
				'</tpl>'),
			listeners: {
				itemdblclick: function(view, record, item, index, e, eOpts){
					window.open("/goods_catalog/get_union_picture_full/" + record.get('id'), '_blank');
				}
			}
		}
	]
}); 