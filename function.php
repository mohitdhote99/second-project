<?php 

include "db.php";
class project_two{
	
	function myquery_($sql_data){
		 $querry = db()->query($sql_data);
		if ($querry==true) {
	  		return true;
	    }else{
	    	return false;
		}
	}
	function insert_pract($c_data){
		  $email = $c_data['email'];
		  $name = $c_data['dance_name'];
		  $mobile = $c_data['mobile'];
		  $age = $c_data['age'];
		  $password = $c_data['password'];
		  $gender = $c_data['gender'];
		  $intrested = $c_data['intrested'];
		  $sql_query = "INSERT INTO practice(mobile,name,email,age,password,gender,intrested) VALUES ('$mobile','$name','$email','$age','$password','$gender','$intrested')";
		  return $querry = $this->myquery_($sql_query);
	}
	function log_in_select($arrg){
		$password = $arrg['password'];
		$email = $arrg['email'];
		if ($arrg['identity'] == 'admin') {
			$tname = 'admin';
		}
	   $sql_query = "SELECT * FROM $tname WHERE password='$password' && email='$email'";
	   $result = db()->query($sql_query);
	    if ($result->num_rows > 0) {
	    	return $result->fetch_assoc();
	    }else{
	    	return false;
	    }
	}
	function profile_edit($edit){
		$type = $edit['type'];
		$id = $edit['id'];
		$sql_query = "SELECT * FROM $type WHERE id='$id'";
		$get_profile = db()->query($sql_query);
		if ($get_profile->num_rows > 0) {
			return $get_profile->fetch_assoc();
		}else{
			return false;
		}
	}
	function admininsert($c_data){
		$identity = $c_data['identity'];
		$email = $c_data['email'];
		$password = $c_data['password'];
		$sql_query = "INSERT INTO admin(email,password,identity) VALUES('$email','$password','$identity')";
		return $querry = $this->myquery_($sql_query);
	}
	function datainsert_dance($c_data){
		  $email = $c_data['email'];
		  $name = $c_data['name'];
		  $mobile = $c_data['mobile'];
		  $age = $c_data['age'];
		  $imagepath = $c_data['image'];
		  $password = $c_data['password'];
		  $sql_query = "INSERT INTO dance(mobile,name,email,age,image,password,type) VALUES ('$mobile','$name','$email','$age','$imagepath','$password','dance')";
		  return $querry = $this->myquery_($sql_query);
	}
	// function foraerobic 
	function datainsert_aerobic($c_data){
		  $email = $c_data['email'];
		  $name = $c_data['name'];
		  $mobile = $c_data['mobile'];
		  $age = $c_data['age'];
		  $imagepath = $c_data['image'];
		  $password = $c_data['password'];
		  $sql_query = "INSERT INTO aerobic(mobile,name,email,age,image,password) VALUES ('$mobile','$name','$email','$age','$imagepath','$password')";
		  return $querry = $this->myquery_($sql_query);
	}
	// function forsports 
	function datainsert_sports($c_data){
		  $email = $c_data['email'];
		  $name = $c_data['name'];
		  $mobile = $c_data['mobile'];
		  $age = $c_data['age'];
		  $imagepath = $c_data['image'];
		  $password = $c_data['password'];
		  $sql_query = "INSERT INTO sport(mobile,name,email,age,image,password) VALUES ('$mobile','$name','$email','$age','$imagepath','$password')";
		  return $querry = $this->myquery_($sql_query);
	}
	function datainsert_assign($c_data){
         $email = $c_data['email'];
         $name = $c_data['name'];
         $mobile = $c_data['mobile'];
         $age = $c_data['age'];
         $imagepath = $c_data['image'];
         $password = $c_data['password'];
         $type = $c_data['type'];
         if ($c_data['type'] == 'dance') {
         	$identity = 'danteacher';
         }elseif($c_data['type'] == 'sport'){
         	$identity = 'spoteacher';
         }else{
         	$identity = 'aeroteacher';
         }
         $sql_query = "INSERT INTO assign(name,email,mobile,age,image,password,type,identity) VALUES('$name','$email','$mobile','$age','$imagepath','$password','$type','$identity')";
         return $querry = $this->myquery_($sql_query);
	}
	function dance_list($pageno){
		$row_limit 	= 3;
		$return_data = array();
		$offset 	= ($pageno * $row_limit)-$row_limit;
		$sql 		= "SELECT * FROM dance LIMIT $row_limit OFFSET $offset";
		$result 	= db()->query($sql);
		// $this->pagination();
		if ($result->num_rows > 0) {
			$serialNo = $offset+1;
			$table = '';
			while ($row = $result->fetch_assoc()) {
		    	$id = $row['id'];
		    	$img_get = $row['image'];
		    	$image_src = $row['image'] !=''?$row['image']:'blank/blank1.png';
		    	$update  = '<a href="dance.php?show=danceform&update='.$id.'">UPDATE</a>';
		    	$delete  = '<a href="dance.php?delete='.$id.'&img='.$img_get.'">DELETE</a>';
				$table 	.=  "<tr>";
				$table  .= "<td>".$serialNo++."</td>";
				$table 	.= "<td>".$row['email']."</td>";
				$table 	.= "<td>".$row['name']."</td>";
				$table 	.= "<td>".$row['age']."</td>";
				$table 	.= "<td>".$row['mobile']."</td>";
	            $table 	.= "<td>".$update.$delete."</td>";
	            $table 	.= "<td><img src='".$image_src."'></td>";
				$table 	.=  "</tr>";
			}
		    $return_data['table'] = $table;
		}else{
		    $return_data['table'] = false;
		}
		// pageination configuration
		$configure['table'] = 'dance';
		$configure['pageno'] = $pageno;
		$configure['base_url'] = 'dance.php?view=dance&pageno';
		$configure['row_limit'] = $row_limit;
		$pageShowLink = $this->pagination($configure);
		$return_data['pagination'] = $pageShowLink; 
		return $return_data;
	}

