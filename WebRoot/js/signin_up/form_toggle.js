// login & register form toggle function

$( "#registerToggle" ).click(function() {
	// Hide Sign In and show Sign Up
	$( '.ui.form.login-form' ).hide();
	$( '.ui.form.register-form' ).show();
	$( '.ui.form.register-form' ).transition('fade in up','1000ms');
	
	$(this).hide();
	$("#topAlertBar p").html(NO_REGISTER_NOW);
	$("#topAlertBar").animate({height:'show'},"slow");
	$('.absolute-center').animate({height:'500px'},"slow");
	$("#loginToggle").fadeIn();
});
$( "#loginToggle" ).click(function() {
	// Hide Sign Up and show Sign In
	$( '.ui.form.register-form' ).hide();
	$( '.ui.form.login-form' ).show();
	$( '.ui.form.login-form' ).transition('fade in up','1000ms');
	$(this).hide();
	$("#topAlertBar").animate({height:'hide'},"slow");
	$('.absolute-center').animate({height:'320px'},"slow");
	$("#registerToggle").fadeIn();
});