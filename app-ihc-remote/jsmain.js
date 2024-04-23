const mockApiUrl = 'https://6605ef1dd92166b2e3c3035d.mockapi.io/Comandos';

function obtenerUltimoRegistro() {
  fetch(mockApiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo obtener el último registro');
      }
      return response.json();
    })
    .then(data => {
      const ultimoRegistro = data[data.length - 1]; // Obtiene el último registro directamente sin ordenar
      mostrarUltimoRegistro(ultimoRegistro);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function mostrarUltimoRegistro(registro) {
  const textoUltimoRegistro = document.getElementById('texto-ultimo-registro');
  if (registro) {
    textoUltimoRegistro.textContent = `Último registro: ${registro.Comando} (ID: ${registro.idComando})`;
  } else {
    textoUltimoRegistro.textContent = 'No hay registros disponibles';
  }
}

// Función para actualizar y mostrar el último registro cada 4 segundos
function actualizarCadaCuatroSegundos() {
  obtenerUltimoRegistro();
  setInterval(obtenerUltimoRegistro, 4000);
}

// Llama a la función para actualizar cada 4 segundos cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  actualizarCadaCuatroSegundos();
});
