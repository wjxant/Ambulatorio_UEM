const user = document.getElementById('usuario');
const contraseña = document.getElementById('contraseña');
const errorUser = document.getElementById('errorUser');
const errorContraseña = document.getElementById('errorContraseña');
const errorValidacion = document.getElementById('errorValidacion');
let validadoUser = false;
let validadoPass = false;
//comprobaciones donde se pierde el foco en el usuario
user.onblur = function () {
    if (user.value.trim() == "") {
        errorUser.innerHTML = ""
        errorUser.innerHTML = `
            <input type="image" src="../assets/icon/errorIcon.png" alt="errorIcon">
            El usuario no puede ser vacio
        `;
        validadoUser = false;
        comprobarValidaciones();
    } else {
        if (validarUser(user.value) !== true) {
            errorUser.innerHTML = `
                <input type="image" src="../assets/icon/errorIcon.png" alt="errorIcon">
                El usuario tiene:
                <ul>
                    <li>Empezar por una Letra</li>
                    <li>9 digitos de numero</li>
                </ul>
                 que empezar por una letra y 8 numeros
            `;
            validadoUser = false;
            comprobarValidaciones();
        }else if (validarUser(user.value) === true) {
            errorUser.innerHTML = ``;
            validadoUser = true;
            comprobarValidaciones();
        }

    }
}
//vamos a crear un metodo que hace el validacion 
function validarUser(valor) {
    //comprobamos si empeza por un a letra y 8 numeros
    if (!(/^[A-Za-z]\d{9}$/.test(valor))) {
        return false;
    }else{
        return true;
    }
}
//comprobaciones donde se pierde el foco en el contraseña
contraseña.onblur = function () {
    if (contraseña.value.trim() == "") {
        errorContraseña.innerHTML = ""
        errorContraseña.innerHTML = `
            <input type="image" src="../assets/icon/errorIcon.png" alt="errorIcon">
            La contraseña no puede ser vacia
        `;
        validadoPass = false;
        comprobarValidaciones();
    } else {
        if (validarContraseña(contraseña.value) !== true) {
            errorContraseña.innerHTML = `
                <input type="image" src="../assets/icon/errorIcon.png" alt="errorIcon">
                La contraseña debe contener:
                <ul>
                    <li>Más de 4 dígitos</li>
                    <li>Un carácter especial</li>
                    <li>Una letra mayúscula</li>
                    <li>Una letra minúscula</li>
                </ul>

            `;
            validadoPass = false;
            comprobarValidaciones();
        }else if (validarContraseña(contraseña.value) === true) {
            errorContraseña.innerHTML = ``;
            validadoPass = true;
            comprobarValidaciones();
        }

    }


}
//vamos a crear un metodo que hace el validacion 
function validarContraseña(valor) {
    //comprobamos si empeza por un a letra y 8 numeros
    if (!(/^(?=.*\d{4,})(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z]).*$/
.test(valor))) {
        return false;
    }else{
        return true;
    }
}



document.getElementById('submit').addEventListener("click", function () {
    comprobarValidaciones();
    document.getElementById('submit').disabled = false;
});

function comprobarValidaciones(){
    if (validadoUser == false || validadoPass == false){
        document.getElementById('submit').disabled = true; 
        errorValidacion.innerHTML = `
            <input type="image" src="../assets/icon/errorIcon.png" alt="errorIcon">
            El Usuario y la Contraseña no son válidos
            ${validadoUser}, ${validadoPass}
        `;
        e.preventDefault(); // Evita el envío del formulario
    }else{
        document.getElementById('submit').disabled = false; 
        errorValidacion.innerHTML = ``;
    }

}


