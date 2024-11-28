<?php

$servidor = "localhost";
$usuario = "root";
$password = ""; //vacia significa que no hay contraseña para acceder

$conn= mysqli_connect($servidor, $usuario, $password);
$sql="SHOW DATABASES LIKE 'ambulatorio'";
$query = mysqli_query($conn,$sql) or die("error al crear bbdd");

if(mysqli_fetch_array($query) <=0) {
    require_once 'crea_tablas.php';
    
}
else{
    //SELECIONAMOS BASE DE DATOS BIBLIOTECA
    mysqli_select_db($conn, "ambulatorio");
    
}
?>