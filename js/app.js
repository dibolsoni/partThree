let total = 0;

function clearPage(){
  /* 
  TEXT INPUT CLEANER
  */
  $('#name').val('');
  $('#mail').val('');
  $('#other-title').val('');
  $('#cc-num').val('');
  $('#zip').val('');
  $('#cvv').val('');


  /* 
  CREDIT-CARD SELECT, HIDE OTHERS
  */
  $('#credit-card').show();
  $('#credit-card').next().hide();
  $('#credit-card').next().next().hide();

  /*  
  CHECKBOXES CLEANER
  */
  $('.activities input:checked').each(function() {
    $(this).prop('checked', false);
  })

  /* 
  SELECT CLEANER
  */
  $("#title").prop("selectedIndex",0);
  $("#design").prop("selectedIndex",0);
  $("#color").prop("selectedIndex",0);
  $("#size").prop("selectedIndex",0);
  $("#select_method").prop("disabled",true);
  $("#payment").prop("selectedIndex",1);
}

function loadPage() { 
  /* 
  FOCUS ON FIRST ITEM
  */
  $('#name').focus();  


  /* 
  HIDE or DISABLE
  */
  $('#colors-js-puns').hide()
  $('#other-title').hide();
  $('#credit-card').next().hide();
  $('#credit-card').next().next().hide();



  /* 
  EVENT LISTENER
  */
 
  let validate = new Validate();
  $("#title").change(function (e) { 
    otherJob(e.target.value);    
  });
  $("#design").change(function (e) { 
    tShirt(e.target.value);    
  });

  $(".activities input").change(function (e) { 
    activitiesList(e.target.name, this);    
  });

  $("#payment").change(function (e) { 
    paymentList($(this).val());
    validate.clearPayment();    
  });

  $("#name").on('keyup change paste', function (e) { 
    validate.name(e.target.value, this);
  });
  $("#mail").on('keyup change paste', function (e) { 
    validate.email(e.target.value, this);
  });
  $("#cc-num").on('keyup change paste', function (e) { 
    if ($("#payment").val() === 'credit-card') {
      validate.creditcardn(e.target.value, this);
    }});

  $("#zip").on('keyup change paste', function (e) { 
    if ($("#payment").val() === 'credit-card') {
      validate.zipcoden(e.target.value, this);
    }});

  $("#cvv").on('keyup change paste', function (e) { 
    if ($("#payment").val() === 'credit-card') {
      validate.creditcardcvv(e.target.value, this);
    }});

  $("button").on('submit click', function (e) { 
    e.preventDefault();
    validate.button();   
  });


  

  /* 
  DIV FOR TOTAL COST OF ACTIVITIES
  */
  let totalDiv = document.createElement('div');
  totalDiv.id = 'total';
  $('.activities').append(totalDiv)


  clearPage();
}


/* 
OTHER JOB CONTROLLER
make an additional text input for other type of jobs
*/
function otherJob(select) {
  select === 'other' ? $('#other-title').show() :  $('#other-title').hide();
}

/*
T SHIRT LIST CONTROLLER 
change avaiables color by design type
*/
function tShirt(select) {
  $('#design').val() === 'select_theme'? $('#colors-js-puns').hide() : $('#colors-js-puns').show();
  const jspuns = [
    'cornflowerblue',
    'darkslategrey',
    'gold'
  ]
  const heartjs = [
    'tomato',
    'steelblue',
    'dimgrey'
  ]
  $('#color option').each(function (i, elem) {
    
    if (select === 'js puns') {
      jspuns.includes(elem.value) ? $(elem).show() : $(elem).hide() ;
      } else if (select === 'heart js') {
      heartjs.includes(elem.value) ? $(elem).show() : $(elem).hide(); 
      } else {
      $(elem).show();
    };
  });
  $("#color").val('');
}

/*
SUPPORT FUNCTION: ACTIVITIES 
block and unblock an element based in  its conflicts in day and hour with others
*/
function activitieBlock(acvt, elem){
  if ($(elem).is(':checked')){
      $("input[name='"+ acvt +"']").attr('disabled', true);
      $("input[name='"+ acvt +"']").prop('checked', false);
      $("input[name='"+ acvt +"").parent().css('color', 'grey');
  } else {
    $("input[name='"+ acvt +"']").attr('disabled', false);
    $("input[name='"+ acvt +"']").parent().css('color', 'black');
  }
}

/* 
SUPPORT FUNCTION: ACTIVITIES
set the total cost of selected activities
*/
function activitieCost(elem, cost) {
  $(elem).is(':checked') ? total += cost : total -= cost;
  total > 0 ? $('#total').text('The total is $' + total).show() : $('#total').hide();
  
}

/* 
ACTIVITIES LIST CONTROLLER
controls the list with cost and availability
*/
function activitiesList(input, elem) {
  switch (input) {
    case 'js-frameworks':
    activitieCost(elem, 100);
    activitieBlock('express', elem);
      break;
    case 'js-libs':
    activitieCost(elem, 100);
    activitieBlock('node', elem);
      break;
    case 'express':
    activitieCost(elem, 100);
    activitieBlock('js-frameworks', elem);
      break;
    case 'node':
    activitieCost(elem, 100);
    activitieBlock('js-libs', elem); 
      break;
    case 'build-tools':
    activitieCost(elem, 100);
    activitieBlock(null, elem); 
      break;
    case 'npm':
    activitieCost(elem, 100);
    activitieBlock(null, elem); 
      break;
    
    default:
    activitieCost(elem, 200)
      break;
  }



  const validate = new Validate();
  validate.activities(elem);
}

