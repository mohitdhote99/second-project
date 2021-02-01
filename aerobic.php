<?php include 'header.php'; ?>

<?php 
// print_r($_SESSION);

$unserialize_error_aerobic = '';
if (isset($_GET['error'])){
	if (isset($_GET['field'])) {
		$unserialize_error_aerobic = unserialize($_GET['field']);
		$error = array();
		$error['name'] 	 = isset($unserialize_error_aerobic['name'])?$unserialize_error_aerobic['name']:'';
		$error['mobile'] = isset($unserialize_error_aerobic['mobile'])?$unserialize_error_aerobic['mobile']:'';
		$error['email']  = isset($unserialize_error_aerobic['email'])?$unserialize_error_aerobic['email']:'';
		$error['age']    = isset($unserialize_error_aerobic['age'])?$unserialize_error_aerobic['age']:'';
		$error['image']    = isset($unserialize_error_aerobic['image'])?$unserialize_error_aerobic['image']:'';
	}

	if ($_GET['error'] == 'dataerror') {
	$error['database'] = true; 
	}
}


$success = false;
if (isset($_GET['success'])) {
$success = true;	
}
// values for udate through get method
  $html_submit = "submit";
  $html_name  = "save";
  $update_data = array('email' => '', 'name' => '', 'mobile' => '', 'age' => '', 'id'=>'','image'=>'');
  if (isset($_GET['update']) && $_GET['update'] !='') {
     $html_submit = "update";
     $html_name  = "update"; 
     $id = $_GET['update'];
     $update_data = $alldata->get_update_aerobic($id);
   }
   // $html_name  = "save";
   // $html_value = 'submit';
   // if () {
   // 	# code...
   // }
if (isset($_GET['delete']) && $_GET['delete'] !='') {
	$id = $_GET['delete']; 
	$delete_result = $alldata->delete_Function_update($id);
    if ($delete_result && isset($_GET['img']) && $_GET['img'] !='' && file_exists($_GET['image'])) {
    	unlink($_GET['image']);
    }
    header('Location:aerobic.php?view=aerobic&del_suc='.$id);
}

if (isset($_GET['view']) && $_GET['view'] == 'aerobic') {
		$pageno = isset($_GET["pageno"]) && $_GET['pageno'] != ''?$_GET['pageno']:1;
		 $aerobic_listPage = $alldata->aerobic_list($pageno);
}


 ?>
<?php if (!isset($_GET['view'])) { ?>
<section class="main">
<div class="child wdth100">
<?php include 'nav.php'; ?>
<div class="aerobic_img wdth100">
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
				<a href="http://127.0.0.1/database/project-2/aerobic.php?view=aerobic">
					<button class="button">VIEW-aerobic-LIST</button>
				</a>
				<a href="http://127.0.0.1/database/project-2/aerobic.php?show=aerobicform">
					<button class="button">NEW REGISTRATION</button>
				</a>
		</div>
	</div><!-- content_left -->
<?php } ?>

<?php if(isset($_GET["show"]) && $_GET['show'] == "aerobicform") { ?>
		<div class="content_right MA">
		    	<div>
		    		<h2>aerobic registration</h2>
	                <div class="clr">
					<a href="aerobic.php">
						<i class="fas fa-caret-square-left"></i>
					</a>
					<a href="dance.php?view=dance">
						<i class="fas fa-caret-square-right"></i>
					</a>
					</div>
		    	</div>
		<div class="content_right_child clr"> <!-- content_right_child -->
			<form method="post" action="action.php" enctype="multipart/form-data">
                <input type="hidden" name="id" value="<?php echo $update_data['id']; ?>">
			    <div>
				<?php if(isset($_GET['update']) && $_GET['update'] != ''){ ?>
				<img src="<?php echo $update_data['image']?$update_data['image']:"blank/blank1.png";?>">
			    <?php } ?>
				<input type="hidden" name="previmage" value="<?php $update_data['image']; ?>">
				<input type="file" name="myimage">
				<?php echo isset($error['image']) && $error['image'] !='' ?"<p class='error'> *".$error['image']."</p>":''; ?>
				</div>
				<div>
			    <input type="text" name="email" value="<?php echo $update_data['email']; ?>" placeholder="email">
				<?php echo isset($error['email']) && $error['email'] !='' ?"<p class='error'> *".$error['email']."</p>":''; ?>
				</div>

				<div>
				<input type="text" name="name" value="<?php echo $update_data['name']; ?>" placeholder="name">
				<?php echo isset($error['email']) && $error['email'] !='' ?"<p class='error'> *".$error['email']."</p>":''; ?>
				</div>

				<div>
				<input type="text" name="mobile" value="<?php echo $update_data['mobile']; ?>" placeholder="mobile">
				<?php echo isset($error['email']) && $error['email'] !='' ?"<p class='error'> *".$error['email']."</p>":''; ?>
				</div>
				<div>
				<input type="text" name="age" value="<?php echo $update_data['age']; ?>" placeholder="age">
				<?php echo isset($error['email']) && $error['email'] !='' ?"<p class='error'> *".$error['email']."</p>":''; ?>
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
				<button type="submit" name='<?php echo $html_submit; ?>'value='aerobic'><?php echo $html_name; ?></button>
				</div>

			</form>
		</div><!-- content_right_child-->
		</div><!-- content_right -->
<?php } ?>

</div><!-- >content -->
          
</div><!-- main_contentainer_child -->
</section><!-- main_contentainer -->
</div><!-- sport_img -->
<?php if ($success) { ?><!-- if sucess then it show -->
<section class="overlay_background">
	<div class="sucess_card">
	<a href="aerobic.php"><img src="blank/check.png"></a>
	<div class="message">
	<h2>congratulation's ! "you are sucessfully registerd for sports compitition.";</h2>
	</div>
	</div>
</section>
<?php } ?><!-- if sucess then it show -->

</div><!-- child -->
</section><!-- main -->
<?php } ?>

<?php if (isset($_GET['view']) &&  $_GET['view'] = "aerobic"){ 
include "nav.php";
	?>
<div class="manage_list"> 	
			<div class="upper_content_table MA">

			<div class="wdth-fit FL">
			<a href="http://127.0.0.1/database/project-2/aerobic.php?show=aerobicform">
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
				<th>MOBILE</th>
				<th>AGE</th>
				<th>Action</th>
				<th>profile</th>
				</tr>
				</thead>
				<tbody>
					<?php echo $aerobic_listPage['table']; ?>
				</tbody>
				</table>
				<?php echo $aerobic_listPage['pagination']?$aerobic_listPage['pagination']:false; ?>
			</div>
</div>
<?php } ?>
 <?php include 'footer.php'; ?>
