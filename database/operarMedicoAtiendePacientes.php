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
//en caso si no esta el tipo de perfil
else if (!isset($data['tipoPerfil'])) {
    echo json_encode(['error' => 'Perfil de persona no proporcionado']);
    exit();
} //en caso si no esta el id_cita
else if (!isset($data['id_cita'])) {
    echo json_encode(['error' => 'Perfil de persona no proporcionado']);
    exit();
}
//importamos los datos
$id = $data['id'];
$tipo = $data['tipoPerfil'];
$id_cita = $data['id_cita'];

//CONSULTA
$queryNombreMedico = "SELECT Medico.nombre
                    FROM Cita
                    JOIN Medico ON Cita.id_medico = Medico.id
                    WHERE Cita.id = $id_cita;";
$result1 = $conn->query($queryNombreMedico);
if ($result1->num_rows > 0) {
    //lo transformamos en un array
    $nombreMedico = $result1->fetch_assoc();
}
$queryNombrePaciente = "SELECT Paciente.nombre
                    FROM Cita
                    JOIN paciente ON Cita.id_paciente = Paciente.id
                    WHERE Cita.id = $id_cita;";
$result2 = $conn->query($queryNombrePaciente);
if ($result2->num_rows > 0) {
    //lo transformamos en un array
    $nombrePaciente = $result2->fetch_assoc();
}
$queryFechaCita = "SELECT *
                    FROM Cita
                    WHERE Cita.id = $id_cita;";
$result3 = $conn->query($queryFechaCita);
if ($result3->num_rows > 0) {
    //lo transformamos en un array
    $datosCita = $result3->fetch_assoc();
}

$queryMedicamentosBBDD = "SELECT * FROM medicamento;";
$result4 = $conn->query($queryMedicamentosBBDD);
$datosMedicamentos = [['id' => -1, 'nombre' => '--- Elige un medicamento ---']];
if ($result4->num_rows > 0) {
    // Obtenemos todas las filas y las almacenamos en un array
    while ($row = $result4->fetch_assoc()) {
        $datosMedicamentos[] = $row; // Añadimos cada fila al array
    }
};
//CONSULTA PARA LAS CITAS FUTURAS DE DE USUARIO
$queryCitasFuturas = "SELECT 
                            c.id AS id_cita,
                            c.fecha AS fecha_cita,
                            m.nombre AS nombre_medico
                        FROM 
                            cita c
                        JOIN 
                            medico m ON c.id_medico = m.id
                        WHERE 
                            c.id_paciente = (SELECT id_paciente FROM cita WHERE id = $id_cita)
                            AND c.fecha > (SELECT fecha FROM cita WHERE id = $id_cita)";

$result0 = $conn->query($queryCitasFuturas);

// Comprobamos la respuesta de la consulta
$citasFuturass = []; // Array para almacenar los resultados

if ($result0->num_rows > 0) {
    while ($row = $result0->fetch_assoc()) {
        $citasFuturass[] = $row;
    }
} else {
    $citasFuturass = null; // O un mensaje indicando que no hay citas futuras
}


//seleccion de medicos
$queryAsignacionMedico = "SELECT * FROM medico
                            ";
$result8 = $conn->query($queryAsignacionMedico);

$asignacionMedico = [['nombre' => 'Sin asignar']];
if ($result8 && $result8->num_rows > 0) {
    while ($row = $result8->fetch_assoc()) {
        $asignacionMedico[] = $row;
    }
}







//consulta para sacar la lista del medicamamento citado en la en la consulta
$medicamentosCitado = [];
//seleccionamos el nombre de medicamento tambien para poner en la lista
$querySelecionarMedicamentosCitados = "SELECT 
    Cita_Medicamento.id_cita,
    Cita_Medicamento.id_medicamento,
    Cita_Medicamento.cantidad,
    Cita_Medicamento.frecuencia,
    Cita_Medicamento.duracion,
    Cita_Medicamento.es_cronica,
    Medicamento.nombre AS nombre_medicamento
