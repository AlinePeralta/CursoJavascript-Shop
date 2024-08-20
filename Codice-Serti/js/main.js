// Manejo de Submenús
document.addEventListener("DOMContentLoaded", function() {
    const toggles = document.querySelectorAll('.menu-toggle');
    const submenuLinks = document.querySelectorAll('.submenu-link');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            event.preventDefault();
            const submenu = this.nextElementSibling;
            if (submenu) {
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                this.classList.toggle('open');
            }
        });
    });

    submenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            submenuLinks.forEach(l => l.classList.remove('active-submenu'));
            this.classList.add('active-submenu');
        });
    });
});

// Cerrar Menú Móvil al hacer clic fuera
$(document).ready(function() {
    $(document).on('click', function(e) {
        if (!$(e.target).closest('header').length) {
            $('#menu-toggle').prop('checked', false);
        }
    });
});

// Manejo de Tabs
(function($) {
    $(function() {
        const tabLinks = $('#tabs-section .tab-link');
        const tabBodies = $('#tabs-section .tab-body');

        tabLinks.on('click', function(event) {
            event.preventDefault();
            tabLinks.removeClass('active');
            tabBodies.removeClass('active active-content');

            $(this).addClass('active');
            $($(this).attr('href')).addClass('active');

            setTimeout(() => {
                $($(this).attr('href')).addClass('active-content');
            }, 50);
        });
    });
})(jQuery);

// Añadir Transacciones en Tiempo Real
function addTransaction(transactionHtml) {
    const tbody = document.getElementById('transaction-table-body');
    const newRow = document.createElement('tr');
    newRow.className = 'transaction-item';
    newRow.innerHTML = transactionHtml;
    tbody.insertBefore(newRow, tbody.firstChild);
  
    setTimeout(() => {
        newRow.classList.add('animate'); 
        setTimeout(() => {
            newRow.classList.remove('animate');
        }, 1000); 
    }, 10); 

    const lastItem = document.querySelector('#transaction-table-body tr:last-child');
    if (lastItem) {
        lastItem.classList.add('exit');
        lastItem.addEventListener('animationend', () => {
            lastItem.remove();
        });
    }
}

// Cerrar Notificaciones
// Función para manejar el cierre de elementos con la clase 'cerrar'
function setupCloseButtons() {
    const cerrarButtons = document.querySelectorAll('.cerrar');
    cerrarButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.style.display = 'none';
        });
    });
}

// Ejecutar la función cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', setupCloseButtons);
