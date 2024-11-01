<div class="twitterSettings">
	<div class="tabs">
		<ul>
			<li><a href="#panel_download_general">General</a></li>
			<li><a href="#panel_download_position">Position</a></li>
		</ul>
		<div id="panel_download_general">
			<label>Twitter Account</label>
			<input name="Twitter" class="TwitterAccount" type="text" value="" />
			<div class="separate"> </div>
		</div>

		<div id="panel_download_position">	
			<?php $this->get_template_part( 'property', 'position' ); ?>
		</div>
	</div>
	<input type="button" value="Apply Changes" />
</div>