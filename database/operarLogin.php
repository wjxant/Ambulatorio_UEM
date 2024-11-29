<?php
    require_once 'conexion.php';

    //comprobamos para cuando presionamos el boton enviar
    if (isset($_POST['sumbit'])){
        $usuarioP = $_POST['usuario'];
        $contaseña = $_POST['contraseña'];

        $querySelectUser = "SELECT * FROM paciente WHERE user = '$usuarioP';";
        $resultadoUser = mysqli_query($conn, $querySelectUser);
        $querySelectUser2 = "SELECT * FROM medico WHERE user = '$usuarioP';";
        $resultadoUser2 = mysqli_query($conn, $querySelectUser2);

        if ($resultadoUser && mysqli_num_rows($resultadoUser) > 0) {  
            //lo transformamos en un array que contiene la fila entera de la consulata
            $bbddUser = $resultadoUser->fetch_assoc();
            if ($bbddUser['pass'] === $contaseña){
                $idPersona = $bbddUser['id_persona'];
                $tipo = "P";
                header('Location: ../html/paciente.html?id_persona='.$idPersona."?type=".$tipo);
            }
        }else if($resultadoUser2 && mysqli_num_rows($resultadoUser2) > 0){
             //lo transformamos en un array que contiene la fila entera de la consulata
             $bbddUser = $resultadoUser2->fetch_assoc();
             if ($bbddUser['pass'] === $contaseña){
                 $idPersona = $bbddUser['id_persona'];
                 $tipo = "M";
                 header('Location: ../html/medico.html?id_persona='.$idPersona."?type=".$tipo);
             }
        }else{
            header('Location: ../html/errorLogin.html');
        }
        
       

    }



    

?>
