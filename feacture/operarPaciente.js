
document.addEventListener(DOMException, function (){

    const param = new URLSearchParams (window.location.search);
    const idPersona = param.get ('id_persona');

    }
);




//div para infoPersonalPDiv
const divNombreEspacio = document.getElementById('nombrePEspacio');
const divSexoEspacio = document.getElementById('sexoPEspacio');
const divNacimientoEspacio = document.getElementById('nacimientoPEspacio');
//introducimos datos, para la entreha de Irene tenemos que modificar
//MODIFICAR
divNombreEspacio.innerHTML = ``;
divSexoEspacio.innerHTML = ``;
divNacimientoEspacio.innerHTML = ``;
divNombreEspacio.innerHTML = "Juan Perez";
divSexoEspacio.innerHTML = "Hombre";
divNacimientoEspacio.innerHTML = "2000 - 01 - 01";

//div para citacionesProximaPDiv
const divProximasCitasEspacio = document.getElementById('proximasCitasP');
//MODIFICAR
divProximasCitasEspacio.innerHTML = `
    Fecha: 2022-12-01 <br>
    <ul>
        <li>ID: 1001</li>
        <li>Medico: Paula Sanchez</li>
    </ul>    
`;

//div para medicamenosActualesPDiv
const divMedicamentoActualesEspacio = document.getElementById('medicamenosActualesP');
//MODIFICAR
divMedicamentoActualesEspacio.innerHTML = `
    <ul>
        <li>Amoxicilina (2022-12-1)</li>
        <li>Paracetamol (2021-12-1)</li>
    </ul>
`;

//div para historialConsultaPDiv
const lista = document.getElementById('historialConsultaP');
const btnVer = document.querySelector('#consultar');
const divInfoEspacio = document.getElementById('infoHistorialConsultaP');
//MODIFICAR
let tarea = ['(1001) - (2020-01-20)', '(1002) - (2020-03-20)'];
if (tarea.length > 0) {
    lista.innerHTML = '';
    tarea.forEach(item => {
        //añadimos el elemento al select
        lista.innerHTML += `<option value="${item}">${item}</option>`;
    });
}
btnVer.onclick = (event) => {
    event.preventDefault();
    //creamos un nuevo array que se llama seleccionado
    //y pasamos los valores ques esta seleccionado
    const seleccionado = document.querySelectorAll("#historialConsultaP option:checked");
    //comprobamos el tamaño del array
    //si el array es igual que 0 signidica el array es 
    if (seleccionado.length === 0) {
        alert("No hay ningún seleccionado!");
        return;
    }
    //iteramos el array que contiene el seleccionado
    //en teoria solo habra 1 elemento
    seleccionado.forEach(valorSeleccionado => {
        imprimirInfo(valorSeleccionado)
    })
};
function imprimirInfo(valor) {
    //sacamos el indice que se encuentra en el array
    const indice = tarea.indexOf(valor.value);
    if (indice == 0) {
        divInfoEspacio.innerHTML = '';
        divInfoEspacio.innerHTML = 'Dolor de Estomago';
    }
    else if (indice === 1) {
        divInfoEspacio.innerHTML = '';
        divInfoEspacio.innerHTML = 'Dolor de cabeza';
    } else {
        divInfoEspacio.innerHTML = '';
        divInfoEspacio.innerHTML = `No has seleccionado nada index: ${indice}`;
    }


}