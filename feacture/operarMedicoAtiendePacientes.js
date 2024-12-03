const param = new URLSearchParams(window.location.search);
const id = param.get('id');
const tipoPerfil = param.get('type');
const id_cita = param.get('id_Cita');


console.log('ID:', id);
console.log('Tipo de Perfil:', tipoPerfil);
console.log('ID de cita: ', id_cita);

//conectamos con el php

//conexion con php
fetch("../database/operarMedicoAtiendePacientes.php", {
    method: 'POST',
    headers: {
        'Content-type': 'application/json',
    },
    body: JSON.stringify({
        id: id,
        tipoPerfil: tipoPerfil,
        id_cita: id_cita
    }),
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener datos del servidor.');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('medicoEspacio').innerHTML = data.nombreMedico || '';
        document.getElementById('pacienteEspacio').innerHTML = data.nombrePaciente || '';
        document.getElementById('fechaEspacio').innerHTML = data.fechaCita || '';
        //comprueba si en el bbd hay algun sintomas
        if (data.sintomasCita !== "") {
            document.getElementById('sintomaEspacio').value = data.sintomasCita;
            document.getElementById('sintomas').value = data.sintomasCita;
            
        } else {
            // Asigna un valor por defecto si no está definido
            document.getElementById('sintomaEspacio').value = 'No tiene Valor';
        }
        //comprueba si en el bbd hay algun dianostico
        if (data.diagnosticocita !== "") {
            document.getElementById('diagnostico').value = data.diagnosticocita;
        } else {
            // Asigna un valor por defecto si no está definido
            document.getElementById('diagnostico').value = 'No tiene Valor';
        }

        //select de medicamento
        if (data.datosMedicamentos.length > 0) {
            document.getElementById('selectMedicacion').innerHTML = `
                <option value="vacio">-- Seleccione un Medicamento ---</option> `;
            document.getElementById('selectMedicacion').innerHTML = data.datosMedicamentos.map(datosMedicamentos1 => `
                <option value="${datosMedicamentos1.id}">${datosMedicamentos1.nombre}</option>
                `).join('');

        }

        //lista de los medicamentos citados 
        if (data.medicamentosCitado.length > 0) {
            document.getElementById('listaMedicamentosAñadido').innerHTML = data.medicamentosCitado.map(medicamentosCitado1 => `
                <ul> --- ${medicamentosCitado1.nombre_medicamento} ---
                    <li>ID Cita: ${medicamentosCitado1.id_cita}</li>
                    <li>ID Medicamento: ${medicamentosCitado1.id_medicamento}</li>
                    <li>cantidad: ${medicamentosCitado1.cantidad}</li>
                    <li>Frecuencia: ${medicamentosCitado1.frecuencia}</li>
                    <li>Duracion: ${medicamentosCitado1.duracion}</li>
                    <li>Cronica: ${medicamentosCitado1.es_cronica}</li>
                
                </ul>
                
                `).join('');
        } else {
            document.getElementById('listaMedicamentosAñadido').innerHTML = "No tiene ningun medicamento"
        }

        //Citas futuras
        //comprobamos si ha devuelto algun dato, en casode si, significa que hay citas, y si no, no
        if (data.citasFuturass && data.citasFuturass.length > 0) {
            // Generar el HTML para las citas futuras
            document.getElementById('proximasCitasP').innerHTML = data.citasFuturass.map(citasFuturass1 => `
                        Fecha: ${citasFuturass1.fecha_cita}<br>
                        <ul>
                            <li>ID: ${citasFuturass1.id_cita}</li>
                            <li>Médico: ${citasFuturass1.nombre_medico}</li>
                        </ul>
                    `).join('');
        } else {
            // Manejo en caso de que no haya citas
            document.getElementById('proximasCitasP').innerHTML = '<p>No hay citas futuras...</p>';
        }



        //select de los medicos

        if (data.asignacionMedico.length > 0) {
            //sacamos para imprimir en la lista
            document.getElementById('divMedicoSelect').innerHTML = data.asignacionMedico.map(asignacionMedico1 => `
                         <option value ="${asignacionMedico1.id}">${asignacionMedico1.nombre} || ${asignacionMedico1.especialidad}</option>
                        `).join('');
        }





    })


