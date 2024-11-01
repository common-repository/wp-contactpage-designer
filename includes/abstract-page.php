<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
if ( !class_exists( 'SubPage' ) ) :
abstract class SubPage{
	
	protected $errors;
	
	public function __construct(){
		$this->errors = array();
	}
	
	function print_option_tags( $options, $option_value=null ) {
		if ( !is_array( $options ) )
			return;
		foreach ( $options as $value => $text ) {
			$selected = '';
			if ( $value == $option_value ) $selected = 'selected="selected"';
			if ( is_array($option_value) )
				foreach( $option_value as $ovalue)
					if (  $value == $ovalue ) $selected = 'selected="selected"';
			echo "<option value='$value' $selected>$text</option>" .chr(13);
		}
	}
	
	protected function select_option( $value, $check, $attr ) {
		if ( $value == $check )
			echo "$attr='$attr'";
	}
	
	protected function show_error( $field ) {
		if ( isset( $this->errors[ $field ] ) )
			echo "<span class='errors' id='error-$field' style='display:inline-block'>{$this->errors[ $field ]}</span>";
		else
			echo "<span class='errors' id='error-$field'></span>";
	}
	
	protected function show_validator_errors() {
		if ( empty( $this->errors ) )
			return;
		foreach ( $this->errors as $key => $value ) {
			echo "validator.showErrors({'$key' : '$value'});" . chr(13);
		}
	}
    
    public function paginate( $count_posts, $pagenum, $per_page, $url = false ) {
		$allpages = ceil( $count_posts / $per_page );
		$base = add_query_arg( 'paged', '%#%', $url );
		$page_links = paginate_links(array(
			'base' => $base,
			'format' => '',
			'prev_text' => __('&laquo;'),
			'next_text' => __('&raquo;'),
			'total' => $allpages,
			'current' => $pagenum
		));

		$page_links_text = sprintf('<span class="displaying-num">' . __('Displaying %s&#8211;%s of %s') . '</span>%s', number_format_i18n(( $pagenum - 1 ) * $per_page + 1), number_format_i18n(min($pagenum * $per_page, $count_posts)), number_format_i18n($count_posts), $page_links
		);
		echo $page_links_text;
	}
	
	abstract  public  function update();
	abstract  public  function display();
	abstract  public  function handle_ajax_request();
}
endif;
?>
