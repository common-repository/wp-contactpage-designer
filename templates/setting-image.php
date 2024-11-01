<div class="EditImg">
	<div class="tabs">
		<ul>
			<li><a href="#panel_image_general">General</a></li>
			<li><a href="#panel_image_position">Position</a></li>
			<li><a href="#panel_image_size">Size</a></li>
		</ul>
		<div id="panel_image_general">
			<label>Image Source</label>
			<input name="Source" type="text" placeholder="Source" value="" id="img_source" />
			<a href="media-upload.php?TB_iframe=1&amp;width=640&amp;height=325" class="thickbox add_media" id="content-add_media" title="Add Media" onclick="return false;"><img src="<?php echo admin_url('images/media-button.png?ver=20111005'); ?>" width="15" height="15"></a>
			<div class="separate"> </div>
		</div>

		<div id="panel_image_position">	
			<?php $this->get_template_part( 'property', 'position' ); ?>
		</div>
		
		<div id="panel_image_size">
			<?php $this->get_template_part( 'property', 'size' ); ?>
		</div>
	</div>

	<input type="button" value="Apply Changes" />
</div>