<div class="EditButtonPopup">
	<div class="separate"> </div>
	<label>Button Text</label>
	<input type="text" name="text" value="" />
	
	<div class="separate"> </div>
	<label>Contact Form ID</label>
	<input type="text" name="cp_template_id" class="width_50" id="cp_template_id" value="" />&nbsp;<a href="#" id="btn_show_popup_template">Insert</a>
	
	<div class="separate"> </div>
	
	<?php $this->get_template_part( 'property', 'position' ); ?>
	<?php $this->get_template_part( 'property', 'size' ); ?>
	<?php $this->get_template_part( 'property', 'background' ); ?>
	<?php $this->get_template_part( 'property', 'font' ); ?>

	<input type="button" value="Apply Changes" />
</div>
<div id="popup_popup_templates" title="Select Contact Form">
	<label>Popup Templates:</label>
	<select name="popup_templates" id="popup_templates">
		
	</select>
</div>