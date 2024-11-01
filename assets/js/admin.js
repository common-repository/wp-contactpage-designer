//Function to convert hex format to a rgb color
function rgb2hex(rgb) {
	var hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	function hex(x) {
		return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
	}
	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function CPD() {
    var CPD     = this;
    CPD.tmpname = null;
    CPD.tmpId	= 0;
    CPD.baseUrl = null;
    CPD.ajaxUrl = null;
	CPD.isElementMove = false;
	CPD.editElementHandler = null;
    
    this.init = function(params) {
        CPD.baseUrl = params.baseurl;
        CPD.ajaxUrl = params.ajaxUrl;
		CPD.editElementHandler = new CPD.CPDElementEditor();
        
        // Initiallize handle controls & listeners
        CPD.handles();
        CPD.ToolsIntercation();
        CPD.WorkflowIntercation();
        CPD.loadTemplates();
        CPD.makeDefault();
		CPD.editTemplate();
		CPD.initGUI();
		//
		CPD.purchasePremium();
        
        // Init ColorPicker
        jQuery('.ElementEditor .colorPalette').ColorPicker({
            eventName: 'click',
            onSubmit: function(hsb, hex, rgb, el) {
                jQuery(el).prev().val('#'+hex);
            },
			onBeforeShow: function () {
				jQuery(this).ColorPickerSetColor(jQuery(this).prev().val());
			}
        });
		
		// init tabs
		jQuery('.tabs').each(function() {
			jQuery(this).tabs();
		});
    }
	
	this.purchasePremium = function() {
		jQuery('ul.ToolsList li.disable').mousedown(function(){
			tb_show('Purchase premium version', '#TB_inline?&width=500&height=200&inlineId=purchase-box');
		});
	}
     
    this.handles = function() {
        
        // Move Handle for Load Template
        jQuery('.SelectTemplate').draggable({
            handle: '.SelectTemplate h4',
            containment: '.CPD .Main'
        });
        
        // Move Handle for Template Properties
        jQuery('.TemplateProperties').draggable({
            handle: '.TemplateProperties h4',
            containment: '.CPD .Main'
        });
        
        // Move Handle for the Main Toolbar
        jQuery('.CPD .Toolbar').draggable({
            handle: '#Toolbar_move_handle',
            containment: '.CPD .Main'
        });
        
        // ToolBar Toggle Hide/Show
        jQuery('#Toolbar_move_handle').dblclick(function(){
            jQuery(this).parent().find('ul.ToolsList').toggle()
        });
        
        // Move Handle for the Workflow
        jQuery('.CPD .Workflow').draggable({
            handle: '#Workflow_move_handle',
            containment: '.CPD .Main'
        });
        
        // Resize Handle for the Workflow 
        jQuery('.CPD .Workflow_Wrapper').resizable({
            handles:'se,s,e',
            minWidth:70,
            minHeight:20,
            start: function() {
                jQuery('#Workflow_resize_coords').fadeIn();
            },
            resize: function(event, ui){
                var x = Math.round(jQuery(this).outerWidth());
                var y = Math.round(jQuery(this).outerHeight());
                jQuery('#Workflow_resize_coords').text(x + 'px : ' + y + 'px');
                jQuery('#Workflow_resize_coords').css({
                    left:  jQuery(this).outerWidth()  / 2 - jQuery('#Workflow_resize_coords').outerWidth()  / 2,
                    top:   jQuery(this).outerHeight() / 2 - jQuery('#Workflow_resize_coords').outerHeight() / 2
                });
                
            },
            stop: function() {
                jQuery('#Workflow_resize_coords').fadeOut();
            }
        });
        
        // FullScreen Button on off
        jQuery('.CPD #Fullscreen').click(function(){
            if (jQuery('.CPD .Main').css('position') == 'absolute') {
                jQuery('.CPD .Main').css({
                    width:'inherit',
                    minHeight:'600px',
                    position:'relative',
                    zIndex:  '1'
                });
            } else {
                jQuery('.CPD .Main').css({
                    width: '100%',
                    height:'100%',
                    position:'absolute',
                    top:0,
                    left:0,
                    zIndex: '10000'
                });
            }
        });
		
		// Close 
        jQuery('.close-button').click(function() {
            CPD.closePopup();
        });
		
		// Save Btn
		jQuery('.CPD #SaveTemplate').click(function() {
			CPD.saveTemplate();
		});
		
		// Insert Template
		jQuery('#btn_show_popup_template').click(function() {
			jQuery.post(CPD.ajaxUrl, {action: 'cp_designer', cp_action: 'get_popup_templates'}, function(data) {
				// add templates
				var options = [];
				for ( var i in data ) {
					if ( data[i].id == CPD.tmpId ) 
						continue;
					options.push('<option value="'+data[i].id+'">'+data[i].name+'</option>');
				}
				
				if ( options.length == 0 ) {
					alert('Sorry. there is not any popup template.');
					return;
				}
				jQuery('#popup_templates').html(options.join(''));
				// Show Popup
				jQuery( "#popup_popup_templates" ).dialog({
					resizable: false,
					height:140,
					modal: true,
					buttons: {
						"Insert": function() {
							jQuery('#cp_template_id').val(jQuery('#popup_templates').val());
							jQuery( this ).dialog( "close" );
						},
						Cancel: function() {
							jQuery( this ).dialog( "close" );
						}
					}
				});
			},'json');
			
			return false;
		});
    }
	
	this.datePicker = function() {
		jQuery('.CPD div.date').each(function(){
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
		jQuery('.CPD div.time').each(function(){
			jQuery(this).find('input').timepicker({
				showPeriod: parseInt(jQuery(this).attr('format')),
				showOn: 'button',
                button: jQuery(this).find('span')
			});
		});
	}
	
    this.WorkflowIntercation = function() {
        jQuery('.Workflow_Wrapper').click(function(e){
            e.stopPropagation();
            jQuery(this).find('.elementTools').hide();
        });
        
        jQuery('.BlackBox').click(function(){
            jQuery(this).hide();
            jQuery('.SelectTemplate').hide();
            jQuery('.TemplateProperties').hide();
            jQuery('.ElementEditor > div').hide();
            jQuery('.ElementEditor > h4').hide();
            jQuery('.ElementEditor').hide();
        });
    }
	
	this.closePopup = function() {
		jQuery('.BlackBox').hide();
		jQuery('.SelectTemplate').hide();
		jQuery('.TemplateProperties').hide();
		jQuery('.ElementEditor > div').hide();
		jQuery('.ElementEditor > h4').hide();
		jQuery('.ElementEditor').hide();
	}
    
    this.ToolsIntercation = function() {
        // User tools interaction; Drag Tools to the Workflow
        
        // Close button for ETI Settings
        jQuery('.CPD .ElementEditor h4 span').live('click', function(){
            jQuery('.BlackBox').hide();
            jQuery('.ElementEditor').hide();
            jQuery('.ElementEditor > div').hide();
            jQuery('.ElementEditor > h4').hide();
        });
        
        jQuery('.CPD .ElementEditor').draggable({
            containment:'window',
            handle:'h4'
        });
        
        jQuery('ul.ToolsList').sortable({
            helper: 'clone',
            revert:'invalid',
            containment: '.CPD .Main'
		});
        
        jQuery('.Workflow_Wrapper').droppable({
            accept: ".ToolsList li",
            drop: function(event, ui){
                var wPos = jQuery('.Workflow_Wrapper ul').offset();
                var pos  = jQuery(ui.helper).offset();
                var y    = pos.top  - wPos.top;
                var x    = pos.left - wPos.left;
                
                var createElement;
				var createId = ui.draggable.attr('id');
				var handler;
                
                switch(createId) {
                    
                    case 'createParagraph' :
                        createElement = '<p control="Paragraph">New Paragraph</p>';
						handler = CPD.editElementHandler.handleParagraph;
                        break;
                    case 'createLabel' :
                        createElement = '<label control="Label">New Label</label>';
						handler = CPD.editElementHandler.handleLabel;
                        break;
                    case 'createField' :
                        createElement = '<input control="Field" type="text" />';
						handler = CPD.editElementHandler.handleField;
                        break;
                    case 'createCheckbox' :
                        createElement = '<div id="checkbox" control="Checkbox" class="checkbox" data="Checkbox"><input type="checkbox" /><label>Checkbox</label></div>';
						handler = CPD.editElementHandler.handleCheckbox;
                        break;
                    case 'createMailField' :
                        createElement = '<input type="email" control="Mail" />';
						handler = CPD.editElementHandler.handleMail;
                        break;
                    case 'createTextarea' :
                        createElement = '<textarea control="Textarea"></textarea>';
						handler = CPD.editElementHandler.handleTextarea;
                        break;
                    case 'createSubmit' :
                        createElement = '<input type="submit" control="Submit" value="Submit" />';
						handler = CPD.editElementHandler.handleSubmit;
                        break;
                    
                    case 'createMap' :
                        createElement = '<img class="map" control="Map" src="http://maps.googleapis.com/maps/api/staticmap?center=London&zoom=10&size=250x250&maptype=terrain&sensor=false" title="gmap" />';
						handler = CPD.editElementHandler.handleMap;
                        break;
                    
                    case 'createSelect' :
                        createElement = '<select control="Select"><option>Select</option></select>';
						handler = CPD.editElementHandler.handleSelect;
                        break;
                    case 'createAddress':
                        createElement = CPD.htmlAddress();
						handler = CPD.editElementHandler.handleAddress;
                        break;
                    case 'createFacebook':
                        createElement = '<div id="facebook" class="facebook" control="Facebook" value="http://www.facebook.com/pages/ContactPageDesigner/305479262862470"></div>';
						handler = CPD.editElementHandler.handleFacebook;
                        break;
                    case 'createTwitter':
                        createElement = '<div id="Twitter" class="Twitter" control="Twitter" value="ContactPage"></div>';
						handler = CPD.editElementHandler.handleTwitter;
                        break;
                    case 'createDate':
                        createElement = '<div id="date" class="date" control="Date" format="mm/dd/yy"><input type="text" value=""/></div>';
						handler = CPD.editElementHandler.handleDate;
                        break;
                    case 'createTime':
                        createElement = '<div id="time" class="time" control="Time" format="1"><input type="text" value=""/><span></span></div>';
						handler = CPD.editElementHandler.handleTime;
                        break;
					case 'createPopup':
                        createElement = '<input type="button" class="popup" control="Popup" value="Popup" />';
						handler = CPD.editElementHandler.handlePopup;
                        break;
					default:
						return false;
                }
				
				// Convert html to jQuery object
				createElement = jQuery(createElement);
				
                // Attach tools to the element
                var elementTools = jQuery('#elementTools').html();
				
                // Creating Dragged element
                var container = jQuery('<li>' + elementTools + '</li>').css({
                    position:'absolute',
                    top:  y,
                    left: x,
                    cursor: 'pointer'
                }).appendTo('.Workflow_Wrapper ul');
				
				// Add element
				createElement.appendTo(container);
				
				// Make edit handler and attach it
				jQuery.data(createElement[0], 'handler', handler);
			
				if (createId == 'createDate')
					CPD.datePicker();
				if (createId == 'createTime')
					CPD.timePicker();
                
                // Create Element tools interaction (ETI)
                CPD.ETI(jQuery('.Workflow_Wrapper ul li:last > .elementTools'));
            }
        });
    }
    
    this.ETI = function(th){
        // Element tools interaction (ETI) (This Element)
        
        // Hide & Show Tools
        th.parent('li').click(function(e){
            e.stopPropagation();
            jQuery('.Workflow_Wrapper ul li .elementTools').hide();
            jQuery(this).find('.elementTools').show();
        });
		
		th.parent('li').mouseover(function(e){
            e.stopPropagation();
			if (!CPD.isElementMove) {
				jQuery(this).find('.elementTools').show();
				jQuery(this).css('z-index', '10000');
			}
        });
		th.parent('li').mouseout(function(e){
            e.stopPropagation();
			if (!CPD.isElementMove) {
				jQuery(this).find('.elementTools').hide();
				jQuery(this).css('z-index', '0');
			}
        });
     
        // Move element
        th.parents('li').draggable({
            containment: '.Workflow_Wrapper ul',
            snap: true,			
            snapTolerance: 5,
            handle:'.elementTools .move',
            grid: [5,5],
			start: function(event, ui) {
				CPD.isElementMove = true;
			},
			stop: function(event, ui) {
				CPD.isElementMove = false;
				if (jQuery(this).draggable('option', 'helper') == 'clone') {
					var cloneObject = jQuery(ui.helper).clone(true);
					 
					// Clone handler, too
					var handler =  jQuery.data(th.next()[0], 'handler');
					jQuery.data(cloneObject.find('.elementTools').next()[0], 'handler', handler);
					
					// Append to the workflow
					cloneObject.removeClass('box ui-draggable ui-draggable-dragging').appendTo('.CPD .Workflow_Wrapper ul');
					
					CPD.ETI(jQuery('.Workflow_Wrapper ul li:last > .elementTools'));
					// hide old elements
					jQuery(this).find('.elementTools').hide();
				}
			}
        }).mousedown(function(event){
			jQuery(this).draggable('option', { helper : event.ctrlKey ? 'clone' : 'original'});
		});
        
        // Delete element
        th.find('.delete').click(function(){
            jQuery(th).parents('li').remove();
        });
        
        // Edit element
        th.find('.edit').click(function(){
            CPD.editElement(th.next());
        });
        
    }
    
	// Show Element Editor
	this.showEditor = function(element, width, height) {
		jQuery('.BlackBox').show();
		jQuery('.ElementEditor > div').hide();

		jQuery('.ElementEditor').show();
		jQuery('.ElementEditor .'+element).show();
		jQuery('.ElementEditor > h4').show();
		
		// set width & height
		if ( typeof width != 'undefined' )
			jQuery('.ElementEditor').css('width', width + 'px');
		else
			jQuery('.ElementEditor').css('width', '410px');
		
		if ( typeof width != 'undefined' )
			jQuery('.ElementEditor').css('height', height + 'px');
		else
			jQuery('.ElementEditor').css('height', 'auto');

		jQuery('.ElementEditor').css({
			// Position Editor
			left:  jQuery(window).outerWidth()  / 2 - jQuery('.ElementEditor').outerWidth()  / 2,
			top:   jQuery(window).outerHeight() / 2 - jQuery('.ElementEditor').outerHeight() / 2
		});
	}
	
	// generate price html code
	this.getPriceHtml = function(currency, value, hideDecimal) {
		var html = [];
		var symbol, dollar, cent;
		
		switch (currency) {
			case 'USD':
				symbol = '$';dollar = 'Dollars';cent = 'Cents';
				break;
			case "EUR":
				symbol = '€';dollar = 'Euros';cent = 'Cents';
				break;
			case "GBP":
				symbol = '£';dollar = 'Pounds';cent = 'Pence';
				break;
			case "AUD":
				symbol = 'AU$';dollar = 'Dollars';cent = 'Cents';
				break;
			case "JPY":
				symbol = '¥';dollar = 'Yen';cent = 'Sen';
				break;
			case "CAD":
				symbol = 'CA$';dollar = 'Dollars';cent = 'Cents';
				break;
			case "NZD":
				symbol = 'NZ$';dollar = 'Dollars';cent = 'Cents';
				break;
			case "HKD":
				symbol = 'HK$';dollar = 'Dollars';cent = 'Cents';
				break;
			case "SGD":
				symbol = 'SG$';dollar = 'Dollars';cent = 'Cents';
				break;
			case "MXN":
				symbol = '$';dollar = 'Pesos';cent = 'Centavos';
				break;
			case "DKK":
				symbol = 'KR';dollar = 'Kronor';cent = 'Ore';
				break;
			case 12:
				symbol = '';dollar = '';cent = '';
				break;
			case "NOK":
				symbol = 'KR';dollar = 'Kronor';cent = 'Ore';
				break;
			case "MYR":
				symbol = 'RM';dollar = 'Ringgt';cent = 'Sen';
				break;
			case "TWD":
				symbol = 'NT$';dollar = 'Dollars';cent = 'Jiao';
				break;
		}
		var values = value.split('.', 2);
		if (values.length == 1)
			values[1] = '00';

		html.push('<span class="currency">', symbol, '</span>');
		html.push('<span class="dollar">', values[0], '</span>');
		if (!hideDecimal)
			html.push('<span class="cent">.', values[1], '</span>');
		
		return html.join('');
	}
		
    
	
	this.editElement = function(th) {
		 // Get Tag Type
        jQuery.data(th[0], 'handler')(jQuery(th[0]));
	}
    
    this.makeSlider = function(slider, element) {
        if (jQuery(element).val() < 0) {
            // Prevent negative values
            jQuery(element).val(0);
        }
        jQuery(slider).slider({
            range: "min",
            min: 0,
            max:   jQuery(element).val() <= 0 ? 100 : jQuery(element).val() * 2,
            value: jQuery(element).val(),
            slide: function(event, ui) { 
                jQuery(element).val((ui.value));
            }
        });
        jQuery(element).unbind('change').change(function(){
            jQuery(slider).slider({
                max:   jQuery(element).val() <= 0 ? 100 : jQuery(element).val() * 2,
                value: jQuery(element).val() <  0 ? 0 : jQuery(element).val()
            });
        });
    }
	
	// Initialize gui
	this.initGUI = function() {
		
		CPD.tmpId = 0;
		CPD.tmpname = '';
		
		jQuery('.CPD #Workflow_move_handle').text('Workflow');
		jQuery('.CPD .Workflow_Wrapper ul').html('');
		jQuery('.CPD .Workflow_Wrapper').width(600);
		jQuery('.CPD .Workflow_Wrapper').height(400);
		jQuery('.CPD .Workflow_Wrapper').removeAttr('style');
		jQuery('.CPD #SaveTemplate').addClass('disabled');
		jQuery('.CPD #editTemplate').addClass('disabled');
		jQuery('#cp_design_toolbar').hide();
	}
	
	this.newTemplate = function() {
		if (jQuery('.CPD .Workflow_Wrapper ul').html().length > 0) {
			if (!confirm('Your work will be lost. Will you continue?'))
				return;
		}
		
		CPD.initGUI();
			
		// Close Without Saving
        jQuery('.TemplateProperties h4 span').live('click', function() {
            CPD.closePopup();
        });
		
		// Black Box
		jQuery('.BlackBox').show();
		
		// Open Properties
		jQuery('.TemplateProperties').css({
			left: jQuery(window).outerWidth()  / 2 - jQuery('.TemplateProperties').outerWidth()  / 2,
			top:  jQuery(window).outerHeight() / 2 - jQuery('.TemplateProperties').outerHeight() / 2
		}).show();
        
        // Save template
        jQuery('.TemplateProperties input[type=button]').unbind('click').click(function(){
            var name = jQuery('.CPD .TemplateProperties input[name=tmp_name]').val();
            
            if (jQuery.trim(name) == "") {
                jQuery('.CPD .TemplateProperties input[name=tmp_name]').css({
                    border:'1px solid #F00'
                });
                return false;
            }
            
			var workflow_wrapper = jQuery('.CPD .Workflow_Wrapper');
			workflow_wrapper.css('width', workflow_wrapper.width());
			workflow_wrapper.css('height', workflow_wrapper.height());
			var css = workflow_wrapper.attr('style');
		
            jQuery.post(CPD.ajaxUrl, { action: 'cp_designer', cp_action : 'new_template', name: name, css: css }, function(response) {
				CPD.loadTemplate(response);
				CPD.closePopup();
			}, 'json');
			
            return true;
        });
	}
    
    this.saveTemplate = function() {
		if ( CPD.tmpId == 0 ) {
			alert('You must create a new template or open a template');
			return;
		}
			
		var template = {};
		template['id'] = CPD.tmpId;
		template['name'] = CPD.tmpname;
		
		template['enable_popup'] = 0;
//		template['enable_popup'] = jQuery('#panel_template_general input[name="enable_popup"]').is(':checked') ? 1 : 0;
		template['mail_from_addr'] = jQuery('#panel_template_mail input[name="mail_from_addr"]').val();
		template['mail_to_addr'] = jQuery('#panel_template_mail input[name="mail_to_addr"]').val();
		template['mail_cc_addr'] = jQuery('#panel_template_mail input[name="mail_cc_addr"]').val();
		template['mail_subject'] = jQuery('#panel_template_mail input[name="mail_subject"]').val();
		
		template['mailchimp_api_key'] = jQuery('#panel_template_mailchimp input[name="mailchimp_api_key"]').val();
		template['mailchimp_list_id'] = jQuery('#panel_template_mailchimp input[name="mailchimp_list_id"]').val();
		
		template['aweber_unit'] = jQuery('#panel_template_aweber input[name="aweber_unit"]').val();
		template['aweber_form_id'] = jQuery('#panel_template_aweber input[name="aweber_form_id"]').val();
		
		template['msg_success'] = jQuery('#panel_template_message textarea[name="msg_success"]').val();
		template['msg_fail'] = jQuery('#panel_template_message textarea[name="msg_fail"]').val();

		var workflow_wrapper = jQuery('.CPD .Workflow_Wrapper');
		workflow_wrapper.css('width', workflow_wrapper.width());
		workflow_wrapper.css('height', workflow_wrapper.height());
		template['css'] = workflow_wrapper.attr('style');

		// get elements
		var elements = {};
		jQuery('.CPD .Workflow ul li').each(function(k){
			elements[k] = {};

			var lastChild = jQuery(this).children(':last');
			var tag = lastChild.get(0).tagName;
			var control = lastChild.attr('control');
			var attrNames = [];

			if (tag == 'SELECT')
				elements[k]['text']   = lastChild.html();
			else
				elements[k]['text']   = lastChild.text();

			if (tag == 'DIV')
				elements[k]['value']  = lastChild.attr('value');                 
			else
				elements[k]['value']  = lastChild.val();

			elements[k]['param']  = 'tag::' + lastChild.get(0).tagName + "||";
			// register attributes
			attrNames.push('src');
			attrNames.push('class');
			attrNames.push('data');
			attrNames.push('type');                

			var name;
			// Param name::
			if (tag == 'INPUT' || tag == 'TEXTAREA' || tag == "SELECT") {
				// add placeholder
				attrNames.push('placeholder');     
				// generate name
				name = lastChild.attr('name');
				if (!name) {
					name = 'field'+k+'_'+ Math.floor(Math.random() * 1000);
					lastChild.attr('name', name);
				}
				attrNames.push('name');     
				if (control == 'Quantity') {
					attrNames.push('max');
				} else if(control == 'Paypal') {
					attrNames.push('paypal');
					attrNames.push('item');
					attrNames.push('total');
				}
			}
			if (tag == 'DIV') {				
				if (control == 'Checkbox')
					name = lastChild.attr('name');
				else
					name = lastChild.find('input:last').attr('name');
				if (!name)
					name = 'field'+k+'_'+ Math.floor(Math.random() * 1000);

				if (control == 'Checkbox') {						
					elements[k]['param'] += '||name::' + name;
				} else if (control == 'MultipleChoice') {
					elements[k]['param'] += '||name::' + name;
					elements[k]['text']   = lastChild.html();
				} else if (control == 'Date' || control == 'Time') {
					elements[k]['param'] += '||name::' + name;
					attrNames.push('format');
					if (lastChild.find('input').hasClass('required'))
						elements[k]['param'] += '||required::required';
				}
			}
			if (tag == 'LABEL') {					
				if (control == 'Price' || control == 'Total' ) {
					name = lastChild.attr('name');
					if (name == undefined)
						name = 'field' + k + '_' + Math.floor(Math.random() * 1000);						
					elements[k]['param'] += '||name::' + name;						
					elements[k]['text']   = lastChild.html();
					attrNames.push('currency');
					attrNames.push('value');						
				}
				if (control == 'Total')
					elements[k]['param'] += '||define::' + lastChild.find('.define-list').text();
			}
			for(var i in attrNames) {
				var attrVal = lastChild.attr(attrNames[i]);
				elements[k]['param'] += '||' + attrNames[i] + '::' + (attrVal == undefined ? '' : attrVal);
			}

			//except for date and time
			if (tag == 'DIV' && (lastChild.hasClass('date') || lastChild.hasClass('time')))
				lastChild = lastChild.find('input');
			
			// add url for download button
			if ( control == 'Download' ) {
				elements[k]['param'] += '||url::' + lastChild.attr('url');
			} else if ( control == 'Popup' ) {
				// add url for download button
				elements[k]['param'] += '||template_id::' + lastChild.attr('template_id');
			}

			elements[k]['control'] = control;
			// CSS Style
			elements[k]['css']    = 'left::'             + Math.round(jQuery(this).position().left) + 'px'         + "||";
			elements[k]['css']   += 'top::'              + Math.round(jQuery(this).position().top)  + 'px'         + "||";
			elements[k]['css']   += 'width::'            + Math.round(lastChild.width())      + 'px'         + "||";
			elements[k]['css']   += 'height::'           + Math.round(lastChild.height())     + 'px'         + "||";
			elements[k]['css']   += 'color::'            + lastChild.css('color')             + "||";
			elements[k]['css']   += 'background-color::' + lastChild.css('backgroundColor')   + "||";
			elements[k]['css']   += 'border::'           + '1px ' + lastChild.css('border-left-style') + ' ' + lastChild.css('border-left-color')  + "||";
			elements[k]['css']   += 'font-family::'      + lastChild.css('font-family')       + "||";
			elements[k]['css']   += 'font-size::'        + lastChild.css('font-size')         + "||";
			elements[k]['css']   += 'font-weight::'      + lastChild.css('font-weight')       + "||";
			elements[k]['css']   += 'text-align::'       + lastChild.css('text-align')        + "||";
			elements[k]['css']   += 'text-transform::'   + lastChild.css('text-transform')    + "||";
			elements[k]['css']   += 'border-radius::'    + lastChild.css('border-top-left-radius');
			
		});
		
		template['elements'] = elements;
		jQuery.ajax({
			type: 'POST',
			async: true,
			url: CPD.ajaxUrl + '?action=cp_designer&cp_action=save_template',
			data: template,
			beforeSend: function() {
			},
			error: function() {
				alert('Error Saving Template!');
			},
			success: function(data){
				alert('Template Saved');
				CPD.closePopup();
			},
			dataType: 'json'
		});
    }
    
    this.loadTemplates = function() {
        jQuery('#selectTemplate').click(function(){
            // Black Box
            jQuery('.BlackBox').show();
            
            jQuery.post(CPD.ajaxUrl, {action: 'cp_designer', cp_action: 'get_templates'}, function(data) {
				// clear old templates
				jQuery('.SelectTemplate ul').html('');
				
				// add templates
				for ( var i in data ) {
					jQuery('<li onDblClick="if(confirm(\'Are you sure you want to delete this form?\')) return CPD.deleteForm('+data[i].id+'); else return false;" id="tmpid_'+data[i].id+'">'+data[i].name+'</li>').appendTo('.SelectTemplate ul');
				}
				
				// show template
				jQuery('.SelectTemplate').css({
					left: jQuery(window).outerWidth()  / 2 - jQuery('.SelectTemplate').outerWidth() / 2,
					top:  jQuery(window).outerHeight() / 2 - jQuery('.SelectTemplate').outerHeight() / 2
				}).show();

				// assign function
				jQuery('.SelectTemplate ul li').click(function() {
					var tmp_id = jQuery(this).attr('id');
					var id = parseInt(tmp_id.replace('tmpid_',''),10);
					
					jQuery.post(CPD.ajaxUrl, {action: 'cp_designer', cp_action: 'get_template', id: id}, function(data) {
						CPD.initGUI();
						CPD.loadTemplate(data);
						CPD.closePopup();
					}, 'json');
				});
			},'json');
        });
    }
	
	this.loadTemplate = function(data) {
		CPD.tmpId = data.id;
		CPD.tmpname = data.name;

		jQuery('.CPD #SaveTemplate').removeClass('disabled');
		jQuery('.CPD #editTemplate').removeClass('disabled');
		jQuery('#cp_design_toolbar').show();
		
		jQuery('.CPD #Workflow_move_handle').text('Workflow (Current template: ' + data.name + ')');
		jQuery('.CPD .Workflow_Wrapper').attr('style', data.css);
		
		// Assign settings value
//		if ( data.enable_popup == 1 ) 
//			jQuery('#panel_template_general input[name="enable_popup"]').attr('checked', 'checked');
//		else
//			jQuery('#panel_template_general input[name="enable_popup"]').removeAttr('checked');
		
		jQuery('#panel_template_mail input[name="mail_from_addr"]').val(data.mail_from_addr);
		jQuery('#panel_template_mail input[name="mail_to_addr"]').val(data.mail_to_addr);
		jQuery('#panel_template_mail input[name="mail_cc_addr"]').val(data.mail_cc_addr);
		jQuery('#panel_template_mail input[name="mail_subject"]').val(data.mail_subject);
		
		jQuery('#panel_template_mailchimp input[name="mailchimp_api_key"]').val(data.mailchimp_api_key);
		jQuery('#panel_template_mailchimp input[name="mailchimp_list_id"]').val(data.mailchimp_list_id);
		
		jQuery('#panel_template_aweber input[name="aweber_unit"]').val(data.aweber_unit);
		jQuery('#panel_template_aweber input[name="aweber_form_id"]').val(data.aweber_form_id);
		
		jQuery('#panel_template_message textarea[name="msg_success"]').val(data.msg_success);
		jQuery('#panel_template_message textarea[name="msg_fail"]').val(data.msg_fail);
		
		jQuery('#panel_template_message input[name="time_success"]').val(data.time_success);
		jQuery('#panel_template_message input[name="time_fail"]').val(data.time_fail);
		

		for ( var i in data.elements ) {
			var el = data.elements[i];
			var elementTools = jQuery('#elementTools').html();
			jQuery(el).appendTo('.CPD .Workflow_Wrapper ul');

			// Append Tool Box
			jQuery(elementTools).prependTo('.CPD .Workflow_Wrapper ul li:last').children(':first');

			// Create Element tools interaction (ETI)
			CPD.ETI(jQuery('.Workflow_Wrapper ul li:last > .elementTools'));
		}
		
		// Bind handlers
		jQuery('.CPD [control]').each(function() {
			var handler = eval('CPD.editElementHandler.handle' + jQuery(this).attr('control'));
			jQuery.data(jQuery(this)[0], 'handler', handler);
		});

		// date, time picker enable
		CPD.datePicker();
		CPD.timePicker();
	}
    
    this.makeDefault = function() {
		jQuery('#NewTemplate').click(function(){
			CPD.newTemplate();
		});
    }
	
	this.editTemplate = function() {
		jQuery('#editTemplate').click(function() {
			if ( CPD.tmpId == 0 ) {
				alert('You must create a new template or open a template');
				return;
			}
			jQuery('.ElementEditor > h4 .title').text('Template Settings');
			CPD.showEditor('EditTemplate', 500);

			var template = jQuery('.Workflow_Wrapper');
			
			// Get Current Parameters
			param				  = new Array();
			param.outerWidth      = Math.round(template.width());
            param.outerHeight     = Math.round(template.height());
			param.color			  = template.css('color');
            param.backColor       = template.css('background-color');
            param.backImage       = template.css('background-image');
            param.backRepeat      = template.css('background-repeat');
			
			//remove url from background image
			if (param.backImage.indexOf('url(') == 0)
				param.backImage = param.backImage.substring(4, param.backImage.length - 1);
			if (param.backImage == 'none')
				param.backImage = '';
			// Assign Current Parameters
			
			jQuery('.ElementEditor .EditTemplate input[name=width]').val(param.outerWidth);
			jQuery('.ElementEditor .EditTemplate input[name=height]').val(param.outerHeight);
			jQuery('.ElementEditor .EditTemplate input[name=color]').val(param.color);
			jQuery('.ElementEditor .EditTemplate input[name=bgcolor]').val(param.backColor);
			jQuery('.ElementEditor .EditTemplate input[name=bgimage]').val(param.backImage);
			jQuery('.ElementEditor .EditTemplate select').val(param.backRepeat);
			// Apply Changes       
			jQuery('.ElementEditor .EditTemplate input[type=button]').unbind('click').click(function(){
				var backImage = jQuery('.ElementEditor .EditTemplate input[name=bgimage]').val();
				if (backImage != '')
					backImage = 'url(' + jQuery('.ElementEditor .EditTemplate input[name=bgimage]').val() + ')';
				else
					backImage = 'none';
				template.css({
					width:				jQuery('.ElementEditor .EditTemplate input[name=width]').val(),
					height:				jQuery('.ElementEditor .EditTemplate input[name=height]').val(),
					color:				jQuery('.ElementEditor .EditTemplate input[name=color]').val(),
					backgroundColor:	jQuery('.ElementEditor .EditTemplate input[name=bgcolor]').val(),
					backgroundImage:	backImage,
					backgroundRepeat:	jQuery('.ElementEditor .EditTemplate select').val()
				});
				CPD.closePopup();
			});
		});
	}
    
    this.htmlAddress = function(){
        var html = ''; 
        html += '<div id="AddressGenerate" class="required" control="Address" value="world-states">';
        
        html += '<p>';
        html += '<label for="streetAddress">Street Address</label>';    
        html += '<input value="" name="street_address" id="streetAddress" />';
        html += '</p>';
        
        html += '<p>';
        html += '<label for="streetAddress2">Address Line 2</label>';    
        html += '<input value="" name="street_address2" id="streetAddress2" />';
        html += '</p>';
        
        html += '<p class="float_left w_50">';
        html += '<label for="cityAddress">City</label>';    
        html += '<input value="" name="cityAddress" id="cityAddress" />';
        html += '</p>';
        
        html += '<p class="float_left w_50">';
        html += '<label for="zipCodeAddress">Postal / zipcode</label>';    
        html += '<input value="" name="zipCodeAddress" id="zipCodeAddress" />';
        html += '</p>';
        
        html += '<p class="float_left w_50">';
        html += '<label for="regionAddress">State/Province/Region</label>';
        html += '<input value="" name="regionAddress" id="regionAddress" />';
        html += '</p>';
        
        html += '<p class="float_left w_50">';
        html += '<label for="CountryAddress">Country</label>';    
        html += '<select name="CountryAddress" id="CountryAddress" ></select>';
        html += '</p>';
        
        html += '</div>';
        return html;
    }
    
    this.SelectCountrySeparate = function(value){
        var boxArs =  jQuery.trim(jQuery(".CountryType_"+value).html()); 
        var sp = boxArs.split(',');
        var html = '';
        for(var i=0; i<sp.length; i++){
            html += sp[i]+'\n';
        }
        jQuery('.CountryEditAddress-choise').html(html);
    }
    this.deleteForm = function(form){
        jQuery.ajax({
            type: 'POST',
            async: false,
            url: CPD.ajaxUrl + "?action=cp_designer&cp_action=delete_template&format=raw",
            data: { form : form },
			dataType: 'json',
            beforeSend: function() {
            },
            error: function() {
                alert('Error deleting Template!');
            },
            success: function(response){
                jQuery('#tmpid_'+form).fadeOut('slow',function(){
                    jQuery('#tmpid_'+form).remove()
                });
            }
        });
    }
    this.UpdateChildren  = function(ob,CssName,value){
        var obj = jQuery(ob).children('p').children('label');
        for(var i=0; i<obj.length; i++){
            var el = jQuery(obj[i]);
            if(CssName == 'fontSize'){
                el.css('fontSize' , value.val() + 'px');
            }
            if(CssName == 'fontWeight'){
                el.css('fontWeight' , value.val());
            }
        }
        jQuery(ob).removeClass(CssName+'__'+value.attr('class'));
        jQuery(ob).addClass(CssName+'__'+value.val());
        value.attr('class',value.val());
    }
    
    this.ShowImportMenu = function(){
        var box = jQuery('.selectChoiseDropDown');
        if(box.is(":visible")){
            box.fadeOut('slow');
            return false;
        }else {
            box.fadeIn('slow');
            return false;
        }
    }   
    this.importChoices = function(choise){
        var boxArs =  jQuery.trim(jQuery(".importChoise_"+choise).html());
        var sp = boxArs.split(',');
        var html = '';
        for(var i=0; i<sp.length; i++){
            html += sp[i]+'\n';
        }
        jQuery('#choices').html(html);
    }
	
    this.importDropDownOptions = function(choise){
        var boxArs =  jQuery.trim(jQuery(".importChoise_"+choise).html());
        var sp = boxArs.split(',');
        var html = '';
        for(var i=0; i<sp.length; i++){
            html += sp[i]+'\n';
        }
        jQuery('#dropdownOption').html(html);
    }
	
	this.CPDElementEditor = function() {
		
		var CPDElementEditor = this;
        // Edit Element Properties
		this.getCommonParamsFromElement = function(element) {
			var param         = new Array();
			param.Name       = element.attr('name');
			param.Title       = element.attr('title');
			param.Text       = element.text();
			param.Value      = element.val();
			param.Left       = Math.round(element.parents('li').position().left);
			param.Top        = Math.round(element.parents('li').position().top);
			param.Width      = Math.round(element.width());
			param.Height     = Math.round(element.height());
			param.Font       = element.css('font-family');
			param.fontWeight = element.css('font-weight');			
			param.Color      = element.css('color');
			param.FontSize   = element.css('font-size').replace('px','');
			param.Align      = element.css('text-align');
			param.Transform  = element.css('text-transform');
			param.bgColor    = element.css('backgroundColor');
			param.brColor    = element.css('border-left-color');
			param.Required   = element.hasClass('required');
			param.Max   = element.attr('max');
			
			param.bgColor = param.bgColor == 'rgba(0, 0, 0, 0)' ? '' : param.bgColor;
			param.brColor = param.brColor == 'rgba(0, 0, 0, 0)' ? '' : param.brColor;
			
			return param;
		}
		
		this.getCommonParamsFromEdit = function(edit) {
			var param         = new Array();
			param.Name		 = edit.find('input.name').val();
			param.Text       = edit.find('[name=text]').val();
			param.Value      = edit.find('[name=text]').val();
			param.Left       = Number(edit.find('input[name=left]').val());
			param.Top        = Number(edit.find('input[name=top]').val());
			param.Width      = edit.find('input[name=width]').val();
			param.Height     = edit.find('input[name=height]').val();			
			param.Font       = edit.find('select.FontFamilies').val();
			param.fontWeight = edit.find('select.FontWeight').val();			
			param.Color      = edit.find('input[name=color]').val();
			param.FontSize   = edit.find('input[name=font-size]').val() + 'px';
			param.Align      = edit.find('select.Alignment').val();
			param.Transform  = edit.find('select.Transform').val();
			param.bgColor    = edit.find('input[name=bgcolor]').val();
			param.brColor    = edit.find('input[name=brcolor]').val();
			param.Required   = edit.find('input.required').is(':checked');
			param.Max   = edit.find('input.max').val();
			
			return param;
		}
		
		// Set Position
		this.setNameToEdit = function(edit, param) {
			edit.find('input.name').val(param.Name);
		}
		this.setNameToElement = function(element, param) {
			if (param.Name != "" && jQuery('.CPD .Workflow_Wrapper ul li [name="'+param.Name+'"]').not(element).length) {
				alert('Name: '+param.Name+' is reserved! Pick different name!');
				return false;
			}
            element.attr('name', param.Name);
		}
		
		// Set Position
		this.setPositionToEdit = function(edit, param) {
			edit.find('input[name=left]').val(param.Left);
			edit.find('input[name=top]').val(param.Top);
		}
		this.setPositionToElement = function(element, param) {
			element.parent().css({
				left: Number(param.Left),
				top:  Number(param.Top)
			});
		}
		
		// Set Size
		this.setSizeToEdit = function(edit, param) {
			edit.find('input[name=width]').val(param.Width);
			edit.find('input[name=height]').val(param.Height);
		}
		this.setSizeToElement = function(element, param) {
			element.css({
				width:           param.Width,
				height:          param.Height
			});
		}
		
		// Set Font
		this.setFontToEdit = function(edit, param) {
			edit.find('input[name=color]').val(param.Color);
			edit.find('input[name=font-size]').val(param.FontSize);

			edit.find('select.FontFamilies option').removeAttr('selected');
			edit.find('select.FontFamilies option[value="'+param.Font+'"]').attr('selected','selected');

			edit.find('select.FontWeight option').removeAttr('selected');
			edit.find('select.FontWeight option[value="'+param.fontWeight+'"]').attr('selected','selected');

			edit.find('select.Alignment option').removeAttr('selected');
			edit.find('select.Alignment option[value="'+param.Align+'"]').attr('selected','selected');

			edit.find('select.Transform option').removeAttr('selected');
			edit.find('select.Transform option[value="'+param.Transform+'"]').attr('selected','selected');
		}
		this.setFontToElement = function(element, param) {
			element.css({
				color:           param.Color,
				fontFamily:      param.Font,
				fontWeight:      param.fontWeight,
				textAlign:       param.Align,
				textTransform:   param.Transform,
				fontSize:        param.FontSize
			});
		}
		
		this.setRequiredToEdit = function(edit, param) {
			edit.find('input.required').prop("checked", param.Required);
		}
		this.setRequiredToElement = function(element, param) {
			if (param.Required) {
				element.addClass('required');
				element.parent().addClass('required');
			} else {
				element.removeClass('required');
				element.parent().removeClass('required');
			}
		}
		
		this.setBackgroundToEdit = function(edit, param) {
			edit.find('input[name=bgcolor]').val(param.bgColor);
			edit.find('input[name=brcolor]').val(param.brColor);
		}
		this.setBackgroundToElement = function(element, param) {
			element.css({
				backgroundColor: param.bgColor,
				borderColor:     param.brColor
			});
		}
		
		this.handleParagraph= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			// Edit Paragraph
			jQuery('.ElementEditor > h4 .title').text('Paragraph Settings');
			CPD.showEditor('EditParagraph');

			var edit = jQuery('.ElementEditor .EditParagraph');

			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);

			// Assign Current Parameters
			edit.find('textarea[name=text]').val(param.Text);
			edit.find('input[name=width]').val(param.Width);

			// Width Slider
			CPD.makeSlider('.ElementEditor .EditParagraph .outerWidthSlider','.ElementEditor .EditParagraph input[name=width]');
			// Font-Size Slider
			CPD.makeSlider('.ElementEditor .EditParagraph .fontSlider','.ElementEditor .EditParagraph input[name=font-size]');

			// Apply Changes
			jQuery('.ElementEditor .EditParagraph input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);
				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);

				element.css({width:         param.Width});
				element.text(param.Text);
				CPD.closePopup();
			});
		}

		this.handleLabel= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			// Edit Label
			jQuery('.ElementEditor > h4 .title').text('Label Settings');
			CPD.showEditor('EditLabel');

			var edit = jQuery('.ElementEditor .EditLabel');

			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setBackgroundToEdit(edit, param);
			edit.find('textarea[name=text]').val(param.Text);

			// Font-Size Slider
			CPD.makeSlider('.ElementEditor .EditLabel .fontSlider','.ElementEditor .EditLabel input[name=font-size]');

			// Apply Changes
			jQuery('.ElementEditor .EditLabel input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);
				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);
				CPDElementEditor.setBackgroundToElement(element, param);

				element.text(param.Text);
				CPD.closePopup();
			});
		}

		this.handleField= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			// Edit Input Text
			jQuery('.ElementEditor > h4 .title').text('Input Settings');
			CPD.showEditor('EditInputText');

			var edit = jQuery('.ElementEditor .EditInputText');

			CPDElementEditor.setNameToEdit(edit, param);
			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setSizeToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setBackgroundToEdit(edit, param);
			CPDElementEditor.setRequiredToEdit(edit, param);

			edit.find('[name=text]').val(param.Value);
			edit.find('.placeholder').val(element.attr('placeholder'));


			// Width Slider
			CPD.makeSlider('.ElementEditor .EditInputText .outerWidthSlider','.ElementEditor .EditInputText input[name=width]');

			// Height  Slider
			CPD.makeSlider('.ElementEditor .EditInputText .outerHeightSlider','.ElementEditor .EditInputText input[name=height]');

			// Font-Size Slider
			CPD.makeSlider('.ElementEditor .EditInputText .fontSlider','.ElementEditor .EditInputText input[name=font-size]');

			// Apply Changes
			edit.find('input[type=button]').unbind('click').click(function(){

				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				CPDElementEditor.setNameToElement(element, param);
				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setSizeToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);
				CPDElementEditor.setBackgroundToElement(element, param);
				CPDElementEditor.setRequiredToElement(element, param);                           

				element.attr('placeholder', edit.find('.placeholder').val());
				element.val(edit.find('[name=text]').val());
				element.text(edit.find('[name=text]').val());
				CPD.closePopup();
				return true;
			});
		}

		this.handleCheckbox= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			// Edit Checkbox
			jQuery('.ElementEditor > h4 .title').text('Checkbox Settings');
			CPD.showEditor('EditCheckbox');

			var edit = jQuery('.ElementEditor .EditCheckbox');

			CPDElementEditor.setNameToEdit(edit, param);
			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setBackgroundToEdit(edit, param);

			edit.find('textarea[name=text]').val(param.Text);
			// Width Slider
			CPD.makeSlider('.ElementEditor .EditCheckbox .outerWidthSlider','.ElementEditor .EditCheckbox input[name=width]');
			// Height  Slider
			CPD.makeSlider('.ElementEditor .EditCheckbox .outerHeightSlider','.ElementEditor .EditCheckbox input[name=height]');
			// Font-Size Slider
			CPD.makeSlider('.ElementEditor .EditCheckbox .fontSlider','.ElementEditor .EditCheckbox input[name=font-size]');

			// Apply Changes
			jQuery('.ElementEditor .EditCheckbox input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				CPDElementEditor.setNameToElement(element, param);
				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);
				CPDElementEditor.setBackgroundToElement(element, param);

				element.attr('data', 'Checkbox');
				element.attr('value', param.Text);
				element.find('label').text(param.Text);
				CPD.closePopup();
				return true;
			});		
		}

		this.handleMultipleChoice= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Multiple Choice Settings');

			CPD.makeSlider('.ElementEditor .EditMultipleChoice .outerWidthSlider', '.ElementEditor .EditMultipleChoice input[name=width]');
			CPD.makeSlider('.ElementEditor .EditMultipleChoice .outerHeightSlider','.ElementEditor .EditMultipleChoice input[name=height]');
			CPD.showEditor('EditMultipleChoice');

			var edit = jQuery('.ElementEditor .EditMultipleChoice');

			CPDElementEditor.setNameToEdit(edit, param);
			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setBackgroundToEdit(edit, param);
			CPDElementEditor.setRequiredToEdit(edit, param);

			param.Text        = element.html();

			// Width Slider
			CPD.makeSlider('.ElementEditor .EditMultipleChoice .outerWidthSlider','.ElementEditor .EditMultipleChoice input[name=width]');
			// Height  Slider
			CPD.makeSlider('.ElementEditor .EditMultipleChoice .outerHeightSlider','.ElementEditor .EditMultipleChoice input[name=height]');
			// Font-Size Slider
			CPD.makeSlider('.ElementEditor .EditMultipleChoice .fontSlider','.ElementEditor .EditMultipleChoice input[name=font-size]');

			valTextArea = '';
			element.find('span').each(function(){
				valTextArea += jQuery(this).text() + '\n';
			});
		//					if(valTextArea != 'Select'){
				edit.find('#choices').text(valTextArea);
		//					}

			// Apply Changes       
			jQuery('.ElementEditor .EditMultipleChoice input[type=button]').unbind('click').click(function(){

				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				CPDElementEditor.setNameToElement(element, param);
				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);
				CPDElementEditor.setBackgroundToElement(element, param);
		//						CPDElementEditor.setRequiredToElement(element, param);

				var op = edit.find('#choices').val();
				if(!op)
					return false;

				var html = [];
				var splits = op.split('\n');
				for(i=0; i<splits.length; i++){
					if(splits[i] != ''){
						html.push('<span>');
						html.push('<input type="radio" name="', param.Name, '" value="', splits[i], '" />');
						html.push(splits[i], '</span>');
					}
				} 
				element.html(html.join(''));
				element.attr('data', 'MultipleChoice');
				CPD.closePopup();
			});
		}

		this.handleMail= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			// Edit Email fied
			jQuery('.ElementEditor > h4 .title').text('Email Field Settings');
			CPD.showEditor('EditEmailField');

			var edit = jQuery('.ElementEditor .EditEmailField');

			CPDElementEditor.setNameToEdit(edit, param);
			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setSizeToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setBackgroundToEdit(edit, param);
			CPDElementEditor.setRequiredToEdit(edit, param);

			edit.find('textarea[name=text]').val(param.Text);
			edit.find('.placeholder').val(element.attr('placeholder'));


			// Width Slider
			CPD.makeSlider('.ElementEditor .EditEmailField .outerWidthSlider','.ElementEditor .EditEmailField input[name=width]');

			// Height  Slider
			CPD.makeSlider('.ElementEditor .EditEmailField .outerHeightSlider','.ElementEditor .EditEmailField input[name=height]');

			// Font-Size Slider
			CPD.makeSlider('.ElementEditor .EditEmailField .fontSlider','.ElementEditor .EditEmailField input[name=font-size]');

			// Apply Changes
			edit.find('input[type=button]').unbind('click').click(function(){

				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				CPDElementEditor.setNameToElement(element, param);
				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setSizeToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);
				CPDElementEditor.setBackgroundToElement(element, param);
				CPDElementEditor.setRequiredToElement(element, param);

				element.attr('placeholder',edit.find('.placeholder').val());
				CPD.closePopup();
				return true;
			});
		}

		this.handleTextarea= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			// Edit Text Area
			jQuery('.ElementEditor > h4 .title').text('Text Area Settings');
			CPD.showEditor('EditTextarea');

			var edit = jQuery('.ElementEditor .EditTextarea');

			CPDElementEditor.setNameToEdit(edit, param);
			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setSizeToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setBackgroundToEdit(edit, param);
			CPDElementEditor.setRequiredToEdit(edit, param);


			// Assign Current Parameters
			jQuery('.ElementEditor .EditTextarea textarea[name=text]').val(param.Text);
			jQuery('.ElementEditor .EditTextarea .placeholder').val(element.attr('placeholder'));

			// Width Slider
			CPD.makeSlider('.ElementEditor .EditTextarea .outerWidthSlider','.ElementEditor .EditTextarea input[name=width]');

			// Height  Slider
			CPD.makeSlider('.ElementEditor .EditTextarea .outerHeightSlider','.ElementEditor .EditTextarea input[name=height]');

			// Font-Size Slider
			CPD.makeSlider('.ElementEditor .EditTextarea .fontSlider','.ElementEditor .EditTextarea input[name=font-size]');

			// Apply Changes
			jQuery('.ElementEditor .EditTextarea input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setSizeToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);
				CPDElementEditor.setBackgroundToElement(element, param);
				CPDElementEditor.setNameToElement(element, param);

				element.attr('placeholder', edit.find('.placeholder').val());
				element.val(param.Text);
				element.text(param.Text);
				CPD.closePopup();
				return true;
			});
		}

		this.handleSubmit= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			 // Edit Submit Button
			jQuery('.ElementEditor > h4 .title').text('Submit Button Settings');
			CPD.showEditor('EditInputSubmit');

			var edit = jQuery('.ElementEditor .EditInputSubmit');

			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setSizeToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setBackgroundToEdit(edit, param);

			jQuery('.ElementEditor .EditInputSubmit [name=text]').val(param.Value);

			// Width Slider
			CPD.makeSlider('.ElementEditor .EditInputSubmit .outerWidthSlider','.ElementEditor .EditInputSubmit input[name=width]');

			// Height  Slider
			CPD.makeSlider('.ElementEditor .EditInputSubmit .outerHeightSlider','.ElementEditor .EditInputSubmit input[name=height]');

			// Font-Size Slider
			CPD.makeSlider('.ElementEditor .EditInputSubmit .fontSlider','.ElementEditor .EditInputSubmit input[name=font-size]');

			// Apply Changes
			jQuery('.ElementEditor .EditInputSubmit input[type=button]').unbind('click').click(function(){

				param = CPDElementEditor.getCommonParamsFromEdit(edit);
				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setSizeToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);
				CPDElementEditor.setBackgroundToElement(element, param);

				element.css({
					lineHeight:      param.Height + 'px'
				});
				element.val(param.Text);
				CPD.closePopup();
			});
		}

		this.handlePaypal= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			// Edit Submit Button
			jQuery('.ElementEditor > h4 .title').text('Paypal Button Settings');
			CPD.showEditor('EditPaypal');

			var edit = jQuery('.ElementEditor .EditPaypal');

			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setSizeToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setBackgroundToEdit(edit, param);

			edit.find('.name').val(param.Value);
			edit.find('.paypal-email').val(element.attr('paypal'));
			edit.find('.item-name').val(element.attr('item'));
			edit.find('.total-name').val(element.attr('total'));

			// Width Slider
			CPD.makeSlider('.ElementEditor .EditPaypal .outerWidthSlider','.ElementEditor .EditPaypal input[name=width]');
			// Height  Slider
			CPD.makeSlider('.ElementEditor .EditPaypal .outerHeightSlider','.ElementEditor .EditPaypal input[name=height]');
			// Font-Size Slider
			CPD.makeSlider('.ElementEditor .EditPaypal .fontSlider','.ElementEditor .EditPaypal input[name=font-size]');

			// Apply Changes
			jQuery('.ElementEditor .EditPaypal input[type=button]').unbind('click').click(function(){

				param = CPDElementEditor.getCommonParamsFromEdit(edit);
				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setSizeToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);
				CPDElementEditor.setBackgroundToElement(element, param);

				element.css({
					lineHeight:      param.Height + 'px'
				});
				element.val(param.Name);
				element.attr('paypal', edit.find('.paypal-email').val());
				element.attr('item', edit.find('.item-name').val());
				element.attr('total', edit.find('.total-name').val());
				CPD.closePopup();
			});
		}

		this.handleImg= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Image Settings');
			CPD.showEditor('EditImg');

			var edit = jQuery('.ElementEditor .EditImg');

			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setSizeToEdit(edit, param);

			param.Source     = element.attr('src');

			edit.find('input[name=Source]').val(param.Source);

			CPD.makeSlider('.ElementEditor .EditImg .outerWidthSlider','.ElementEditor .EditImg input[name=width]');
			CPD.makeSlider('.ElementEditor .EditImg .outerHeightSlider','.ElementEditor .EditImg input[name=height]');

			// Apply Changes       
			edit.find('input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setSizeToElement(element, param);

				element.attr('src', edit.find('input[name=Source]').val());

				CPD.closePopup();
			});
		}

		this.handleMap= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Map Settings');
			CPD.showEditor('EditMap');

			var edit = jQuery('.ElementEditor .EditMap');

			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setSizeToEdit(edit, param);

			CPD.makeSlider('.ElementEditor .EditMap .outerWidthSlider','.ElementEditor .EditMap input[name=width]');
			CPD.makeSlider('.ElementEditor .EditMap .outerHeightSlider','.ElementEditor .EditMap input[name=height]');

			// Apply Changes       
			jQuery('.ElementEditor .EditMap input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				CPDElementEditor.setPositionToElement(element, param);
				element.parent().css({
					left: Number(jQuery('.ElementEditor .EditMap input[name=left]').val()),
					top:  Number(jQuery('.ElementEditor .EditMap input[name=top]').val())
				});
				element.attr('src','http://maps.googleapis.com/maps/api/staticmap?center=' + jQuery('.ElementEditor .EditMap input[name=location]').val() + '&zoom=' + jQuery('.ElementEditor .EditMap select.zoom').val() + '&size=' + param.Width + 'x' + param.Height + '&maptype=' + jQuery('.ElementEditor .EditMap select.MapType').val() + '&sensor=false');
				CPD.closePopup();
			});
		}

		this.handleCaptcha= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Captcha Settings');
			CPD.showEditor('EditCaptcha');

			var edit = jQuery('.ElementEditor .EditCaptcha');

			CPDElementEditor.setPositionToEdit(edit, param);

			// Apply Changes
			jQuery('.ElementEditor .EditCaptcha input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);
				CPDElementEditor.setPositionToElement(element, param);

				CPD.closePopup();
			});
		}

		this.handleSelect= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Select Settings');

			CPD.makeSlider('.ElementEditor .EditSelect .outerWidthSlider', '.ElementEditor .EditSelect input[name=width]');
			CPD.makeSlider('.ElementEditor .EditSelect .outerHeightSlider','.ElementEditor .EditSelect input[name=height]');
			CPD.showEditor('EditSelect');

			var edit = jQuery('.ElementEditor .EditSelect');

			CPDElementEditor.setNameToEdit(edit, param);
			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setSizeToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setBackgroundToEdit(edit, param);
			CPDElementEditor.setRequiredToEdit(edit, param);

			param.Text        = element.html();

			// Width Slider
			CPD.makeSlider('.ElementEditor .EditSelect .outerWidthSlider','.ElementEditor .EditSelect input[name=width]');

			// Height  Slider
			CPD.makeSlider('.ElementEditor .EditSelect .outerHeightSlider','.ElementEditor .EditSelect input[name=height]');

			// Font-Size Slider
			CPD.makeSlider('.ElementEditor .EditSelect .fontSlider','.ElementEditor .EditSelect input[name=font-size]');

			var valTextArea = '';
			var splits = param.Text.split('</option>');
			for(var s=0; s<splits.length; s++){
				var el = splits[s];
				var strpos = el.indexOf('>');
				if(strpos != -1){
					valTextArea += el.substr(strpos + 1,el.length);
					valTextArea += '\n';
				}
			}
			if(valTextArea != 'Select'){
				jQuery('#dropdownOption').text(valTextArea);
			}

			// Apply Changes       
			jQuery('.ElementEditor .EditSelect input[type=button]').unbind('click').click(function(){

				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				CPDElementEditor.setNameToElement(element, param);
				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setSizeToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);
				CPDElementEditor.setBackgroundToElement(element, param);

				var op = jQuery('#dropdownOption').val();
				if(!op){
					return false;
				}
				var html = '';
				var splits = op.split('\n');
				for(i=0; i<splits.length; i++){
					if(splits[i] != ''){
						html += '<option value="'+splits[i]+'">'+splits[i]+'</option>';
					}
				} 
				element.html(html);
				CPD.closePopup();
			});
		}

		this.handleAddress= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Address Settings');
			CPD.showEditor('EditAddress');

			var edit = jQuery('.ElementEditor .EditAddress');

			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setRequiredToEdit(edit, param);

			jQuery('.ElementEditor .EditAddress input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);
				CPDElementEditor.setRequiredToElement(element, param);
				element.parent().removeClass('required');   

				CPD.UpdateChildren("#AddressGenerate",'fontSize',jQuery('.ElementEditor .EditAddress input[name=font-size]'));

				var html = '';
				var op = jQuery('.CountryEditAddress-choise').val();
				var splits = op.split('\n');
				for(i=0; i<splits.length; i++){
					if(splits[i] != ''){
						html += '<option value="'+splits[i]+'">'+splits[i]+'</option>';
					}
				} 
				element.attr('data', 'addressModified');
				element.attr('value', jQuery('.CountryAddressSelect').val());
				jQuery('#CountryAddress').html(html);
				CPD.closePopup();
			});
		}

		this.handleFacebook= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Facebook Settings');
			CPD.showEditor('FacebookSettings');

			var edit = jQuery('.ElementEditor .FacebookSettings');

			CPDElementEditor.setPositionToEdit(edit, param);
			edit.find('.Facebooktolike').val(param.Value);

			// Apply Changes
			jQuery('.ElementEditor .FacebookSettings input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);
				CPDElementEditor.setPositionToElement(element, param);

				var facebookVal   =    jQuery('.ElementEditor .FacebookSettings .Facebooktolike').val();
				element.attr('value',facebookVal);
				CPD.closePopup();
			});
		}

		this.handleTwitter= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Twitter Settings');
			CPD.showEditor('twitterSettings');

			var edit = jQuery('.ElementEditor .twitterSettings');
			CPDElementEditor.setPositionToEdit(edit, param);

			edit.find('.TwitterAccount').val(param.Value);

			// Apply Changes
			jQuery('.ElementEditor .twitterSettings input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);
				CPDElementEditor.setPositionToElement(element, param);

				var TwitterAccount   =    edit.find('.TwitterAccount').val();
				element.attr('value', TwitterAccount)

				CPD.closePopup();
			});
		}

		this.handlePrice= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Price Settings');
			CPD.showEditor('EditPrice');

			var edit = jQuery('.ElementEditor .EditPrice');

			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setNameToEdit(edit, param);

			edit.find('#currency').val(element.attr('currency'));
			edit.find('.price').val(element.attr('value'));
			if (element.find('span.cent').size() == 0)
				edit.find('.required').attr('checked', 'checked');
			else
				edit.find('.required').removeAttr('checked');

			// Apply Changes       
			edit.find('input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);
				CPDElementEditor.setNameToElement(element, param);

				var currency = edit.find('#currency').val();
				var value = edit.find('.price').val();
				element.html(CPD.getPriceHtml(currency, value, edit.find('.required').is(':checked')));
				element.attr('currency', currency);
				element.attr('value', value);
				CPD.closePopup();
			});
		}

		this.handleQuantity= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Quantity Settings');
			CPD.showEditor('EditQuantity');

			var edit = jQuery('.ElementEditor .EditQuantity');

			CPDElementEditor.setNameToEdit(edit, param);
			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setSizeToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setBackgroundToEdit(edit, param);
			CPDElementEditor.setRequiredToEdit(edit, param);

			edit.find('.max').val(param.Max);
			edit.find('.placeholder').val(element.attr('placeholder'));


			// Width Slider
			CPD.makeSlider('.ElementEditor .EditQuantity .outerWidthSlider','.ElementEditor .EditQuantity input[name=width]');
			// Height  Slider
			CPD.makeSlider('.ElementEditor .EditQuantity .outerHeightSlider','.ElementEditor .EditQuantity input[name=height]');
			// Font-Size Slider
			CPD.makeSlider('.ElementEditor .EditQuantity .fontSlider','.ElementEditor .EditQuantity input[name=font-size]');

			// Apply Changes
			edit.find('input[type=button]').unbind('click').click(function(){

				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				CPDElementEditor.setNameToElement(element, param);
				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setSizeToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);
				CPDElementEditor.setBackgroundToElement(element, param);
				CPDElementEditor.setRequiredToElement(element, param);                           

				element.attr('max', param.Max);	
				element.attr('placeholder', edit.find('.placeholder').val());								
				CPD.closePopup();
				return true;
			});
		}

		this.handleTotal= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Total Settings');
			CPD.showEditor('EditTotal');

			var edit = jQuery('.ElementEditor .EditTotal');

			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setNameToEdit(edit, param);
			CPDElementEditor.setBackgroundToEdit(edit, param);

			edit.find('#currency').val(element.attr('currency'));
			edit.find('#define-list').val(element.find('.define-list').text());
			if (element.find('span.cent').size() == 0)
				edit.find('.required').attr('checked', 'checked');
			else
				edit.find('.required').removeAttr('checked');

			// Apply Changes       
			edit.find('input[type=button]').unbind('click').click(function(){
				// validate define list
				var defineList = edit.find('#define-list').val();
				var splits = defineList.split('\n');
				var defines;
				for(i=0; i<splits.length; i++){
					if(splits[i] != ''){
						defines = splits[i].split(',', 2);
						if (jQuery('label.price[name="' + defines[0] + '"]').size() == 0) {
							alert('Price name "' + defines[0] + '" does not exist!');
							return;
						}
						if (jQuery('input.quantity[name="' + defines[1] + '"]').size() == 0) {
							alert('Quantity name "' + defines[1] + '" does not exist!');
							return;
						}	
					}
				} 

				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				CPDElementEditor.setPositionToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);
				CPDElementEditor.setNameToElement(element, param);
				CPDElementEditor.setBackgroundToElement(element, param);

				var currency = edit.find('#currency').val();
				var value = '0.00';
				element.html(CPD.getPriceHtml(currency, value, edit.find('.required').is(':checked')));
				element.attr('currency', currency);
				element.append('<span class="define-list">' + defineList + '</span>');
				CPD.closePopup();
			});
		}

		this.handleDate= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Date Settings');
			CPD.showEditor('EditDate');

			var edit = jQuery('.ElementEditor .EditDate');

			var dateParam = CPDElementEditor.getCommonParamsFromElement(element.find('input'));
			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, dateParam);
			CPDElementEditor.setSizeToEdit(edit, dateParam);
			CPDElementEditor.setNameToEdit(edit, dateParam);
			CPDElementEditor.setRequiredToEdit(edit, dateParam);
			// set format
			edit.find('#date_format').val(element.attr('format'));

			edit.find('input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				var dateEdit = element.find('input');
				CPDElementEditor.setPositionToElement(element, param);						
				CPDElementEditor.setSizeToElement(dateEdit, param);
				CPDElementEditor.setFontToElement(dateEdit, param);
				CPDElementEditor.setNameToElement(dateEdit, param);
				if (param.Required) {
					dateEdit.addClass('required');
					dateEdit.parents('li').addClass('required');
				} else {
					dateEdit.removeClass('required');
					dateEdit.parents('li').removeClass('required');
				}
				// set format
				element.attr('format', edit.find('#date_format').val());
				dateEdit.datepicker( "option", "dateFormat", element.attr('format') );

				CPD.closePopup();
			});
		}

		this.handleTime= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Time Settings');
			CPD.showEditor('EditTime');

			var edit = jQuery('.ElementEditor .EditTime');

			var timeParam = CPDElementEditor.getCommonParamsFromElement(element.find('input'));
			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, timeParam);
			CPDElementEditor.setSizeToEdit(edit, timeParam);
			CPDElementEditor.setNameToEdit(edit, timeParam);
			CPDElementEditor.setRequiredToEdit(edit, timeParam);
			// set format
			edit.find('#time_format').val(element.attr('format'));

			edit.find('input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);
				var timeEdit = element.find('input');

				CPDElementEditor.setPositionToElement(element, param);						
				CPDElementEditor.setSizeToElement(timeEdit, param);
				CPDElementEditor.setFontToElement(timeEdit, param);	
				CPDElementEditor.setNameToElement(timeEdit, param);
				if (param.Required) {
					timeEdit.addClass('required');
					timeEdit.parents('li').addClass('required');
				} else {
					timeEdit.removeClass('required');
					timeEdit.parents('li').removeClass('required');
				}
				// set format
				element.attr('format', edit.find('#time_format').val());
				timeEdit.timepicker( "option", "showPeriod", parseInt(edit.find('#time_format').val()) );


				CPD.closePopup();
			});
		}

		this.handleDownload= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Download Settings');
			CPD.showEditor('EditButtonDownload');

			var edit = jQuery('.ElementEditor .EditButtonDownload');

			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setSizeToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setBackgroundToEdit(edit, param);

			edit.find('[name="text"]').val(param.Value);
			// set url
			edit.find('#download_url').val(element.attr('url'));

			edit.find('input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				CPDElementEditor.setPositionToElement(element, param);						
				CPDElementEditor.setSizeToElement(element, param);
				CPDElementEditor.setFontToElement(element, param);
				CPDElementEditor.setNameToElement(element, param);
				// set url
				element.attr('url', edit.find('#download_url').val());
				element.val(edit.find('[name="text"]').val());

				CPD.closePopup();
			});	
		}
		
		this.handlePopup= function(element) {
			var param = CPDElementEditor.getCommonParamsFromElement(element);
			
			jQuery('.ElementEditor > h4 .title').text('Popup Settings');
			CPD.showEditor('EditButtonPopup');

			var edit = jQuery('.ElementEditor .EditButtonPopup');

			CPDElementEditor.setPositionToEdit(edit, param);
			CPDElementEditor.setSizeToEdit(edit, param);
			CPDElementEditor.setFontToEdit(edit, param);
			CPDElementEditor.setBackgroundToEdit(edit, param);

			edit.find('[name="text"]').val(param.Value);
			// set url
			edit.find('#cp_template_id').val(element.attr('template_id'));

			edit.find('input[type=button]').unbind('click').click(function(){
				param = CPDElementEditor.getCommonParamsFromEdit(edit);

				var dateEdit = element.find('input');
				CPDElementEditor.setPositionToElement(element, param);						
				CPDElementEditor.setSizeToElement(dateEdit, param);
				CPDElementEditor.setFontToElement(dateEdit, param);
				CPDElementEditor.setNameToElement(dateEdit, param);
				// set url
				element.attr('template_id', edit.find('#cp_template_id').val());
				element.val(edit.find('[name="text"]').val());

				CPD.closePopup();
			});	
		}
    }
}