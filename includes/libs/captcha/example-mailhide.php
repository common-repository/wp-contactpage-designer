<?php
/*------------------------------------------------------------------------
# com_cpd - custom contact form
# ------------------------------------------------------------------------
# author    Jason Murray or contactpagedesigner
# copyright Copyright (C) 2010 contactpagedesigner.com. All Rights Reserved.
# @license - http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
# Websites: http://www.contactpagedesigner.com
# Technical Support:  Forum - http://www.support.contactpagedesigner.com
-------------------------------------------------------------------------*/

?>
<html><body>
<?
require_once ("recaptchalib.php");

// get a key at http://www.google.com/recaptcha/mailhide/apikey
$mailhide_pubkey = '';
$mailhide_privkey = '';

?>

The Mailhide version of example@example.com is
<? echo recaptcha_mailhide_html ($mailhide_pubkey, $mailhide_privkey, "example@example.com"); ?>. <br>

The url for the email is:
<? echo recaptcha_mailhide_url ($mailhide_pubkey, $mailhide_privkey, "example@example.com"); ?> <br>

</body></html>
