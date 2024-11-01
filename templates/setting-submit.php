<div class="EditInputSubmit">
	<div class="tabs">
		<ul>
			<li><a href="#panel_submit_general">General</a></li>
			<li><a href="#panel_submit_position">Position</a></li>
			<li><a href="#panel_submit_size">Size</a></li>
			<li><a href="#panel_submit_font">Font</a></li>
			<li><a href="#panel_submit_background">Background</a></li>
		</ul>
		<div id="panel_submit_general">
			<label>Button Text</label>
			<input name="text" type="text" value="" />
			<div class="separate"> </div>
		</div>

		<div id="panel_submit_position">	
			<?php $this->get_template_part( 'property', 'position' ); ?>
		</div>
		
		<div id="panel_submit_size">
			<?php $this->get_template_part( 'property', 'size' ); ?>
		</div>
		
		<div id="panel_submit_font">
			<?php $this->get_template_part( 'property', 'font' ); ?>
		</div>
		
		<div id="panel_submit_background">
			<?php $this->get_template_part( 'property', 'background' ); ?>
		</div>
	</div>

	<input type="button" value="Apply Changes" />
</div>