<?php

abstract class FormElement {
    protected $tag;
	protected $control;
    protected $param;
	protected $css;
    protected $text;
	protected $value;
    
    function __construct( $control, $param, $css, $text, $value ) {
		$this->control = $control;
		$this->param = $param;
		$this->css = $css;
		$this->text = $text;
		$this->value = $value;
    }
	
	function get_style() {
		$el_style = '';
		foreach ( array_slice( $this->css, 2 ) as $style => $css ) :
			$el_style .= $style . ':' . $css . ';';
		endforeach;
		
		return $el_style;
	}
	
	function get_list_style() {
		$el_style = 'position:absolute; list-style-type:none;';
		foreach ( array_slice( $this->css, 0, 2 ) as $style => $css )
			$el_style .= $style . ':' . $css . ';';
		return $el_style;
	}
	
	public function get_type() {
		return $this->param['type'];
	}
	
	public function get_name() {
		return $this->param['name'];
	}
	
	public function is_required() {
		return stripos( $this->param['class'], 'required' ) !== FALSE || $this->param['required'] == 'required';
	}
	
	public function to_html() {
		if ( $this->is_required() )
			echo "<li style='" .$this->get_list_style() ."' class='required'>";
		else
			echo "<li style='" .$this->get_list_style() ."'>";
		
		$this->html_content();
		echo "</li>";
	}
	
	public function form_content() {
		$this->html_content();
	}	
	
	public function to_form() {
		if ( $this->is_required() )
			echo "<li style='" .$this->get_list_style() ."' class='required'>";
		else
			echo "<li style='" .$this->get_list_style() ."'>";
		$this->form_content();
		echo "</li>";
	}
	
	abstract function html_content();		
	
	public function to_mail( $post_data ) {
		return "<tr>
					<th style='padding-right:20px;'>{$this->param['name']}</th>
					<td>{$post_data[$this->param['name']]}</td>
				</tr>";			
	}
}

class OtherElement extends FormElement {
    
	public function html_content() {
		echo "<{$this->param['tag']} control='$this->control' name='{$this->param['name']}' style='" .$this->get_style() ."' >" .stripslashes( $this->text ) ."</{$this->param['tag']}>";
	}

	public function to_mail( $post_data ) {
		if ( $this->param['tag'] == 'P' || $this->param['tag'] == 'SELECT' )
			return parent::to_mail ( $post_data );
		else
			return '';
	}
}

class LabelElement extends OtherElement {
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'Label', $param, $css, $text, $value );
    }
}
class ParagraphElement extends OtherElement {
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'Paragraph', $param, $css, $text, $value );
    }
}
class SelectElement extends OtherElement {
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'Select', $param, $css, $text, $value );
    }
}

class InputElement extends FormElement {
    
	public function html_content() {
		echo "<input class='{$this->param['class']}' control='$this->control' placeholder='{$this->param['placeholder']}' title='{$this->param['title']}' style='" .$this->get_style() . "' type='{$this->param['type']}' value='{$this->value}' name='{$this->param['name']}' />";
	}
	
	public function to_mail( $post_data ) {
		if ( $this->param['type'] == 'submit' )
			return '';
		else
			return parent::to_mail( $post_data );
	}
}

class FieldElement extends InputElement {
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'Field', $param, $css, $text, $value );
    }
}
class MailElement extends InputElement {
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'Mail', $param, $css, $text, $value );
    }
}
class SubmitElement extends InputElement {
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'Submit', $param, $css, $text, $value );
    }
}

class CheckboxElement extends FormElement {
    
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'Checkbox', $param, $css, $text, $value );
    }
    
	public function html_content() {		
		echo "<div id='checkbox' class='checkbox' control='$this->control' name='{$this->param['name']}' style='" .$this->get_style() . "'>";
		echo "<input type='checkbox' value='1' /><label>{$this->text}</label>";
		echo "</div>";
	}
	
	public function form_content() {		
		echo "<div class='checkbox' style='" .$this->get_style() . "'>";
		echo "<input type='checkbox' name='{$this->param['name']}' value='1' /><label>{$this->text}</label>";
		echo "</div>";
	}
	
	public function to_mail( $post_data ) {
		if ( isset( $post_data[$this->param['name']] ) )
			return "<tr>
						<th style='padding-right:20px;'>{$this->param['name']}</th>
						<td>{$this->text}</td>
					</tr>";	
		else
			return '';
	}
}

