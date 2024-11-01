<div class="FacebookSettings">
	<div class="tabs">
		<ul>
			<li><a href="#panel_facebook_general">General</a></li>
			<li><a href="#panel_facebook_position">Position</a></li>
		</ul>
		<div id="panel_facebook_general">
			<label>URL to Like</label>
			<input name="urltolike" class="Facebooktolike" type="text" value="" />
			<div class="separate"> </div>
		</div>

		<div id="panel_facebook_position">	
			<?php $this->get_template_part( 'property', 'position' ); ?>
		</div>
	</div>
	<input type="button" value="Apply Changes" />
</div>