//COMPROBAIONES JS

//sintomalogia
document.getElementById('sintomaEspacio').onblur = function () {
    comprobarVacio('sintomaEspacio', 'errorsintomasEspacio');
    if (comprobarVacio('sintomaEspacio', 'errorsintomasEspacio') == false) {
        document.getElementById('guardarSintomas').disabled = true;
    } else {
        document.getElementById('guardarSintomas').disabled = false;
    }

}
//dianostico
document.getElementById('diagnostico').onblur = function () {
    comprobarVacio('diagnostico', 'errorDianostioEspacio');
    if (comprobarVacio('diagnostico', 'errorDianostioEspacio') == false) {
        document.getElementById('guardarDianostico').disabled = true;
    } else {
        document.getElementById('guardarDianostico').disabled = false;
    }

}
//////////////////////////////////////////////////////////////////////////////
let comprobacionCa = false;
let comprobacionF = false;
let comprobacionD = false;
let comprobacionS = false;

//cantidad
document.getElementById('cantidadMedicamento').onblur = function () {
    comprobarVacio('cantidadMedicamento', 'errorCantidadMediamento');
    if ((comprobarVacio('cantidadMedicamento', 'errorCantidadMediamento')) == false) {
        comprobacionCa = false
        // document.getElementById('añadirMedicamentoBtn').disabled= true
    } else {
        comprobacionCa = true;
    }

}
//frecuencia medicamento
document.getElementById('frecuenciaMedicamento').onblur = function () {
    comprobarVacio('frecuenciaMedicamento', 'errorFrecuenciaMedicamento');
    if ((comprobarVacio('frecuenciaMedicamento', 'errorFrecuenciaMedicamento')) == false) {
        comprobacionF = false
    } else {
        comprobacionF = true;
    }

}
//duracion de medicamentos dias
document.getElementById('duracionMedicamento').onblur = function () {
    comprobarVacio('duracionMedicamento', 'errorDuracionMedicamentos');
    if ((comprobarVacio('duracionMedicamento', 'errorDuracionMedicamentos')) == false) {
        comprobacionD = false
    } else {
        comprobacionD = true;
    }

}

//un funcion que se comprueba si el contenido esta vacio o no 
function comprobarVacio(comprobante, error) {
    // Comprobamos si el campo está vacío
    if (document.getElementById(comprobante).value.trim() == "") {
        document.getElementById(error).innerHTML = `
            <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
            No puede estar vacío
        `;
        return false;
    } else {
        if (document.getElementById(comprobante).value.length > 100) {
            document.getElementById(error).innerHTML = `
            <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
            Has superado el maximo de Caracteres (max.100)
        `;
            return false;
        } else {
            document.getElementById(error).innerHTML = ``;
            return true;
        }
    }
}

//comprobaciones de medicamento 
document.getElementById('selectMedicacion').onblur = function () {
    // Obtenemos los elementos seleccionados del select
    const seleccionado1 = document.querySelectorAll("#selectMedicacion option:checked");
    if (seleccionado1.length === 0) {
        document.getElementById('errorSelectMedicament').innerHTML = `
            <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
            No has seleccionado ningun medicamento
        `;
        return comprobacionS = false;
    } else {
        // seleccionamos el id, ya que esta en el posicion 0
        const idSeleccionadoMedicamento = seleccionado1[0].value;
        //comprobamos si es -1 o no, en caso que se , no ha seleccionado (opcion de elige un medicamento)
        if (idSeleccionadoMedicamento == -1) {
            document.getElementById('errorSelectMedicament').innerHTML = `
            <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
            No has seleccionado ningun medicamento
        `;
            comprobacionS = false
        } else {
            //en caso si ha seleccionado un medicamento
            document.getElementById('errorSelectMedicament').innerHTML = ``;
            comprobacionS = true
        }
    }

}

