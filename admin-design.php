<?php
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

require_once( CP_DESIGNER_PATH . '/includes/abstract-page.php' );

class CPDesignerDesignPage extends SubPage {
	
	function __construct() {
		
	}
	
	public function update() {
		
	}
	
	public function handle_ajax_request() {
		
	}
	
	public function insert_choise() {
        $return = array();
        $vars = array(
            "Days of the Week",
            'Months of the Year',
            'Age',
            'Years (1930+)',
            'Continents',
            'US States',
            'EU Countries',
            'World Countries'
        );
        foreach ($vars as $key => $value) {
            $return[$value] = $this->choise($key);
        }
        return $return;
    }
	
	protected function for_count($number) {
        $arr = array();
        for ($i = 1930; $i <= $number; $i++) {
            $arr[] = $i;
        }
        return $arr;
    }

    protected function edit_address() {
        return array(
            'us-states' => $this->read_file_as_array('us-states'),
            'eu-states' => $this->read_file_as_array('eu-states'),
            'world-states' => $this->read_file_as_array('world-states')
        );
    }
	
	protected function choise($num) {
        $array = array(
            $this->read_file_as_array('days'),
            $this->read_file_as_array('months'),
            $this->read_file_as_array('age'),
            $this->for_count(date('Y')),
            $this->read_file_as_array('Continents'),
            $this->read_file_as_array('us-states'),
            $this->read_file_as_array('eu-states'),
            $this->read_file_as_array('world-states')
        );
        return $array[$num];
    }

    public function read_file_as_array( $file ) {
        $html_content = file_get_contents( CP_DESIGNER_PATH .'/importdata/' .$file .'.txt' );
        return preg_split( '/\r\n|\r|\n/', $html_content );
    }
	
	public function get_template_part( $slug, $name ) {
		if ( file_exists( CP_DESIGNER_PATH . "/templates/$slug-$name.php" ) ) 
			include( CP_DESIGNER_PATH . "/templates/$slug-$name.php" );
	}

	public function display() {
		
	?>
<style type="text/css">
	#wpcontent {
		background-color: #EEEEEE;
	}
</style>
<div class="CPD">
    <div class="Main">
        <!--<div id="Fullscreen"><span>Full Screen</span></div>-->
        <div class="Toolbar" id="cp_design_toolbar"> 
            <h1 id="Toolbar_move_handle" title="Click to move">Tools Panel</h1>
            <div class="Toolbar_move_handle_scroll">
                <!-- Tools List -->
                <ul class="ToolsList">
                    <li id="createLabel" title="Drag to Workflow"><span></span>Label</li>
                    <li id="createField" title="Drag to Workflow"><span></span>Input Field</li>
                    <li id="createMailField"  title="Drag to Workflow"><span></span>E-Mail Field</li>
					<li id="createTextarea" title="Drag to Workflow"><span></span>Text Area</li>                    
					<li id="createParagraph" title="Drag to Workflow"><span></span>Paragraph</li>                    
                    <li id="createSubmit" title="Drag to Workflow"><span></span>Submit Button</li>                                                 
					<li id="createMap" title="Drag to Workflow"><span></span>Map</li>
					<li id="createFacebook" title="Drag to Workflow"><span></span>Facebook</li>
                    <li id="createTwitter" title="Drag to Workflow"><span></span>Twitter</li>
					<li id="createDate" title="Drag to Workflow"><span></span>Date</li>  
					<li id="createTime" title="Drag to Workflow"><span></span>Time</li>
					<li id="createImg" title="Drag to Workflow" class="disable"><span></span>Image</li>
					<li id="createSelect" title="Drag to Workflow" class="disable"><span></span>Drop down</li>
					<li id="createCheckbox" title="Drag to Workflow" class="disable"><span></span>Checkbox</li>
					<li id="createMultipleChoice" title="Drag to Workflow" class="disable"><span></span>Multiple Choice</li>					
                    <li id="createAddress" title="Drag to Workflow" class="disable"><span></span>Address</li>
					<li id="createCaptcha" title="Drag to Workflow" class="disable"><span></span>Captcha</li>                    
					<li id="createPrice" title="Drag to Workflow" class="disable"><span></span>Price</li>
                    <li id="createQuantity" title="Drag to Workflow" class="disable"><span></span>Quantity</li>
                    <li id="createTotal" title="Drag to Workflow" class="disable"><span></span>Total</li>
                    <li id="createPaypal" title="Drag to Workflow" class="disable"><span></span>Paypal</li>
					<li id="createDownload" title="Drag to Workflow" class="disable"><span></span>Download</li>
                </ul>
                <!-- /Tools List -->
            </div>
        </div>

