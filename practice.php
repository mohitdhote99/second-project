<?php include 'function.php'; ?>
<!DOCTYPE html>
<html>
<head>
	<title>practice</title>
	<link rel="stylesheet" type="text/css" href="style.css">
	<link rel="stylesheet" type="text/css" href="formantic_ui.css">
	<link rel="stylesheet" type="text/css" href="fontawesom/css/all.css">

</head>
<body>
	<div id="main">

		<div>
			<button class="buttonadd">fill details</button>
			<div class="errormessage"></div>
			<section class="practiceform">
			<form method="post" class="Formpractice" action="ajaxaction.php" enctype="multipart/form-data">
				<div class="clr">
					<div class="FR">
						<button class="buttonrem"><i class="fas fa-times-circle"></i></button>
					</div>
				</div>
				<div class="clr MT">
					<div class="wdth50 FL">
						<div class="myinput">
							<input type="text" name="dance_name">
							<label>name</label>
						</div>
						<div class="error"></div>
					</div>
					<div class="wdth50 FL">
						<div class="myinput">
						<input type="text" name="email">
							<label>email</label>
						</div>
						<div class="error"></div>
					</div>
				</div>
				<div class="clr MT">
					<div class="wdth50 FL">
						<div class="myinput">
						<input type="text" name="age">
							<label>age</label>
						</div>
						<div class="error"></div>
					</div>
					<div class="wdth50 FL">
						<div class="myinput">
						<input type="text" name="mobile">
							<label>mobile</label>
						</div>
						<div class="error"></div>
					</div>
				</div>
				<div class="clr MT">
					<div class="wdth50 FL">
						<div class="myinput">
						<input type="password" name="password">
							<label>password</label>
						</div>
						<div class="error"></div>
					</div>
				</div>
				<div class="clr">
					<div class="width50 FL">					
						<div class="myradio">
						<input type="radio" name="gender" id="male" value="male" checked="checked">
						<label for="male">Male</label>
						</div>
					</div>
					<div class="width50 FL">
						<div class="myradio">
						<input type="radio" name="gender" id="female" value="female">
						<label for="female">Female</label>
						</div>
					</div>
				</div>
				<div class="clr">
					<div class="width50 FL">
						<div class="myoption">					
								<select name="category" class="ui dropdown mydropdown">
								    <option value="dance">dance</option>
								    <option value="practice">practice</option>
								    <option value="aerobic">aerobic</option>
								    <option value="sport">sport</option>
								</select>
						</div>
					</div>
				</div>
				<div class="mychekbox">
					<input type="checkbox" id="intrested" name="intrested" value="1" checked="checked">
					<label for="intrested">intrested</label>
				</div>
				<div>
					<button class="buttonFORM" type="submit">submit</button>
				</div>
			</form>
			</section>

	</div>

<!--  fomantic modal -->
<div class="ui modal large mymodal">
	<div class="header popup_heading">
		sucessfully registerd
	</div>
	<div class="description content popup_content">
		<h1>you are sucessfully registerd for compitition..........</h1>
	</div>
	<div class="actions">
		<button class="ui button basic green okay">okay!</button>
	</div>
</div>
<!--  fomantic modal -->

</div>

<?php include 'footer.php'; ?>


