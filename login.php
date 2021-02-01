<?php include 'header.php'; 
$error['dataerror'] = false;
if (isset($_GET['error'])) {
	if (isset($_GET['log'])) {
		$un_log = unserialize($_GET['log']);
		$error['name']	  = isset($un_log['name'])?$un_log['name']:'';
		$error['email']   = isset($un_log['email'])?$un_log['email']:'';
	}
}
if ($error['dataerror']) {
	$error['dataerror'] = true;
}
?>
<form action="action.php" method="post">
<section id="log_in">
	<div>
		<div class="clr">
			<h1>Welcome</h1>
			<span><img src="blank/blank1.png"></span>
			<input type="hidden" name="identity" value="<?php echo isset($_GET['visit'])?$_GET['visit']:'admin' ?>">
			<span>
				<input type="text" name="email" placeholder="email">
				<label class="error FL"><?php echo isset($error['email'])?$error['email']:''; ?></label>
			</span>
			<span>
				<input type="text" name="password" placeholder="password">
				<label class="error"><?php echo isset($error['name'])?$error['name']:''; ?></label>
			</span>
			<button type="submit" name="submit" value="login">login</button>
		</div>
	</div>
</section>
</form>