import random
import smtplib
from email.message import EmailMessage
import os

def generar_codigo_verificacion():
    codigo = random.randint(100000, 999999)
    return str(codigo)

def enviar_correo_verificacion(email_receptor, verification_code):
    email_emisor = "connecting.conectandopersonas@gmail.com"
    email_contrasena = "tewzfmaeieppwahl"

    asunto = "Código de verificación"
    cuerpo = f"Tu código de verificación es: {verification_code}"

    em = EmailMessage()
    em["From"] = email_emisor
    em["To"] = email_receptor
    em["Subject"] = asunto
    em.set_content(cuerpo)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(email_emisor, email_contrasena)
        smtp.send_message(em)