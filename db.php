<?php 
function db(){
	$host = 'localhost';
      $pass = '';
      $dbname= 'registration';
      $user= 'root';
      $connection = new mysqli($host,$user,$pass,$dbname); 
      if ($connection->connect_error) {
	      return false;
      }else{
      	return $connection;
      }
}
// session_destroy();
