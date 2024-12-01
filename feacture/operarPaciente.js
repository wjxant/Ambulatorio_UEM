const param = new URLSearchParams(window.location.search);
const id = param.get('id');
const tipoPerfil = param.get('type');


console.log('ID:', id);  // Debe mostrar 2
console.log('Tipo de Perfil:', tipoPerfil);  // Debe mostrar P

//INFORMACIONES PARA MOSTRAR//////////////////////////////////////////////////////////////////////////////////////////
//div para infoPersonalPDiv
const divIdEspacio = document.getElementById('idPEspacio');
const divNombreEspacio = document.getElementById('nombrePEspacio');
const divSexoEspacio = document.getElementById('sexoPEspacio');
const divNacimientoEspacio = document.getElementById('nacimientoPEspacio');
//introducimos datos, para la entreha de Irene tenemos que modificar
//MODIFICAR
divIdEspacio.innerHTML = `${id} : ${tipoPerfil}`;


//conexion con php
fetch("../database/operarPacientes.php", {
    method: 'POST',
    headers: {
        'Content-type': 'application/json',
    },
    body: JSON.stringify({ id: id, tipoPerfil: tipoPerfil }),
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener datos del servidor.');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            //actualizar los informaciones personales del paciente
            document.getElementById('nombrePEspacio').innerHTML = data.infoNombre || '';
            document.getElementById('sexoPEspacio').innerHTML = data.infoSexo || '';
            document.getElementById('nacimientoPEspacio').innerHTML = data.infoFecha_nacimiento || '';
            //actualizar la lista de los citas futuras
            //comprobamos si ha devuelto algun dato, en casode si, significa que hay citas, y si no, no
            if (data.citasFuturas && data.citasFuturas.length > 0) {
                // Generar el HTML para las citas futuras
                document.getElementById('proximasCitasP').innerHTML = data.citasFuturas.map(citasFuturas1 => `
                    Fecha: ${citasFuturas1.fecha}<br>
                    <ul>
                        <li>ID: ${citasFuturas1.id}</li>
                        <li>Médico: ${citasFuturas1.nombre}</li>
                    </ul>
                `).join('');
            } else {
                // Manejo en caso de que no haya citas
                document.getElementById('proximasCitasP').innerHTML = '<p>No hay citas futuras.</p>';
            }
            //actualizar los medicamentos que esta tomando
            if (data.medicamentos.length > 0) {
                document.getElementById('medicamenosActualesP').innerHTML = data.medicamentos.map(medicamentos1 => `
                Medicamento: ${medicamentos1.medicamento}<br>
                <ul>
                    <li>Fecha: ${medicamentos1.fecha_fin}</li>
                </ul>
                `).join('');
            }
            //actualizar la lista de historiorial de consulta
            if (data.citasPasadas.length > 0) {
                document.getElementById('historialConsultaP').innerHTML = data.citasPasadas.map(citasPasadas1 => `
                    <option value="${citasPasadas1.id}">${citasPasadas1.id} => ${citasPasadas1.fecha}</option>
                    `).join('');
            }
            //PEDIR LA CITA ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (data.asignacionMedico.length > 0) {

                document.getElementById('divMedicoSelect').innerHTML = data.asignacionMedico.map(asignacionMedico1 => `
                    
                     <option value ="${asignacionMedico1.id_medico}">${asignacionMedico1.nombre}</option>
                    `).join('');
            }
        }
    })

//HISTORIAL DE LA CONSULTA /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ACTUALIZAR EL HISTORIAL DE LA CUNSULTA
//solo ejecutara cuando presionamos el boton (actionlistener)

