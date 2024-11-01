<div class="EditLabel">
	<div class="tabs">
		<ul>
			<li><a href="#panel_label_general">General</a></li>
			<li><a href="#panel_label_position">Position</a></li>
			<li><a href="#panel_label_font">Font</a></li>
			<li><a href="#panel_label_background">Background</a></li>
		</ul>
		<div id="panel_label_general">
			<label>Label Text</label>
			<div class="separate"> </div>
			<textarea name="text" >  </textarea>
			<div class="separate"> </div>
		</div>

		<div id="panel_label_position">	
			<?php $this->get_template_part( 'property', 'position' ); ?>
		</div>
		
		<div id="panel_label_font">
			<?php $this->get_template_part( 'property', 'font' ); ?>
		</div>
		
		<div id="panel_label_background">
			<?php $this->get_template_part( 'property', 'background' ); ?>
		</div>
	</div>
	
	<input type="button" value="Apply Changes" />
</div>