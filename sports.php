<?php 
include 'header.php';
// for error
$error = array();

if (isset($_GET['error'])) {
	// field error 
	if (isset($_GET['field'])) {
		$un_spo = unserialize($_GET['field']);
		// print_r($err_unserialize);
		$error['name'] = isset($un_spo['name'])?$un_spo['name']:'';
		$error['email'] = isset($un_spo['email'])?$un_spo['email']:'';
		$error['mobile'] = isset($un_spo['mobile'])?$un_spo['mobile']:'';
		$error['age'] = isset($un_spo['age'])?$un_spo['age']:'';
		$error['image'] = isset($un_spo['image'])?$un_spo['image']:'';
		$error['password'] = isset($un_spo['password'])?$un_spo['password']:'';

	}

	// database error 
	if ($_GET['error'] == 'dataerror') {
		$error['database'] = true;
	}

}
	// for success
	$success = false;
	if (isset($_GET['success'])) {
	$success = true;
	}

		$html_text     = 'SAVE';
		$sub_name      = 'submit';
	    $update_sports = array('name'=>'' , 'mobile' =>'' , 'email' =>'' ,'age' =>'' , 'id' =>'','image'=>'');
	if (isset($_GET['update']) && $_GET['update'] !=''){
		$html_text     = 'update';
		$sub_name      = 'update';
		$id            = $_GET['update'];
		$update_sports = $alldata->get_update_function_sport($id);
	}
	// delete_sports

	if (isset($_GET['delete']) && $_GET['delete'] != '') {
		$id     = $_GET['delete'];
		$delete_sports = $alldata->delete_Function_sport($id);
		if ($delete_sports && isset($_GET['img']) && $_GET['img'] !='' && file_exists($_GET['img']) ) {
            unlink($_GET['img']);
			header('location:sports.php?view=sports&deleted='.$id);
		}
	}

       	$get_sports_list = '';
		if (isset($_GET['view']) && $_GET['view'] == 'sports') {

		    $pageno = (isset($_GET['pageno']) && $_GET['pageno'] != '')?$_GET['pageno']:1;

		    $get_sports_list = $alldata->sport_list($pageno);
	    }




