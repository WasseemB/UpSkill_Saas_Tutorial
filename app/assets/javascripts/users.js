/* global $, Stripe */
//Document ready.
$(document).on('turbolinks:load',function() {
  var theForm = $('#pro-form');
  var submitBtn = $('form-signup-btn');
  
  //Set Stripe public key.
  Stripe.setPublishableKey($('meta[name="stripe-key"]').attr('content'));
  
  //When user clicks form submit btn,
  submitBtn.click(function(event){
  //prevent default submission behavior.
    event.preventDefault()
    submitBtn.val("Processing").prop('disabled',true);
  //Collect the credit card fields.
    var ccNum = $('#card-number').val(),
        cvcNum = $('#card-code').val(),
        expMonth = $('#card-month').val(),
        expYear = $('#card-year').val();
        
  //User stripe js library to check for errors
    var error = false;
    
    //Validate card number
    if(!Stripe.card.validateCardNumber(ccNum)){
      error = true
      alert("The credit card numbers appear to be invalid");
    }
    //Validate cvc number
    if(!Stripe.card.validateCVC(cvcNum)){
      error = true
      alert("The cvc numbers appear to be invalid");
    }
    //Validate expiration date
    if(!Stripe.card.validExpiry(expMonth,expYear)){
      error = true
      alert("Expiration date appears to be invalid");
    }
  
    if(error){
      //If there is card errors do not send to stripe.
      submitBtn.val("Sign Up").prop('disabled',false);
    } else {
      Stripe.createToken({
      number : ccNum,
      cvc : cvcNum,
      exp_month : expMonth,
      exp_year : expYear
    }, stripeResponseHandler);
    }
    //Send the card info to Stripe.
  
    return false;
  });
  
  //Stripe will return a card token.
  function stripeResponseHandler(status,response){
    //Get the token from the response
    var token = response.id;
    
    //Inject the card token in a hidden field
    theForm.append($('<input type="hidden" name="user[stripe-card-token]">').val(token));
    //Submit form to our Rails app.
    theForm.get(0).submit();
  };
});