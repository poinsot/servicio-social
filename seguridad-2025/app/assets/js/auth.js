// Genera y guarda una clave específica para una página

function inicializarClaves() {
    const clavesMapa = {
        "modulo2": 83742,
        "modulo3": 12958,
        "modulo4": 64590,
        "modulo5": 39017,
        "modulo6": 57281,
        "modulo7": 91824,
        "modulo8": 46309,
        "modulo9": 25036,
        "modulo10": 70415
    };

    for (const [paginaId, clave] of Object.entries(clavesMapa)) {
        if (!localStorage.getItem(`clave_${paginaId}`)) {
            localStorage.setItem(`clave_${paginaId}`, clave);
            localStorage.setItem(`acceso_${paginaId}`, "true"); 
        }
    }
}

// Llama a la función de inicialización cuando la página se carga
document.addEventListener("DOMContentLoaded", function () {
    inicializarClaves();
   
});



function generarClave(paginaId) {
    const clavesMapa = {
        "modulo2": 83742,
        "modulo3": 12958,
        "modulo4": 64590,
        "modulo5": 39017,
        "modulo6": 57281,
        "modulo7": 91824,
        "modulo8": 46309,
        "modulo9": 25036,
        "modulo10": 70415
    };
    const clave = clavesMapa[paginaId];
    //const clave = Math.floor(10000 + Math.random() * 90000); // Clave de 5 dígitos
    localStorage.setItem(`clave_${paginaId}`, clave); // Guarda la clave en localStorage con un prefijo específico para cada página
    document.getElementById("clave").innerHTML = "Clave para la siguiente unidad:<br><br><b>" + clave + "</b>";
     // Crear el icono de portapapeles
    const clipboardIcon = document.createElement("img");
    clipboardIcon.src = "../../assets/images/course/quiz/copy.png"; // Asegúrate de tener la imagen en la ruta especificada
    clipboardIcon.style.cursor = "pointer";
    clipboardIcon.alt = "Copiar Clave";
    clipboardIcon.style.width = "1em";
    clipboardIcon.style.height = "1em";
    clipboardIcon.style.verticalAlign = "middle";
    clipboardIcon.style.marginLeft = "0.5em";

    // Crear el comentario flotante
    const tooltip = document.createElement("span");
    tooltip.innerText = "Copiar";
    tooltip.style.visibility = "hidden";
    tooltip.style.backgroundColor = "black";
    tooltip.style.color = "#fff";
    tooltip.style.textAlign = "center";
    tooltip.style.borderRadius = "5px";
    tooltip.style.padding = "2px 5px";
    tooltip.style.fontSize = "0.75em"; // Texto chico
    tooltip.style.position = "absolute";
    tooltip.style.zIndex = "1";
    tooltip.style.marginLeft = "10px";
    tooltip.style.opacity = "0";
    tooltip.style.transition = "opacity 0.3s";

    // Agregar evento de hover al icono de portapapeles
    clipboardIcon.addEventListener("mouseover", () => {
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";
    });

    clipboardIcon.addEventListener("mouseout", () => {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    });

    // Agregar evento de clic al icono de portapapeles
    clipboardIcon.addEventListener("click", () => {
        navigator.clipboard.writeText(clave).then(() => {
            window.location.href = `../temario/temario.html?paginaId=${paginaId}`; // Redirigir a temario.html con paginaId
        }).catch(err => {
            console.error("Error al copiar la clave: ", err);
        });
    });

    // Agregar el icono y el comentario flotante al DOM
    const claveElement = document.getElementById("clave");
    claveElement.appendChild(clipboardIcon);
    claveElement.appendChild(tooltip);
}

// Verifica la clave y realiza redirección automática si es correcta
function verificarClave(paginaId, claveIngresada) {
    const claveGuardada = localStorage.getItem(`clave_${paginaId}`);
    console.log("Clave guardada:", claveGuardada);
    console.log("Clave ingresada:", claveIngresada);
    console.log("PaginaIdActual:", paginaId);
    if (claveIngresada === claveGuardada) {
        localStorage.setItem(`acceso_${paginaId}`, "true"); // Guarda el estado de acceso permitido
        redirigirPagina(paginaId); // Redirige automáticamente a la página correspondiente
        return true;
    } else {
        document.getElementById("mensaje").innerText = "Clave incorrecta. Inténtalo de nuevo.";
        return false;
    }
}

// Revisa si el usuario tiene acceso concedido a una página específica
function tieneAcceso(paginaId) {
    return localStorage.getItem(`acceso_${paginaId}`) === "true";
}

// Redirige automáticamente a la página restringida correspondiente
function redirigirPagina(paginaId) {
    switch (paginaId) {
        case "modulo2":
            window.location.href = "../../html/modulo2/modulo2-2.html";
            break;
        case "modulo3":
            window.location.href = "../../html/modulo3/modulo3-2.html";
            break;
        case "modulo4":
            window.location.href = "../../html/modulo4/modulo4-2.html";
            break;
        case "modulo5":
            window.location.href = "../../html/modulo5/modulo5-2.html";
            break;
        case "modulo6":
            window.location.href = "../../html/modulo6/modulo6-2.html";
            break;
        case "modulo7":
            window.location.href = "../../html/modulo7/modulo7-2.html";
            break;
        case "modulo8":
            window.location.href = "../../html/modulo8/modulo8-2.html";
            break;
        case "modulo9":
            window.location.href = "../../html/modulo9/modulo9-2.html";
            break;
        case "modulo10":
            window.location.href = "../../html/modulo10/modulo10-2.html";
            break;

        default:
            console.error("No se encontró una página de redirección para", paginaId);
    }
}
