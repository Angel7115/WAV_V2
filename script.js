const controlTexto = document.getElementById('controlTexto');

document.addEventListener('DOMContentLoaded', async function() {
  const escucharIntervalo = 6000;
  const descansoIntervalo = 5000;

  async function iniciarEscucha() {
    while (true) {
      await escuchar();
      await descansar();
    }
  }

  async function escuchar() {
    return new Promise(resolve => {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'es-ES';

      recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();

        //********************************************************* SECCION TAMAÑOS LETRA */

        const sizeKeywords = ['tamaño 1', 'tamaño 2', 'tamaño 3', 'tamaño 4', 'tamaño 5', 'tamaño 6'];

        for (let i = 1; i <= 6; i++) {
          if (transcript.includes(`tamaño ${i}`)) {
            for (let j = 1; j <= 6; j++) {
              controlTexto.classList.remove(`fs-${j}`);
            }
            controlTexto.classList.add(`fs-${i}`);
            console.log(`Se detectó la palabra clave: tamaño ${i}`);
            enviarOrdenA(mockApiUrl, `tamaño ${i}`);
            resolve();
            return;
          }
        }

        //********************************************************* SECCION NAVEGADOR */

        const browserKeywords = {
          'abrir pestaña': () => window.open('https://www.google.com/?hl=es', '_blank'),
          'ir a youtube': () => window.open('https://www.youtube.com', '_blank'),
          'ir a facebook': () => window.open('https://www.facebook.com', '_blank'),
          'ir a github': () => window.open('https://www.github.com', '_blank'),
          //'maximizar ventana': () => window.resizeTo(screen.width, screen.height),
          //'minimizar ventana': () => window.resizeTo(screen.width / 2, screen.height / 2),
          //'cerrar pestaña': () => window.close(),
         // 'cerrar navegador': () => window.close()
        };

        for (const keyword in browserKeywords) {
          if (transcript.includes(keyword)) {
            browserKeywords[keyword]();
            console.log(`Se detectó la palabra clave: ${keyword}`);
            enviarOrdenA(mockApiUrl, keyword);
            resolve();
            return;
          }
        }

        console.log('Comando no reconocido');
        resolve();
      };

      recognition.onerror = function(event) {
        console.error('Error de reconocimiento de voz: ' + event.error);
        resolve();
      };

      recognition.start();

      mostrarMensaje("A la escucha...");

      setTimeout(() => {
        recognition.stop();
        resolve();
      }, escucharIntervalo);
    });
  }

  function descansar() {
    return new Promise(resolve => {
      mostrarMensaje("Necesito un momentito...");

      setTimeout(resolve, descansoIntervalo);
    });
  }

  function mostrarMensaje(mensaje) {
    const resultContainer = document.getElementById('result-container');
    resultContainer.textContent = mensaje;
  }

  iniciarEscucha();
});

function enviarOrdenA(url, comando) {
  const orden = {
    Comando: comando
  };

  const opciones = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orden)
  };

  fetch(url, opciones)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al enviar la orden a MockAPI.io');
      }
      return response.json();
    })
    .then(data => {
      console.log('Orden enviada correctamente a MockAPI.io:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

const mockApiUrl = 'https://6605ef1dd92166b2e3c3035d.mockapi.io/Comandos';
