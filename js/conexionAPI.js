async function productList() {
    const conexion = await fetch("http://localhost:3000/products");
    const conexionConvertida = conexion.json();
    return conexionConvertida;
}

// Agregar producto
async function createProducts(name,price,image) {
    const conexion = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify({
            name:name,
            price:price,
            image:image
        })
    })
    //Convertir esa conexión a un elemnto JSON
    const conexionConvertida = conexion.json();

    // Si la conexión falla
    if(!conexion.ok) {
        throw new Error("Ha ocurrido un error al enviar el producto");
    }

    // Se va a retornar cuando sea accionada la función createProducts
    return conexionConvertida;
}

// Eliminar un producto
async function deleteProducts(id) {
    const conexion = await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE"
    });
     // Manejar posibles errores en la eliminación
     if (!conexion.ok) {
        throw new Error("Ha ocurrido un error al eliminar el producto");
    }

    // Devolver la respuesta de la conexión
    return conexion; 
}

// Buscar un producto
async function searchProducts(palabraClave) {
    const conexion = await fetch(`http://localhost:3000/products?q=${palabraClave}`);
    const conexionConvertida = conexion.json();
    return conexionConvertida;
}

export const conexionAPI = {
    productList, createProducts, deleteProducts, searchProducts
}