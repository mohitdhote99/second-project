<?php 
$edit["id"]		 = isset($_SESSION['id'])?$_SESSION['id']:'';
$edit['type'] 	 = isset($_SESSION['type'])?$_SESSION['type']:'';
if ($edit["id"] !=='') {
$profile 		 = $alldata->profile_edit($edit);
}
$dp = isset($profile['image'])?$profile['image']:'blank/blank.png';
 ?>
<section class="clr navigation">
	<div><h1>TNT SPORTS</h1></div>
	<nav>
		<ul class="wdth100">

			<!-- without login -->

			<!-- with login -->

			<?php if (isset($_SESSION['id'])) { ?>
				<li><a href="http://127.0.0.1/database/project-2/" class="page_hover">HOME</a></li>
				<li><a href="http://127.0.0.1/database/project-2/dance.php" class="a_2">DANCE</a></li>
				<li><a href="http://127.0.0.1/database/project-2/sports.php" class="a_2">SPORTS</a></li>
				<li><a href="http://127.0.0.1/database/project-2/aerobic.php" class="a_2">AEROBIC</a></li>
				<li><a href="http://127.0.0.1/database/project-2/assign.php?show=assignform" class="a_2">ASSIGN</a></li>
			<?php } ?>




	    </ul>
	</nav>
    <div class="FR">	
    		<?php if (!isset($_SESSION['id'])) { ?>
			<a href="http://127.0.0.1/database/project-2/login.php">
				login
		    </a>
    		<?php }else{ ?>
    		<a href="profile.php"><img src='<?php echo $dp; ?>'></a>
			<a href="http://127.0.0.1/database/project-2/logout.php">
			   <i class="fas fa-sign-out-alt"></i>logout
		    </a>
    		<?php } ?>
    </div>
</section>
<div class="ad_nav"></div>
