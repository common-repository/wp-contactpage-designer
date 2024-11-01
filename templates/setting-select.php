<div class="EditSelect">
	<div class="tabs">
		<ul>
			<li><a href="#panel_select_general">General</a></li>
			<li><a href="#panel_select_position">Position</a></li>
			<li><a href="#panel_select_size">Size</a></li>
			<li><a href="#panel_select_font">Font</a></li>
			<li><a href="#panel_select_background">Background</a></li>
		</ul>
		<div id="panel_select_general">
			<label>Required</label>
			<input class="required" type="checkbox" />
			<div class="separate"> </div>

			<label>Input Name</label>
			<input class="name"  type="text" value="" />
			<div class="separate"> </div>
			
			<label>Available Choices (one every line)</label>
			<a class="importButton" href="javascript:void(0);" onclick="CPD.ShowImportMenu();">Import</a>
			<div class="separate"> </div>
			<div class="selectChoiseDropDown" style="display: none;">
				<span>Import choices:</span>
				<ul>
					<?php
					$i = 1;
					$choices = $this->insert_choise();
					foreach ($choices as $key => $value):
						?>
						<li><a href="javascript:void(0);" onclick="CPD.importDropDownOptions(<?php echo $i; ?>);"><?php echo $key ?></a></li>
						<div style="display: none;" class="importChoise_<?php echo $i ?>">
						<?php echo implode(',', $value); ?>
						</div>
						<?php $i++;
					endforeach;
					?> 
				</ul>
			</div>
			<textarea name="dropdown" id="dropdownOption">
Choice1
Choice2
Choice3</textarea> 
			<div class="separate"> </div>
		</div>

		<div id="panel_select_position">	
			<?php $this->get_template_part( 'property', 'position' ); ?>
		</div>
		
		<div id="panel_select_size">
			<?php $this->get_template_part( 'property', 'size' ); ?>
		</div>
		
		<div id="panel_select_font">
			<?php $this->get_template_part( 'property', 'font' ); ?>
		</div>
		
		<div id="panel_select_background">
			<?php $this->get_template_part( 'property', 'background' ); ?>
		</div>
	</div>
	
	<input type="button" value="Apply Changes" />
</div> 