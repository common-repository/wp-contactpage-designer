<div class="EditEmailField">
	<div class="tabs">
		<ul>
			<li><a href="#panel_email_general">General</a></li>
			<li><a href="#panel_email_position">Position</a></li>
			<li><a href="#panel_email_size">Size</a></li>
			<li><a href="#panel_email_font">Font</a></li>
			<li><a href="#panel_email_background">Background</a></li>
		</ul>
		<div id="panel_email_general">
			<label>Required</label>
			<input class="required" type="checkbox" />
			<div class="separate"> </div>
			
			<label>E-Mail Text</label>
			<div class="separate"> </div>
			<textarea name="text" >  </textarea>
			<div class="separate"> </div>

			<label>Placeholder</label>
			<input class="placeholder" type="text" value="" />
			<div class="separate"> </div>

			<label>Input Name</label>
			<input class="name" type="text" value="" />
			<div class="separate"> </div>
		</div>

		<div id="panel_email_position">	
			<?php $this->get_template_part( 'property', 'position' ); ?>
		</div>
		
		<div id="panel_email_size">
			<?php $this->get_template_part( 'property', 'size' ); ?>
		</div>
		
		<div id="panel_email_font">
			<?php $this->get_template_part( 'property', 'font' ); ?>
		</div>
		
		<div id="panel_email_background">
			<?php $this->get_template_part( 'property', 'background' ); ?>
		</div>
	</div>
	<input type="button" value="Apply Changes" />
</div>