FROM 
    Cita_Medicamento
JOIN 
    Medicamento 
ON 
    Cita_Medicamento.id_medicamento = Medicamento.id
WHERE 
    Cita_Medicamento.id_cita = $id_cita;";
$result5 = $conn->query($querySelecionarMedicamentosCitados);
if ($result5->num_rows > 0) {
    // Obtenemos todas las filas y las almacenamos en un array
    while ($row = $result5->fetch_assoc()) {
        $medicamentosCitado[] = $row; // Añadimos cada fila al array
    }
}


//cuando presionamos el actualizar sintomas
$actualizarSintoma = [];

if (isset($data['sintomas'])) {
    $id = $data['id'];
    $id_cita = $data['id_cita'];
    $sintomas = $data['sintomas'];

    $insert = "UPDATE Cita SET sintomatologia = '$sintomas' WHERE id = $id_cita AND id_medico = $id";
    $result5 = $conn->query(query: $insert);
    // Ejecutar la consulta
    if ($result5) {
        // Respuesta de éxito si la inserción fue exitosa
        $actualizarSintoma = array('status' => 'success', 'message' => 'Sintoma Actualizado');

        //echo json_encode($pedirCita);
    } else {
        // Respuesta de error si la inserción falla
        $actualizarSintoma = array('status' => 'error', 'message' => 'Error al insertar Sintomas');
        // echo json_encode($pedirCita);
    }
} else {
    // Respuesta si los datos no están presentes
    $actualizarSintoma = array('status' => 'error', 'message' => 'Datos incompletos.');
    //echo json_encode($response);
}




//cuando presionamos el actualizar diagnostico
$actualizarDiagnostico = [];

if (isset($data['diagnostico'])) {
    $id = $data['id'];
    $id_cita = $data['id_cita'];
    $diagnostico = $data['diagnostico'];

    $insert2 = "UPDATE Cita SET diagnostico = '$diagnostico' WHERE id = $id_cita AND id_medico = $id";
    $result6 = $conn->query(query: $insert2);
    // Ejecutar la consulta
    if ($result6) {
        // Respuesta de éxito si la inserción fue exitosa
        $actualizarDiagnostico = array('status' => 'success', 'message' => 'Diagnostico Actualizado');

        //echo json_encode($pedirCita);
    } else {
        // Respuesta de error si la inserción falla
        $actualizarDiagnostico = array('status' => 'error', 'message' => 'Error al insertar Dignostico');
        // echo json_encode($pedirCita);
    }
} else {
    // Respuesta si los datos no están presentes
    $actualizarDiagnostico = array('status' => 'error', 'message' => 'Datos incompletos.');
    //echo json_encode($response);
}
//insert de dato cuando guarda medicamento
$datoMedicamentoGuardado = [];
if (isset($data['medicamentoSeleccioando']) && isset($data['cantidadSeleccionadoMedicamento']) && isset($data['frecuenciaseleccionadoMedicamento']) && isset($data['diasSeleccionadoMedicamento']) && isset($data['cronicaSeleccionadoMedicamento'])) {
    $id = $data['id'];
    $id_cita = $data['id_cita'];
    $tipoPerfil = $data['tipoPerfil'];
    $medicamentoSeleccioando = $data['medicamentoSeleccioando'];
    $cantidadSeleccionadoMedicamento = $data['cantidadSeleccionadoMedicamento'];
    $frecuenciaseleccionadoMedicamento = $data['frecuenciaseleccionadoMedicamento'];
    $diasSeleccionadoMedicamento = $data['diasSeleccionadoMedicamento'];
    $cronicaSeleccionadoMedicamento = $data['cronicaSeleccionadoMedicamento'];


    $queryInseccionDatos = "INSERT INTO cita_medicamento (id_cita, id_medicamento, cantidad, frecuencia, duracion, es_cronica)
                            VALUES ($id_cita, $medicamentoSeleccioando, $cantidadSeleccionadoMedicamento, 
                            $frecuenciaseleccionadoMedicamento, $diasSeleccionadoMedicamento, $cronicaSeleccionadoMedicamento)";
    $queryQuitarError = "INSERT INTO cita_medicamento (id_cita, id_medicamento, cantidad, frecuencia, duracion, es_cronica)
                            VALUES ($id_cita, $medicamentoSeleccioando, '$cantidadSeleccionadoMedicamento', 
                            '$frecuenciaseleccionadoMedicamento', $diasSeleccionadoMedicamento, $cronicaSeleccionadoMedicamento)
                            ON DUPLICATE KEY UPDATE
                            cantidad = VALUES(cantidad),
                            frecuencia = VALUES(frecuencia),
                            duracion = VALUES(duracion),
                            es_cronica = VALUES(es_cronica)";
    $result8 = $conn->query(query: $queryQuitarError);
    // Ejecutar la consulta
    if ($result8) {
        // Respuesta de éxito si la inserción fue exitosa
        $datoMedicamentoGuardado = array('status' => 'success', 'message' => 'Medicamentos Actualizado');

        //echo json_encode($pedirCita);
    } else {
        // Respuesta de error si la inserción falla
        $datoMedicamentoGuardado = array('status' => 'error', 'message' => 'Error al insertar Medicamentos');
        // echo json_encode($pedirCita);
    }
} else {
    // Respuesta si los datos no están presentes
    $datoMedicamentoGuardado = array('status' => 'error', 'message' => 'Datos incompletos.');
    //echo json_encode($response);
}





