<?php
include 'header.php';
 ?>
<form class="main_form" method="post" action="action.php">
	<section class="main">
	<div class="child">
		<?php include 'nav.php'; ?>
    <div class="home_img wdth100">
    		<section class="home_content wdth90 MA">
			<div class="clr">
				<div>
					<div>
					<img src="image/admin.png">
					<h1>Admin</h1>
					<a href=#>login an admin</a>
					<input type="hidden" name="login" value="admin">
					</div>
				</div>
				<div>
					<div>
					<img src="image/teacher.png">
					<h1>teacher</h1>
					<a href=#>login an teacher</a>
					<input type="hidden" name="login" value="teacher">
					</div>
				</div>
				<div>
					<div>
					<img src="image/student.png">	
					<h1>student</h1>
					<a href=#>login an student</a>
					<input type="hidden" name="login" value="student">
					</div>
				</div>
 			</div>	
			</section>
    </div>
	</div>
</section>
</form>
<?php 
include 'footer.php';
 ?>























