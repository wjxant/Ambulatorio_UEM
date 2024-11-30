<?php
//CREAR BASE DE DATOS BIBLIOTECA

$crear_db = "CREATE DATABASE ambulatorio";
mysqli_query($conn, $crear_db) or die("Fallo al crear la base de datos");

//TABLA LIBROS
mysqli_select_db($conn, "ambulatorio"); //Indica con que BD va a trabajar


$tablaPacientes = "CREATE TABLE Paciente (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    sexo ENUM('M', 'F') NOT NULL, -- 'M' para masculino, 'F' para femenino
    fecha_nacimiento DATE NOT NULL,
    user VARCHAR(50) UNIQUE NOT NULL, -- Nombre de usuario único
    pass VARCHAR(255) NOT NULL );
    ";
mysqli_query($conn, $tablaPacientes) or die("Error Crear Tablas");

$tablaMedicos = "CREATE TABLE Medico (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(50) NOT NULL,
    user VARCHAR(50) UNIQUE NOT NULL, -- Nombre de usuario único
    pass VARCHAR(255) NOT NULL);
    ";
mysqli_query($conn, $tablaMedicos) or die("Error Crear Tablas");

$tablaCitas = "CREATE TABLE Cita (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    sintomatologia TEXT,
    diagnostico TEXT,
    fecha DATE NOT NULL,
    pdf text,
    FOREIGN KEY (id_paciente) REFERENCES Paciente(id),
    FOREIGN KEY (id_medico) REFERENCES Medico(id))
    ";
mysqli_query($conn, $tablaCitas) or die("Error al crear la tabla Citas");


$tablaMedicamento = "CREATE TABLE Medicamento (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL);
    ";
mysqli_query($conn, $tablaMedicamento) or die("Error Crear Tablas");

$tablaMedicacion = "CREATE TABLE Cita_Medicamento (
    id_cita INT NOT NULL,
    id_medicamento INT NOT NULL,
    cantidad VARCHAR(50),
    frecuencia VARCHAR(50),
    duracion INT, 
    es_cronica BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_cita, id_medicamento),
    FOREIGN KEY (id_cita) REFERENCES Cita(id),
    FOREIGN KEY (id_medicamento) REFERENCES Medicamento(id));
    ";
mysqli_query($conn, $tablaMedicacion) or die("Error Crear Tablas");

$tablaPaciente_Medicos = "CREATE TABLE Paciente_Medico (
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    PRIMARY KEY (id_paciente, id_medico),
    FOREIGN KEY (id_paciente) REFERENCES Paciente(id),
    FOREIGN KEY (id_medico) REFERENCES Medico(id)
)";
mysqli_query($conn, $tablaPaciente_Medicos) or die("Error Crear Tablas");



$insert1 = "INSERT INTO Paciente (id, nombre, sexo, fecha_nacimiento, user, pass) VALUES
(1, 'Juan Pérez', 'M', '1990-05-15', 'J123456789', 'Juan@1234'),
(2, 'María López', 'F', '1985-08-22', 'M987654321', 'Maria#5678'),
(3, 'Carlos Ruiz', 'M', '2000-03-10', 'C123987456', 'Carlo$7890'),
(4, 'Ana Torres', 'F', '1995-11-30', 'A987321654', 'Ana@4321'),
(5, 'Pedro Gómez', 'M', '1987-04-11', 'P234567890', 'Pedro*8765'),
(6, 'Lucía Martínez', 'F', '1992-07-19', 'L112233445', 'Lucia@1234')";
mysqli_query($conn, $insert1) or die("Error en la inserción de Pacientes");

// Insertar datos en la tabla Medico
$insert2 = "INSERT INTO Medico (id, nombre, especialidad, user, pass) VALUES
(1, 'Dr. Luis Gómez', 'Cardiología', 'L654321987', 'DrLuis@2023'),
(2, 'Dra. Sofía Castro', 'Pediatría', 'S123456987', 'Sofia#1234'),
(3, 'Dr. Fernando Vargas', 'Traumatología', 'F987654123', 'Ferna!5678'),
(4, 'Dra. Elena Ramírez', 'Neurología', 'E123987654', 'Elena*4321'),
(5, 'Dr. Alberto Pérez', 'Dermatología', 'A345678901', 'Alberto1234'),
(6, 'Dra. Clara Jiménez', 'Ginecología', 'C234567890', 'Clara#5678')";
mysqli_query($conn, $insert2) or die("Error en la inserción de Médicos");

// Insertar datos en la tabla Cita
$insert3 = "INSERT INTO Cita (id, id_paciente, id_medico, sintomatologia, diagnostico, fecha) VALUES
(1, 1, 1, 'Dolor en el pecho', 'Posible infarto', '2026-11-30'),
(2, 2, 2, 'Fiebre y tos', 'Infección viral', '2052-12-01'),
(3, 3, 3, 'Dolor en la pierna', 'Fractura ósea', '2027-12-02'),
(4, 4, 4, 'Dolor de cabeza', 'Migraña', '2024-12-03'),
(5, 5, 5, 'Manchas en la piel', 'Dermatitis', '2024-12-04'),
(6, 6, 6, 'Dolor abdominal', 'Cálculos renales', '2024-12-05')";
mysqli_query($conn, $insert3) or die("Error en la inserción de Citas");

// Insertar datos en la tabla Medicamento
$insert4 = "INSERT INTO Medicamento (id, nombre) VALUES
(1, 'Paracetamol'),
(2, 'Ibuprofeno'),
(3, 'Amoxicilina'),
(4, 'Aspirina'),
(5, 'Loratadina'),
(6, 'Omeprazol')";
mysqli_query($conn, $insert4) or die("Error en la inserción de Medicamentos");

// Insertar datos en la tabla Cita_Medicamento
$insert5 = "INSERT INTO Cita_Medicamento (id_cita, id_medicamento, cantidad, frecuencia, duracion, es_cronica) VALUES
(1, 1, '500mg', 'Cada 8 horas', 5, FALSE),
(2, 2, '400mg', 'Cada 12 horas', 3, FALSE),
(3, 3, '1 cápsula', 'Cada 6 horas', 7, FALSE),
(4, 4, '100mg', 'Cada 24 horas', 7, FALSE),
(5, 5, '10mg', 'Cada 24 horas', 5, FALSE),
(6, 6, '20mg', 'Cada 24 horas', 7, TRUE)";
mysqli_query($conn, $insert5) or die("Error en la inserción de Cita_Medicamento");

// Insertar datos en la tabla Paciente_Medico
$insert6 = "INSERT INTO Paciente_Medico (id_paciente, id_medico) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6)";
mysqli_query($conn, $insert6) or die("Error en la inserción de Paciente_Medico");