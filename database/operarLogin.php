<?php
    require_once 'conexion.php';

    //comprobamos para cuando presionamos el boton enviar
    if (isset($_POST['sumbit'])){
        $usuarioP = $_POST['usuario'];
        $contaseña = $_POST['contraseña'];

        $querySelectUser = "SELECT * FROM personas WHERE user = '$usuarioP';";
        $resultadoUser = mysqli_query($conn, $querySelectUser) or die("Error Crear Tablas");
        //lo transformamos en un array que contiene la fila entera de la consulata
        $bbddUser = $resultadoUser->fetch_assoc();

        
        if ($bbddUser['pass'] === $contaseña){
            $idPersona = $bbddUser['id_persona'];
            
            if($bbddUser['tipo_usuario'] === "MEDICO"){

                header('Location: ../html/medico.html?id_persona='.$idPersona);
            }else{
                //me para aqui
                header('Location: ../html/paciente.html?id_persona='.$idPersona);
            }
        }else{
            header('Location: ../html/errorLogin.html');
        }

    }



    

?>
