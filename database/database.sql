-- Tabla de pacientes
CREATE TABLE Paciente (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    sexo ENUM('M', 'F') NOT NULL, -- 'M' para masculino, 'F' para femenino
    fecha_nacimiento DATE NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL, -- Nombre de usuario único
    password VARCHAR(255) NOT NULL -- Contraseña, almacenada de forma segura (encriptada)
);

-- Tabla de médicos
CREATE TABLE Medico (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(50) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL, -- Nombre de usuario único
    password VARCHAR(255) NOT NULL -- Contraseña, almacenada de forma segura (encriptada)
);

-- Tabla de citas
CREATE TABLE Cita (
    id INT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    sintomatologia TEXT,
    diagnostico TEXT,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES Paciente(id),
    FOREIGN KEY (id_medico) REFERENCES Medico(id)
);

-- Tabla de medicamentos
CREATE TABLE Medicamento (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Relación cita-medicamento
CREATE TABLE Cita_Medicamento (
    id_cita INT NOT NULL,
    id_medicamento INT NOT NULL,
    cantidad VARCHAR(50),
    frecuencia VARCHAR(50),
    duracion INT, -- en días
    es_cronica BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_cita, id_medicamento),
    FOREIGN KEY (id_cita) REFERENCES Cita(id),
    FOREIGN KEY (id_medicamento) REFERENCES Medicamento(id)
);

-- Relación paciente-médico (médicos que tratan a un paciente)
CREATE TABLE Paciente_Medico (
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    PRIMARY KEY (id_paciente, id_medico),
    FOREIGN KEY (id_paciente) REFERENCES Paciente(id),
    FOREIGN KEY (id_medico) REFERENCES Medico(id)
);
