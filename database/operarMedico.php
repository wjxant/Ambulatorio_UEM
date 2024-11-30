<?php
//servidor enviará estará en formato JSON
header('Content-Type: application/json');
require_once 'conexion.php';

//en caso si nos devuel ve un error
if ($conn->connect_error) {
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit();
}
//lee los datos recibido desde js
//comprobamos si hemos recibido los informaciones del la cosnulta
$json = file_get_contents('php://input');
$data = json_decode($json, true);





//en caso si no esta el id
if (!isset($data['id'])) {
    echo json_encode(['error' => 'ID de persona no proporcionado']);
    exit();
}
//escoge el variable
$id = $data['id'];

//HACEMOS LAS CONSULTAS
$queryInfoMedico = "SELECT *FROM medico WHERE id = $id";
$result2 = $conn->query($queryInfoMedico);
// Lo pasamos a un array
if ($result2 && $result2->num_rows > 0) {
    while ($row = $result2->fetch_assoc()) {
        $infoMedico = $row;
    }
}

//CONSULTA PARA EL NUMERO DE CITAS EN 7 DIAS
$queryNumeroCitas = "SELECT COUNT(*) AS numero_citas
                    FROM Cita
                    WHERE fecha BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY )AND id_medico = $id;";
$result3 = $conn->query($queryNumeroCitas);
// Lo pasamos a un array
if ($result3) {
    while ($row = $result3->fetch_assoc()) {
        $numeroCitasFuturas = $row;
    }
}

//CONSULTA PARA LA TABLA 
$queryTabla = "SELECT Cita.id AS id_cita,
                Paciente.nombre AS nombre_paciente,
                LEFT(Cita.sintomatologia, 100) AS extracto_sintomatologia
                FROM Cita
                JOIN Paciente ON Cita.id_paciente = Paciente.id
                WHERE Cita.fecha = CURDATE() AND  id_medico = $id;";
$result4 = $conn->query($queryTabla);
$consultaTabla = [];
// Lo pasamos a un array
if ($result4 && $result4->num_rows > 0) {
    while ($row = $result4->fetch_assoc()) {
        $consultaTabla[] = $row;
    }
}


//enviamos los datos
echo json_encode([
    'nombreMedico' => $infoMedico['nombre'],
    'especialidad' => $infoMedico['especialidad'],
    'numeroCitasFuturas' => $numeroCitasFuturas['numero_citas'], 
    'consultaTabla' => $consultaTabla
]);



