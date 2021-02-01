<?php 
include 'header.php';
// for error
$error = array();

if (isset($_GET['error'])) {
	// field error 
	if (isset($_GET['field']) && $_GET['field'] !='') {
		$err_uns = unserialize($_GET['field']);
		// print_r($err_uns);
		$error['name'] = isset($err_uns['name'])?$err_uns['name']:'';
		$error['email'] = isset($err_uns['email'])?$err_uns['email']:'';
		$error['mobile'] = isset($err_uns['mobile'])?$err_uns['mobile']:'';
		$error['age'] = isset($err_uns['age'])?$err_uns['age']:'';
		$error['image'] = isset($err_uns['image'])?$err_uns['image']:'';
		$error['password'] = isset($err_uns['password'])?$err_uns['password']:'';
		$error['type'] = isset($err_uns['type'])?$err_uns['type']:'';
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
	    $updates = array('name'=>'' , 'mobile' =>'' , 'email' =>'' ,'age' =>'' , 'sid' =>'','image'=>'');
	if (isset($_GET['update']) && $_GET['update'] !=''){
		$html_text     = 'update';
		$sub_name      = 'update';
		$id            = $_GET['update'];
		$updates = $alldata->get_update_function($id);
	}
	// deletes

	if (isset($_GET['delete']) && $_GET['delete'] != '') {
		$sid     = $_GET['delete'];
		$deletes = $alldata->delete_Function($sid);
		if ($deletes && isset($_GET['img']) && $_GET['img'] !='' && file_exists($_GET['img']) ) {
            unlink($_GET['img']);
			header('location:sports.php?view=sports&deleted='.$sid);
		}
	}

       	$gets_list = '';
		if (isset($_GET['view']) && $_GET['view'] == 'sports') {

		    $pageno = (isset($_GET['pageno']) && $_GET['pageno'] != '')?$_GET['pageno']:1;

		    $gets_list = $alldata->sport_list($pageno);
	    }




?>
 <section class="main">
      <div class="child wdth100">
		<?php include 'nav.php'; ?>
		<div class="sport_img wdth100">
	    <section class="main_contentainer ML">
		 <div class="main_contentainer_child clr">
<div class="content MA">
		<div class="content_right MA">
    	<div>
    		<h2>ASSIGN TEACHER</h2>
    	    <div class="clr">
					<a href="assign.php">
						<i class="fas fa-caret-square-left"></i>
					</a>
					<a href="dance.php?view=dance">
						<i class="fas fa-caret-square-right"></i>
					</a>
			</div>
    	</div>

		 <div class="content_right_child clr"> <!-- content_right_child -->
			<form method="post" action="action.php" enctype="multipart/form-data">
				<div>
				<!-- <img src="blank/blank1.png"> -->
				<input type="file" name="myimage" value="" class="img_selector">
				<!-- image design -->
				<div class="image_desig">
					<span><i class="fas fa-cloud-upload-alt"></i></span>
					<p class="txt_C show">drag image</p>
				</div>
				<?php echo isset($error['image']) && $error['image'] !=''?'<p class="error">*'.$error["image"].'</p>':''; ?>
				<input type="hidden" name="assid" value="">
				<input type="hidden" name="previmage" value="">
				</div>
				<div class="wdth90">
				<input type="text" name="email" value="" placeholder="email">
				<?php echo isset($error['email']) && $error['email'] !=''?'<p class="error">*'.$error["email"].'</p>':''; ?>
				</div>

				<div>
				<input type="text" name="name" value="" placeholder="name">
				<?php echo isset($error['name']) && $error['name'] !=''?'<p class="error">*'.$error["name"].'</p>':''; ?>
				</div>

				<div>
				<input type="text" name="mobile" value="" placeholder="mobile">
				<?php echo isset($error['mobile']) && $error['mobile'] !=''?'<p class="error">*'.$error["mobile"].'</p>':''; ?>
				</div>

				<div>
				<input type="text" name="age" value="" placeholder="age">
				<?php echo isset($error['age']) && $error['age'] !=''?'<p class="error">*'.$error["age"].'</p>':''; ?>
				</div>

				<div>
				<input type="password" name="password" value="" placeholder="password">
				<?php echo isset($error['password']) && $error['password'] !=''?'<p class="error">*'.$error["password"].'</p>':''; ?>
				</div>

				<div>
				<label class="labels">ASSIN FOR</label>
				<select name="type">
					<option value="">---</option>
					<option value="dance">DANCE</option>
					<option value="sport">SPORT</option>
					<option value="aerobic">AEROBIC</option>
				</select>
				<?php echo isset($error['type']) && $error['type'] !=''?'<p class="error">*'.$error["type"].'</p>':''; ?>
				</div>

				<div class="form_buton wdth100 FL">
	 				<button type="submit" name='<?php echo $sub_name; ?>'value="assign">
				    <?php echo $html_text; ?>
				    </button>
				</div>
			</form>
		  </div><!-- content_right_child-->
         </div><!-- content_right -->

</div><!-- content -->
          
			</div><!-- content -->
		 </div><!-- main_contentainer_child -->
	     </section><!-- main_contentainer -->
	    </div><!-- sport_img -->
      </div><!-- child -->
    </section><!-- main -->

 <?php include 'footer.php'; ?>
