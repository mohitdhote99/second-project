$(document).ready(function(){
// for animations behaviour
$('.mytable td img').hover(function(){
   $(this).addClass("scl");
},function(){
   $(this).removeClass("scl");
});
// demo image
$('.image_desig').click(function(){
	$('.img_selector').click();
});
$('.image_desig').hover(function(){
    $('.image_desig span i').css({'transform':'scale(1.1)'});
    $('.image_desig p').addClass('opac');
},function(){
	    $('.image_desig span i').css({'transform':'scale(1)'});
    $('.image_desig p').removeClass('opac');

});

$('.sucess_card img').hover(
	function(){
	    $(this).css({'transition':'0.35s all linear','transform':'scale(1.2)'});
	},
	function(){
		$(this).css({'transform':'scale(1)'});
	}
);
// for login data entry
$('.home_content>div>div>div a').click(function(){
	// alert('hello');
	// $('.home_content>div>div>div input').click();
	$('.main_form').submit();
});

	// $('.home_content>div>div>div input').click(function(){
	// 	alert('yes your a');
	// });

// for login data entry
// alert();
// var getIndexing = $('.demo_insert').data('indexing');

// var sR = 1;
// $('.addFieldForm').click(function(e){
// var putIndex = (sR++)+1;
// 	e.preventDefault();
// var addField;
// 		addField = '<tr>';
// 	 		addField += '<td><input type="text" name="dance['+putIndex+'][name]"></td>';
// 	 		addField += '<td><input type="text" name="dance['+putIndex+'][email]"></td>';
// 	 		addField += '<td><input type="text" name="dance['+putIndex+'][profile]"></td>';
// 	 		addField += '<td><button class="remove buttonrem">remove</button></td>';
// 	 	addField += '</tr>';
// 	$('.demo_multiple tbody').append(addField);
// }); 

// $(document).on('click', '.remove',function(e){
// 	e.preventDefault();
// 	console.log($('.demo_multiple tbody tr').length);
//  var tableNum = $('.demo_multiple tbody tr').length;
// 	var button = $(this);
// 	var rmElem = button.parent().parent();
// 	if (tableNum > 1) {
// 		rmElem.remove();
// 	}
// 	console.log(button.attr('class'));

// });

// showform
$('.buttonadd').click(function(){
	$('.practiceform').addClass('active');
});

function errorCheck(myvar,title)
 {
 			if (myvar == '') {
				 return false;
			}else{
				return title;
			}
 }

$('.buttonrem').click(function(){
  $('.Formpractice')[0].reset();
  $('.Formpractice').val('');
});

function inputUpDownEffect(selected){
		$(selected).children('input').focus(function(){
			$(this).siblings('label').addClass('active');
		});
		$(selected).children('label').click(function(){
			$(this).addClass('active');
			$(this).siblings('input').focus();
		});
		$(selected).children('input').focusout(function(){
			if ($(this).val() == '') {
				$(this).siblings('label').removeClass('active');
			}
		});
}
inputUpDownEffect('.myinput');
// insert dance 
		$('.buttonFORM').click(function(e){
			e.preventDefault();
			var form_data = $('.Formpractice');
			var formInputArea = $('.Formpractice input[type="text"], .Formpractice input[type="password"]'); 

			$('.errorInput').removeClass('errorInput');
// for error get
			// var verified = true;
			
			// $.each(formInputArea, function(fr_key,fr_val){
			// 	var liveInput = formInputArea[fr_key];
			// 	if (liveInput.value == '') {
			// 		verified = false;
			// 		$(liveInput).addClass('errorInput');
			// 	}
			// });
			// if (verified) {
					$.ajax({
						url:"ajaxaction.php",
						method:"post",
						data:form_data.serialize(),
						dataType:'json',
						success:function(response){
							console.log(response);
							// console.log(response.result_DB);
							if (response.result_DB == 1) {
								$('.mymodal').modal('show');
								$('.shomodal').click(function(){
									$('.mymodal').modal('show').modal({
										centered:false,
										closable:false
									});
								});
								$('.okay').click(function(){
								 $('.Formpractice input').val('');
								 $('.mymodal').modal('hide');
								});
							}else if(response.error !== ''){

							  $.each(response.error, function(err_key,err_value){
								if (err_key !== '') {
									$('input[name="'+err_key+'"]').closest('.myinput').next('div.error').html('<p>'+err_value+'</p>');
								}

								});
							}else{

							}

						},error:function(xhr){
							console.log(xhr); 
							console.log(xhr.responseText);
						}
					});
			// }
						
			// }else{S
			// 	console.log(check);
			// }


			

		});
$('.mydropdown').dropdown();






});
// maindocument





