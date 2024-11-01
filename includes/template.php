<?php
require_once( 'element.php' );

class ContactFormTemplate {
    private $id;
    private $name;
    private $size;
	private $css;
	private $mail_from_addr;
	private $mail_to_addr;
	private $mail_cc_addr;
	private $mail_subject;
	private $mailchimp_api_key;
	private $mailchimp_list_id;
	private $aweber_unit;
	private $aweber_form_id;
	private $msg_success;
	private $msg_fail;
	private $time_success;
	private $time_fail;
	private $enable_popup;
    private $elements;
	private $form_elements;
	
	private $errors;
    private static $unique_form_id = 0;
    
    function __construct() {
        $this->id = 0;
        $this->name = '';
		$this->css = '';
		$this->mail_from_addr = get_bloginfo( 'admin_email' );
		$this->mail_to_addr = '';
		$this->mail_cc_addr = '';
		$this->mail_subject = 'Contact Request from WP PLUGIN Pros';
		$this->mailchimp_api_key = '';
		$this->mailchimp_list_id = '';
		$this->aweber_unit = '';
		$this->aweber_form_id = '';
		$this->msg_success = 'Contact Request was sent successfully.';
		$this->msg_fail = 'Sorry. The problem occured while sending message.';
		$this->time_success = 3;
		$this->time_fail = 3;
		$this->enable_popup = false;
		
		$this->errors = array();
    }
	
	public function get( $name ) {
		return isset( $this->$name ) ? $this->$name : false;
	}
	
	public function validate_data( $data ) {
		$this->errors = array();
		
		$required_fields = array( 'name' );
		
		foreach ( $required_fields as $field ) {
			if ( !isset( $data[ $field ] ) || empty( $data[ $field ] ) ) 
				$this->errors[ $field ] = 'This field is required.';
		}
		
		if ( !empty( $this->errors ) ) 
			return $this->errors;
		
		$this->name = $data['name'];
		$this->css = $data['css'];
		$this->enable_popup = (int)$data['enable_popup'];
		$this->mail_from_addr = isset( $data['mail_from_addr'] ) ? $data['mail_from_addr'] : '';
		$this->mail_to_addr = isset( $data['mail_to_addr'] ) ? $data['mail_to_addr'] : '';
		$this->mail_cc_addr = isset( $data['mail_cc_addr'] ) ? $data['mail_cc_addr'] : '';
		$this->mail_subject = isset( $data['mail_subject'] ) ? $data['mail_subject'] : '';
		$this->mailchimp_api_key = isset( $data['mailchimp_api_key'] ) ? $data['mailchimp_api_key'] : '';
		$this->mailchimp_list_id = isset( $data['mailchimp_list_id'] ) ? $data['mailchimp_list_id'] : '';
		$this->aweber_unit = isset( $data['aweber_unit'] ) ? $data['aweber_unit'] : '';
		$this->aweber_form_id = isset( $data['aweber_form_id'] ) ? $data['aweber_form_id'] : '';
		$this->msg_success = isset( $data['msg_success'] ) ? $data['msg_success'] : '';
		$this->msg_fail = isset( $data['msg_fail'] ) ? $data['msg_fail'] : '';
        
        // get elements
        $this->elements = array();
        
		if ( isset( $data['elements'] ) && is_array( $data['elements'] ) ) {
			$this->elements = $data['elements'];
		}
		
		return true;
	}
	
