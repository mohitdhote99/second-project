<?php 
include "function.php";


if ($_POST['dance_ajax']) {
   echo "success";
}else{
   header("Location:dance.php?show=danceform&success=ok");
}

if ($_POST['dance_ajax']) {
    echo "error";
}else{
    $serialize_error_dance = urlencode(serialize($error));
    header("Location:dance.php?show=danceform&error=field&field=".$serialize_error_dance);
}
// section submit
if (isset($_POST['submit'])  && $_POST['submit'] == "dance") {
$error = array();
// emailerror
    if ($_POST['email'] =='') {
        $error['email'] = 'email is empty';
    }
// mobile error
    if ($_POST['mobile'] =='' || !is_numeric($_POST['mobile'])) {        
        $error['mobile'] = 'mobile is empty and should be numeric';
    }
// nameerror
    if ($_POST['name'] =='' || is_numeric($_POST['name'])){
            $error['name'] = 'name should not empty and not contain numbers';
    }
// age error
    if ($_POST['age'] =='' || !is_numeric($_POST['age'])) {
            $error['age'] =  'mention your age & age should be in no';
    }
// password error
    if ($_POST['password'] == '' && $_POST['con_password'] == '' || $_POST['con_password'] !== $_POST['password']) {
        $error['password'] = 'password should not blank and password should same';
    }


// image
    if (isset($_FILES['myimage']['name']) && $_FILES['myimage']['name'] !='' && $_FILES['myimage']['tmp_name']) {
        $imageName = $_FILES['myimage']['name'];
        $imageSize = $_FILES['myimage']['size'];
        $imageTempName = $_FILES['myimage']['tmp_name'];
        $ext_get = explode('.', $imageName);
        $ext = end($ext_get);
        $extcheck = strtolower($ext);
        $image_rename = "dance-".uniqid().'.'.$extcheck;
        $imagePath = 'myupload/'.$image_rename;

        if ($extcheck && ($extcheck == 'png' or $extcheck == 'jpg' or $extcheck == 'jpeg')) {
            // for image upload
            if ($imageSize >= 9000000) {
                $error['image'] = 'maximum size 7MB';
            }

        }else{
            $error['image'] = 'format incorrect';
        }

    }else{
        $error['image'] = 'selct image';
    }

    if (empty($error)) {
        $arg_data          = $_POST;
        $arg_data['image'] = $imagePath;
        $uploaded_file     = move_uploaded_file($imageTempName, $imagePath);

    if ($uploaded_file) {
        $result = $alldata->datainsert_dance($arg_data);
    }



    if ($result) {

       header("Location:dance.php?show=danceform&success=ok");

    }else{

       header("Location:dance.php?error=dataerror");

    }

    }else{
      $serialize_error_dance = urlencode(serialize($error));
      header("Location:dance.php?show=danceform&error=field&field=".$serialize_error_dance);
    }
// dance submit
}

// update section dance
if (isset($_POST['update']) && $_POST['update'] == 'dance') {

        $error = array();
// emailerror
    if ($_POST['email'] =='') {
        $error['email'] = 'email is empty';
    }
// mobile error
    if ($_POST['mobile'] =='' || !is_numeric($_POST['mobile'])) {        
        $error['mobile'] = 'mobile is empty and should be numeric';
    }
// nameerror
    if ($_POST['name'] =='' || is_numeric($_POST['name'])){
            $error['name'] = 'name should not empty and not contain numbers';
    }
// age error
    if ($_POST['age'] =='' || !is_numeric($_POST['age'])) {
            $error['age'] =  'mention your age & age should be in no';
    }
// image
    if (isset($_FILES['myimage']['name']) && $_FILES['myimage']['name'] !='') {
        $imageName = $_FILES['myimage']['name'];
        $imageSize = $_FILES['myimage']['size'];
        $imageTempName = $_FILES['myimage']['tmp_name'];
        $ext_get = explode('.', $imageName);
        $ext = end($ext_get);
        $extcheck = strtolower($ext);
        $image_rename = "dance-".uniqid().'.'.$extcheck;
        $imagePath = 'myupload/'.$image_rename;

        if ($extcheck && ($extcheck == 'png' or $extcheck == 'jpg' or $extcheck == 'jpeg')) {
            // for image upload
            if ($imageSize >= 9000000) {
                $error['image'] = 'maximum size 7MB';
            }
        }else{
            $error['image'] = 'format incorrect';
        }

    }

    if (empty($error)) {
        $up_data = $_POST;
    if (isset($_FILES['myimage']['name']) && $_FILES['myimage']['name'] !='') {
        $uploaded_file = move_uploaded_file($imageTempName, $imagePath);
        if ($uploaded_file) {
            $up_data['image'] = $imagePath;
        }
    }
    $result = $alldata->dance_update($up_data);
        if ($result) {
           if (isset($_FILES['myimage']['name']) && $_FILES['myimage']['name'] !='' && isset($_POST['previmage']) && $_POST['previmage'] !='' && file_exists($_POST['previmage'])) {
                        unlink($_POST['previmage']);
           }
          header('location:dance.php?view=dance&updated='.$_POST['name']);
        }else{
          header('location:dance.php?error=unsucessful');
        }

    }else{
         $serialize_error_dance = urlencode(serialize($error));
         header('location:dance.php?show=danceform&error=field&field='.$serialize_error_dance);
    }

}

