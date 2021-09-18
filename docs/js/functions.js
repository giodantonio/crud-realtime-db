// Código aleatorio
export function generarCod (min, max, cod) {
    let num = Math.floor((Math.random() * (max - min + 1)) + min);
    return `${cod + num}`;
}

// No acepta espacios
export function validarEspacios(e) {
	let code = e.keyCode != 0 ? e.keyCode : e.charCode;
	if (code == 32) return false;
	else return true;
}

// Solo acepta numeros
export function validarInputNum(e) {
	let code = e.keyCode != 0 ? e.keyCode : e.charCode;
	if (code == 8 || code == 9)
		// backspace && tab.
		return true;

	if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105)) {
		String.fromCharCode(code);
		return true;
	} else return false;
}

// Verifica que los campos no esten vacíos y tengan la longitud requerida
export function validarCampos(id) {
    
    let value = $(id).val();
    if($(id).val().trim().length > 0) {

        if($(id).attr('maxLength') !== undefined && $(id).attr('minLength') !== undefined) {
            let max = $(id).attr('maxlength');
            let min = $(id).attr('minlength');

            if(value.length >= min && value.length <= max) {
                $(id).removeClass('is-invalid');
                return true;
            }else {
                $(id).addClass('is-invalid');
                return false;
            }

        }else{
            $(id).removeClass('is-invalid');
            return true;
        }
    } else {
        $(id).addClass('is-invalid');
        return false;
    }
}

// Crear registro
export function mostrarProductos({codigo, descripcion, cantidad, precio}) {
    return `
        <td>${codigo}</td>
        <td>${descripcion}</td>
        <td>${cantidad}</td>
        <td>${precio}</td>
        <td class="text-center">
            <button class="btn-editar btn btn-secondary me-lg-2 mb-2 mb-md-0" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil-fill"></i></button>
            <button class="btn-borrar btn btn-danger" data-toggle="tooltip" title="Borrar"><i class="bi bi-trash-fill"></i></button>
        </td>
    `
}