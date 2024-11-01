<div class="EditParagraph">
	<div class="tabs">
		<ul>
			<li><a href="#panel_paragraph_general">General</a></li>
			<li><a href="#panel_paragraph_position">Position</a></li>
			<li><a href="#panel_paragraph_size">Size</a></li>
			<li><a href="#panel_paragraph_font">Font</a></li>
		</ul>
		<div id="panel_paragraph_general">
			<label>Paragraph Text</label>
			<div class="separate"> </div>
			<textarea name="text" >  </textarea>
			<div class="separate"> </div>
		</div>

		<div id="panel_paragraph_position">	
			<?php $this->get_template_part( 'property', 'position' ); ?>
		</div>
		
		<div id="panel_paragraph_size">
			<label>Width</label>
			<input name="width" type="text" placeholder="Width" value="" />
			<label style="text-indent:10px">px</label>
			<div class="separate"> </div>

			<div class="widthSlider" style="width:100%; margin-bottom:5px;"> </div>
			<div class="separate"> </div>
		</div>
		
		<div id="panel_paragraph_font">
			<?php $this->get_template_part( 'property', 'font' ); ?>
		</div>
	</div>

	<input type="button" value="Apply Changes" />
</div>