//cuando damos al si al cronica
document.getElementById('cronicaMedicamento0').onclick = function () {
    document.getElementById('infoCronicaMedicamento').innerHTML = "";
    document.getElementById('duracionMedicamento').value = "";
    document.getElementById('duracionMedicamento').disabled = false;
    if ((comprobarVacio('duracionMedicamento', 'errorDuracionMedicamentos')) == false) {
        comprobacionD = false
    } else {
        comprobacionD = true;
    }
}
document.getElementById('cronicaMedicamento1').onclick = function () {
    document.getElementById('infoCronicaMedicamento').innerHTML = `
     Numero de dia que hay que tomar es 365
     `;
    //asignamos wl 365 dias 
    document.getElementById('duracionMedicamento').value = 365
    //desabilitamos el imput
    document.getElementById('duracionMedicamento').disabled = true;
    comprobarVacio('duracionMedicamento', 'errorDuracionMedicamentos');
    comprobacionD = true

}

//Cuando presionamos el Guardar de sintoma 
document.getElementById('guardarSintomas').addEventListener('click', function () {
    //comprueba de nuevo por si caso 
    if (!comprobarVacio('sintomaEspacio', 'errorsintomasEspacio')) {
        return; // Si está vacío, no hacemos nada
    }
    // Enviamos la solicitud con los datos de la cita
    fetch("../database/operarMedicoAtiendePacientes.php", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            id: id,
            tipoPerfil: tipoPerfil,
            id_cita: id_cita,
            sintomas: document.getElementById('sintomaEspacio').value
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
            //Verificamos si hay un mensaje de la respuesta
            if (data.actualizarSintoma && data.actualizarSintoma.message) {
                alert(data.actualizarSintoma.message);  // Mostramos el mensaje de éxito o error
            }
            //actualiza la pagina     
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al procesar la solicitud.');
        });
})






//Cuando presionamos el Guardar de dianostico 
document.getElementById('guardarDianostico').addEventListener('click', function () {


    //comprueba de nuevo por si caso 
    if (!comprobarVacio('diagnostico', 'errorDianostioEspacio')) {
        return; // Si está vacío, no hacemos nada
    }
    // Enviamos la solicitud con los datos de la cita
    fetch("../database/operarMedicoAtiendePacientes.php", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            id: id,
            tipoPerfil: tipoPerfil,
            id_cita: id_cita,
            diagnostico: document.getElementById('diagnostico').value

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
            //Verificamos si hay un mensaje de la respuesta
            if (data.actualizarDiagnostico && data.actualizarDiagnostico.message) {
                alert(data.actualizarDiagnostico.message);  // Mostramos el mensaje de éxito o error
            }
            //actualiza la pagina     
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al procesar la solicitud.');
        });

})

//creamos un funcion para comprobar antes ddel añadir el medicamento
function revisionañadirMedicamento() {
    if (comprobacionCa !== true || comprobacionF !== true || comprobacionD !== true || comprobacionS !== true) {
        document.getElementById('errorAñadrLista').innerHTML = `
        <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
        Hay algun campo esta vacio o tiene Error
        `;

    } else {
        document.getElementById('errorAñadrLista').innerHTML = ""
    }
}


