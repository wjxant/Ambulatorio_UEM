    <?php
    //servidor enviará estará en formato JSON
    header('Content-Type: application/json');
    require_once 'conexion.php';

    if ($conn->connect_error) {
        echo json_encode(['error' => 'Error de conexión a la base de datos']);
        exit();
    }
    // Leer datos del cuerpo de la solicitud
    //comprobamos si hemos recibido los informaciones del la cosnulta
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    //en caso si no esta el id
    if (!isset($data['id'])) {
        echo json_encode(['error' => 'ID de persona no proporcionado']);
        exit();
    }
    //en caso si no esta el id_cita
    else if (!isset($data['id_cita'])) {
        echo json_encode(['error' => 'ID de cita no proporcionado']);
        exit();
    }



    $actualizarDatosBBDD=[];


    if (isset($data['diagnostico'])&& isset($data['sintoma'])&& isset($data['pdf'])){
    //importamos los datos
    $id = $data['id'];
    $id_cita = $data['id_cita'];
    $diagnostico = $data['diagnostico'];
    $sintoma = $data['sintoma'];
    $pdf = $data['pdf'];

    $directorio_subida = "uploads/";

        //sacamos el nombre del pdf
            $name_archivo = $_FILES['pdf']['name'];
            //sacamos los informaciones del archivo segun su nombre
            $array_archivo = pathinfo($name_archivo);
            //sacamos la rura que encuentra en la carpeta temp
            //(Ruta antigua)
            $ruta_antiguo = $_FILES['pdf']['tmp_name'];
            //sacamos la ruta que tiene que estrar en uploads
            //Ruta nueva
            $ruta_destino = $directorio_subida . $name_archivo;
            move_uploaded_file($ruta_antiguo, to: $ruta_destino);

            $queryPdf = "UPDATE cita SET pdf = '$ruta_destino' WHERE id = $id_cita";



    $result1 = $conn->query(query: $queryPdf);
    if ($result1) {
        // Respuesta de éxito si la inserción fue exitosa
        $actualizarDatosBBDD = array('status' => 'success', 'message' => 'Datos Registrado');

        //echo json_encode($pedirCita);
    } else {
        // Respuesta de error si la inserción falla
        $actualizarDatosBBDD = array('status' => 'error', 'message' => 'Error Registro');
        // echo json_encode($pedirCita);
    }


    }else{
        // Respuesta si los datos no están presentes
        $actualizarDatosBBDD = array('status' => 'error', 'message' => 'Datos incompletos.');
        //echo json_encode($response);
    }

    

    echo json_encode([
        'actualizarDatosBBDD' => $actualizarDatosBBDD
    ]);
    exit();

    ?>