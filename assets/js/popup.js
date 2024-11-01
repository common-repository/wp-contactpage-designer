/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
jQuery(document).ready(function(){
    var event_source = jQuery('#cpd_event_source').val();
    var autoload = jQuery('#cpd_auto_display').val();
    var is_home = jQuery('#cpd_is_home').val();
    jQuery('#'+event_source).css('cursor','pointer');
    if( autoload == "1" && is_home == "1" ){
        show_popup_contact_form();
    }
    jQuery('#'+event_source).click(function(){
        show_popup_contact_form();
    })
})

function show_popup_contact_form(){
    if( jQuery('#cpd_contact_form_container').size() > 0 ){
        var width = jQuery('#cpd_contact_form_container').outerWidth()+3;
        var height = jQuery('#cpd_contact_form_container').outerHeight();
        
        // Remove script codes
        jQuery('#cpd_contact_form_container script').html('');
        jQuery.fancyboxrun({
            type: 'inline',
            href: '#cpd_contact_form_container'
        });
        jQuery('.fancybox-wrap').attr('style','width:'+width+'px !important');
    }else{
        scrollTo(jQuery('#cpd_page_container').position().left,jQuery('#cpd_page_container').position().top);
    }
}

