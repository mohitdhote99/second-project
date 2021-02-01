  <?php 
include 'header.php';
	    $get_dance = '';
		if (isset($_GET['view']) && $_GET['view'] == 'dance') {
			$pageno = (isset($_GET['pageno']) && $_GET['pageno'] != '')?$_GET['pageno']:1;
			$dance_listPage = $alldata->dance_list($pageno);
	    }

		$error = array();
		$error['database'] = false;
		if (isset($_GET['error'])){
		// field error 
			if (isset($_GET['field']) && $_GET['field'] != '') {
				$un_dan = unserialize($_GET['field']);
				$error['name'] 	   = isset($un_dan['name'])?$un_dan['name']:'';
				$error['mobile']   = isset($un_dan['mobile'])?$un_dan['mobile']:'';
				$error['email']    = isset($un_dan['email'])?$un_dan['email']:'';
				$error['age']      = isset($un_dan['age'])?$un_dan['age']:'';
				$error['image']    = isset($un_dan['image'])?$un_dan['image']:'';
				$error['password'] = isset($un_dan['password'])?$un_dan['password']:'';
		    }
			if ($_GET['error'] == 'dataerror') {
				$error['database'] = true;
			}
		}	
		// for success
		$success = false;
		if (isset($_GET['success'])) {
			$success = true;
		}

		$sub_html = 'SAVE';
		$sub_name = 'submit';
		//update section
	$update_data = array('email' => '', 'name'=>'','mobile'=>'','age' =>'','id'=>'','image'=>'','password'=>'');
		if (isset($_GET['update']) && $_GET['update'] != '') {
			$sub_html    = 'update';
			$sub_name    = 'update';
			$id          = $_GET['update'];
			$update_data = $alldata->get_update_function_dance($id);
		}

		// delete section
		if (isset($_GET['delete']) &&  $_GET['delete'] != '') {
		    $id = $_GET['delete'];
			$delete_result = $alldata->delete_Function_dance($id);

				if (isset($_GET['img']) && $_GET['img'] !='' && $delete_result && file_exists($_GET['img'])) {
					unlink($_GET['img']);
				}

			   header('Location:dance.php?view=dance&del_suc='.$id);
		}
 ?>
