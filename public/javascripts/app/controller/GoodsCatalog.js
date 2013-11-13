Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
	'Ext.ux.DataView.LabelEditor'
]);
Ext.define('app.controller.GoodsCatalog', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'goodsCatalog.CatGoods',
		'goodsCatalog.UnionGoods',
		'goodsCatalog.CatGoodsInUnion',
		'goodsCatalog.Pictures'
	],
	
	models: [
		'valueModel',
		'goodsCatalog.GoodsModel',
		'goodsCatalog.PictureModel'
	],
	
	views: [
		'goodsCatalog.Container',
		'goodsCatalog.FileWindow'
	],
	
	catGoodsStore: null,
	masterStore: null,
	detailStore: null,
	picturesStore: null,
	
	mainContainer: null,
	fileWindow: null,
	
	haveCatGoodsToAdd: false,
	
	CAT_GOODS_LOAD_ERROR: "Ошибка при получении товаров CAT для товара каталога",
	UNION_PICTURES_LOAD_ERROR: "Ошибка при получении картинок для товара каталога",
	
	loadDetail: function(store, masterId, errorString){
		var controller = this;
		
		
			store.proxy.extraParams={
				master_id: masterId
			};
			store.load(
				function(records, operation, success){
					if(success!==true){
						Ext.Msg.alert("Ошибка", errorString);
					} else {
						if(controller.detailStore==store && controller.haveCatGoodsToAdd){
							controller.haveCatGoodsToAdd = false;
							controller.addCatGoodsToUnion();
						}
					}
				}
			);
		
	},
	
	loadMaster: function(){
		var controller = this;
		
		controller.masterStore.proxy.extraParams = {
			name: Ext.getCmp('UnionGoodsName').getValue()
		};
		controller.masterStore.load(
			function(records, operation, success){
				if(success!==true){
					Ext.Msg.alert("Ошибка", "Ошибка при получении товаров каталога");
				}
			}
		);
	},
	
	loadCatGoods: function(){
		var controller = this;
		
		controller.catGoodsStore.proxy.extraParams = {
			name: Ext.getCmp('CatGoodsName').getValue(),
			show_only_without_picture: Ext.getCmp('CatGoodsShowOnlyWithoutPicture').getValue() ? 1 : 0
		};
		controller.catGoodsStore.load(
			function(records, operation, success){
				if(success!==true){
					Ext.Msg.alert("Ошибка", "Ошибка при получении товаров CAT");
				}
			}
		);
	},
	
	addUnionGoods: function(name){
		var controller = this;
		controller.masterStore.insert(0, {
			name: name
		});
	},
	
	checkCatGoodsButtons: function(selectedUnionGoods, selectedCatGoods){
		var enableCreateUnionOnSelectedCatGoods = (selectedCatGoods!=null && selectedCatGoods.length>0),
			enableAddToUnionSelectedCatGoods = enableCreateUnionOnSelectedCatGoods && (selectedUnionGoods!=null && selectedUnionGoods.length==1);
		
		Ext.getCmp('CreateUnionOnSelectedCatGoods').setDisabled(!enableCreateUnionOnSelectedCatGoods);
		Ext.getCmp('AddToUnionSelectedCatGoods').setDisabled(!enableAddToUnionSelectedCatGoods);
	},
	
	addCatGoodsToUnion: function(){
		var controller = this,
			selectedCatGoods = Ext.getCmp('CatGoodsTable').getSelectionModel().getSelection(),
			i;
		
		controller.detailStore.each(
			function(r){
				for(i=0; i<selectedCatGoods.length; i++){
					if(selectedCatGoods[i].get('id')==r.get('id')){
						selectedCatGoods.splice(i, 1);
						i--;
					}
				}
				return selectedCatGoods!=null;
			}
		);
		
		for(i=0; i<selectedCatGoods.length; i++){
			selectedCatGoods[i] = selectedCatGoods[i].copy();
			selectedCatGoods[i].phantom = true;
		}
		
		controller.detailStore.add(selectedCatGoods);
	},
	
	checkNamesArray: function(selectedNames, unionName){
		for(var i=1; i<selectedNames.length; i++){
			if(selectedNames[i].substr(0, unionName.length)!=unionName){
				return false;
			}
		}
		return true;
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.goodsCatalog.Container');
		controller.fileWindow=Ext.create('app.view.goodsCatalog.FileWindow');
		
		controller.control({
			'#refreshUnionGoods': {
				click: controller.loadMaster
			},
			'#addUnionGoods': {
				click: function(){
					controller.addUnionGoods();
				}
			},
			'#deleteUnionGoods': {
				click: function(){
					var selection = Ext.getCmp('UnionGoodsTable').getSelectionModel().getSelection();
					controller.masterStore.remove(selection);
				}
			},
			'#saveUnionGoods': {
				click: function(){
					controller.masterStore.proxy.extraParams = {};
					controller.masterStore.sync({
						callback: function(batch){
							if(batch.exceptions.length>0){
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							}
						}
					});
				}
			},
			'#refreshCatGoodsInUnion': {
				click: function(){
					controller.loadDetail(
						controller.detailStore,
						Ext.getCmp('UnionGoodsTable').getSelectionModel().getSelection()[0].get('id'),
						controller.CAT_GOODS_LOAD_ERROR
					);
				}
			},
			'#deleteCatGoodsInUnion': {
				click: function(){
					var selection = Ext.getCmp('CatGoodsInUnionTable').getSelectionModel().getSelection();
					controller.detailStore.remove(selection);
				}
			},
			'#saveCatGoodsInUnion': {
				click: function(){
					controller.detailStore.proxy.extraParams = {
						master_id: Ext.getCmp('UnionGoodsTable').getSelectionModel().getSelection()[0].get('id')
					};
					
					controller.detailStore.sync({
						callback: function(batch){
							if(batch.exceptions.length>0){
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							}
						}
					});
				}
			},
			'#refreshCatGoods': {
				click: function(){
					controller.loadCatGoods();
				}
			},
			'#CatGoodsName': {
				keypress: function(field, e, eOpts){
					if(e.getKey()==Ext.EventObject.ENTER){
						controller.loadCatGoods();
						field.focus();
					}
					return true;
				}
			},
			'#UnionGoodsName': {
				keypress: function(field, e, eOpts){
					if(e.getKey()==Ext.EventObject.ENTER){
						controller.loadMaster();
						field.focus();
					}
					return true;
				}
			},
			'#CreateUnionOnSelectedCatGoods': {
				click: function(){
					var selectedCatGoods = Ext.getCmp('CatGoodsTable').getSelectionModel().getSelection(),
						selectedNames = [],
						unionName="",
						i, firstCheck, currentCheck, lengthToCheck,
						r;
					
					for(i=0; i<selectedCatGoods.length; i++){
						selectedNames.push(selectedCatGoods[i].get('name'));
					}
					//здесь предполагаем, что 3/4 длины строки  совпадает
					//если нет, то идем к началу слова. если да, то к концу
					lengthToCheck = selectedNames[0].length*3/4;
					unionName = selectedNames[0].substr(0, lengthToCheck);
					firstCheck = controller.checkNamesArray(selectedNames, unionName);
					do {
						lengthToCheck = lengthToCheck + (firstCheck?1:-1);
						if(lengthToCheck == 0){
							currentCheck = true;
						} else if (lengthToCheck > selectedNames[0].length){
							currentCheck = false;
						} else {
							unionName = selectedNames[0].substr(0, lengthToCheck);
							currentCheck = controller.checkNamesArray(selectedNames, unionName);
						}
					} while (firstCheck&&currentCheck || !firstCheck&&!currentCheck);
					if(lengthToCheck==0 || lengthToCheck > selectedNames[0].length){
						unionName = selectedNames[0];
					} else {
						unionName = selectedNames[0].substr(0, lengthToCheck + (firstCheck?-1:0)).trim();
					}
					r = Ext.ModelManager.create({
						name: unionName
					}, 'app.model.valueModel');
					controller.masterStore.add(r);
					r.setProxy(controller.masterStore.getProxy());
					r.proxy.extraParams = {};
					r.save({
						callback: function(batch){
							if(batch.exceptions!=null && batch.exceptions.length>0){
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							} else {
								controller.haveCatGoodsToAdd = true;
								Ext.getCmp('UnionGoodsTable').getSelectionModel().select(r);
							}
						}
					});
				}
			},
			'#AddToUnionSelectedCatGoods': {
				click: controller.addCatGoodsToUnion
			},
			'#addPicture': {
				click: function(){
					controller.fileWindow.setTitle(
						"Добавление картинки для товара \"" + 
						Ext.getCmp('UnionGoodsTable').getSelectionModel().getSelection()[0].get('name') +
						"\"");
					controller.fileWindow.show();
				}
			},
			'#deletePicture': {
				click: function(){
					var sm = Ext.getCmp('UnionPicturesList').getSelectionModel(),
						selection = sm.getSelection(),
						picturesProxy = controller.picturesStore.getProxy();
						
					sm.deselectAll();
					picturesProxy.extraParams = {
						master_id: Ext.getCmp('UnionGoodsTable').getSelectionModel().getSelection()[0].get('id')
					};
					for(var i=0; i<selection.length; i++){
						selection[i].setProxy(picturesProxy);
						selection[i].destroy();
					}
				}
			},
			'#savePicture': {
				click: function(){
					var r = Ext.getCmp('UnionGoodsTable').getSelectionModel().getSelection()[0],
						id = r.get('id');
					controller.picturesStore.proxy.extraParams = {
						master_id: (id!=null && id!=0) ? id : r.getId()
					};
					controller.picturesStore.sync({
						callback: function(batch){
							if(batch.exceptions.length>0){
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							}
						}
					});
				}
			},
			'#refreshPicture': {
				click: function(){
					controller.loadDetail(
						controller.picturesStore,
						Ext.getCmp('UnionGoodsTable').getSelectionModel().getSelection()[0].get('id'),
						controller.UNION_PICTURES_LOAD_ERROR
					);
				}
			},
			'#UnionGoodsTable': {
				selectionchange: function(sm, selected, eOpts){
					var selectionPresent = (selected!=null && selected.length>0),
						shouldShowDetail = (selected!=null && selected.length==1);
					
					Ext.getCmp('deleteUnionGoods').setDisabled(!selectionPresent);
					Ext.getCmp('CatGoodsInUnionTable').setDisabled(!shouldShowDetail);
					Ext.getCmp('UnionPicturesPanel').setDisabled(!shouldShowDetail);
					
					controller.checkCatGoodsButtons(selected, Ext.getCmp('CatGoodsTable').getSelectionModel().getSelection());
					
					if(shouldShowDetail){
						controller.loadDetail(
							controller.detailStore,
							selected[0].get('id'),
							controller.CAT_GOODS_LOAD_ERROR
						);
						controller.loadDetail(
							controller.picturesStore,
							selected[0].get('id'),
							controller.UNION_PICTURES_LOAD_ERROR
						);
					}
				}
			},
			'#CatGoodsInUnionTable': {
				selectionchange: function(sm, selected, eOpts){
					var selectionPresent = (selected!=null && selected.length>0);
					
					Ext.getCmp('deleteCatGoodsInUnion').setDisabled(!selectionPresent);
				}
			},
			'#CatGoodsTable': {
				selectionchange: function(sm, selected, eOpts){
					var selectionPresent = (selected!=null && selected.length>0);
					
					controller.checkCatGoodsButtons(Ext.getCmp('UnionGoodsTable').getSelectionModel().getSelection(), selected);
				}
			},
			'#UnionPicturesList': {
				selectionchange: function(sm, selected, eOpts){
					var selectionPresent = (selected!=null && selected.length>0);
					
					Ext.getCmp('deletePicture').setDisabled(!selectionPresent);
				}
			},
			'#uploadFile': {
				click: function(button) {
					var form = button.up('form').getForm();
					if(form.isValid()){
						var masterId = Ext.getCmp('UnionGoodsTable').getSelectionModel().getSelection()[0].get('id');
						form.submit({
							url: '/goods_catalog/upload_union_picture',
							params: {
								authenticity_token: window._token,
								master_id: masterId
							},
							waitMsg: 'Загрузка данных...',
							success: function(fp, o) {
								controller.loadDetail(
									controller.picturesStore,
									masterId,
									controller.UNION_PICTURES_LOAD_ERROR
								);
								controller.fileWindow.hide();
							},
							errors: function(fp, o){
								controller.fileWindow.hide();
								Ext.Msg.alert("Ошибка обработки файла", o.result.errors);
							}
						});
					}
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.catGoodsStore=Ext.getCmp('CatGoodsTable').getStore();
		controller.masterStore=Ext.getCmp('UnionGoodsTable').getStore();
		controller.detailStore=Ext.getCmp('CatGoodsInUnionTable').getStore();
		controller.picturesStore=Ext.getCmp('UnionPicturesList').getStore();
		
		controller.loadMaster();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});