-- Tabla de persona que coni
CREATE TABLE Personas (
    id_persona INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo ENUM('M', 'F') NOT NULL,
    user VARCHAR(100) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('PACIENTE', 'MEDICO') NOT NULL,
    especialidad VARCHAR(50), -- se puede dejar vacio en caso si es un paciente
);

-- Tabla de citas
CREATE TABLE Citas (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL, --forinkey de paciente
    id_medico INT NOT NULL, -- foreinkey de medico
    fecha_cita DATE NOT NULL,
    sintomas TEXT, -- Opcional
    FOREIGN KEY (id_paciente) REFERENCES Personas(id_persona),
    FOREIGN KEY (id_medico) REFERENCES Personas(id_persona)
);

-- Tabla de consultas
CREATE TABLE Consultas (
    id_consulta INT AUTO_INCREMENT PRIMARY KEY,
    id_cita INT NOT NULL, -- Relación con una cita
    diagnostico TEXT,
    FOREIGN KEY (id_cita) REFERENCES Citas(id_cita)
);

-- Tabla de medicación
CREATE TABLE Medicacion (
    id_medicacion INT AUTO_INCREMENT PRIMARY KEY,
    id_consulta INT NOT NULL,
    medicamento VARCHAR(100) NOT NULL,
    cantidad VARCHAR(50) NOT NULL,
    frecuencia VARCHAR(50) NOT NULL,
    dias INT, -- Opcional si la medicación es crónica
    cronica BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_consulta) REFERENCES Consultas(id_consulta)
);

-- Tabla de documentos
CREATE TABLE Documentos (
    id_documento INT AUTO_INCREMENT PRIMARY KEY,
    id_consulta INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    archivo LONGBLOB NOT NULL, -- Archivo binario (PDF, imágenes, etc.)
    FOREIGN KEY (id_consulta) REFERENCES Consultas(id_consulta)
);
