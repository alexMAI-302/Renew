Ext.define('app.controller.Certificate', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Certificate.Certificates'
	],
	
	models: [
		'valueModel',
		'Certificate.CertificateModel'
	],
	
	views: [
		'Certificate.Container'
	],
	
	mainContainer: null,
	
	certificatesStore:null,
	
	init: function() {
		var controller = this;
		Ext.tip.QuickTipManager.init();
		controller.mainContainer=Ext.create('app.view.Certificate.Container');
		
		controller.control({
			'#filterCertificate': {
				click: function(button){
					var innField = Ext.getCmp('innCertificate'),
						inn=innField.getValue(),
						ndocField=Ext.getCmp('ndocCertificate'),
						ndoc=ndocField.getValue(),
						goodsCodeField=Ext.getCmp('goodsCodeCertificate'),
						goodsCode=goodsCodeField.getValue(),
						form = button.up('form').getForm();
					
					if(form.isValid()){
						controller.certificatesStore.proxy.extraParams={
							inn: inn,
							ndoc: ndoc,
							goods_code: goodsCode
						};
						
						controller.mainContainer.setLoading(true);
						controller.certificatesStore.load(
							function(records, operation, success){
								var e=Ext.getCmp('errorCertificates'),
									t=Ext.getCmp('certificatesTable');
								if(success!==true){
									e.setText('Ошибка сервера. Попробуйте еще раз.');
									e.show();
									t.hide();
								} else {
									if(records.length==0){
										e.setText('Ничего не найдено. Измените условия поиска.');
										e.show();
										t.hide();
									} else {
										e.hide();
										t.show();
									}
								}
								controller.mainContainer.setLoading(false);
								return true;
							}
						);
					}
				}
			}
		});
		
		
	},
	
	initStores: function(){
		var controller=this;
		
		controller.certificatesStore=controller.getCertificateCertificatesStore();
	},
	
	bindStores: function(){
		var controller=this;
		
		Ext.getCmp('certificatesTable').reconfigure(controller.certificatesStore);
	},
	
	initElements: function(){
		var controller=this,
			innField = Ext.getCmp('innCertificate'),
			ndocField=Ext.getCmp('ndocCertificate'),
			goodsCodeField=Ext.getCmp('goodsCodeCertificate');
		
		function validator(){
			var ndoc=ndocField.getValue(),
				goodsCode=goodsCodeField.getValue(),
				error = ((ndoc==null || ndoc.replace('\s', '')=='') &&
					(goodsCode==null || goodsCode.replace('\s', '')=='')
				),
				e=Ext.getCmp('errorCertificates');
			
			if(error){
				e.setText('Введите номер накладной или код товара');
				e.show();
			} else {
				e.hide();
			}
			
			return (!error)?true:'Введите номер накладной или код товара';
		};
	
		ndocField.validator=validator;
		goodsCodeField.validator=validator;
		
		innField.setValue(Ext.getDom('inn').value);
		ndocField.setValue(Ext.getDom('ndoc').value);
		goodsCodeField.setValue(Ext.getDom('goods_code').value);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
		
		controller.initElements();
	}
});