	public function create_element( $row ) {
		$new_param = array();
		$new_css = array();
		
		$row->css = stripslashes( $row->css );
		$row->params = stripslashes( $row->params );
		$row->text = stripslashes( $row->text );
		$row->value = stripslashes( $row->value );
		
		// Change single quote to double quote
		$row->css = str_replace( "'", '"', $row->css );
		
		$element_css = explode('||',$row->css);
		foreach ($element_css as $css) :
			$css = explode( '::', $css );
			$new_css[$css[0]] = $css[1];
		endforeach;

		$element_params = explode('||',$row->params);
		foreach ($element_params as $param) :
			$param = explode('::',$param);
			$new_param[$param[0]] = $param[1];
		endforeach;

		switch ( $row->control ) {
			case 'Quantity':
				$element = new QuantityElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Paypal':
				$element = new PaypalElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Download':
				$element = new DownloadElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Field':
                $element = new FieldElement( $new_param, $new_css, $row->text, $row->value );
				break;
            
			case 'Mail':
                $element = new MailElement( $new_param, $new_css, $row->text, $row->value );
				break;
            
			case 'Submit':
				$element = new SubmitElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Captcha':
				$cp_option = CPDesigner::get_option( 'general_settings' );					
				$element = new CaptchaElement( $new_param, $new_css, $row->text, $row->value );
				$element->set_key( $cp_option['captcha_pubkey'], $cp_option['captcha_privkey'] );
				break;
			
			case 'Map':
				$element = new MapElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Img':
				$element = new ImageElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Textarea':
				$element = new TextAreaElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Address':
				$row->value = empty( $row->value ) ? 'world-states' : $row->value;
				$element = new AddressElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Facebook':
				$element = new FacebookElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Twitter':
				$element = new TwitterElement( $new_param, $new_css, $row->text, $row->value );	
				break;
			
			case 'Checkbox':
				$element = new CheckboxElement( $new_param, $new_css, $row->text, $row->value );		
				break;
			
			case 'MultipleChoice':
				$element = new MultipleChoiceElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Date':
				$element = new DateElement( $new_param, $new_css, $row->text, $row->value );	
				break;
			
			case 'Time':
				$element = new TimeElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Price':
				$element = new PriceElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Total':
				$element = new TotalElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Popup':
				$element = new PopupElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Label':
				$element = new LabelElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Paragraph':
				$element = new ParagraphElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			case 'Select':
				$element = new SelectElement( $new_param, $new_css, $row->text, $row->value );
				break;
			
			default:
				$element = new OtherElement( $row->control, $new_param, $new_css, $row->text, $row->value );
				break;
			
		}
		
		return $element;
	}
    
    /**
     * This function was for previous version.
     */
    public function old_create_element( $options ) {
		$new_param = array();
		$new_css = array();
		
		$element_css = explode('||',$options->css);
		foreach ($element_css as $css) :
			$css = explode( '::', $css );
			$new_css[$css[0]] = $css[1];
		endforeach;

		$element_params = explode('||',$options->params);
		foreach ($element_params as $param) :
			$param = explode('::',$param);
			$new_param[$param[0]] = $param[1];
		endforeach;

		switch ( $new_param['tag'] ) :
			case 'INPUT' :
				if ( $new_param['data'] == 'CreateQuantity' )
					$element = new QuantityElement( $new_param, $new_css, $options->text, $options->value );
				else if ( $new_param['class'] == 'paypal' )
					$element = new PaypalElement( $new_param, $new_css, $options->text, $options->value );
				else if ( $new_param['type'] == 'text' )
					$element = new FieldElement( $new_param, $new_css, $options->text, $options->value );
                else if ( $new_param['type'] == 'email' )
					$element = new MailElement( $new_param, $new_css, $options->text, $options->value );
                else if ( $new_param['type'] == 'submit' )
					$element = new SubmitElement( $new_param, $new_css, $options->text, $options->value );
				break;
			case 'IMG' :
				if ( $new_param['class'] == 'captcha' ) {
					$options = CPDesigner::get_option( 'general_settings' );					
					$element = new CaptchaElement( $new_param, $new_css, $options->text, $options->value );
					$element->set_key( $options['captcha_pubkey'], $options['captcha_privkey'] );
				} else if ( $new_param['class'] == 'map' ) {
					$element = new MapElement( $new_param, $new_css, $options->text, $options->value );
				} else {
					$element = new ImageElement( $new_param, $new_css, $options->text, $options->value );
				}
				break;
			case 'TEXTAREA':
				$element = new TextAreaElement( $new_param, $new_css, $options->text, $options->value );
				break;
			case 'DIV' :
				$data = $new_param['data'];				
				$options->value = empty( $options->value ) ? 'world-states' : $options->value;
				if ($data == 'addressModified')
					$element = new AddressElement( $new_param, $new_css, $options->text, $options->value );
				else if ($data == 'CreateFaceBook')
					$element = new FacebookElement( $new_param, $new_css, $options->text, $options->value );
				else if ($data == 'CreateTwitter')
					$element = new TwitterElement( $new_param, $new_css, $options->text, $options->value );				
				else if ($data == 'Checkbox')
					$element = new CheckboxElement( $new_param, $new_css, $options->text, $options->value );				
				else if ($data == 'MultipleChoice')
					$element = new MultipleChoiceElement( $new_param, $new_css, $options->text, $options->value );				
				else if ($data == 'CreateDate')
					$element = new DateElement( $new_param, $new_css, $options->text, $options->value );				
				else if ($data == 'CreateTime')
					$element = new TimeElement( $new_param, $new_css, $options->text, $options->value );				
				break;
			case 'LABEL':
				$data = $new_param['data'];
				if ($data == 'CreatePrice')
					$element = new PriceElement( $new_param, $new_css, $options->text, $options->value );
				else if ($data == 'CreateTotal')
					$element = new TotalElement( $new_param, $new_css, $options->text, $options->value );
				else
					$element = new LabelElement( $new_param, $new_css, $options->text, $options->value );
				break;
			
			case 'P':
				$element = new ParagraphElement( $new_param, $new_css, $options->text, $options->value );
				break;
			
			case 'SELECT':
				$element = new SelectElement( $new_param, $new_css, $options->text, $options->value );
				break;
			
			default:
				$element = new OtherElement( 'Other', $new_param, $new_css, $options->text, $options->value );
		endswitch;
		
		return $element;
	}
    
