// login & register form toggle function

$( "#registerToggle" ).click(function() {
	// Hide Sign In and show Sign Up
	$( '.ui.form.login-form' ).hide();
	$( '.ui.form.register-form' ).fadeIn();
	$(this).hide();
	$("#loginToggle").fadeIn();
});
$( "#loginToggle" ).click(function() {
	// Hide Sign Up and show Sign In
	$( '.ui.form.register-form' ).hide();
	$( '.ui.form.login-form' ).fadeIn();
	$(this).hide();
	$("#registerToggle").fadeIn();
});