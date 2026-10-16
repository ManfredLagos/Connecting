from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")  # Agrega el decorador @ para definir la ruta
def index():
    return render_template("snake.html")

if __name__ == '__main__':
    app.run(debug=True, port=5035)


