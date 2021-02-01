<?php  
include 'header.php';
$edit["id"]		 = $_SESSION['id'];
$edit['type'] 	 = $_SESSION['type'];
if ($edit["id"] !=='') {
    $profile = $alldata->profile_edit($edit);
}
include 'nav.php';
	if ($profile) {
	  	$id 		= isset($profile['id'])?$profile['id']:'';
		$name 		= isset($profile['name'])?$profile['name']:'';
		$email 		= isset($profile['email'])?$profile['email']:'';
		$dp 		= isset($profile['image'])?$profile['image']:'';
		$age 		= isset($profile['age'])?$profile['age']:'';
		$mobile 	= isset($profile['mobile'])?$profile['mobile']:'';
		$type 		= isset($profile['type'])?$profile['type']:'';
	}
$edit_a = $type.'.php?show='.$type."form&update=".$id;
?>
<section class="profile_main">
	<div>
		<section>
			<div><img src="image/ba-2.png"></div>

			<div>

				<div class="clr">
				<div><img src="<?php echo $dp; ?>"></div>
				<div>
				<span>! Hello</span>
				<div><h1>I'm<b><?php echo $name; ?></b></h1><p>Intrested in <?php echo $type; ?></p></div>
				<ul>
				<li class="clr"><p>Name</p><span><?php echo $name; ?></span></li>
				<li class="clr"><p>Email</p><span><?php echo $email; ?></span></li>
				<li class="clr"><p>Age</p><span><?php echo $age; ?></span></li>
				<li class="clr"><p>Mobile</p><span><?php echo $mobile; ?></span></li>
				<li class="clr"><p>Intrested</p><span><?php echo $type; ?></span></li>
				<li class="clr"><p>Adress</p><span>this is my address</span></li>
				</ul>
				</div>
				</div>

				<nav>
				<ul>
				<li><a href=<?php echo $edit_a; ?>><i class="fas fa-pencil-alt"></i></a></li>
				<li><a href="#"><i class="fas fa-user-plus"></i></a></li>
				</ul>
				</nav>

			</div>

		</section>
	</div>
</section>
