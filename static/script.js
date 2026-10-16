//Dashboard

const chatSection = document.querySelector('.chat-section');
const resizeButton = document.getElementById('resize-button');
const contactsSection = document.querySelector('.contacts-section');
const goToBottomButton = document.getElementById("go-to-bottom");

let isExpanded = true;

resizeButton.addEventListener('click', () => {
    if (isExpanded) {
        chatSection.style.flex = '80%';
        chatSection.style.maxWidth = '80%';
        contactsSection.style.flex = '0%';
        contactsSection.style.maxWidth = '0%';
    } else {
        chatSection.style.flex = '55%';
        chatSection.style.maxWidth = '55%';
        contactsSection.style.flex = '20%';
        contactsSection.style.maxWidth = '20%';
    }

    isExpanded = !isExpanded;
});

chatSection.addEventListener("scroll", () => {
    // Si el usuario ha desplazado hacia arriba en la sección de chat,
    // muestramos el botón para ir al final
    if (chatSection.scrollTop > 0) {
        goToBottomButton.style.display = "block";
    } else {
        goToBottomButton.style.display = "none";
    }
});

goToBottomButton.addEventListener("click", () => {
    // Al hacer clic en el botón, desplázate al final de la sección de chat
    chatSection.scrollTop = chatSection.scrollHeight;
});

const messageTextarea = document.getElementById('user-message');
const chatbox = document.querySelector('.chatbox');
const initialInputHeight = messageTextarea.clientHeight; // Altura inicial de chatInput

messageTextarea.addEventListener('input', () => {
    messageTextarea.style.height = 'auto';
    messageTextarea.style.height = (messageTextarea.scrollHeight > 140 ? '140px' : messageTextarea.scrollHeight + 'px');

    chatbox.scrollTop = chatbox.scrollHeight;

});


//Resetpassword

let countdown = 15;
let countdownInterval;

function startCountdown() {
    const resendCodeButton = document.getElementById('resend-code-button');
    resendCodeButton.classList.add('countdown-button');

    countdownInterval = setInterval(() => {
        countdown--;

        if (countdown === 0) {
            clearInterval(countdownInterval);
            resendCodeButton.removeAttribute('disabled');
            resendCodeButton.classList.remove('countdown-button');
            resendCodeButton.innerText = 'Volver a enviar código';
        } else {
            resendCodeButton.innerText = `Volver a enviar código (${countdown})`;
        }
    }, 1000);
}

window.onload = startCountdown;

const resendCodeButton = document.getElementById('resend-code-button');
resendCodeButton.addEventListener('click', () => {
    countdown = 15;
    startCountdown();
});

//Base

function togglePasswordVisibility() {
    var password = document.getElementById("password");
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}

function togglePasswordVisibility2() {
    var new_password = document.getElementById("new_password");
    if (new_password.type === "password") {
        new_password.type = "text";
    } else {
        new_password.type = "password";
    }
}

function togglePasswordVisibility3() {
    var confirm_password = document.getElementById("confirm_password");
    if (confirm_password.type === "password") {
        confirm_password.type = "text";
    } else {
        confirm_password.type = "password";
    }
}


//chatseccion

const chatInput = document.querySelector(".message-textarea");
const sendChatBtn = document.querySelector(".message-send");
const chatboxid = document.getElementById("chatboxid"); // Agrega un ID para seleccionarlo

let userMessage;



const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    const chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span><i class="fa-solid fa-paper-plane"></i></span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    const newChatLi = createChatLi(userMessage, "outgoing");
    chatboxid.appendChild(newChatLi); // Agrega el nuevo mensaje al final de la lista
    chatInput.value = "";

    // Desplaza la ventana de chat hacia abajo para mostrar el mensaje más nuevo
    chatboxid.scrollTop = chatboxid.scrollHeight;
}

sendChatBtn.addEventListener("click", handleChat);

