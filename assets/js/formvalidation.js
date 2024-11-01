function CPD(formId){
	 var CPD     = this;
     CPD.tmpname = null;
     CPD.baseUrl = null;
	 CPD.ajaxUrl = null;
	 CPD.isPopup = 0;
     CPD.form    = jQuery('#' + formId);
	 this.init = function(params) {
        CPD.baseUrl = params.baseUrl;
        CPD.ajaxUrl = params.ajaxUrl;
		CPD.isPopup = params.isPopup;
		CPD.datePicker();
		CPD.timePicker();
		CPD.calculateTotal();
		CPD.form.find('input.quantity').keyup(function() {
			if (jQuery(this).attr('max') != undefined && parseFloat(jQuery(this).val()) > parseFloat(jQuery(this).attr('max'))) {
				var errorClass = 'cpdFieldPositionClass_' + (100 + Math.floor(Math.random() * 100));
				jQuery(this).addClass(errorClass);
				CPD.ShowError(errorClass, 'Exceeded to max amount!');
				jQuery(this).removeClass(errorClass);
			}
				
			CPD.calculateTotal();
		})
		CPD.form.find('input.paypal').click(function(){
			CPD.purchase(jQuery(this));
		});
		
		CPD.form.find('.submit-success').fadeOut(params.timeSuccess);
		CPD.form.find('.submit-error').fadeOut(params.timeFail);
        
        // Validate Form
        CPD.form.unbind('submit').submit(function() {
            return CPD.validateForm();
        });
    }
	
    this.validateForm = function() {
		
        var formId = CPD.form.find(".required:not(li)");
//		if( CPD.isPopup == "1" ){
//			formId = jQuery("div.fancybox-wrap form#"+id + " .required:not(li)");
//		}
		var AddressFields = jQuery('#AddressGenerate');
		var isAddressNotExist = AddressFields.size() == 0 ;
        var count = 0;		
        for(var i=0; i<formId.length; i++){
            var type =  jQuery(formId[i]);
            var attr_type = type.attr('type');
            if(attr_type == 'submit' || attr_type=='button'){
                type.attr('disabled','disabled');
                type.addClass('cpdFieldSubmitButton');
            }
            //if((type.is('input') || type.is('textarea')) && attr_type != "hidden" && attr_type != 'submit' ){
            if(isAddressNotExist || AddressFields.attr('id') != type.attr('id')){								                				
                var clasName = 'cpdFieldPositionClass_'+i;
				if(type.hasClass('hasDatepicker') || type.hasClass('hasTimepicker'))
					type.parent().addClass(clasName);				
				else
					type.addClass(clasName);				
				var value = type.val();
                if(value == ''){					
                    this.ShowError(clasName,'The Field is required');
                    count++
                }else if(attr_type == 'email'){
                    if(!this.validateEmail(value)){
                        this.ShowError(clasName,'Please enter an email address');
                        count++
                    }
                }
            }
        // }
        }
        //captcha
        var captcha = CPD.form.find("#recaptcha_response_field");
        
        if(captcha.length > 0){
            if(captcha.val() == ''){
                captcha.val('The Field is required');
                count += 1 
            }
        }
        //address 
       
        if(AddressFields && AddressFields.hasClass('required') ){
            var getInputField = AddressFields.children('p').children('input');
            for(var s = 0; s < getInputField.length; s++){
                var addressField = jQuery(getInputField[s]);
                if(addressField.attr('name') != 'street_address2' && addressField.val() == ''){
                    this.ShowErrorAddress(addressField.attr('id'),' The Field is required');
                    count++
                }
            }
            
        }
        if(count == 0){
			if( CPD.isPopup ){
				var data = "action=front_cp_designer&cp_action=contact&" + CPD.form.serialize();
                console.log(data);
				jQuery.ajax({
					url: CPD.ajaxUrl, 
					type: 'POST',
					data: data, 
					dataType: 'json',
					success: function( response ) {
						if( response.success == "OK" ){
							alert(response.msg);
							jQuery.fancyboxrun.close();
						}else{
							alert(response.msg);
							jQuery.fancyboxrun.close();
						}
					}
				})
				return false;
			}
            return true;
        } else {
            return false;
        }
    }
    
    
    this.ShowError = function(cls,text){
        var parent = jQuery("."+cls).parent('li');
        var children = jQuery("."+cls);
        //        var pos = parent.position();
        var nameErrorId = 'ErrorObject'+cls;
        if(jQuery("#"+nameErrorId).length == 0){
            var html = '<div id="'+nameErrorId+'" class="hidden cpd_errorFrondEnd">';
            html += '<div class="cpd_errorArrow_left">&nbsp;</div>';
            html += '<div class="cpd_errorArrow_repeat">'+text+'</div>';
            html += '<div class="cpd_errorArrow_right">&nbsp;</div>';
            html += '</div>';
            parent.append(html);
        }
        var w = children.width();
        var h = children.height();
        var ObjError = jQuery("#"+nameErrorId);
        if(ObjError.is(':animated')){
            return false;
        }
        var center = parseInt(h)/2 - parseInt(ObjError.height())/2;
        ObjError.css('left',w);
        ObjError.css('top',center);
        ObjError.show('bounce',
			{
				times:3,
				direction:'right'
			},
			500,
			function(){
				ObjError.delay('1000').hide('bounce',{
					times:3,
					direction:'right'
				},500,function(){
					jQuery('.cpdFieldSubmitButton').removeAttr('disabled');
					ObjError.remove();
				});
			}
		);                                
    }
    
    this.ShowErrorAddress = function(id,text){
        var parent = jQuery("#"+id).parent('p');
        var children = jQuery("#"+id);
        var nameErrorId = 'ErrorObject'+id;
        if(jQuery("#"+nameErrorId).length == 0){
            var html = '<div id="'+nameErrorId+'" class="hidden cpd_errorFrondEnd">';
            html += '<div class="cpd_errorArrow_left">&nbsp;</div>';
            html += '<div class="cpd_errorArrow_repeat">'+text+'</div>';
            html += '<div class="cpd_errorArrow_right">&nbsp;</div>';
            html += '</div>';
            parent.append(html);
        }
        var pos = children.position();
        var w = children.width();
        //        var h = children.height();
        //        
        var ObjError = jQuery("#"+nameErrorId);
        if(ObjError.is(':animated')){
            return false;
        }
        
        //        
        //        var center = parseInt(h)/2;
        //        
        ObjError.css('left',pos.left + w);
        ObjError.css('top',pos.top);
        ObjError.show('bounce',{
            times:3,
            direction:'right'
        },500,function(){
            ObjError.delay('1000').hide('bounce',{
                times:3,
                direction:'right'
            },500,function(){
                jQuery('.cpdFieldSubmitButton').removeAttr('disabled');
                ObjError.remove();
            });
        });                        
        
    }
    
    this.validateEmail = function(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    } 

	this.datePicker = function() {
		CPD.form.find('div.date').each(function(){
			var format = jQuery(this).attr('format');
			if (format == undefined || format == '')
				format = 'mm/dd/yy';
			
			jQuery(this).find('input').datepicker({
				dateFormat: format,
				showOn: "button",
				buttonImage: CPD.baseUrl + "assets/css/img/calendar.png",
				buttonImageOnly: true
			});
		});
	}
	
	this.timePicker = function() {
		CPD.form.find('div.time').each(function(){
			jQuery(this).find('input').timepicker({
				showPeriod: parseInt(jQuery(this).attr('format')),
				showOn: 'button',
                button: jQuery(this).find('span')
			});
		});
	}
	this.calculateTotal = function() {
		CPD.form.find('label.total').each(function() {
			var self = jQuery(this);
			var defineList = self.find('.define-list').text();
			var splits = defineList.split('\n');
			var defines;
			var total = 0;
			for (i=0; i<splits.length; i++) {
				if(splits[i] != ''){
					defines = splits[i].split(',', 2);
					var price = jQuery('label.price[name="' + defines[0] + '"]');
					var quantity = jQuery('input.quantity[name="' + defines[1] + '"]');
					if (price.size() == 0 || quantity.size() == 0)
						break;
					price = parseFloat(price.attr('value'));
					price = (isNaN(price) ? 0 : price);
					quantity = parseFloat(quantity.val());	
					quantity = (isNaN(quantity) ? 0 : quantity);
					
					total += price * quantity;
				}
			}
			splits = total.toString().split('.', 2);
			self.find('.dollar').html(splits[0]);
			if (self.find('.cent').size() > 0 && splits.length > 1)
				self.find('.cent').html(splits[1]);
			
			total = '';
			self.find('span:not(.define-list)').each(function(){
				total += jQuery(this).text();
			});
			self.parent().find(':hidden').val(total);
		});
	}
	this.getCurrencyCode = function(currency) {
		
	}
	
	this.purchase = function(elem) {
		if (!CPD.validateForm())
			return;
		// check validation
		if (elem.attr('paypal') == undefined || elem.attr('item') == undefined || elem.attr('total') == undefined) {
			alert('Invalid info to connect paypal. Please have a contact with administrator.');
			return;
		}
		var data = 'action=front_cp_designer&cp_action=contact&';
		jQuery.ajax({
			url: CPD.ajaxUrl,
			data: data + CPD.form.serialize(),
			type: 'POST',
			success: function(response) {
				var form = [];
				var total = CPD.form.find('label.total[name="' + elem.attr('total') + '"]');
				var amount = total.find('.dollar').text();
				if (total.find('.cent').size() > 0)
					amount += total.find('.cent').text();
				amount = parseFloat(amount);
				
				form.push('<form action="https://www.paypal.com//cgi-bin/webscr" method="post" target="_self">');
				form.push('<input type="hidden" name="business" value="', elem.attr('paypal'), '" />');
				form.push('<input type="hidden" name="cmd" value="_xclick" />');
				form.push('<input type="hidden" name="item_name" value="', elem.attr('item'), '" />');
				form.push('<input type="hidden" name="amount" value="', amount, '" />');
				form.push('<input type="hidden" name="currency_code" value="', total.attr('currency'), '" />');
				form.push('<input type="hidden" name="lc" value="US" />');
				form.push('<input type="hidden" name="mrb" value="YRDKF6S68Y7DS" />');
				form.push('</form>');
				jQuery(form.join('')).appendTo('body').submit();
			},
			error: function(response) {
				alert('Sorry. Error occured while contacting with a site!');
			}
		});
	}
}