    public function load( $template_id ) {  
        global $wpdb;
        
        $template = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}cpd_templates WHERE id=%d", $template_id ) );
        if ( !$template )
            return false;
		
        $this->id = $template_id;
        $this->name = $template->tmp_name;
        $this->css = $template->tmp_css;
		$this->enable_popup = $template->enable_popup;
		
		// load settings
		$this->mail_from_addr = get_option ( "cp_tmp" . $this->id . "mail_from_addr", '' );
		$this->mail_to_addr = get_option ( "cp_tmp" . $this->id . "mail_to_addr", '' );
		$this->mail_cc_addr = get_option ( "cp_tmp" . $this->id . "mail_cc_addr", '' );
		$this->mail_subject = get_option ( "cp_tmp" . $this->id . "mail_subject", 'Contact Request from WP PLUGIN Pros' );
		$this->mailchimp_api_key = get_option ( "cp_tmp" . $this->id . "mailchimp_api_key", '' );
		$this->mailchimp_list_id = get_option ( "cp_tmp" . $this->id . "mailchimp_list_id", '' );
		$this->aweber_unit = get_option ( "cp_tmp" . $this->id . "aweber_unit", '' );
		$this->aweber_form_id = get_option ( "cp_tmp" . $this->id . "aweber_form_id", '' );
		$this->msg_success = get_option ( "cp_tmp" . $this->id . "msg_success", 'Contact Request was sent successfully.' );
		$this->msg_fail = get_option ( "cp_tmp" . $this->id . "msg_fail", 'Sorry. The problem occured while sending message.' );
		
		// load elements
        $elements = $wpdb->get_results( $wpdb->prepare( "SELECT control, css, text, value, params FROM {$wpdb->prefix}cpd_elements WHERE tmp_id=%d", $template_id ) );
		
        $this->form_elements = array();		
        foreach ($elements as $k => $element) {		
			$form_element = empty( $element->control ) ? $this->old_create_element( $element ) : $this->create_element( $element );
			if ( !is_null( $form_element ) )
				$this->form_elements[] = $form_element;
		}
		
