<?php
// Conexión a la base de datos
include 'conexion.php'; // Archivo donde defines $conn

if (isset($_POST['funcion'])) {
    $funcion = $_POST['funcion'];

    if ($funcion === 'insertaMisDatos') {
        // Capturar y sanitizar los valores
        $medicoSeleccionado = $_POST['medicoSeleccionado'];
        $diaCita = $_POST['inputFecha'];
        $sintomatologia = $_POST['sintomatologia'];
        $id = $_POST['id'];


        // Consulta SQL
        $queryPedircitas = "INSERT INTO cita (id_paciente, id_medico, sintomatologia, fecha)
                            VALUES ('$id', '$medicoSeleccionado', '$sintomatologia', '$diaCita')";

        // Ejecutar consulta
        if (mysqli_query($conn, $queryPedircitas)) {
            $response = array('status' => 'success', 'message' => 'Datos insertados con éxito.');
        } else {
            $response = array('status' => 'error', 'message' => 'Error al insertar datos: ' . mysqli_error($conn));
        }

        // Enviar respuesta como JSON
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
}

// Respuesta para solicitudes inválidas
$response = array('status' => 'error', 'message' => 'Función no válida o datos incompletos.');
header('Content-Type: application/json');
echo json_encode($response);
?>