//cuando presionamos añadir medicamento
document.getElementById('añadirMedicamentoBtn').addEventListener('click', function () {
    revisionañadirMedicamento()

    //comprobar otra vez si todo los datos estan rellenos
    if (comprobacionCa !== true || comprobacionF !== true || comprobacionD !== true || comprobacionS !== true) {
        
        
        if(comprobacionCa !== true){
            document.getElementById('errorCantidadMediamento').innerHTML=`
             <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
                El Cantidad no puede estar Vacio
            `
        }else{
            document.getElementById('errorCantidadMediamento').innerHTML=`
           `;
        }
        if(comprobacionF !== true){
            document.getElementById('errorFrecuenciaMedicamento').innerHTML=`
             <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
                La frecuencia no puede estar Vacio
            `
        }else{
            document.getElementById('errorFrecuenciaMedicamento').innerHTML=`
            `;
        }
        if(comprobacionD !== true){
            document.getElementById('duracionMedicamento').innerHTML=`
             <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
                El duracion no puede estar Vacio
            `
        }else{
            document.getElementById('duracionMedicamento').innerHTML=`
            `
        }
        if(comprobacionS !== true){
            document.getElementById('errorSelectMedicament').innerHTML=`
             <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
                El Medicamento no puede estar Vacio
            `
        }else{
            document.getElementById('errorSelectMedicament').innerHTML=`

           `
        }
        
        //si no se para aqui
        return
    }
    //seleccion del id del select del medicamento
    const medicamentoSeleccioandoNoCompresivo = document.querySelectorAll("#selectMedicacion option:checked");
    const medicamentoSeleccioando = medicamentoSeleccioandoNoCompresivo[0].value;

    //seleccion del radiobutton del cronica
    let cronicaMedicamentoValue;
    //iteramos
    for (let i = 0; i < document.getElementsByName('cronicaMedicamento').length; i++) {
        //comparamos cual esta seleccionado
        if (document.getElementsByName('cronicaMedicamento')[i].checked) {
            //asignamos el valor al variable
            cronicaMedicamentoValue = document.getElementsByName('cronicaMedicamento')[i].value;
            break;  // Ya que solo uno puede estar seleccionado, podemos salir del bucle
        }
    }

    // Enviamos la solicitud con el idCitaDetail adicional
    fetch("../database/operarMedicoAtiendePacientes.php", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        //enviamos v/ asignamos datos nuevamente
        body: JSON.stringify({
            id: id,
            tipoPerfil: tipoPerfil,
            id_cita: id_cita,
            medicamentoSeleccioando: medicamentoSeleccioando,
            cantidadSeleccionadoMedicamento: document.getElementById('cantidadMedicamento').value,
            frecuenciaseleccionadoMedicamento: document.getElementById('frecuenciaMedicamento').value,
            diasSeleccionadoMedicamento: document.getElementById('duracionMedicamento').value,
            cronicaSeleccionadoMedicamento: cronicaMedicamentoValue

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
            //Verificamos si hay un mensaje de la respuesta
            if (data.datoMedicamentoGuardado && data.datoMedicamentoGuardado.message) {
                alert(data.datoMedicamentoGuardado.message);  // Mostramos el mensaje de éxito o error
            }
            //actualiza la pagina     
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error o Medicamento ya Creada.');
        });







});




let errorMedico = true;
let errorDia = true;
let errorSintomas = true;
let medicoSeleccionado;
let fechaFormateada;
//escoger valor de sintomatologia
var sintomas

// Bloquear el envío desde el inicio
//bloquearEnvio();
//comprobacion de seleccion de medico de cita
document.getElementById('divMedicoSelect').onblur = function () {
    // Obtenemos los elementos seleccionados del select
    const seleccionado2 = document.querySelectorAll("#divMedicoSelect option:checked");
    // cogemos eldat seleccionado
    medicoSeleccionado = seleccionado2[0].value;
    if (medicoSeleccionado == "undefined" || medicoSeleccionado == "ningunMedico") {
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
    //bloquearEnvio();
}



document.getElementById('diaCita').onblur = function () {
    const inputFecha = document.getElementById('diaCita').value;
    const fechaSeleccionada = new Date(inputFecha);
    const fechaActual = new Date();
    const maxFecha = new Date(fechaActual);
    maxFecha.setDate(maxFecha.getDate() + 90); // Ajustar el límite de 90 días


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
    else if (fechaSeleccionada < fechaActual) {
        document.getElementById('errorDiaCita').innerHTML = `
            <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
            Fecha no válida`;
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
    //bloquearEnvio(errorDia);

};

document.getElementById('sintomas').onblur = function () {

    sintomas = document.getElementById('sintomas').value;
    if (sintomas.trim() == "") {
        errorSintoma = true;
        document.getElementById('errorSintoma').innerHTML = `
         <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
         El sintoma no puede estar vacio, por que eres medico
        `;
    } else {
        errorSintoma = false;
        document.getElementById('errorSintoma').innerHTML = "";
    }


}



// Función para bloquear el envío dependiendo de los errores
function bloquearEnvio() {
    if (errorMedico === true || errorDia === true) {
        document.getElementById('citaMedicoFamiliaPButt').disabled = true; // Deshabilitar el botón
        // document.getElementById('errorCitaMedicoFamiliaPButt').innerHTML = `
        //         <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
        //             ${errorMedico} ${errorDia}`;
    }
    // else {
    //     document.getElementById('citaMedicoFamiliaPButt').disabled = false; // Habilitar el botón
    //     //document.getElementById('errorCitaMedicoFamiliaPButt').innerHTML = ``;
    // }
}




//PRESIONAR EL BOTON PARA PEDIR CITA

document.getElementById('citaMedicoFamiliaPButt').addEventListener("click", function (event) {
    if (errorMedico === true || errorDia === true || errorSintoma === true) {
        document.getElementById('errorCitaMedicoFamiliaPButt').innerHTML = `
        <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">
            Error en el formulario
        `;
    } else {
        sintomas1 = document.getElementById('sintomas').value
        // Enviamos la solicitud con los datos de la cita
        fetch("../database/operarMedicoAtiendePacientes.php", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                tipoPerfil: tipoPerfil,
                id_cita: id_cita,
                medicoSeleccionado: medicoSeleccionado,
                fechaFormateada: fechaFormateada,
                sintomas1: sintomas1
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
    }

    //document.getElementById('errorCitaMedicoFamiliaPButt').innerHTML=`dsdsdsd: ${sintomas}`
    event.preventDefault();


});


document.getElementById('registroTotal').addEventListener('click', function (event) {
    event.preventDefault();

    const inputFile = document.getElementById('pdf').files[0];
    const formData = new FormData();

    formData.append('id', param.get('id'));
    formData.append('id_cita', id_cita);
    formData.append('diagnostico', document.getElementById('diagnostico').value);
    formData.append('sintoma', document.getElementById('sintomaEspacio').value);
    if (inputFile) {
        formData.append('pdf', inputFile);
    } else {
        alert("No se ha adjuntado el PDF.");
        return;
    }

    fetch("../database/operarRegistroTotal.php", {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('El servidor no responde');
            }
            return response.json();
        })
        .then(data => {
            if (data.actualizarDatosBBDD && data.actualizarDatosBBDD.message) {
                alert(data.actualizarDatosBBDD.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al procesar la solicitud.');
        });



    //comprobaciones 
    //comprobamos si ha subido archivo o no 
    let error = [];
    let comprobacionSintoma = false;
    let comrpbacionDiagnostico = false;
    let comprobacionPDF = false;
    if (inputFile.files.length > 0) {
        comprobacionPDF = true;
    } else {
        error.push("No se ha adjuntado el PDF");
        comprobacionPDF = false;
    }
    if (document.getElementById('sintomaEspacio').value.trim() == "") {
        error.push("El sintoma no puede etar vacio");
        comprobacionSintoma = false;

    } else {
        comprobacionSintoma = true;
    }
    if (document.getElementById('diagnostico').value.trim() == "") {
        error.push("El Diagnostico no puede etar vacio");
        comrpbacionDiagnostico = false;

    } else {
        comrpbacionDiagnostico = true;
    }
    //comprobar si alguno de los compribaciones esta vacio o no 
    if (comprobacionSintoma == false || comrpbacionDiagnostico == false || comprobacionPDF == false) {
        document.getElementById('infoRegistroTotal').innerHTML = error
            .map(function (errorr) {
                return `<ul>
                                    <li> <img src="../assets/icon/errorIcon.png" alt="errorIcon" id="erroricon">${errorr}</li>
                                </ul>`;
            })
            .join(''); // Une los elementos generados en una cadena
    }


});



//para el regreso del al perfil 
document.getElementById('regresar').addEventListener('click', function () {
    window.location.href = `../html/medico.html?id=${id}&type=M`;
});



