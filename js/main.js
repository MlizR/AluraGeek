import {
    conexionAPI
} from "./conexionAPI.js";

import {tiposError,mensajes} from "./customError.js";

const productContainer = document.querySelector("[data-products]");
const formulario = document.querySelector("[data-form]");
const boton = document.querySelector("[data-boton-busqueda]");
const inputElemento = document.querySelector("#buscar");
const camposDeFormulario = document.querySelectorAll("[required]");


function createCard(name, price, image, id) {
    // Crea un elemento div
    const card = document.createElement("div");
    // Se le añade una estilización
    card.className = "card";

    card.innerHTML = `
        <div class="img-card">
            <img src="${image}" alt="${name}">
        </div>
        <div class="card-info">
            <p>${name}</p>
            <div class="card-value">
                <p>$ ${price}</p>
            <button class="button-delete" data-id="${id}">
                <img src="img/borrar.png" alt="eliminar">
            </button>
            </div>
        </div>
    `;

    const deleteButton = card.querySelector('.button-delete');
    deleteButton.addEventListener('click', function () {
        // Mostrar un mensaje de confirmación antes de eliminar
        const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
        if (confirmed) {
            eliminarProducto(id);
        }
    });

    //productContainer.appendChild(card);
    return card;
}

const render = async () => {
    try {
        const listProducts = await conexionAPI.productList();
        listProducts.forEach(product => productContainer.appendChild(createCard(product.name, product.price, product.image, product.id)));
        if (listProducts.length == 0) {
            productContainer.innerHTML = `<h2 class="mensaje__titulo">No se han agregado productos*</h2>`;

        }


    } catch {
        productContainer.innerHTML = '<h2 class="mensaje__titulo">Ha ocurrido un problema con la conexión :(</h2>'
    }
};

render();


//////////////////////  Crear producto ////////////////////////////
async function crearProducto(evento) {
    evento.preventDefault();

    const name = document.querySelector("[data-name]").value;
    const price = document.querySelector("[data-price]").value;
    const image = document.querySelector("[data-img]").value;

    try {
        // Esperamos el retorno de la función
        await conexionAPI.createProducts(name, price, image);

    } catch (e) {
        // Muestra el mensaje de error que se creo en conexionApi
        alert(e);

    }
}
formulario.addEventListener("submit", evento => crearProducto(evento));


/////////////////////// Eliminar producto ///////////////////////
async function eliminarProducto(id) {
    try {
        await conexionAPI.deleteProducts(id);
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
    }
}



/////////////////////// Buscar producto ///////////////////////

async function filtrarProducto(evento) {
    evento.preventDefault();
    console.log("Iniciando búsqueda...");
    const inputBuscar = document.querySelector("[data-busqueda]").value.toLowerCase();
    console.log("Palabra clave de búsqueda:", inputBuscar);

    try {
        //Obetener el json luego de accionar la busqueda en la conexión API
        const busqueda = await conexionAPI.searchProducts(inputBuscar);
        console.log("Resultados de la búsqueda:", busqueda);

        while(productContainer.firstChild){
            // Si es TRUE
            // Cada ves que encuentre que tiene un hijo lo va ir removiendo y al final va a remover todos los hijos que encuentra y va a agregar unicamente los elementos resultantes de la busqueda
            productContainer.removeChild(productContainer.firstChild);
        }

        // Limpiar el contenedor de productos
        productContainer.innerHTML = '';

        if (busqueda.length > 0) {
            let resultadosCoincidentes = busqueda.filter(product => product.name.toLowerCase().includes(inputBuscar));
            if (resultadosCoincidentes.length > 0) {
                resultadosCoincidentes.forEach(product => {
                    productContainer.appendChild(createCard(product.name, product.price, product.image, product.id));
                });
            } else {
                productContainer.innerHTML = `<h2 class="mensaje__titulo">No se encontraron productos para "${inputBuscar}"</h2>`;
            }
        } else {
            productContainer.innerHTML = `<h2 class="mensaje__titulo">No se encontraron productos para "${inputBuscar}"</h2>`;
        }

    } catch (error) {
        productContainer.innerHTML = `<h2 class="mensaje__titulo">Ha ocurrido un error al buscar productos</h2>`;
        console.error(error);
    }
}

boton.addEventListener("click", evento => filtrarProducto(evento));


// Buscar con la tecla enter
// Agregamos un evento al elemnto, que se activa cuando se presiona una tecla (keyup)
inputElemento.addEventListener("keyup", function (e) {
    // Cuando se detecta que se presiono la tecla se obtiene el codigo de la tecla (keycode)
    var key = e.which || e.keyCode;
    if (key == 13) {
        filtrarProducto(e)
    }
});


/////////////////////// Errores ///////////////////////////

camposDeFormulario.forEach((campo) => {
    campo.addEventListener("blur", () => verificarCampo(campo));
    campo.addEventListener("invalid", evento => evento.preventDefault());
});

function verificarCampo(campo) {
    let mensaje = "";
    campo.setCustomValidity("");

    tiposError.forEach(error => {
        if (campo.validity[error]) {
            mensaje = mensajes[campo.name][error];
            console.log(mensaje);
        }
    });

    const mensajeError = campo.nextElementSibling;
    const validaInputCheck = campo.checkValidity();

    if (mensajeError) {
        if (!validaInputCheck) {
            mensajeError.textContent = mensaje;
        } else {
            mensajeError.textContent = "";
        }
    }
}