		return true;
    }
    
    public function load_byName( $name ) {
        global $wpdb;
        
        $template = $wpdb->get_row( $wpdb->prepare( "SELECT id FROM {$wpdb->prefix}cpd_templates WHERE tmp_name=%s'", $name ) );
        if ( !$template )
            return false;
		
        return $this->load( $template->id );
    }
    
    public function save() {
        global $wpdb;
		
		if ( !empty( $this->errors ) ) 
			return $this->errors;
        
		if ( !$this->id ) {
			// create new template
			$wpdb->insert( 
				"{$wpdb->prefix}cpd_templates",
				array( 
					'tmp_name'		=> $this->name, 
					'tmp_css'		=> $this->css,
					'enable_popup'	=> $this->enable_popup,
				)
			);
			$this->id = $wpdb->insert_id;
		} else {
			// update template
			$wpdb->update( 
				"{$wpdb->prefix}cpd_templates",
				array( 
					'tmp_name'		=> $this->name, 
					'tmp_css'		=> $this->css,
					'enable_popup'	=> $this->enable_popup,
				),
				array( 'id' => $this->id )
			);
		}
		
		// update settings
		update_option ( "cp_tmp" . $this->id . "mail_from_addr", $this->mail_from_addr );
		update_option ( "cp_tmp" . $this->id . "mail_to_addr", $this->mail_to_addr );
		update_option ( "cp_tmp" . $this->id . "mail_cc_addr", $this->mail_cc_addr );
		update_option ( "cp_tmp" . $this->id . "mail_subject", $this->mail_subject );
		update_option ( "cp_tmp" . $this->id . "mailchimp_api_key", $this->mailchimp_api_key );
		update_option ( "cp_tmp" . $this->id . "mailchimp_list_id", $this->mailchimp_list_id );
		update_option ( "cp_tmp" . $this->id . "aweber_unit", $this->aweber_unit );
		update_option ( "cp_tmp" . $this->id . "aweber_form_id", $this->aweber_form_id );
		update_option ( "cp_tmp" . $this->id . "msg_success", $this->msg_success );
		update_option ( "cp_tmp" . $this->id . "msg_fail", $this->msg_fail );
        
		// remove old elements
		$query = $wpdb->prepare( "DELETE FROM `{$wpdb->prefix}cpd_elements` WHERE `tmp_id` = %d ", $this->id );
        $wpdb->query( $query );
		
		// save template elements
        foreach ( $this->elements as $element ):
            $wpdb->insert( "{$wpdb->prefix}cpd_elements",
                array( 
                    'control'	=> $element['control'], 
                    'css'		=> $element['css'], 
                    'text'		=> $element['text'], 
                    'value'		=> $element['value'], 
                    'params'	=> $element['param'], 
                    'tmp_id'	=> $this->id 
                ),
                array( '%s', '%s', '%s', '%s', '%s', '%d' )
            );
        endforeach;
		
		return true;
    }
	
	public function remove() {
		self::delete_template_byId( $this->id );
		
		$this->id = 0;
	}
    
    public static function get_templates() {
        global $wpdb;
        
        $query = "SELECT * FROM `{$wpdb->prefix}cpd_templates` ";
        $templates = $wpdb->get_results( $query );
        
        return $templates;
    }
	
    public static function get_popup_templates() {
        global $wpdb;
        
        $query = "SELECT id, tmp_name AS name FROM `{$wpdb->prefix}cpd_templates` WHERE enable_popup = 1 ";
        $templates = $wpdb->get_results( $query, ARRAY_A );
        
        return $templates;
    }
	
    public static function delete_template_byId( $id ) {
        global $wpdb;
        
		// remove self
        $query = $wpdb->prepare( "DELETE FROM `{$wpdb->prefix}cpd_templates` WHERE `id` = %d ", $id );
        $wpdb->query( $query );
        
		// remove elements
        $query = $wpdb->prepare( "DELETE FROM `{$wpdb->prefix}cpd_elements` WHERE `tmp_id` = %d ", $id );
        $wpdb->query( $query );
		
		// delete
		delete_option( "cp_tmp" . $this->id . "mail_from_addr" );
		delete_option( "cp_tmp" . $this->id . "mail_to_addr" );
		delete_option( "cp_tmp" . $this->id . "mail_cc_addr" );
		delete_option( "cp_tmp" . $this->id . "mail_subject" );
		delete_option( "cp_tmp" . $this->id . "mailchimp_api_key" );
		delete_option( "cp_tmp" . $this->id . "mailchimp_list_id" );
		delete_option( "cp_tmp" . $this->id . "aweber_unit" );
		delete_option( "cp_tmp" . $this->id . "aweber_form_id" );
		delete_option( "cp_tmp" . $this->id . "msg_success" );
		delete_option( "cp_tmp" . $this->id . "msg_fail" );
    }
    
	public function to_array() {
		$template = array();

		$template['id'] = $this->id;
		$template['name'] = stripslashes( $this->name );
		$template['css'] = stripslashes( $this->css );
		$template['mail_from_addr'] = $this->mail_from_addr;
		$template['mail_to_addr'] = $this->mail_to_addr;
		$template['mail_cc_addr'] = $this->mail_cc_addr;
		$template['mail_subject'] = $this->mail_subject;
		$template['enable_popup'] = $this->enable_popup;
		$template['mailchimp_api_key'] = $this->mailchimp_api_key;
		$template['mailchimp_list_id'] = $this->mailchimp_list_id;
		$template['aweber_unit'] = $this->aweber_unit;
		$template['aweber_form_id'] = $this->aweber_form_id;
		$template['msg_success'] = $this->msg_success;
		$template['msg_fail'] = $this->msg_fail;
		$template['time_success'] = $this->time_success;
		$template['time_fail'] = $this->time_fail;
		$template['elements'] = array();
		
		if ( !empty( $this->form_elements ) ) {
			foreach ($this->form_elements as $element) {
				ob_start();

				$element->to_html();
				$template['elements'][] = ob_get_contents();

				ob_clean();
			}
		}
		
		return $template;
    }
    
    public function to_xml() {
		
		echo '<?xml version="1.0" encoding="utf-8"?>';
		echo '<response>';
		echo "<tmp_name><![CDATA[{$this->name}]]></tmp_name>";
		echo "<tmp_css><![CDATA[" .stripslashes( $this->css ) ."]]></tmp_css>";
		
		foreach ($this->form_elements as $element) :
			echo '<element><![CDATA[';
			$element->to_html();
			echo ']]></element>';
		endforeach;
		echo '</response>';
    }
	
	public function to_html( $success, $errors, $is_popup ) {
		require_once( CP_DESIGNER_PATH .'/includes/libs/captcha/recaptchalib.php' );
		
        self::$unique_form_id++;
		?>
		<div class="CPD">			
			<form id="cpdFormSumit_<?php echo self::$unique_form_id ?>" class="cpdFormSumit" method="post">
				<?php
				if ( !$is_popup && array_key_exists( $this->id, $success ) ) {
					echo "<div class='submit-success'>";					
					echo $success[$this->id];				
					echo "</div>";
				}
				if ( !$is_popup &&  array_key_exists( $this->id, $errors ) ) {
					echo "<div class='submit-error'>";					
					echo implode( '<br/>', $errors[$this->id] );					
					echo "</div>";
				}
				?>
				<ul style='position: relative;<?php echo stripslashes( $this->css ); ?>'>
					<?php 
					foreach ( $this->form_elements as $element ) {
						$element->to_form();
					}
					?>
				</ul>
				<input type="hidden" name="tmpid" value="<?php echo $this->id;?>" />
				<input type="hidden" name="cp_designer" value="contact_us"/>
				<?php wp_nonce_field( 'cpd_form', 'cpd_security_key' ); ?>
			</form>
			<script type="text/javascript" language="javascript">
				<?php
				$config = array(
					'baseUrl'		=> CP_DESIGNER_URL,
					'ajaxUrl'		=> admin_url('admin-ajax.php'),
					'isPopup'		=> (int)$is_popup,
					'timeSuccess'	=> $this->time_success * 1000,
					'timeFail'		=> $this->time_fail * 1000,
				);
				?>
				jQuery(document).ready(function(){
					try{
						var cpdForm = new CPD("<?php echo "cpdFormSumit_" . self::$unique_form_id;?>");
						cpdForm.init(<?php echo json_encode( $config ) ?>);
					}catch(e){
						
					}
				});  
			</script>
		</div>
		<?php
    }
	
	public function to_mail( $post_data, &$errors, &$emails ) {
		require_once( CP_DESIGNER_PATH .'/includes/libs/captcha/recaptchalib.php' );
		
        $required = array();
        $msg .= '<html><body><table>';
		
        foreach ( $this->form_elements as $element ) {
            $type = $element->get_type();
			$class_name = get_class( $element );
            if ( $type == 'email' )
                $emails[] = $post_data[$element->get_name()]; 
			
            if ( $element->is_required() ) {
				if ( $class_name == 'AddressElement' ) {
					$required[] = $post_data['street_address'];
					$required[] = $post_data['street_address2'];
					$required[] = $post_data['cityAddress'];
					$required[] = $post_data['regionAddress'];
					$required[] = $post_data['zipCodeAddress'];
					$required[] = $post_data['CountryAddress'];
				} else {
					$required[] = $post_data[$element->get_name()];
				}
			}
			
            if ( $class_name == 'CaptchaElement' ) {
				if ( !$element->is_valid( $post_data['recaptcha_challenge_field'], $post_data['recaptcha_response_field'] ) )
					$errors[] = 'Please input the correct captcha code';
			}
			
			$msg .= $element->to_mail( $post_data );
        }
		$msg .= '</table></body></html>';

        if ( @in_array( "", $required ) ) {
			$errors[] = 'Please fill the required fields!';
        }
		
		if ( count( $errors ) > 0 )
			return FALSE;
		
		return $msg;
    }
	
	public function mail( $data ) {
		$errors = array();
		$emails = array();
	}

    protected function replace_tags($string) {
        preg_match_all("/\{(.*?)\}+/", $string, $res);

        $streplace = array();
        if (is_array($res[1])) {
            foreach ($res[1] as $val):
                if (array_key_exists($val, $_POST)) {
                    $streplace["{" . $val . "}"] = $_POST[$val];
                }
                if ($val == 'br') {
                    $streplace["{" . $val . "}"] = '\n';
                }

            endforeach;
        }
        return str_replace(array_keys($streplace), array_values($streplace), $string);
    }
	
	function is_valid_mail($email){
		return eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $email);
	}
}