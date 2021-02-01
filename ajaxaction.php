<?php 
include "function.php";

	if (isset($_POST['dance_name'])) {

		if ($_POST['email'] == '') {
			$error['email'] = 'email is empty';
		}
		if ($_POST['mobile'] == '') {
			$error['mobile'] = 'mobile is empty';
		}
		if ($_POST['age'] == '') {
			$error['age'] = 'age is empty';
		}
		if ($_POST['dance_name'] == '') {
			$error['dance_name'] = 'name is empty';
		}
		if ($_POST['password'] == '') {
			$error['password'] = 'password is empty';
		}

		if (empty($error)) {
			 $message['result_DB'] =  $alldata->insert_pract($_POST)?1:0;
		}else{
			$message['error'] = $error;
		}
		echo json_encode($message);

	}

// echo "string";


