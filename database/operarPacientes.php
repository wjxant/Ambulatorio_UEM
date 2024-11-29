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
}
$id = $data['id'];
$tipo = $data['tipoPerfil'];

//CONSULTA DE LOS INFORMACIONES GENERALES DEL USUARIO
//en caso si no tenemos ningun error, hacemos las consultas
$queryDatosPersonales = "SELECT * FROM paciente WHERE id = $id";
$result = $conn->query($queryDatosPersonales);
//comprobamos la respuesta de la consulta
if ($result->num_rows > 0) {
    //lo transformamos en un array
    $personaInfo = $result->fetch_assoc();
} else {
    echo json_encode(['error' => 'No se encontraron datos para esta persona']);
    exit();
}

//CONSULTA PARA LAS CITAS FUTURAS DE DE USUARIO
$queryCitasFuturas = "SELECT Cita.id, Medico.nombre, Cita.fecha 
                      FROM Cita
                      INNER JOIN Medico ON Cita.id_medico = Medico.id 
                      WHERE Cita.fecha > CURDATE() AND id_paciente = $id";
$result2 = $conn->query($queryCitasFuturas);

// Comprobamos la respuesta de la consulta
$citasFuturas = [];

// Lo pasamos a un array
while ($row = $result2->fetch_assoc()) {
    $citasFuturas[] = $row;
}

//CONSULTA MEDICAMENTOS
//la consulta se calcula directamente el dia
$queryMedicamentos = "SELECT 
         M.nombre AS medicamento,
         CM.duracion,
         C.fecha AS fecha_inicio,
         DATE_ADD(C.fecha, INTERVAL CM.duracion DAY) AS fecha_fin
     FROM 
         Cita C
     JOIN 
         Cita_Medicamento CM ON C.id = CM.id_cita
     JOIN 
         Medicamento M ON CM.id_medicamento = M.id
     JOIN 
         Paciente P ON C.id_paciente = P.id
     WHERE 
         P.id = $id AND C.fecha <= CURDATE() 
         AND (CM.es_cronica = FALSE OR (CM.es_cronica = TRUE AND DATE_ADD(C.fecha, INTERVAL CM.duracion DAY) >= CURDATE()));
 ";

$result3 = $conn->query($queryMedicamentos);
//creamos un variable vacio para el array
$medicamentos = [];
// Lo pasamos a un array
while ($row = $result3->fetch_assoc()) {
    $medicamentos[] = $row;
}

//CONSULTAS PARAHISTORIAL DE LAS COSULTAS
$queryHistorialConsultas = "SELECT Cita.id, Cita.fecha 
                      FROM Cita
                      WHERE Cita.fecha < CURDATE() AND id_paciente = $id";
$result4 = $conn->query($queryHistorialConsultas);
// Comprobamos la respuesta de la consulta
$citasPasadas = [];
// Lo pasamos a un array
while ($row = $result4->fetch_assoc()) {
    $citasPasadas[] = $row;
}

//CONSULTAS PARAHISTORIAL DE LAS COSULTAS (DETALLES)
//solo va aejecutar cuando asigno al idCitaDetail
//pero si no se ejecuta la consulta, el array tiene que estar creado
$citasPasadasDetails = [];
if (isset($data['idCitaDetail'])) {
    $idCitaDetail = $data['idCitaDetail'];
    $queryHistorialConsultasDetail = "SELECT Cita.id, Cita.fecha, Cita.sintomatologia, 
                                      Cita.diagnostico, Medico.nombre
                                      FROM Cita
                                      INNER JOIN Medico ON Cita.id_medico = Medico.id 
                                      WHERE Cita.id = $idCitaDetail AND id_paciente = $id";
    $result5 = $conn->query($queryHistorialConsultasDetail);
    if ($result5 && $result5->num_rows > 0) {
        while ($row = $result5->fetch_assoc()) {
            $citasPasadasDetails[] = $row;
        }
    }
}




echo json_encode([
    'infoNombre' => $personaInfo['nombre'],
    'infoSexo' => $personaInfo['sexo'],
    'infoFecha_nacimiento' => $personaInfo['fecha_nacimiento'],
    'citasFuturas' => $citasFuturas, // Incluye todas las citas futuras
    'medicamentos' => $medicamentos,
    'citasPasadas' => $citasPasadas,
    'citasPasadasDetails' => $citasPasadasDetails
]);