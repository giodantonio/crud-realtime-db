import * as fn from './functions.js';

let id, codP, descP, cantP, precioP;

let idA;

$(document).ready(function () {
    let uid;

    if($('#bodyProductos').length > 1) {
        $('#contenido').show();
        $('.info').hide();
    }else {
        $('#contenido').hide();
        $('.info').fadeIn();

    }

    let cod= fn.generarCod (99, 999, 'COD');
    // Se pinta en el input el codigo de producto generado
    $('#cod').attr("value", cod);

    const firebaseConfig = {
        apiKey: "AIzaSyC0E9x6Tzlb234obHxnaEMrIEAg4-18f0s",
        authDomain: "crud-8d6b5.firebaseapp.com",
        databaseURL: "https://crud-8d6b5-default-rtdb.firebaseio.com",
        projectId: "crud-8d6b5",
        storageBucket: "crud-8d6b5.appspot.com",
        messagingSenderId: "313284361886",
        appId: "1:313284361886:web:8aa3d0d76b7cca5d00458f"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const db = firebase.database();

    // Se crea una referencia para la base de datos 'coleccion productos'
    let coleccionProductos = db.ref().child('productos');


    // Validación inputs
    $('input').on({
        keydown: function (e) {
            // Se captura el id del input
            let idSelector = $(this).attr('id');
            // Se programa que el campo no acepte espacios en blanco
            // Y solo admita numeros
            if (idSelector == 'cantidad' || idSelector == 'precio') {
                if (!fn.validarEspacios(e) || !fn.validarInputNum(e)) e.preventDefault();
            }
        },
        blur: function (e) {
            if (fn.validarCampos('#descripcion') && fn.validarCampos('#cantidad') && fn.validarCampos('#precio')) {
                console.log('validado');
                if(($('#cantidad').val() > 0 &&  $('#cantidad').val() <= 100) && $('#precio').val() > 0) {

                    $('#btnAdd').prop('disabled', false);
                }
            }
        }
    });

    $('#btnAdd').click(function () {
        $('#loading').fadeIn();
        // Se descarga el script de sweetAlert
        $.getScript("//cdn.jsdelivr.net/npm/sweetalert2@11")
        .done(function(script, textStatus) {
            $('#error').empty();

            // Se obtiene la key generada por firebase para identificar cada elemento de la coleccion
            uid = coleccionProductos.push().key;

            db.ref(`productos/${uid}`).set({
                uid: uid,
                codigo: $('#cod').val(),
                descripcion: $('#descripcion').val(),
                cantidad: $('#cantidad').val(),
                precio: $('#precio').val()
            });

            $('#btnAdd').prop('disabled', true);

            // se resetean los campos
            $('#formReg')[0].reset();

            // Se actualiza el codigo
            $('#cod').attr("value", fn.generarCod (99, 999, 'COD'));

            Swal.fire(
                '¡Registro Exitoso!',
                'El producto fue agregado de manera exitosa.',
                'success'
            )
            .finally(()=>{
                $('#loading').fadeOut();
                $('#contenido').show();
                $('.info').hide();
            })
        })
        .fail(function(jqxhr, settings, exception) {
            $('#error').append(`
                <div class="alert alert-danger d-flex align-items-center" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                    </svg>
                    <div class="ps-3">
                        Ha ocurrido un error. Intente refrescar la página.
                    </div>
                </div>
            `);
        });
    });

    //CHILD_ADDED (evento de firebase) lee los elementos desde la base de datos detecta nuevos elementos
    coleccionProductos.on('child_added', function(data) {
        let td = fn.mostrarProductos(data.val());
        let tr = `<tr class="align-middle" id=${data.key}>${td}</tr>`;
        // Se agrega la fila
        $('#bodyProductos').append(tr);
        $('#contenido').show();
        $('.info').hide();
    })

    //CHILD_CHANGED (evento de firebase) detecta cualquier cambio en los nodos de los elementos
    coleccionProductos.on('child_changed', function(data) {
        const rows = $('#tablaProductos').prop('rows');
        const idP = data.val().uid

        //Actualizando las filas
        for (let i = 0; i < rows.length; i++) {
            let tr = $(rows)[i];
            if (idP == $(tr).attr('id')) {
                $(tr).children()[0].innerText = data.val().codigo;
                $(tr).children()[1].innerText = data.val().descripcion;
                $(tr).children()[2].innerText = data.val().cantidad;
                $(tr).children()[3].innerText = data.val().precio;
                break;
            }
        }
    })

    //CHILD_removed (evento de firebase) Elimina el producto desde la base de datos
    coleccionProductos.on('child_removed', data => {
        const nodoEditado = data.key;
        const rows = $('#tablaProductos').prop('rows');

        // se elimina la fila
        for (let i = 0; i < rows.length; i++) {
            let tr = $(rows)[i];
            if (nodoEditado == $(tr).attr('id')) {
                $(tr).remove();
            }
        }
    })

    // Se programa el boton editar para cada fila de producto agregado
    $('#tablaProductos').on('click', '.btn-editar', function() {
        // se captura el id de la fila donde se hizo click
        idA = $(this).closest('tr').attr('id');
        // Capturando el texto de cada celda
        let codigo = $(this).closest('tr').find('td:eq(0)').text();
        let descripcion = $(this).closest('tr').find('td:eq(1)').text();
        let cantidad = $(this).closest('tr').find('td:eq(2)').text();
        let precio = $(this).closest('tr').find('td:eq(3)').text();

        // Cada valor capturado en la tabla lo mostramos en el formulario
        id = $('#id').val(idA);
        codP = $('#cod').val(codigo);
        descP = $('#descripcion').val(descripcion);
        cantP = $('#cantidad').val(cantidad);
        precioP = $('#precio').val(precio);

        // Se oculta el boton guardar y se muestra el de editar
        $('.btn-nuevo').hide();
        $('.btn-edit').show();

        $('#descripcion').focus();
    });

    $('#btnEditar').click(function () {

        if (fn.validarCampos('#descripcion') && fn.validarCampos('#cantidad') && fn.validarCampos('#precio')) {

            if(($('#cantidad').val() > 0 &&  $('#cantidad').val() <= 100) && $('#precio').val() > 0) {

                $('#btnEditar').prop('disabled', false);

                // Se actualiza en la base de datos la edicion
                db.ref(`productos/${idA}`).update({
                    uid: idA,
                    codigo: $('#cod').val(),
                    descripcion: $('#descripcion').val(),
                    cantidad: $('#cantidad').val(),
                    precio: $('#precio').val()
                });
                // se resetean los campos
                $('#formReg')[0].reset();
        
                $('.btn-nuevo').show();
                $('.btn-edit').hide();
                
                $('#btnAdd').prop('disabled', true);
            }
        }
    });

    // Programacion boton borrar
    $('#tablaProductos').on('click', '.btn-borrar', function() {
        let idP = $(this).closest('tr').attr('id');
        // console.log(idP);
        // Se descarga el script de sweetAlert
        $.getScript("//cdn.jsdelivr.net/npm/sweetalert2@11")
        .done(function(script, textStatus) {
            $('#error').empty();
            // Se programa la ventana modal para ingresar datos
            Swal.fire({
                title: 'Confirmación',
                text: "¿Está seguro que desea eliminar el producto?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Borrar',
                cancelButtonText: 'Cancelar'
            }).then(function(result) {
                // Validacion de campos
                if (result.isConfirmed) {
                    // se captura el id de la fila donde se hizo click
                    // Eliminamos el producto de firebase
                    db.ref(`productos/${idP}`).remove();

                    Swal.fire(
                        '¡Eliminado!',
                        'El producto se ha eliminado.',
                        'success'
                    )
                }
            })
        })
        .fail(function(jqxhr, settings, exception) {
            $('#error').append(`
                <div class="alert alert-danger d-flex align-items-center" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                    </svg>
                    <div class="ps-3">
                        Ha ocurrido un error. Intente refrescar la página.
                    </div>
                </div>
            `);
        });
    });
})

