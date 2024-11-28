<?php
//CREAR BASE DE DATOS BIBLIOTECA

$crear_db = "CREATE DATABASE ambulatorio";
mysqli_query($conn, $crear_db) or die("Fallo al crear la base de datos");

//TABLA LIBROS
mysqli_select_db($conn, "ambulatorio"); //Indica con que BD va a trabajar


$tablaPersonas = " CREATE TABLE Personas (
    id_persona INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo ENUM('M', 'F') NOT NULL,
    user VARCHAR(100) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('PACIENTE', 'MEDICO') NOT NULL,
    especialidad VARCHAR(50)); -- se puede dejar vacio en caso si es un paciente);
    ";
mysqli_query($conn, $tablaPersonas) or die("Error Crear Tablas");

$tablaCitas = "CREATE TABLE Citas (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    fecha_cita DATE NOT NULL,
    sintomas TEXT,
    FOREIGN KEY (id_paciente) REFERENCES Personas(id_persona),
    FOREIGN KEY (id_medico) REFERENCES Personas(id_persona),
    CHECK (id_paciente != id_medico) -- Un paciente no puede ser médico en la misma cita
)";
mysqli_query($conn, $tablaCitas) or die("Error al crear la tabla Citas");


$tablaConsultas = "CREATE TABLE Consultas (
    id_consulta INT AUTO_INCREMENT PRIMARY KEY,
    id_cita INT NOT NULL, -- Relación con una cita
    diagnostico TEXT,
    FOREIGN KEY (id_cita) REFERENCES Citas(id_cita));
    ";
mysqli_query($conn, $tablaConsultas) or die("Error Crear Tablas");

$tablaMedicacion = "CREATE TABLE Medicacion (
    id_medicacion INT AUTO_INCREMENT PRIMARY KEY,
    id_consulta INT NOT NULL,
    medicamento VARCHAR(100) NOT NULL,
    cantidad VARCHAR(50) NOT NULL,
    frecuencia VARCHAR(50) NOT NULL,
    dias INT, -- Opcional si la medicación es crónica
    cronica BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_consulta) REFERENCES Consultas(id_consulta));
    ";
mysqli_query($conn, $tablaMedicacion) or die("Error Crear Tablas");

$tablaDocumentos = "CREATE TABLE Documentos (
    id_documento INT AUTO_INCREMENT PRIMARY KEY,
    id_consulta INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    archivo LONGBLOB NOT NULL, -- Archivo binario (PDF, imágenes, etc.)
    FOREIGN KEY (id_consulta) REFERENCES Consultas(id_consulta));
    ";
mysqli_query($conn, $tablaDocumentos) or die("Error Crear Tablas");

$insert = "INSERT INTO Personas (nombre, fecha_nacimiento, sexo, user, pass, tipo_usuario, especialidad) 
          VALUES ('Juan Pérez', '1990-05-15', 'M', 'A123456789', 'Pass1234!', 'PACIENTE', NULL);";
mysqli_query($conn, $insert) or die("Error Insertar datos");

$insert2 = "INSERT INTO Personas (nombre, fecha_nacimiento, sexo, user, pass, tipo_usuario, especialidad) 
          VALUES ('Ana García', '1985-03-20', 'F', 'B987654321', 'AnaG2023$', 'MEDICO', 'CARDIOLOGÍA');";
mysqli_query($conn, $insert2) or die("Error Insertar datos");

$insert3 = "INSERT INTO Personas (nombre, fecha_nacimiento, sexo, user, pass, tipo_usuario, especialidad) 
          VALUES ('Carlos López', '1978-11-11', 'M', 'C135791357', 'C@rlos6789', 'PACIENTE', NULL);";
mysqli_query($conn, $insert3) or die("Error Insertar datos");

$insert4 = "INSERT INTO Personas (nombre, fecha_nacimiento, sexo, user, pass, tipo_usuario, especialidad) 
          VALUES ('Marta Sánchez', '1992-06-25', 'F', 'D246802468', 'Marta$2022', 'MEDICO', 'PEDIATRÍA');";
mysqli_query($conn, $insert4) or die("Error Insertar datos");

$insert5 = "INSERT INTO Personas (nombre, fecha_nacimiento, sexo, user, pass, tipo_usuario, especialidad) 
          VALUES ('Luis Martínez', '1980-09-10', 'M', 'E543216789', 'Luis@7890', 'PACIENTE', NULL);";
mysqli_query($conn, $insert5) or die("Error Insertar datos");

$insert6 = "INSERT INTO Personas (nombre, fecha_nacimiento, sexo, user, pass, tipo_usuario, especialidad) 
          VALUES ('Sofía Ruiz', '1995-04-18', 'F', 'F987651234', 'S0f!a2023', 'MEDICO', 'DERMATOLOGÍA');";
mysqli_query($conn, $insert6) or die("Error Insertar datos");