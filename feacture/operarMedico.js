const param = new URLSearchParams(window.location.search);
const id = param.get('id');
const tipoPerfil = param.get('type');

console.log('ID:', id);  
console.log('Tipo de Perfil:', tipoPerfil);

// Informamos el id del medico
document.getElementById('idPEspacio').innerHTML = `${id} : ${tipoPerfil}`;

// Conexion con PHP
fetch("../database/operarMedico.php", {
    method: 'POST',
    headers: {
        'Content-type': 'application/json',
    },
    body: JSON.stringify({ id: id }),
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener datos del servidor.');
        }
        return response.json();
    })
    .then(data => {
        // Actualizamos los datos del médico
        document.getElementById('nombrePEspacio').innerHTML = data.nombreMedico || "";
        document.getElementById('especialidadPEspacio').innerHTML = data.especialidad || "";

        // Mensaje sobre las citas futuras
        if (data.numeroCitasFuturas == 0) {
            document.getElementById('numConsultaPEspacio').innerHTML = "No tienes ninguna cita en estos 7 días";
        } else {
            document.getElementById('numConsultaPEspacio').innerHTML = `Tienes ${data.numeroCitasFuturas} Consultas`;
        }

        // Accedemos a la tabla
        const tabla = document.getElementById('tablaConsulta').getElementsByTagName('tbody')[0];

        // Verificamos la respuesta de la consulta
        if (data.consultaTabla.length > 0) {
            //un foreach donde se repit tantas veces como el resutado del la consulta
            //hacemos un foreacha la respuesta de bbbdd
            data.consultaTabla.forEach(consultaTabla1 => {
                // Crea una nueva fila
                const nuevaFila = tabla.insertRow();
                // crea la primera celda
                const celda1 = nuevaFila.insertCell();
                //introdycudini informacion 
                celda1.innerHTML = `${consultaTabla1.id_cita}`;
                // Crea la segnda celda
                const celda2 = nuevaFila.insertCell();
                //introducimos indormacion en la celda
                celda2.innerHTML = `${consultaTabla1.nombre_paciente}`;
                // Crea la tercera celda
                const celda3 = nuevaFila.insertCell();
                //introducimos informacion en la celda
                celda3.innerHTML = `${consultaTabla1.extracto_sintomatologia}`;
                // rea la cuarta celda con el botón
                const celda4 = nuevaFila.insertCell();
                //metemos una boton en la cuarta celda para el consurtal
                //AQUI en el value del boton he puesto el id de cita
                celda4.innerHTML = `<button type="button" class="botonAtender" value="${consultaTabla1.id_cita}">Atender</button>`;
            });
        } else {
            document.getElementById('infoTabla').innerHTML = "Hoy no tienes ninguna consulta";
        }
    })


// Evento de cerrar sesión
document.getElementById('cerrarSesion').addEventListener("click", function () {
    window.location.replace('../index.html');
});

// Delegación de eventos para los botones "Atender"
document.getElementById('tablaConsulta').addEventListener('click', function(event) {
    //event.target.value es obtener el valor del boton, en este caso es el id de la cita (en la tabla de ariba cada boton he puesto el value del id de la consulta)
    //alert(`Atender la cita con ID: ${event.target.value}`);

    //comprobamos si hemos dado el boton
    if (isNaN(event.target.value)){
        alert(`Por favor, presiona el boton Atender`);
        return
    }else{
        window.location.href =`../html/medicoAtiendePacientes.html?id=${id}&type=M&id_Cita=${event.target.value}`;
    }

    

});



//cuando damos el boton cerrar sesion 
document.getElementById('cerrarSesion').addEventListener("click", function () {
    window.location.replace('../index.html');

});