document.querySelector('#consultar').onclick = (event) => {
    event.preventDefault();

    // Obtenemos los elementos seleccionados del select
    const seleccionado1 = document.querySelectorAll("#historialConsultaP option:checked");
    // Comprobamos si hay al menos un elemento seleccionado
    if (seleccionado1.length === 0) {
        alert("No hay ningún elemento seleccionado!");
        return;
    }else {

        // seleccionamos el id, ya que esta en el posicion 0
        const idCitaDetail = seleccionado1[0].value;

        if (!isNaN(idCitaDetail)) {
            
        // Enviamos la solicitud con el idCitaDetail adicional
        fetch("../database/operarPacientes.php", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            //enviamos v/ asignamos datos nuevamente
            body: JSON.stringify({
                id: id,  // El id del paciente que ya tienes
                tipoPerfil: tipoPerfil,  // El tipo de perfil que ya tienes
                idCitaDetail: idCitaDetail  // El id de la cita seleccionada
            }),
        })
            //revisamos las respuestas
            .then(response => {
                //en caso si es distinto a un ok
                if (!response.ok) {
                    throw new Error('Error al obtener datos del servidor.');
                }
                return response.json();
            })
            //si nos devuelve un dato (json)
            .then(data => {
                imprimirInfo(data); // Pasa los datos correctamente
            })
        } else {
            document.getElementById('infoHistorialConsultaP').innerHTML = "No has selecionado";
        }

    };
    //metodo para imprimir los informaciones en el espacio del div
    function imprimirInfo(data) {
        if (data.citasPasadasDetails.length < 1) {
            document.getElementById('infoHistorialConsultaP').innerHTML = "Datos no encontrados en BBDD";
        } else {
            // Mostrar los detalles de la cita pasada
            document.getElementById('infoHistorialConsultaP').innerHTML = data.citasPasadasDetails.map(citasPasadasDetails1 => `
                ID Cita: ${citasPasadasDetails1.id}<br>
                Médico: ${citasPasadasDetails1.nombre}<br>
                Sintomatología: ${citasPasadasDetails1.sintomatologia}<br>
                Diagnóstico: ${citasPasadasDetails1.diagnostico}<br>
                Fecha: ${citasPasadasDetails1.fecha}<br>
            `).join('');
        }
    }
};


//LOGICA DE PEDIR CITA////////////////////////////////////////////////////////////////////////////////////////


let errorMedico = true;
let errorDia = true;
let medicoSeleccionado;
let fechaFormateada;
//escoger valor de sintomatologia
var sintomas

// Bloquear el envío desde el inicio
bloquearEnvio();
//comprobacion de seleccion de medico de cita
document.getElementById('divMedicoSelect').onblur = function () {
    // Obtenemos los elementos seleccionados del select
    const seleccionado2 = document.querySelectorAll("#divMedicoSelect option:checked");
    // cogemos eldat seleccionado
    medicoSeleccionado = seleccionado2[0].value;
    if (medicoSeleccionado == "undefined") {
        document.getElementById('errorSelect').innerHTML = `
        <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
        No has Seleccionado ningun Medico
        `;
        errorMedico = true;
        document.getElementById('infoSelect').innerHTML = "";
    } else {
        document.getElementById('infoSelect').innerHTML = `
        Has seleccionado El medico con id: ${medicoSeleccionado}
        `;
        document.getElementById('errorSelect').innerHTML = "";
        errorMedico = false;
    }
    bloquearEnvio();
    // alert('fsdfsf');
}



