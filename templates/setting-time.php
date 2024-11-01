<div class="EditTime">
	<div class="tabs">
		<ul>
			<li><a href="#panel_time_general">General</a></li>
			<li><a href="#panel_time_position">Position</a></li>
			<li><a href="#panel_time_size">Size</a></li>
			<li><a href="#panel_time_font">Font</a></li>
		</ul>
		<div id="panel_time_general">
			<label>Required</label>
			<input class="required" type="checkbox" />
			<div class="separate"> </div>

			<label>Time Name</label>
			<input class="name" type="text" value="" />
			<div class="separate"> </div>

			<label>Time Format</label>
			<select name="time_format" id="time_format">
				<option value="1">12 hours</option>
				<option value="0">24 hours</option>
			</select>			
			<div class="separate"> </div>
		</div>

		<div id="panel_time_position">	
			<?php $this->get_template_part( 'property', 'position' ); ?>
		</div>
		
		<div id="panel_time_size">
			<?php $this->get_template_part( 'property', 'size' ); ?>
		</div>
		
		<div id="panel_time_font">
			<?php $this->get_template_part( 'property', 'font' ); ?>
		</div>
	</div>

	<input type="button" value="Apply Changes" />
</div>
<!-- end EditTime-->