/* 
PAYMENT TYPE LIST CONTROLLER 
only shows the selected one
*/
function paymentList(item) {
  $('#credit-card').hide();
  $('#paypal').hide();
  $('#bitcoin').hide();
  if (item != 'select_method') {
    $("#"+ item +"").show();
  }
}


/*
VALIDATE MAIN FUNCTION 
the main function to validate the form
*/
function Validate() {

  /* 
  VALIDATES THE NAME INPUT 
  only accepts letter
  */
  let errormsg = '';
  this.name = function (input, elem){
    let regex = /^[a-z A-Z .0-9]{2,40}$/;
    errormsg = 'A name must have more than 2 letters';
    if (regex.test(input)) {
      this.error(false, elem)
      regex = /^\D+$/;
      errormsg = "Don't use numbers";
      regex.test(input) ? this.error(false, elem) : this.error(true, elem, errormsg); 
    } else {
      this.error(true, elem, errormsg);
    }
  }

  /* 
  VALIDATES EMAIL INPUT
  accepts only an email type value
  */
  this.email = function (input, elem){
    const regex = /^[^@]+@[^@.]+\.[a-z]+$/i;
    errormsg = 'A email must be as user@example.com';
    regex.test(input) ? 
      this.error(false, elem) : 
      this.error(true, elem, errormsg);

    return  input.replace(regex);
  }

  /* 
  VALIDATES SELECT IN ACTIVITIES
  accepts only when have at least one active
  */
  this.activities = function (elem){
    let ischecked;
    const activitieselem = $(elem).parent().parent();
    $.each( $('input[type="checkbox"]'), function (i, v) { 
      $(v).prop('checked') ? ischecked = true : null;
    });
    if (!ischecked) {      
      const msg = 'You must select at least one active';
      this.error(true, activitieselem, msg);
    } else {
      this.error(false, activitieselem);
    }
  }

  /* 
  VALIDATES CREDIT CARD NUMBER
  accepts only when have a correct credit card number
  */
  this.creditcardn = function (input, elem) {
    let regex = /[A-Za-z]/g;
    let regex2 = /^\d{13}\d{0,3}$/;
    let selected;
    $('#payment').val() === 'credit-card' ? selected = true: selected = false;

    if (!selected) {
      this.error(false, elem) 
      return true;
    } 
    if (regex2.test(input)) {
      this.error(false, elem); 
    } else if (regex.test(input)) {
      errormsg = "Don't use letters";
      this.error(true, elem, errormsg);
    } else  {
      errormsg = 'You must type only 13 to 16 numbers';
      this.error(true, elem, errormsg)
    }

  }

  /*
  VALIDATES ZIP CODE NUMBER
  accepts only when have a ZIPCODE number
  */
  this.zipcoden = function (input, elem) {
    let selected;
    $('#payment').val() === 'credit-card' ? selected = true: selected = false;
    const regex = /^\d{5}$/;
    errormsg = 'You must type only 5 numbers';
    !regex.test(input) && !selected ? 
      this.error(false, elem) : 
      this.error(true, elem, errormsg);
  }

  /*
  VALIDATES CREDIT CARD CVV NUMBER
  accepts only when have a correct credit card CVV number
  */
 this.creditcardcvv = function (input, elem) {
  let selected;
  $('#payment').val() === 'credit-card' ? selected = true: selected = false;
  let regex = /^\d{3}$/;
  errormsg = 'You must type only 3 numbers';
  !regex.test(input) && !selected  ? 
    this.error(false, elem) : 
    this.error(true, elem, errormsg);
  
  }

  this.clearPayment = function () {
    if ($('#payment').val() != 'credit-card') {
      $.each($('#credit-card input[type="text"]'), function (i, v) { 
        v.value = '';
        $(v).removeClass();
      });
    }
  }


  /* 
  BUTTON SUBMIT CONTROLLER
  when validates all inputs before pass to submit
  */
this.button = function () {
  const validate = new Validate();
  validate.name($('#name').val(), $('#name'));
  validate.email($('#mail').val(), $('#mail'));
  validate.activities($('#activities input'));
  validate.creditcardn($('#cc-num').val(), $('#cc-num'));
  validate.creditcardcvv($('#cvv').val(), $('#cvv'));
  validate.zipcoden($('#zip').val(), $('#zip'));

  let errors = $('.errorBox');
  if (errors.length === 0) {

      alert('submited') ;
      clearPage();
    }; 
};



  /* 
  SUPPORT FUNCTION: ERROR CONTROLLER
  shows or hide a msg error when don't pass in validate function
  */
  this.error = function (iserror, elem, msg=null) {
    this.setErrorSpan(elem, msg);
    let span = document.querySelector("#"+ $(elem).attr('id') + 'span');
    
    if (iserror) {      
      $(elem).addClass('errorBox');
      span.style.display = "inherit";
      } else {
      $(elem).removeClass('errorBox');
      span.style.display = "none";
      }
  }

  /* 
  SUPPORT FUNCTION: SPAN ERROR
  creates or re-text the span msg error per error
  */
  this.setErrorSpan = function (elem, msg) {
    let span = document.querySelector("#"+ $(elem).attr('id') + 'span');
    if (span) {
      $(span).text(msg);
    } else {
      span = document.createElement('span');
      span.className = 'error';
      span.id = $(elem).attr('id') + 'span';
      span.textContent = msg;
      $("#"+ $(elem).attr('id') +"").after(span);
    }
  }
}

loadPage();



