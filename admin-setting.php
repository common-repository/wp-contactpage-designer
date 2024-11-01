<?php
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

require_once( CP_DESIGNER_PATH . '/includes/abstract-page.php' );

class CPDesignerSettingPage extends SubPage {
	
	function __construct() {
        
        // handle submit
		$cpd_action = isset( $_POST['cp_designer'] ) ? $_POST['cp_designer'] : '';
		if ( $cpd_action == 'update-setting' )
			$this->update();
	}
	
	public function update() {
        global $cp_designer;
        
		$keys = array( 
			'captcha_pubkey', 
			'captcha_privkey',
            'entry_template',
		);
		$options = array();
		foreach ( $keys as $key ) {
			$options[ $key ] = isset( $_POST[ $key ] ) ? $_POST[ $key ] : '';
		}
		
		$cp_designer->update_option( 'general_settings', $options );
	}
	
	public function handle_ajax_request() {
		
	}
    public function display() {
        global $cp_designer;
        
        $options = $cp_designer->get_option('general_settings');
        ?>
<div class="icon32" id="icon-options-general"><br></div>
<h2>Contact Page Designer Setting</h2>
<form method="post">
	<h3>Google Captcha Setting</h3>
	<table class="form-table">
		<tbody>                                            			        
			<tr>
				<th scope="row">Public key</th>
				<td><input type="text" name="captcha_pubkey" id="captcha_pubkey" value="<?php echo $options['captcha_pubkey']; ?>" /></td>
			</tr>                         
			<tr>
				<th scope="row">Private key</th>
				<td><input type="text" name="captcha_privkey" id="captcha_privkey" value="<?php echo $options['captcha_privkey']; ?>"/></td>
			</tr>                         
		</tbody>	
	</table>
	<h3>Popup Setting</h3>
    <table class="form-table">
		<tbody>
			<tr>
				<th scope="row"> Auto display when home page</th>
				<td>
                    <select style="width:190px;" id="entry_template" name="entry_template" >
                        <option value="">None</option>
                        <?php
                        require_once( 'includes/template.php' );
                        
                        $templates = ContactFormTemplate::get_templates();
                        
                        for( $i = 0; $i < count( $templates ); $i++ ){
                            $tmp_name = trim($templates[$i]->tmp_name);
                            echo "<option value='" . $templates[ $i ]->id . "' ";
                                $this->select_option( $templates[ $i ]->id, $options['entry_template'], "selected" );
                            echo ">{$tmp_name}</option>";
                        }
                        ?>
                    </select>
                </td>
			</tr>
        </tbody>
    </table>
	<br/>
	<input type="hidden" name="cp_designer" value="update-setting"/>
	<input type="submit" value="Save Changes" name="update-button" id="update-button" class="button-primary" />                        
</form>
<script>
	jQuery('#popup_status').click(function(){
		if( jQuery( this ).attr( 'checked' ) != 'checked' ){
			jQuery( this ).parent().parent().siblings().hide();			
		}else{
			jQuery( this ).parent().parent().siblings().show();
		}
	})
</script>
	<?php
	}
}