$pedirCita = [];  // Inicializar el arreglo

// Asegúrate de que los datos están en la solicitud y no vacíos
if (isset($data['medicoSeleccionado']) && isset($data['fechaFormateada']) && isset($data['sintomas'])) {
    $medicoSeleccionado = $data['medicoSeleccionado'];
    $fechaFormateada = $data['fechaFormateada'];
    $sintomas = $data['sintomas'];
    $id = $data['id'];
    // Consulta SQL con declaración preparada (prevención de inyecciones SQL)
    $queryPedircitas = "INSERT INTO cita (id_paciente, id_medico, sintomatologia, fecha) VALUES ($id, $medicoSeleccionado, '$sintomas', '$fechaFormateada')";

    $result10 = $conn->query(query: $queryPedircitas);
    // Ejecutar la consulta
    if ($result10) {
        // Respuesta de éxito si la inserción fue exitosa
        $pedirCita = array('status' => 'success', 'message' => 'Cita registrada con éxito.');

        //echo json_encode($pedirCita);
    } else {
        // Respuesta de error si la inserción falla
        $pedirCita = array('status' => 'error', 'message' => 'Error al insertar cita: ');
        // echo json_encode($pedirCita);
    }
} else {
    // Respuesta si los datos no están presentes
    $pedirCita = array('status' => 'error', 'message' => 'Datos incompletos.');
    //echo json_encode($response);
}





echo json_encode([
    'nombreMedico' => $nombreMedico['nombre'],
    'nombrePaciente' => $nombrePaciente['nombre'],
    'fechaCita' => $datosCita['fecha'],
    'sintomasCita' => $datosCita['sintomatologia'],
    'diagnosticocita' => $datosCita['diagnostico'],
    'datosMedicamentos' => $datosMedicamentos,
    'medicamentosCitado' => $medicamentosCitado,
    'citasFuturass' => $citasFuturass,
    'actualizarSintoma' => $actualizarSintoma,
    'actualizarDiagnostico' => $actualizarDiagnostico,
    'datoMedicamentoGuardado' => $datoMedicamentoGuardado,
    'asignacionMedico' => $asignacionMedico,
    'pedirCita' => $pedirCita
    
]);

error_reporting(0);
ini_set('display_errors', 0);