<?php if(!isset($_GET['view'])){ ?>
	<section class="main">
	<div class="child wdth100">

	<?php include 'nav.php'; ?>

	<div class="dance_img wdth100">
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
				<a href="http://127.0.0.1/database/project-2/dance.php?view=dance">
					<button class="button">VIEW-DANCE-LIST</button>
				</a>
				<a href="http://127.0.0.1/database/project-2/dance.php?show=danceform">
					<button class="button">NEW REGISTRATION</button>
				</a>
				</div>

			</div><!-- content_left -->
            <?php } ?>

            <?php if (isset($_GET['show']) && $_GET['show'] == 'danceform') { ?> <!-- if form success -->

 	    	<div class="content_right MA">
	    	    <div>
	    	    	<h2>DANCE REGISTRATION</h2>
		    	    <div class="clr">
					<a href="dance.php">
						<i class="fas fa-caret-square-left"></i>
					</a>
					<a href="dance.php?view=dance">
						<i class="fas fa-caret-square-right"></i>
					</a>
					</div>
	    	    </div>

<p><?php echo isset($error['database']) && $error['database']?"<p class='email error'> *".$error['database']."</p>":''; ?>
</p>

    		    <div class="content_right_child clr">
    		    		
				<form method="post" action="action.php" enctype="multipart/form-data">

				<input type="hidden" name="id" value="<?php echo $update_data['id']; ?>">

				<div>
                <?php if(isset($_GET['update']) && $_GET['update'] != ''){ ?>
				<img src="<?php echo $update_data['image']?$update_data['image']:"blank/blank1.png";?>">
			    <?php } ?>
				<input type="hidden" name="previmage" value="<?php echo $update_data['image']; ?>">
				<input type="file" name="myimage" value="" class="Imagedance">
 				<?php echo isset($error['image']) && $error['image'] !='' ?"<p class='error'> *".$error['image']."</p>":''; ?>
				</div>
				<div>
					<input type="text" name="email" value="<?php echo $update_data['email']; ?>" placeholder="email">
					<?php echo isset($error['email']) && $error['email'] !='' ?"<p class='error'> *".$error['email']."</p>":''; ?>
				</div>
				<div>
					<input type="text" name="name" value="<?php echo $update_data['name']; ?>" placeholder="name">
					<?php echo isset($error['name']) && $error['name'] != ''?"<p class='error'> *".$error['name']."</p>":''; ?>
				</div>
				<div>
					<input type="text" name="mobile" value="<?php echo $update_data['mobile']; ?>" placeholder="mobile">
					<?php echo isset($error['mobile']) && $error['mobile'] != ''?"<p class='error'> *".$error['mobile']."</p>":''; ?>
				</div>
				<div>
					<input type="text" name="age" value="<?php echo $update_data['age']; ?>" placeholder="age">
					<?php echo isset($error['age']) && $error['age'] != ''?"<p class='error'> *".$error['age']."</p>":''; ?>
				</div>
				<?php if(!isset($_GET['update'])){ ?>
				<div>
					<input type="password" name="password" value="<?php echo $update_data['password']; ?>" placeholder="password">
					<?php echo isset($error['password']) && $error['password'] !='' ?"<p class='error'> *".$error['password']."</p>":''; ?>
				</div>
				<div>
					<input type="password" name="con_password" value="<?php echo $update_data['password']; ?>" placeholder="confirm-password">
					<?php echo isset($error['password']) && $error['password'] !='' ?"<p class='error'> *".$error['password']."</p>":''; ?>
				</div>
			    <?php } ?>
				<div>
				<button type="submit" name='<?php echo $sub_name; ?>' value="dance">
				<?php echo $sub_html; ?>
				</button>
				</div>
				</form>
                </div><!-- content_right_child -->
    	      </div><!-- content_right -->
    	    <?php } ?>
			</div><!-- content -->



	</div><!-- main_contentainer_child -->
	</section><!-- main_contentainer -->
	</div><!-- dance_img  -->


<?php if ($success) { ?><!-- if sucess then it show -->
<section class="overlay_background">
<div class="sucess_card">
<div class="message">
	<h2>congratulation's ! "you are sucessfully registerd for dance compitition.";</h2>
</div>
</div>
</section>
<?php } ?><!-- if sucess then it show -->


</section><!-- main -->
<?php } ?> <!-- for image not shown if table visible -->
	</div><!-- child-->

<!-- for-table -->
<?php if(isset($_GET['view']) && $_GET['view'] == 'dance'){ include'nav.php'; ?>
<div class="manage_list">

			<div class="upper_content_table MA">
				<div class="FL wdth-fit">
				<a href="http://127.0.0.1/database/project-2/dance.php?show=danceform">
				<button class="button CP">NEW-REGISTRATION</button>
				</a>
			    </div>

				<?php if (isset($_GET['updated'])) {?>
				<div class="wdth-fit FR">
				<h1 class="new_regis_name">
				<marquee behavior=slide>welcome to compitition <?php echo $_GET['updated']; ?></marquee>
				</h1>
				</div>
				<?php } ?>
				<?php if (isset($_GET['del_suc'])) {?>
				<div class="wdth-fit FR">
				<h1 class="new_regis_name">
				<marquee behavior=slide>participent eliminated</marquee>
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
				<th>AGE</th>
				<th>MOBILE</th>
				<th>Action</th>
				<th>profile</th>
				</tr>
				</thead>
				<tbody>
                    <?php echo $dance_listPage['table']; ?>
				</tbody>
			</table>
             <div><?php echo $dance_listPage['pagination']; ?></div>
			</div><!-- table_structure -->
        </div><!-- manage_list -->
<?php } ?>
 <?php include 'footer.php'; 



 ?>