?>
<?php if(!isset($_GET['view'])) { ?>
 <section class="main">
      <div class="child wdth100">
		<?php include 'nav.php'; ?>
		<div class="sport_img wdth100">
	    <section class="main_contentainer ML">
		 <div class="main_contentainer_child clr">
<div class="content MA">
	<?php if(!isset($_GET["show"])) { ?>
		<div class="mainshow_contents">
		<div>
		<h1>TURNING BIG IDEAS INTO GREAT PRODUCTS</h1>
		</div>

		<div>
		<p>Lorem Ipsum has been the industry's standard since the 1500s.Vestibulum ante ipsum primis in faucibus orci luctus.</p>
		</div>

		<div class="clr">
		<a href="http://127.0.0.1/database/project-2/sports.php?view=sports">
			<button class="button">VIEW-SPORTS-LIST</button>
		</a>
		<a href="http://127.0.0.1/database/project-2/sports.php?show=sportsform">
			<button class="button">NEW REGISTRATION</button>
		</a>
		</div>
		</div><!-- content_left -->
<?php } ?>
		<?php if (isset($_GET['show']) && $_GET['show'] == 'sportsform') { ?> <!-- if form success -->


		<div class="content_right MA">
    	<div>
    		<h2>SPORT REGISTRATION</h2>
    	    <div class="clr">
			<a href="sports.php">
				<i class="fas fa-caret-square-left"></i>
			</a>
			<a href="dance.php?view=dance">
				<i class="fas fa-caret-square-right"></i>
			</a>
			</div>
    	</div>
		<?php echo isset($error['database']) && $error['database']?'<p class="error"> Databse Error....</p>':''; ?>    

		 <div class="content_right_child clr"> <!-- content_right_child -->
			<form method="post" action="action.php" enctype="multipart/form-data">

				<div>
				<img src="<?php echo $update_sports['image']?$update_sports['image']:'blank/blank1.png'; ?>">
				<input type="file" name="myimage" value="" placeholder="image">
				<input type="hidden" name="previmage" value="<?php echo $update_sports['image']; ?>">
 				<?php echo isset($error['image']) && $error['image'] !='' ?"<p class='error'> *".$error['image']."</p>":''; ?>
				</div>

				<input type="hidden" name="id" value="<?php echo $update_sports['id']; ?>">

				<div>
				<input type="text" name="email" value="<?php echo $update_sports['email']; ?>" placeholder="email">
				<?php echo isset($error['email']) && $error['email'] !='' ?'<p class="error"> *'.$error['email'].'</p>':''; ?>
				</div>

				<div>
				<input type="text" name="name" value="<?php echo $update_sports['name']; ?>" placeholder="name">
				<?php echo isset($error['name']) && $error['name'] !='' ?'<p class="error"> *'.$error['name'].'</p>':''; ?>
				</div>

				<div>
				<input type="text" name="mobile" value="<?php echo $update_sports['mobile']; ?>" placeholder="mobile">
				<?php echo isset($error['mobile']) && $error['mobile'] !='' ?'<p class="error"> *'.$error['mobile'].'</p>':''; ?>
				</div>
				<div>
				<input type="text" name="age" value="<?php echo $update_sports['age']; ?>" placeholder="age">
				<?php echo isset($error['age']) && $error['age'] != ''?"<p class='error'> *".$error['age']."</p>":''; ?>
				</div>

				<?php if(!isset($_GET['update'])){ ?>
				<div>
				<input type="password" name="password" value="" placeholder="password">
				<?php echo isset($error['password']) && $error['password'] !='' ?"<p class='error'> *".$error['password']."</p>":''; ?>
				</div>
				<div>
				<input type="password" name="con_password" value="" placeholder="confirm-password">
				<?php echo isset($error['password']) && $error['password'] !='' ?"<p class='error'> *".$error['password']."</p>":''; ?>
				</div>
				<?php } ?>

				<div>
	 				<button type="submit" name='<?php echo $sub_name; ?>'value="sports">
				    <?php echo $html_text; ?>
				    </button>
				</div>
			</form>
		  </div><!-- content_right_child-->
         </div><!-- content_right -->
	<?php } ?> <!-- if form success --> 






</div><!-- content -->

</div><!-- content -->
</div><!-- main_contentainer_child -->
</section><!-- main_contentainer -->
</div><!-- sport_img -->


<?php if ($success) { ?><!-- if sucess then it show -->
<section class="overlay_background">
	<div class="sucess_card">
	<a href="sports.php"><img src="blank/check.png"></a>
	<div class="message">
	<h2>congratulation's ! "you are sucessfully registerd for sports compitition.";</h2>
	</div>
	</div>
</section>
<?php } ?><!-- if sucess then it show -->


</div><!-- child -->
</section><!-- main -->
<?php } ?>




<?php if (isset($_GET['view']) && $_GET['view'] == 'sports') { 
include 'nav.php'; ?>

<div class="manage_list"> 	
			<div class="upper_content_table MA">

			<div class="wdth-fit FL">
			<a href="http://127.0.0.1/database/project-2/sports.php?show=sportsform">
			<button class="button">NEW-REGISTRATION</button>
			</a>
			</div>
			
		    <?php if (isset($_GET['updated'])) {?>
			<div class="wdth-fit FR">
			<h1 class="new_regis_name">
			<marquee behavior=slide>welcome to compitition <?php echo $_GET['updated']; ?></marquee>
			</h1>
			</div>
			<?php } ?>
			</div>

			<div class="table_structure">
				<table class="mytable">
				<thead>
				<tr>
				<th>ID</th>
				<th>NAME</th>
				<th>EMAIL</th>
				<th>MOBILE</th>
				<th>AGE</th>
				<th>Action</th>
				<th>profile</th>
				</tr>
				</thead>
				<tbody>
				<?php 
				print_r($get_sports_list['table']);
				?>
				</tbody>
				</table>
				<?php print_r($get_sports_list['pagination']); ?>
			</div>
</div>
<?php } ?>

 <?php include 'footer.php'; ?>
