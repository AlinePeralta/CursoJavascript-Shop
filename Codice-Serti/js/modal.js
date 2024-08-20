// Selecciona elementos
const modalButtons = document.querySelectorAll("[data-modal]");
const modals = document.querySelectorAll(".modal-content");
const closeButtons = document.querySelectorAll(".modal-close");
const tableRows = document.querySelectorAll("table tr");
const listItems = document.querySelectorAll("ul li");
const buttons = document.querySelectorAll("button");
const inputs = document.querySelectorAll("input");
const inputIcons = document.querySelectorAll(".input_icon");

// Muestra el modal
const showModal = (modalId) => {
    const modal = document.querySelector(`#${modalId}`);
    if (modal) {
        modal.classList.add("active");
        document.body.classList.add("modal-active");
        document.querySelector("nav").classList.add("disabled");
        tableRows.forEach(row => !row.closest(".modal-content") && row.classList.add("disable-click"));
        listItems.forEach(item => item.classList.add("disable-click"));
        buttons.forEach(btn => btn.classList.add("disable-click"));
        inputs.forEach(input => !input.closest(".modal-content") && input.classList.add("disable-click"));
    }
};

// Oculta todos los modales
const hideModals = () => {
    modals.forEach(modal => modal.classList.remove("active"));
    document.body.classList.remove("modal-active");
    document.querySelector("nav").classList.remove("disabled");
    tableRows.forEach(row => row.classList.remove("disable-click"));
    listItems.forEach(item => item.classList.remove("disable-click"));
    buttons.forEach(btn => btn.classList.remove("disable-click"));
    inputs.forEach(input => input.classList.remove("disable-click"));
};

// Abre modales al hacer clic en botones
modalButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        event.stopPropagation();
        showModal(button.getAttribute("data-modal"));
    });
});

// Cierra modales al hacer clic en botones de cerrar
closeButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        event.stopPropagation();
        hideModals();
    });
});

// Cierra el modal al hacer clic en la sombra
document.body.addEventListener("click", (event) => {
    if (document.body.classList.contains("modal-active") && !event.target.closest(".modal-content")) {
        hideModals();
    }
});

// Cierra el modal al hacer clic en los íconos de entrada
inputIcons.forEach(icon => {
    icon.addEventListener("click", (event) => {
        event.stopPropagation();
        hideModals();
    });
});

// Evita cerrar el modal al hacer clic dentro del contenido
modals.forEach(modal => {
    modal.addEventListener("click", (event) => {
        event.stopPropagation();
    });
});