function sendMessage() {
    const userMessage = document.getElementById("user-message").value;
    if (userMessage) {
        const chatboxid = document.querySelector("#chatboxid");
        const chatLi = document.createElement("li");
        chatLi.className = "chat outgoing";
        chatLi.innerHTML = `<p>${userMessage}</p>`;
        chatboxid.appendChild(chatLi);
        document.getElementById("user-message").value = "";

        // Actualiza la altura inicial
        messageTextarea.style.height = 'auto';
        initialInputHeight = messageTextarea.clientHeight; 

        // Calcula el bottom de chatbox en función de chatInput
        const currentInputHeight = messageTextarea.clientHeight;
        const heightDifference = currentInputHeight - initialInputHeight;
        chatbox.style.bottom = (83 + heightDifference) + 'px';

        // Desplaza la ventana de chat hacia abajo para mostrar el mensaje más nuevo
        chatboxid.scrollTop = chatboxid.scrollHeight;
            
        // Después de enviar el mensaje, restablece la altura del textarea
        
        // Añade el evento de tecla presionada al textarea
        messageTextarea.addEventListener('keydown', (event) => {
        // Verifica si la tecla presionada es "Enter" y no "Shift + Enter"
        if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Evita que se inserte un salto de línea en el textarea
        enviarMensaje();
    }
});

    }
}



        // Función que se ejecuta al hacer clic en el botón de búsqueda
        function performSearch() {
            const searchTerm = document.getElementById('searchInput').value;
            alert('Realizar búsqueda: ' + searchTerm);
        }

        // Agregar un manejador de eventos al botón de búsqueda
        const searchButton = document.getElementById('searchButton');
        searchButton.addEventListener('click', performSearch);

        // Manejar la búsqueda al presionar Enter en el campo de entrada
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });


// tetris

class Tetris {
    constructor() {
        this.board = [];
        this.currentPiece = null;
        this.currentPosition = { x: 4, y: 0 };
        this.intervalId = null;
        this.gameOver = false;
        this.score = 0;
        this.scoreElement = document.getElementById('score');
        this.highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        this.createBoard();
        this.startGame();
    }

    createBoard() {
        for (let row = 0; row < 20; row++) {
            this.board[row] = [];
            for (let col = 0; col < 10; col++) {
                this.board[row][col] = 0;
            }
        }
    }

    drawBoard() {
        const tetrisBoard = document.querySelector('.tetris-board');
        tetrisBoard.innerHTML = '';
        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                if (this.board[row][col] !== 0) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece');
                    piece.classList.add(`piece-${this.board[row][col]}`);
                    cell.appendChild(piece);
                }
                tetrisBoard.appendChild(cell);
            }
        }
        this.scoreElement.textContent = this.score;
    }

    // Resto de la lógica del juego...

    // Método para actualizar el marcador de puntuación
    updateScore(points) {
        this.score += points;
        this.scoreElement.textContent = this.score;
    }

    // Método para guardar puntajes
    saveHighScore() {
        const newScore = {
            score: this.score,
            date: new Date().toLocaleDateString()
        };
        this.highScores.push(newScore);
        this.highScores.sort((a, b) => b.score - a.score);
        this.highScores = this.highScores.slice(0, 10); // Mantener solo los 10 mejores puntajes
        localStorage.setItem('highScores', JSON.stringify(this.highScores));
        this.displayHighScores();
    }

    // Método para mostrar los puntajes más altos
    displayHighScores() {
        const highScoresTable = document.getElementById('high-scores-table');
        const tbody = highScoresTable.querySelector('tbody');
        tbody.innerHTML = '';
        this.highScores.forEach((score, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${index + 1}</td><td>${score.score} (${score.date})</td>`;
            tbody.appendChild(row);
        });
    }

    // Resto de la lógica del juego...
    // ...
}

// Resto del código para el manejo del juego...
// ...

// Ejemplo de inicio del juego
document.addEventListener("DOMContentLoaded", function() {
    const tetris = new Tetris();
    // Lógica del juego y eventos del teclado...
    // ...
});


//limitar la fecha a 8 digitos
document.getElementById('birthdate').addEventListener('input', function () {
    // Limitar la longitud del año a 4 dígitos
    var year = this.value.split('-')[0];
    if (year.length > 4) {
        this.value = this.value.slice(0, -1);
    }
});