        <div class="Workflow"> 
            <h1 id="Workflow_move_handle" title="Click to move">Workflow</h1>
            <div id="NewTemplate" title="New Template"> </div>
            <div id="SaveTemplate" title="Save Template" class="disabled"> </div>
            <div id="selectTemplate" title="Load Template"> </div>
			<div id="editTemplate" title="Configure Template" class="disabled"> </div>

            <div class="Workflow_Wrapper"> 
                <ul> </ul>
                <!-- Handles Info & Elements Toolbox -->
                <div id="Workflow_resize_handle" title="Resize"> </div>
                <div id="Workflow_resize_coords"> </div>
                <div id="elementTools">
                    <div class="elementTools">
                        <div class="move" title="Move"> </div>
                        <div class="edit" title="Edit"> </div>
                        <div class="delete" title="Delete"> </div>
                    </div>
                </div>
                <!-- /Handles And Info -->
            </div>
        </div>
    </div>

    <div class="BlackBox"> </div>

    <div class="TemplateProperties"> 
        <h4 title="Click to move"><span class="title">New Template</span><span class="close-button" title="Click to Close">Close</span></h4>
        <label>Template Name</label>
        <input name="tmp_name" type="text" value="" />
        <div class="separate"> </div>

        <input type="button" value="Create" />
    </div>

    <div class="SelectTemplate">
        <h4 title="Click to move"><span class="title">Load Template</span><span class="close-button" title="Click to Close">Close</span></h4>
        <i>if you want to delete template please click double on the element</i>
        <ul>

        </ul>
    </div>

    <div class="ElementEditor">

        <h4 title="Click to move"><span class="title">Settings</span><span class="close-button" title="Click to Close">Close</span></h4>
		<?php $this->get_template_part( 'setting', 'template' ) ?>
		<?php $this->get_template_part( 'setting', 'select' ) ?>
		<?php $this->get_template_part( 'setting', 'twitter' ) ?>
		<?php $this->get_template_part( 'setting', 'facebook' ) ?>
		<?php $this->get_template_part( 'setting', 'map' ) ?>
		<?php $this->get_template_part( 'setting', 'paragraph' ) ?>
		<?php $this->get_template_part( 'setting', 'label' ) ?>
		<?php $this->get_template_part( 'setting', 'email' ) ?>
		<?php $this->get_template_part( 'setting', 'input' ) ?>
		<?php $this->get_template_part( 'setting', 'submit' ) ?>
		<?php $this->get_template_part( 'setting', 'textarea' ) ?>
		<?php $this->get_template_part( 'setting', 'date' ) ?>
		<?php $this->get_template_part( 'setting', 'time' ) ?>
    </div>
</div>
<div id="purchase-box" style="display: none;">	
	<p>You can not use this function in free version.</p>
	<p>To use this function, purchase premium version by clicking <a href="http://www.wppluginpros.com/shop/page-designer-pro/" target="_blank">here</a></p>
</div>
<script type="text/javascript" language="javascript">
    jQuery(document).ready(function(){
        CPD = new CPD();
        CPD.init({
            baseurl: <?php echo '"' . CP_DESIGNER_URL . '"';?>,
            ajaxUrl: <?php echo '"' . admin_url( 'admin-ajax.php' ) . '"';?>
        });
		
		window.send_to_editor = function(html) {
			imgurl = jQuery('img', html).attr('src');
			jQuery('#img_source').val(imgurl);
			tb_remove();
		}
    });  
</script>
	<?php
	}
}