if (isset($_POST['submit']) && $_POST['submit'] == "sports") {
$error = array();
// emailerror
    if ($_POST['email'] =='') {
        $error['email'] = 'email is empty';
    }
// mobile error
    if ($_POST['mobile'] =='' || !is_numeric($_POST['mobile'])) {        
        $error['mobile'] = 'mobile is empty and should be numeric';
    }
// nameerror
    if ($_POST['name'] =='' || is_numeric($_POST['name'])){
            $error['name'] = 'name should not empty and not contain numbers';
    }
// age error
    if ($_POST['age'] =='' || !is_numeric($_POST['age'])) {
            $error['age'] =  'mention your age & age should be in no';
    }
// password error
    if ($_POST['password'] == '' && $_POST['con_password'] == '' || $_POST['con_password'] !== $_POST['password']) {
        $error['password'] = 'password should not blank and password should same';
    }
// image
    if (isset($_FILES['myimage']['name']) && $_FILES['myimage']['name'] !='') {
        $imageName = $_FILES['myimage']['name'];
        $imageSize = $_FILES['myimage']['size'];
        $imageTempName = $_FILES['myimage']['tmp_name'];
        $ext_get = explode('.', $imageName);
        $ext = end($ext_get);
        $extcheck = strtolower($ext);
        $image_rename = "dance-".uniqid().'.'.$extcheck;
        $imagePath = 'myupload/'.$image_rename;
        // echo $extcheck;
        // return;

        if ($extcheck && ($extcheck == 'png' or $extcheck == 'jpg' or $extcheck == 'jpeg')) {
            // for image upload
            if ($imageSize >= 9000000) {
                $error['image'] = 'maximum size 7MB';
            }
        }else{
            $error['image'] = 'format incorrect';
        }

    }else{
        $error['image'] = 'selct image';
    }

if (empty($error)) {
    $arg_data = $_POST;
    $arg_data['image'] = $imagePath;
    $uploaded_file = move_uploaded_file($imageTempName, $imagePath);
    if ($uploaded_file) {
       $result = $alldata->datainsert_sports($arg_data);
    }
      if ($result) {
        header('location:sports.php?show=sportsform&success=ok');
      }else{
        header("Location:sports.php?error=dataerror");
      }
    }else{
        $serial_error_sport = urlencode(serialize($error));
        header("Location:sports.php?show=sportsform&error=field&field=".$serial_error_sport);
    }
// sports submit
}

// update_sports
if (isset($_POST['update']) && $_POST['update'] == 'sports') {
$error = array();
// emailerror
    if ($_POST['email'] =='') {
        $error['email'] = 'email is empty';
    }
// mobile error
    if ($_POST['mobile'] =='' || !is_numeric($_POST['mobile'])) {        
        $error['mobile'] = 'mobile is empty and should be numeric';
    }
// nameerror
    if ($_POST['name'] =='' || is_numeric($_POST['name'])){
            $error['name'] = 'name should not empty and not contain numbers';
    }
// age error
    if ($_POST['age'] =='' || !is_numeric($_POST['age'])) {
            $error['age'] =  'mention your age & age should be in no';
    }
// password error
    if ($_POST['password'] == '' && $_POST['con_password'] == '' || $_POST['con_password'] !== $_POST['password']) {
        $error['password'] = 'password should not blank and password should same';
    }
// image
    if (isset($_FILES['myimage']['name']) && $_FILES['myimage']['name'] !='') {
        $imageName = $_FILES['myimage']['name'];
        $imageSize = $_FILES['myimage']['size'];
        $imageTempName = $_FILES['myimage']['tmp_name'];
        $ext_get = explode('.', $imageName);
        $ext = end($ext_get);
        $extcheck = strtolower($ext);
        $image_rename = "dance-".uniqid().'.'.$extcheck;
        $imagePath = 'myupload/'.$image_rename;
        // echo $extcheck;
        // return;

        if ($extcheck && ($extcheck == 'png' or $extcheck == 'jpg' or $extcheck == 'jpeg')) {
            // for image upload
            if ($imageSize >= 9000000) {
                $error['image'] = 'maximum size 7MB';
            }
        }else{
            $error['image'] = 'format incorrect';
        }

    }
    if (empty($error)) {
      $up_data = $_POST;
      if (isset($_FILES['myimage']['name']) && $_FILES['myimage']['name'] !='') {
        $uploaded_file = move_uploaded_file($imageTempName, $imagePath);
        if ($uploaded_file) {
            $up_data['image'] = $imagePath;
        }
      }
      $result = $alldata->sports_update($up_data);
      if ($result) {
           if (isset($_FILES['myimage']['name']) && $_FILES['myimage']['name'] !='' && isset($_POST['previmage']) && $_POST['previmage'] !='' && file_exists($_POST['previmage'])) {
               unlink($_POST['previmage']);
           }
            header('location:sports.php?view=sports&updated='.$_POST['name']);
      }else{
            header('location:sports.php?show=sportsform&error=unsucessful');
      }
    }else{
        $serial_error_sport = urlencode(serialize($error));
        header("Location:sports.php?show=sportsform&error=field&field=".$serial_error_sport);
    }

}


