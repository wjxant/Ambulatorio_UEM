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
    id INT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    sintomatologia TEXT,
    diagnostico TEXT,
    fecha DATE NOT NULL,
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
    duracion INT, -- en días
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
(4, 'Ana Torres', 'F', '1995-11-30', 'A987321654', 'Ana@4321');
";
mysqli_query($conn, $insert1);

$insert2 = "INSERT INTO Medico (id, nombre, especialidad, user, pass) VALUES
(1, 'Dr. Luis Gómez', 'Cardiología', 'L654321987', 'DrLuis@2023'),
(2, 'Dra. Sofía Castro', 'Pediatría', 'S123456987', 'Sofia#1234'),
(3, 'Dr. Fernando Vargas', 'Traumatología', 'F987654123', 'Ferna!5678'),
(4, 'Dra. Elena Ramírez', 'Neurología', 'E123987654', 'Elena*4321');
";
mysqli_query($conn, $insert2);