	// pagination{}
	function pagination($config){
		$table_name = $config['table'];
		$pageno 	= $config['pageno'];
		$base_url 	= $config['base_url'];
		$row_limit 	= $config['row_limit'];
	   // data for pagination
		$sql2 ="SELECT * FROM $table_name";
		$result2 	= db()->query($sql2);
		$no_of_page_links 	  = ceil($result2->num_rows/$row_limit);
		$increment_upto_first = 1;
		$increment_upto_last  = $no_of_page_links;
		$pageShowLink	      = '';
		//total_limit_of_page_link that how many link you  need on one page
		$total_limit_of_page_link   = 3;
		// left anchor links
		$leftAnchor          = $pageno - $total_limit_of_page_link;
		// right anchor links
		$rightAnchor   = $pageno + $total_limit_of_page_link;
	            $pageShowLink .=  '<div class="listno_table">';
				$pageShowLink .=  '<ul>';
	// for previous button
	$pageShowLink .= $pageno > 1?"<li><a href='".$base_url."=".($pageno-1)."'>previous</a></li>":'';
		while ($leftAnchor <= $rightAnchor) {
			if ($leftAnchor <= $increment_upto_last-1 && $leftAnchor >= $increment_upto_first) {
				$pageShowLink .=  '<li>';
				$active        = $leftAnchor == $pageno?'onactive':'';
				$pageShowLink .= "<a class='".$active."' href='".$base_url."=".$leftAnchor."'>".$leftAnchor."</a>";
				$pageShowLink .=  '</li>';
			}
			$leftAnchor++;
	    }


	$pageShowLink .= "<li><p>...</p></li>";
	$pageShowLink .= $increment_upto_last >= $pageno?"<li><a href='".$base_url."=".$increment_upto_last."'>".$increment_upto_last."</a></li>":'';

	$pageShowLink .= $increment_upto_last > $pageno?"<li><a href='".$base_url."=".($pageno+1)."'>Next</a></li>":'';
				$pageShowLink .=  '</ul>';
				$pageShowLink .=  '</div>';

				if ($no_of_page_links > 1) {
					return $pageShowLink;
				}else{
					return false;
				}
	}
	// function for delete from sport
	function sport_list($pageno){
			$row_limit   = 5;
			$offset  = ($pageno * $row_limit)-$row_limit;
			$sql     = "SELECT * FROM sport LIMIT $row_limit OFFSET $offset";
			$result  = db()->query($sql);
			$return_data = array();
			
		if ($result->num_rows > 0) {
		    // output data of each row
	    	$table   = '';		
	    	$serialNo = $offset+1;
		    while($row = $result->fetch_assoc()) {
	    	$id      = $row["id"];
	    	$img_get = $row['image'];
		    $image_src = $row['image'] !=''?$row['image']:'blank/blank1.png';
	    	$update  = '<a href="sports.php?show=sportsform&update='.$id.'">UPDATE</a>';
	    	$delete  = '<a href="sports.php?&delete='.$id.'&img='.$img_get.'">DELETE</a>';
	        $table 	.=  "<tr class=''>";
	        $table 	.= "<td>".$serialNo++."</td>";
	        $table	.= "<td>".$row['name']."</td>";
	        $table	.= "<td>".$row['email']."</td>";
	        $table	.= "<td>".$row['mobile']."</td>";
	        $table	.= "<td>".$row['age']."</td>";
	        $table	.= "<td>".$update.$delete."</td>";
	        $table  .= "<td><img src='".$image_src."'></td>";
	        $table 	.= "</tr>";
		    }
				$return_data["table"] = $table;
		}else{
					$return_data['table'] = false;
		}

		// pageination configuration
		$configure['table'] = 'sport';
		$configure['pageno'] = $pageno;
		$configure['base_url'] = 'sports.php?view=sports&pageno';
		$configure['row_limit'] = $row_limit;
		$pageShowLink = $this->pagination($configure);
		$return_data['pagination'] = $pageShowLink; 
		return $return_data;

	}
	// select functionaerobic
	function aerobic_list($pageno){
		$return_data = array();
		$row_limit = 3;
		$offset = ($pageno * $row_limit)-$row_limit;
		$sql_select = "SELECT * FROM aerobic LIMIT $row_limit OFFSET $offset";
		$result = db()->query($sql_select);
		if ($result->num_rows > 0) {
	    $serno = $offset+1;
		$table = '';
		while ($row = $result->fetch_assoc()) {
			// return $row;
	    	$id = $row['id'];
	    	$image_get = $row['image'];
	    	$image_src = $row['image'] !=''?$row['image']:'blank/blank1.png';
	    	$update  = '<a href="aerobic.php?show=aerobicform&update='.$id.'">UPDATE</a>';
	    	$delete  = '<a href="aerobic.php?&delete='.$id.'&img='.$image_get.'">DELETE</a>';
			$table .= '<td>'.$serno++.'</td>';
			$table .= '<td>'.$row["name"].'</td>';
			$table .= '<td>'.$row["email"].'</td>';
			$table .= '<td>'.$row["mobile"].'</td>';
			$table .= '<td>'.$row["age"].'</td>';
			$table .= '<td><div>'.$update.$delete.'</div></td>';
			$table .= '<td><img src="'.$image_src.'"></td>';
			$table .= '</tr>';
		}
		$return_data['table'] = $table;

	}else{
		$return_data['table'] = false;
	}
		// pageination configuration
	$configure['table']        = 'aerobic';
	$configure['pageno']       = $pageno;
	$configure['base_url']     = 'aerobic.php?view=aerobic&pageno';
	$configure['row_limit']    = $row_limit;
	$pageShowLink              = $this->pagination($configure);
	$return_data['pagination'] = $pageShowLink; 
	return $return_data;
	}
//for update throunh id for dance
	function get_update_function_dance($id){
		$sql_select = "SELECT * FROM dance WHERE id=$id";
		$result = db()->query($sql_select);

		if ($result->num_rows > 0) {
			return $result->fetch_assoc();
		}else{
			return false;
		}
	}
// for update throunh id for dance
	function get_update_function_sport($id){
		$sql_select = "SELECT * FROM sport WHERE id=$id";
		$result = db()->query($sql_select);

		if ($result->num_rows > 0) {
			return $result->fetch_assoc();
		}else{
			return false;
		}
	}

