// Importar las funciones necesarias de los SDK que necesitas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'

// Configuración de tu aplicación Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDVR3NbIUjbS36h1HO48siktFsw2-9UoZg",
    authDomain: "notas-3-15f7a.firebaseapp.com",
    projectId: "notas-3-15f7a",
    storageBucket: "notas-3-15f7a.appspot.com",
    messagingSenderId: "43320421688",
    appId: "1:43320421688:web:75d78278b5758cffeaa5cd"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Variable para verificar si se ha enviado la notificación de registro
let registrationNotificationSent = false;

// Función para enviar una notificación por correo electrónico
async function sendEmailNotification(email) {
    try {
        // Enviar notificación por correo electrónico solo si no se ha enviado anteriormente
        if (!registrationNotificationSent) {
            const notificationResponse = await fetch('http://localhost:5000/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    correo_destino: email,
                    asunto: 'Bienvenido a nuestra aplicación de notas',
                    mensaje: '¡Haz iniciado session correctamente, si no fuiestes tu, cambia tu contraseña!'
                })
            });
            const notificationData = await notificationResponse.text();
            console.log(notificationData);
            registrationNotificationSent = true; // Establecer la bandera a verdadero
        }
    } catch (error) {
        console.error('Error al enviar la notificación por correo electrónico:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.querySelector('#signUpButton');
    if (signUpButton) {
        signUpButton.addEventListener('click', async function(e) {
            e.preventDefault();
    
            // Obtener el valor del email y la contraseña
            const email = document.querySelector('#emailInput').value;
            const password = document.querySelector('#passwordInput').value;

            try {
                // Crear usuario con correo y contraseña
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Usuario creado exitosamente
                var user = userCredential.user;
                console.log('Usuario creado:', user);

                // Enviar notificación por correo electrónico
                await sendEmailNotification(email);

                // Obtener el idToken del usuario actual
                const idToken = await user.getIdToken();
                // Imprimir el idToken en la consola para depurar
                console.log('idToken:', idToken);

                // Redirigir a la página de inicio después de registrarse
                window.location.href = 'index.html';
                // Redirigir o mostrar mensajes según sea necesario
            } catch (error) {
                // Error al crear el usuario
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error('Error al crear el usuario:', errorMessage);
                if (errorCode === 'auth/email-already-in-use') {
                    // Mostrar modal de correo ya registrado
                    var emailExistsModal = new bootstrap.Modal(document.getElementById('emailExistsModal'));
                    emailExistsModal.show();
                } else {
                    // Otro error
                    alert('Ha ocurrido un error al crear el usuario. Por favor, inténtelo de nuevo.');
                }
            }
        });
    }

    // Event listener para el botón de autenticación con Google
    const googleLogin = document.querySelector('#googleLogin');
    if (googleLogin) {
        googleLogin.addEventListener('click', async function(e) {
            e.preventDefault();

            // Obtener el usuario autenticado con Google
            try {
                const provider = new GoogleAuthProvider();
                const userCredential = await signInWithPopup(auth, provider);
                const user = userCredential.user;
                
                // Enviar notificación por correo electrónico solo si es un nuevo registro
                await sendEmailNotification(user.email);

                // Redirigir a la página de inicio después de iniciar sesión
                window.location.href = 'index.html';
            } catch (error) {
                // Manejar errores
                console.error('Error al autenticar con Google:', error);
                alert('ERROR DE AUTENTICACION X Google');
            }
        });
    }

    // Event listener para el botón de autenticación con GitHub
    const githubLogin = document.querySelector('#githubButton');
    if (githubLogin) {
        githubLogin.addEventListener('click', async function(e) {
            e.preventDefault();

            // Obtener el usuario autenticado con GitHub
            try {
                const provider = new GithubAuthProvider();
                const userCredential = await signInWithPopup(auth, provider);
                const user = userCredential.user;
                
                // Enviar notificación por correo electrónico solo si es un nuevo registro
                await sendEmailNotification(user.email);

                // Redirigir a la página de inicio después de iniciar sesión
                window.location.href = 'index.html';
            } catch (error) {
                // Manejar errores
                console.error('Error al autenticar con GitHub:', error);
                alert('ERROR DE AUTENTICACION X GITHUB');
            }
        });
    }

    // Event listener para el botón de correo
    const emailButton = document.querySelector('#emailButton');
    if (emailButton) {
        emailButton.addEventListener('click', function() {
            window.location.href = 'auth-cover-signup.html';
        });
    }
});
