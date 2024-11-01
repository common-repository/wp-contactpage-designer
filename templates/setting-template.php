<div class="EditTemplate">
	<div id="template_tabs" class="tabs">
		<ul>
			<li><a href="#panel_template_general">General</a></li>
			<li><a href="#panel_template_mail">Mail</a></li>
			<li><a href="#panel_template_message">Message</a></li>
			<!--<li><a href="#panel_template_popup">Popup</a></li>-->
		</ul>
		<!-- general panel -->
		<div id="panel_template_general">
			<div class="separate"> </div>
      
			<?php $this->get_template_part( 'property', 'size' ); ?>

			<div class="separate"> </div>
			<label>Font Color</label>
			<input name="color" type="text" placeholder="Font Color" value="" />
			<div class="colorPalette" title="Pick Color"> </div>
			<div class="separate"> </div>

			<label>Background Color</label>
			<input name="bgcolor" type="text" placeholder="BG Color" value="" />
			<div class="colorPalette" title="Pick Color"> </div>
			<div class="separate"> </div>

			<label>Background Image</label>
			<input name="bgimage" type="text" placeholder="Source" value="" />
			<div class="separate"> </div>

			<label>Background Repeat</label>
			<select name="bgrepeat">
				<option value="no-repeat">no-repeat</option>
				<option value="repeat-x">repeat-x</option>
				<option value="repeat-y">repeat-y</option>
				<option value="repeat">repeat</option>
			</select>
			<div class="separate"> </div>
		</div>
		<!-- end/general panel -->
		
		<!-- mail panel -->
		<div id="panel_template_mail">
			<div class="separate"> </div>
			<label>From Address</label>
			<input name="mail_from_addr" type="text" placeholder="From Address" value="" />
			
			<div class="separate"> </div>
			<label>To Address</label>
			<input name="mail_to_addr" type="text" placeholder="To Address" value="" />
			
			<div class="separate"> </div>
			<label>CC</label>
			<input name="mail_cc_addr" type="text" placeholder="CC" value="" />
			
			<div class="separate"> </div>
			<label>Subject</label>
			<input name="mail_subject" type="text" placeholder="Subject" value="" />
			
			<div class="separate"> </div>
		</div>
		<!-- end/mail panel -->
		
		<!-- message panel -->
		<div id="panel_template_message">
			<div class="separate"> </div>
			<label>Success Time</label>
			<input type="text" class="width_50" name="time_success" placeholder="Success Time" />&nbsp;sec
			
			<div class="separate"> </div>
			<label>Fail Time</label>
			<input type="text" class="width_50" name="time_fail" placeholder="Fail Time" />&nbsp;sec
			
			<div class="separate"> </div>
			<label>Success</label>
			<textarea name="msg_success" placeholder="Success Message"></textarea>
			
			<div class="separate"> </div>
			<label>Fail</label>
			<textarea name="msg_fail" placeholder="Fail Message" ></textarea>
			
			<div class="separate"> </div>
		</div>
		<!-- end/message panel -->
    
<!--		<div id="panel_template_popup">
			<div class="separate"> </div>
			<label>DOM Popup</label>
			<input name="enable_popup" type="checkbox" value="enable" />
			<div class="separate"> </div>

			<label>DOM ID</label>
			<input name="popup_dom_id" type="text" value="" />
			<div class="separate"> </div>

			<label>Welcome Popup</label>
			<input name="welcome_popup" type="checkbox" value="enable" />
			<div class="separate"> </div>
		</div>-->
	</div>

	<input type="button" value="Apply Changes" />
</div>