// AEROBICS SUBMIT
if (isset($_POST['submit']) && $_POST['submit'] == "aerobic") {
$error = array();
// emailerror
    if ($_POST['email'] =='') {
        $error['email'] = 'email is empty';
    }
// mobile error
    if ($_POST['mobile'] =='' || !is_numeric($_POST['mobile'])) {        
        $error['mobile'] = 'mobile is empty and should be numeric';
    }
// nameerror
    if ($_POST['name'] =='' || is_numeric($_POST['name'])){
            $error['name'] = 'name should not empty and not contain numbers';
    }
// age error
    if ($_POST['age'] =='' || !is_numeric($_POST['age'])) {
            $error['age'] =  'mention your age & age should be in no';
    }
// password error
    if ($_POST['password'] == '' && $_POST['con_password'] == '' || $_POST['con_password'] !== $_POST['password']) {
        $error['password'] = 'password should not blank and password should same';
    }
// image
    if (isset($_FILES['myimage']['name']) && $_FILES['myimage']['name'] !='') {
        $imageName = $_FILES['myimage']['name'];
        $imageSize = $_FILES['myimage']['size'];
        $imageTempName = $_FILES['myimage']['tmp_name'];
        $ext_get = explode('.', $imageName);
        $ext = end($ext_get);
        $extcheck = strtolower($ext);
        $image_rename = "dance-".uniqid().'.'.$extcheck;
        $imagePath = 'myupload/'.$image_rename;
        // echo $extcheck;
        // return;

        if ($extcheck && ($extcheck == 'png' or $extcheck == 'jpg' or $extcheck == 'jpeg')) {
            // for image upload
            if ($imageSize >= 9000000) {
                $error['image'] = 'maximum size 7MB';
            }
        }else{
            $error['image'] = 'format incorrect';
        }

    }else{
        $error['image'] = 'selct image';
    }
  if (empty($error)) {
      // $for_insert = array();
      $for_insert          = $_POST;
      $for_insert['image'] = $imagePath;
      $uploaded_file = move_uploaded_file($imageTempName, $imagePath);
      if ($uploaded_file){
          $result = $alldata->datainsert_aerobic($for_insert);
      }
      if ($result){
          header('location:aerobic.php?show=aerobicform&success=ok');
      }else{
          header('location:aerobic.php?error=dataerror');
      }

  }else{
    $serialize_error_aerobic = urlencode(serialize($error));
    header('location:aerobic.php?show=aerobicform&error=field&field='.$serialize_error_aerobic);
  }
}