class TextAreaElement extends FormElement {
    
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'TextArea', $param, $css, $text, $value );
    }
    
	public function html_content() {
		if ( $this->param['class'] == 'required' )
			echo "<TEXTAREA placeholder='{$this->param['placeholder']}' control='$this->control' class='required' name='{$this->param['name']}' style='" . $this->get_style() . "'>{$this->text}</TEXTAREA>";		
		else
			echo "<TEXTAREA placeholder='{$this->param['placeholder']}' control='$this->control' name='{$this->param['name']}' style='" . $this->get_style() . "'>{$this->text}</TEXTAREA>";		
	}
}

class MapElement extends FormElement {
    
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'Map', $param, $css, $text, $value );
    }
    
	public function form_content() {
		echo "<img src='{$this->param['src']}' />";
	}
	
	public function html_content() {
		echo "<img class='map' control='$this->control' src='{$this->param['src']}' />";
	}
	
	public function to_mail( $post_data ) {
		return '';
	}
}

class FacebookElement extends FormElement {
    
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'Facebook', $param, $css, $text, $value );
    }
    
	public function html_content() {
		echo "<div id='facebook' class='facebook' control='$this->control' value='{$this->value}'></div>";
	}
	
	public function form_content() {
		ob_start();
		require_once( CP_DESIGNER_PATH .'/importdata/facebook.php' );
		$html_content = ob_get_contents();
		ob_clean();
		echo $html_content;
	}
	
	public function to_mail( $post_data ) {
		return '';
	}
}

class TwitterElement extends FormElement {
    
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'Twitter', $param, $css, $text, $value );
    }
    
	public function html_content() {
		echo "<div id='Twitter' class='Twitter' control='$this->control' value='{$this->value}'></div>";
	}
	
	public function form_content() {
		ob_start();
		require_once( CP_DESIGNER_PATH .'/importdata/twitter.php' );
		$html_content = ob_get_contents();
		ob_clean();
		
		$html_content = str_replace( '{twitter}', $this->value, $html_content );
		echo $html_content;
	}
	
	public function to_mail( $post_data ) {
		return '';
	}
}

class DateElement extends FormElement {
    
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'Date', $param, $css, $text, $value );
    }
    
	public function html_content() {
		$required = $this->param['required'] == 'required' ? "class='required'" : '';
		echo "<div class='date' control='$this->control' format='{$this->param['format']}' $required><input $required placeholder='{$this->param['placeholder']}' style='" .$this->get_style() . "' type='text' name='{$this->param['name']}' /></div>";
	}
}

class TimeElement extends FormElement {
    
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'Time', $param, $css, $text, $value );
    }
    
	public function html_content() {
		$required = $this->param['required'] == 'required' ? 'class="required"' : '';
		echo "<div class='time' control='$this->control' format='{$this->param['format']}' $required><input $required placeholder='{$this->param['placeholder']}' style='" .$this->get_style() . "' type='text' name='{$this->param['name']}' /><span></span></div>";
	}
}

class ImageElement extends FormElement {
    
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'Image', $param, $css, $text, $value );
    }
    
	public function html_content() {
		echo "<img  class='{$this->param['class']}' control='Img' style='position:relative;" .$this->get_style() ."' src='{$this->param['src']}' />";
	}
	
	public function to_mail( $post_data ) {
		return '';
	}
}

class PopupElement extends FormElement {
	
    function __construct( $param, $css, $text, $value ) {
        parent::__construct( 'Popup', $param, $css, $text, $value );
    }
    
	public function form_content() {
		echo "<input type='{$this->param['type']}' class='{$this->param['class']}' onclick=\"cpdDownload('{$this->param['url']}')\" style='" .$this->get_style() . "' value='{$this->value}' />";
	}
    
	public function html_content() {
		echo "<input type='{$this->param['type']}' control='$this->control' class='{$this->param['class']}' template_id='{$this->param['template_id']}' style='" .$this->get_style() . "' value='{$this->value}' />";
	}
	
	public function to_mail($post_data) {
		return '';
	}
}
