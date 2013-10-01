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
		
		controller.certificatesStore=Ext.getCmp('certificatesTable').getStore();
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
				e.setText('Введите номер накладной или артикул товара');
				e.show();
			} else {
				e.hide();
			}
			
			return (!error)?true:'Введите номер накладной или артикул товара';
		};
		
		function innValidator(value){
			var check=false;
			if(value==null || value.replace('\s', '')==''){
				return 'Введите ИНН';
			}
			
			value=value.replace('\s', '');
			
			if(value.length!=10 && value.length!=12){
				return 'ИНН должен состоять из 10 или 12 цифр';
			}
			if(value.length==10){
				check=(
					parseInt(value[9]) == (((2*parseInt(value[0])+4*parseInt(value[1])+10*parseInt(value[2])+
					3*parseInt(value[3])+5*parseInt(value[4])+9*parseInt(value[5])+4*parseInt(value[6])+
					6*parseInt(value[7])+8*parseInt(value[8])) % 11) % 10)
				);
			}
			if(value.length==12){
				check=(
					parseInt(value[10]) == (((7*parseInt(value[0])+2*parseInt(value[1])+4*parseInt(value[2])+
					10*parseInt(value[3])+3*parseInt(value[4])+5*parseInt(value[5])+9*parseInt(value[6])+
					4*parseInt(value[7])+6*parseInt(value[8])+8*parseInt(value[9])) % 11) % 10)
				);
				if(check){
					check=(
						parseInt(value[11]) == (((3*parseInt(value[0])+7*parseInt(value[1])+2*parseInt(value[2])+
						4*parseInt(value[3])+10*parseInt(value[4])+3*parseInt(value[5])+
						5*parseInt(value[6])+9*parseInt(value[7])+4*parseInt(value[8])+
						6*parseInt(value[9]) + 8*parseInt(value[10])) % 11) % 10)
					);
				}
			}
			return (check)?true:'ИНН некорректен';
		};
	
		ndocField.validator=validator;
		goodsCodeField.validator=validator;
		innField.validator=innValidator;
		
		innField.setValue(Ext.getDom('inn').value);
		ndocField.setValue(Ext.getDom('ndoc').value);
		goodsCodeField.setValue(Ext.getDom('goods_code').value);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.initElements();
	}
});