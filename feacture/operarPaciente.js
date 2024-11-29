const param = new URLSearchParams(window.location.search);
const id = param.get('id');
const tipoPerfil = param.get('type');


console.log('ID:', id);  // Debe mostrar 2
console.log('Tipo de Perfil:', tipoPerfil);  // Debe mostrar P

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
            if (data.citasFuturas > 0) {
                //se hace un map con los contenido de un array
                //transformamos el array de objeto del citasFutura y lo pasamos a una lista de cadena te texto (map) y cada lista deelemento se va a llamerse citasFuturas1
                document.getElementById('proximasCitasP').innerHTML = data.citasFuturas.map(citasFuturas1 => `
                Fecha: ${citasFuturas1.fecha}<br>
                <ul>
                    <li>ID: ${citasFuturas1.id}</li>
                    <li>Médico: ${citasFuturas1.nombre}</li>
                </ul>
            `).join('');
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










        }
    })


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
    } else {
        // Asumimos que solo hay un elemento seleccionado
        const idCitaDetail = seleccionado1[0].value;

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