document.getElementById('diaCita').onblur = function () {
    const inputFecha = document.getElementById('diaCita').value;
    const fechaSeleccionada = new Date(inputFecha);
    const fechaActual = new Date();
    const maxFecha = new Date(fechaActual);
    maxFecha.setDate(maxFecha.getDate() + 30); // Ajustar el límite de 30 días


    // Limpiar mensajes previos
    document.getElementById('errorDiaCita').innerHTML = '';

    // Verificar si la fecha es válida
    if (isNaN(fechaSeleccionada.getTime())) {
        document.getElementById('errorDiaCita').innerHTML = `
            <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
            Fecha no válida`;
        errorDia = true;
        document.getElementById('infoDiaSeleccionado').innerHTML = "";
    }
    // Comprobar si la fecha es anterior al día de hoy
    else if (fechaSeleccionada < fechaActual+1) { //he puesto un +1 para la comparacion, por ejemplo hoy<hoy 
        document.getElementById('errorDiaCita').innerHTML = `
            <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
            La cita no puede ser antes de hoy`;
        errorDia = true;
        document.getElementById('infoDiaSeleccionado').innerHTML = "";
    }
    // Comprobar si la fecha es en fin de semana
    else if (fechaSeleccionada.getDay() === 0 || fechaSeleccionada.getDay() === 6) {
        document.getElementById('errorDiaCita').innerHTML = `
            <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
            Por favor, elija un día laborable`;
        errorDia = true;
        document.getElementById('infoDiaSeleccionado').innerHTML = "";
    }
    // Comprobar si la fecha es más tarde de un mes desde la fecha actual
    else if (fechaSeleccionada > maxFecha) {
        document.getElementById('errorDiaCita').innerHTML = `
            <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
            Tan malo no estarás. Pide una fecha como máximo 30 días en el futuro`;
        errorDia = true;
        document.getElementById('infoDiaSeleccionado').innerHTML = "";
    }
    // Si pasa todas las validaciones
    else {
        let fecha = new Date(fechaSeleccionada);

        // Extraer el año, mes y día
        let year = fecha.getFullYear();
        let month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan en 0, por eso se le suma 1
        let day = fecha.getDate().toString().padStart(2, '0');

        // Formatear la fecha como yyyy-mm-dd
        fechaFormateada = `${year}-${month}-${day}`;
        document.getElementById('infoDiaSeleccionado').innerHTML = `
            Hs seleccionado el dia  ${fechaFormateada}`;
        errorDia = false;


    }
    // Llamar a la función para bloquear el envío si hay error
    bloquearEnvio(errorDia);

};

document.getElementById('sintomas').onblur = function (){
    sintomas= document.getElementById('sintomas').value;
}



// Función para bloquear el envío dependiendo de los errores
function bloquearEnvio() {
    if (errorMedico === true || errorDia === true) {
        document.getElementById('citaMedicoFamiliaPButt').disabled = true; // Deshabilitar el botón
        // document.getElementById('errorCitaMedicoFamiliaPButt').innerHTML = `
        //         <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
        //             ${errorMedico} ${errorDia}`;
    } else {
        document.getElementById('citaMedicoFamiliaPButt').disabled = false; // Habilitar el botón
        //document.getElementById('errorCitaMedicoFamiliaPButt').innerHTML = ``;
    }
}

//PRESIONAR EL BOTON

document.getElementById('citaMedicoFamiliaPButt').addEventListener("click", function (event) {

    //document.getElementById('errorCitaMedicoFamiliaPButt').innerHTML=`dsdsdsd: ${sintomas}`
    event.preventDefault();
    
    // Enviamos la solicitud con los datos de la cita
    fetch("../database/operarPacientes.php", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            id: id,  // El id del paciente que ya tienes
            tipoPerfil: tipoPerfil,  // El tipo de perfil que ya tienes
            medicoSeleccionado: medicoSeleccionado,
            fechaFormateada: fechaFormateada,
            sintomas: sintomas
        }),
    })
        .then(response => {
            // Si la respuesta no es "ok", lanzamos un error
            if (!response.ok) {
                throw new Error('El servido no responde');
            }
            return response.json();
        })
        .then(data => {
            // Recargamos la página
            window.location.reload();
            // Verificamos si hay un mensaje de la respuesta
            if (data.pedirCita && data.pedirCita.message) {
                alert(data.pedirCita.message);  // Mostramos el mensaje de éxito o error
            }
            
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al procesar la solicitud.');
        });
});

//cuando damos el boton cerrar sesion 
document.getElementById('cerrarSesion').addEventListener("click", function () {
    window.location.replace('../index.html');

});