// for_aerobic update
if (isset($_POST['update']) && $_POST['update'] == "aerobic") {
$error = array();
// emailerror
    if ($_POST['email'] =='') {
        $error['email'] = 'email is empty';
    }
// mobile error
    if ($_POST['mobile'] =='' || !is_numeric($_POST['mobile'])) {        
        $error['mobile'] = 'mobile is empty and should be numeric';
    }
// nameerror
    if ($_POST['name'] =='' || is_numeric($_POST['name'])){
            $error['name'] = 'name should not empty and not contain numbers';
    }
// age error
    if ($_POST['age'] =='' || !is_numeric($_POST['age'])) {
            $error['age'] =  'mention your age & age should be in no';
    }
// password error
    if ($_POST['password'] == '' && $_POST['con_password'] == '' || $_POST['con_password'] !== $_POST['password']) {
        $error['password'] = 'password should not blank and password should same';
    }
// image
    if (isset($_FILES['myimage']['name']) && $_FILES['myimage']['name'] !='') {
        $imageName = $_FILES['myimage']['name'];
        $imageSize = $_FILES['myimage']['size'];
        $imageTempName = $_FILES['myimage']['tmp_name'];
        $ext_get = explode('.', $imageName);
        $ext = end($ext_get);
        $extcheck = strtolower($ext);
        $image_rename = "dance-".uniqid().'.'.$extcheck;
        $imagePath = 'myupload/'.$image_rename;
        // echo $extcheck;
        // return;

        if ($extcheck && ($extcheck == 'png' or $extcheck == 'jpg' or $extcheck == 'jpeg')) {
            // for image upload
            if ($imageSize >= 9000000) {
                $error['image'] = 'maximum size 7MB';
            }
        }else{
            $error['image'] = 'format incorrect';
        }

    }

    if (empty($error)) {
            $up_data = $_POST;
        if (isset($_FILES['myimage']['name']) && $_FILES['myimage']['name'] != '') {
            $upload_file = move_uploaded_file($imageTempName, $imagePath);
            if ($uploaded_file) {
                $up_dat['image'] = $imagePath;    
            }
        }
        $result = $alldata->aerobic_update($up_data);

        if ($result) {
            if (isset($_FILES['myimage']['name']) && $_FILES['myimage']['name'] != '' && isset($_POST['previmage']) && $_POST['previmage'] !='' && file_exists($_POST['previmage'])) {
                unlink($POST['previmage']);      
            }
            header('location:aerobic.php?view=aerobic&updated='.$_POST['name']);
        }else{
            header('location:aerobic.php?show=aerobicform&error=dataerror');
        }

    }else{
        $serialize_error_aerobic = urlencode(serialize($error));
        header('location:aerobic.php?show=aerobicform&error=field&field='.$serialize_error_aerobic);
    }


}



if (isset($_POST['submit']) && $_POST['submit'] == 'assign') {
$error = array();
// emailerror
    if ($_POST['email'] =='') {
        $error['email'] = 'email is empty';
    }
// mobile error
    if ($_POST['mobile'] =='' || !is_numeric($_POST['mobile'])) {        
        $error['mobile'] = 'mobile is empty and should be numeric';
    }
// nameerror
    if ($_POST['name'] =='' || is_numeric($_POST['name'])){
            $error['name'] = 'name should not empty and not contain numbers';
    }
// age error
    if ($_POST['age'] =='' || !is_numeric($_POST['age'])) {
            $error['age'] =  'mention your age & age should be in no';
    }
//type error
   if ($_POST['type'] =='') {
        $error['type'] = 'select type';
    } 
// password error
    if ($_POST['password'] == '') {
        $error['password'] = 'password should not blank';
    }

if (isset($_FILES['myimage']['name']) && $_FILES['myimage']['name'] !='') {
     $imageName = $_FILES['myimage']['name'];
     $imageTempName = $_FILES['myimage']['tmp_name'];
     $imageSize = $_FILES['myimage']['size'];
     $ext_get = explode('.', $imageName);
     $ext = end($ext_get);
     $extcheck = strtolower($ext);
     $image_rename = "assign-".uniqid().'.'.$imageName;
     $imagePath = "myupload/".$image_rename;
        if ($extcheck && ($extcheck == 'png' || $extcheck == 'jpg' || $extcheck == 'jpeg')) {
            // for image upload
            if ($imageSize >= 9000000) {
                $error['image'] = 'maximum size 7MB';
            }
        }else{
            $error['image'] = 'format incorrect';
        }
}
        if (empty($error)) {
            $arg_data = $_POST;
            $arg_data['image'] = $imagePath;
            $upload_file = move_uploaded_file($imageTempName, $imagePath);
            if ($upload_file) {
               $result = $alldata->datainsert_assign($arg_data);
            }
            if ($result) {
                header('location:assign.php?success=ok');
            }else{
                header('location:assign.php?error=dataerror');
            }

        }else{
            $serialize_error_assign = urlencode(serialize($error));
            header('location:assign.php?show=assignform&error=field&field='.$serialize_error_assign);
        }

}
if (isset($_POST['submit']) && $_POST['submit'] == 'login' ) {
    $error = array();
    if ($_POST['email'] == '') {
        $error['email'] = 'email empty';
    }
    if ($_POST['password'] == '') {
        $error['password'] = 'password empty';
    }
    if (empty($error)) {
            $log_data = $alldata->log_in_select($_POST);
            if ($log_data) {
             $session_data = array( 'id' => $log_data["id"],
                                    'type' => $log_data["type"],
                                  );
                $_SESSION = isset($session_data)?$session_data:'';
                header('location:index.php?successfully=login');

            }else{
            header('location:login.php?error=dataerror');
            }
    }else{
        $error_serr = urlencode(serialize($error));
        header('location:login.php?error=log&log='.$error_serr);
    }

}