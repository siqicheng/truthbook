// login & register form toggle function

$( "#registerToggle" ).click(function() {
	// Hide Sign In and show Sign Up
	$( '.ui.form.login-form' ).hide();
	$( '.ui.form.register-form' ).show();
	$( '.ui.form.register-form' ).transition('pulse');
	
	$(this).hide();
	$("#loginToggle").fadeIn();
});
$( "#loginToggle" ).click(function() {
	// Hide Sign Up and show Sign In
	$( '.ui.form.register-form' ).hide();
	$( '.ui.form.login-form' ).show();
	$( '.ui.form.login-form' ).transition('pulse');
	$(this).hide();
	$("#registerToggle").fadeIn();
});