<!-- EditDate-->
<div class="EditDate">
	<div class="tabs">
		<ul>
			<li><a href="#panel_date_general">General</a></li>
			<li><a href="#panel_date_position">Position</a></li>
			<li><a href="#panel_date_size">Size</a></li>
			<li><a href="#panel_date_font">Font</a></li>
		</ul>
		<div id="panel_date_general">
			<label>Required</label>
			<input class="required" type="checkbox" />
			<div class="separate"> </div>

			<label>Date Name</label>
			<input class="name" type="text" value="" />
			<div class="separate"> </div>

			<label>Date Format</label>
			<select name="date_format" id="date_format">
				<option value="mm/dd/yy">Default - mm/dd/yy</option>
				<option value="dd/mm/yy">dd/mm/yy</option>
				<option value="yy-mm-dd">ISO 8601 - yy-mm-dd</option>
				<option value="d M, y">Short - d M, y</option>
				<option value="d MM, y">Medium - d MM, y</option>
				<option value="DD, d MM, yy">Full - DD, d MM, yy</option>
				<option value="'day' d 'of' MM 'in the year' yy">With text - 'day' d 'of' MM 'in the year' yy</option>
			</select>			
			<div class="separate"> </div>
		</div>

		<div id="panel_date_position">	
			<?php $this->get_template_part( 'property', 'position' ); ?>
		</div>
		
		<div id="panel_date_size">
			<?php $this->get_template_part( 'property', 'size' ); ?>
		</div>
		
		<div id="panel_date_font">
			<?php $this->get_template_part( 'property', 'font' ); ?>
		</div>
		
	</div>
	<input type="button" value="Apply Changes" />
</div>
<!-- end EditDate-->