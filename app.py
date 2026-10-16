from flask import Flask, redirect, render_template, request, url_for, session
from flask_mysqldb import MySQL
from datetime import datetime
from codigo import generar_codigo_verificacion, enviar_correo_verificacion

app = Flask(__name__)
app.config['MYSQL_HOST'] = '190.113.81.253'
app.config['MYSQL_USER'] = 'manfred'
app.config['MYSQL_PASSWORD'] = 'CwsrOPiEn3Dh%bcd'
app.config['MYSQL_DB'] = 'postits_db'
app.config['SECRET_KEY'] = 'nijvbhuhbrkefhrfvnlrvvr56v9tr15vrvtr15vr6$#%&(/"FCV5656HTS%&'  # Cambiar por tu clave secreta
app.config['DEBUG'] = True
mysql = MySQL(app)

@app.route('/')
def index():
    error_message = session.pop('error_message', None)
    email = session.get('email', None)  # Obtener el correo electrónico de la sesión si está disponible
    return render_template('index.html', error_message=error_message, email=email)


@app.route('/dashboard')
def dashboard():
    # Verificar si el usuario está autenticado
    if 'email' in session:
        return render_template('dashboard.html')
        
    else:
        return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM user WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()

        if user:
            if user[4] == password:  # Acceder a la contraseña usando el índice 4
                # Iniciar sesión almacenando el email en la sesión
                session['email'] = user[3]  # Acceder al email usando el índice 2
                return redirect('/dashboard')
            else:
                error_message = "Las credenciales ingresadas son incorrectas. Por favor, verifica tu correo electrónico y contraseña e inténtalo nuevamente."
                text_color = 'red'  # Define el color deseado, por ejemplo, rojo
                font_weight = 'bold'  # Define el grosor de la fuente, por ejemplo, negrita
                session['error_message'] = {'text': error_message, 'text_color':'red', 'font_weight': font_weight}
                session['email'] = email  # Mantener el correo ingresado en la sesión
                return redirect(url_for('index'))

        else:
            error_message = "La cuenta ingresada no está registrada. Por favor, asegúrate de haber ingresado correctamente tus credenciales o crea una cuenta nueva."
            text_color = 'red'  # Define el color deseado, por ejemplo, rojo
            font_weight = 'bold'  # Define el grosor de la fuente, por ejemplo, negrita
            session['error_message'] = {'text': error_message, 'text_color': text_color,
                                        'font_weight': font_weight}
            return redirect(url_for('index'))

    return render_template('index.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        nickname = request.form.get('nickname')
        lastname = request.form.get('lastname')
        email = request.form.get('email')
        password = request.form.get('password')
        age_str = request.form.get('age')
        country = request.form.get('country')

        if nickname is None or nickname.strip() == '':
            # Manejar el caso cuando el campo 'nickname' está vacío
            error_message = "El campo 'nickname' es obligatorio."
            return render_template('register.html', error_message=error_message)

        if age_str is None:
            age = None
        else:
            age = datetime.strptime(age_str, '%Y-%m-%d').date()

        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO user (nickname, lastname, email, password, country, age) VALUES (%s, %s, %s, %s, %s, %s)",
            (nickname, lastname, email, password, country, age))
        mysql.connection.commit()
        cur.close()

        return redirect('/')

    return render_template('register.html')


@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form['email']
        verification_code = generar_codigo_verificacion()

        # Guardar los datos de correo y PIN en la tabla new_password
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO new_password (email, pin) VALUES (%s, %s)", (email, verification_code))
        mysql.connection.commit()
        cur.close()

        # Enviar el código de verificación por correo electrónico
        enviar_correo_verificacion(email, verification_code)

        # Almacenar email y pin en la sesión
        session['email'] = email
        session['pin'] = verification_code

        # Redirigir al usuario a la página de restablecimiento de contraseña
        return redirect(url_for('reset_password'))

    return render_template('forgot_password.html')


@app.route('/reset-password', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'POST':
        pin = request.form.get('verification_code')
        new_password = request.form.get('new_password')
        confirm_password = request.form.get('confirm_password')

        if new_password != confirm_password:
            error_message = "Las contraseñas no coinciden. Por favor, inténtalo de nuevo."
            return render_template('reset_password.html', error_message=error_message, pin=pin)

        # Verificar si el pin es válido en la tabla new_password
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM new_password WHERE pin = %s", (pin,))
        password_data = cur.fetchone()
        cur.close()

        if password_data:
            email = password_data[1]  # Obtener el correo electrónico asociado al pin
            new_password = request.form.get('new_password')

            # Actualizar la contraseña en la tabla user
            cur = mysql.connection.cursor()
            cur.execute("UPDATE user SET password = %s WHERE email= %s", (new_password, email))
            mysql.connection.commit()
            cur.close()

            # Eliminar los datos de la tabla new_password después de actualizar la contraseña
            cur = mysql.connection.cursor()
            cur.execute("DELETE FROM new_password WHERE pin = %s", (pin,))
            mysql.connection.commit()
            cur.close()

            return redirect(url_for('index'))

        elif 'resend_pin' in request.form:
            # Se hizo clic en el botón "Volver a enviar código"
            verification_code = session.get('pin')
            email = session.get('email')

            # Enviar el código de verificación por correo electrónico
            enviar_correo_verificacion(email, verification_code)

            # borrar los valores de email y pin de session.
            session.pop('email', None)
            session.pop('pin', None)

            # Actualizar el campo oculto "pin" en el formulario de reset_password
            return render_template('reset_password.html', email=email, pin=verification_code)

        else:
            error_message = "El código PIN es incorrecto. Por favor, verifica el código e inténtalo de nuevo."
            return render_template('reset_password.html', error_message=error_message, pin_error=True)

    return render_template('reset_password.html')

# Ruta para el juego Snake
@app.route('/snake')
def snake():
    # Redirige al usuario a "snake.html"
    return render_template('snake.html')


if __name__ == '__main__':
    app.run(debug=True, port=5046, host='0.0.0.0')



