<div class="EditMap">
	<div class="tabs">
		<ul>
			<li><a href="#panel_map_general">General</a></li>
			<li><a href="#panel_map_position">Position</a></li>
			<li><a href="#panel_map_size">Size</a></li>
		</ul>
		<div id="panel_map_general">
			<label>Location</label>
			<input name="location" type="text" placeholder="Map Location" value="" />
			<div class="separate"> </div>

			<label>Map Type</label>
			<select class="MapType">
				<option value="terrain">Terrain</option>
				<option value="roadmap">Road Map</option>
				<option value="satellite">Satellite</option>
				<option value="hybrid">Hybrid</option>
			</select>
			<div class="separate"> </div>

			<label>Map Zoom</label>
			<select class="zoom">
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
				<option value="6">6</option>
				<option value="7">7</option>
				<option value="8">8</option>
				<option value="9">9</option>
				<option value="10">10</option>
				<option value="11">11</option>
				<option value="12">12</option>
				<option value="13">13</option>
				<option value="14">14</option>
				<option value="15">15</option>
			</select>
			<div class="separate"> </div>
		</div>

		<div id="panel_map_position">	
			<?php $this->get_template_part( 'property', 'position' ); ?>
		</div>
		
		<div id="panel_map_size">
			<?php $this->get_template_part( 'property', 'size' ); ?>
		</div>
	</div>

	<input type="button" value="Apply Changes" />
</div>