	function get_update_aerobic($id){
		$sql_select = "SELECT * FROM aerobic WHERE id=$id";
		$result = db()->query($sql_select);
		if ($result->num_rows > 0) {
			return $result->fetch_assoc();
		}else{
			return false;
		}
	}

// edit data after id came
	function dance_update($c_data){
		  $u_id       = $c_data['id'];
		  $email      = isset($c_data['email'])?$c_data['email']:'';
		  $name       = isset($c_data['name'])?$c_data['name']:'';
		  $mobile     = isset($c_data['mobile'])?$c_data['mobile']:'';
		  $image      = isset($c_data['image'])?$c_data['image']:'';
		  $age        = isset($c_data['age'])?$c_data['age']:''

		  if (isset($c_data['image'])) {
				$image      = $c_data['image'];
				$sql_update = "UPDATE dance SET name='$name', email='$email', mobile='$mobile', age='$age',image='$image' WHERE id=$u_id";
			}else{
		  		$sql_update = "UPDATE dance SET name='$name', email='$email', mobile='$mobile', age='$age' WHERE id=$u_id";
			}
		 return $this->myquery_($sql_update); 
	}

// edit data of sports
	function sports_update($c_data){
		  $u_id       = $c_data['id'];
		  $email      = $c_data['email'];
		  $name       = $c_data['name'];
		  $mobile     = isset($c_data['mobile'])?$c_data['mobile']:'';
		  $image      = isset($c_data['image'])?$c_data['image']:'';
		  $age        = isset($c_data['age'])?$c_data['age']:'';
		  $sql_update = "UPDATE sport SET name='$name', email='$email', mobile='$mobile', age='$age',image='$image' WHERE id=$u_id";
		 return $this->myquery_($sql_update);
	}
// aerobic update
	function aerobic_update($c_data){
	    $id         = $c_data['id'];
	    $email      = $c_data['email'];
	    $name       = $c_data['name'];
	    $age        = $c_data['age'];
	    $mobile     = $c_data['mobile'];
		$image      = isset($c_data['image'])?$c_data['image']:'';
	    $sql_update = "UPDATE aerobic SET name='$name', email='$email', mobile='$mobile', age='$age',image='$image' WHERE id=$id";
	    return $this->myquery_($sql_update);
	}
// delete function
	function delete_Function_dance($id){
		  $sql_delete = "DELETE FROM dance WHERE id = $id";
		  return $this->myquery_($sql_delete);
	}

	function delete_Function_sport($id){
		  $sql_delete = "DELETE FROM sport WHERE id = $id";
		  return $this->myquery_($sql_delete);
	}

	function delete_Function_update($id){
		  $sql_delete = "DELETE FROM aerobic WHERE id = $id";
		  return $this->myquery_($sql_delete);
	}

//class close 
}
$alldata = new project_two();
// echo 123;
// echo "<br>";
// echo 123;