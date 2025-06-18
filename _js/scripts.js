const formulario = document.getElementById('formularioAvanzado');
const campos = formulario.querySelectorAll('input, textarea, select');
const btnEnviar = document.getElementById('btnEnviar');

let estadoValidacion = {};
campos.forEach((campo) => {
  estadoValidacion[campo.name] = false;
});

// Validaciones específicas por campo
// Nombres
validarCampoTexto('nombres', 'errorNombres', 'exitoNombres');
// Apellidos
validarCampoTexto('apellidos', 'errorApellidos', 'exitoApellidos');

// Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
document.getElementById('correo').addEventListener('input', function () {
  if (!emailRegex.test(this.value)) {
    mostrarError('errorCorreo', 'Formato de email inválido');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoCorreo', '✓ Email válido');
    marcarCampo(this, true);
  }
});

// Confirmar correo
const correoInput = document.getElementById('correo');
document.getElementById('confirmarCorreo').addEventListener('input', function () {
  if (this.value !== correoInput.value) {
    mostrarError('errorConfirmarCorreo', 'Los correos no coinciden');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoConfirmarCorreo', '✓ Correos coinciden');
    marcarCampo(this, true);
  }
});

// Contraseña
const passwordInput = document.getElementById('password');
passwordInput.addEventListener('input', function () {
  const password = this.value;
  const fortaleza = calcularFortalezaPassword(password);
  actualizarBarraFortaleza(fortaleza);

  if (password.length < 8) {
    mostrarError('errorPassword', 'La contraseña debe tener al menos 8 caracteres');
    marcarCampo(this, false);
  } else if (fortaleza.nivel < 2) {
    mostrarError('errorPassword', 'Contraseña muy débil. Añade números y símbolos');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoPassword', `✓ Contraseña ${fortaleza.texto}`);
    marcarCampo(this, true);
  }

  const confirmar = document.getElementById('confirmarPassword');
  if (confirmar.value) confirmar.dispatchEvent(new Event('input'));
});

// Confirmar contraseña
const confirmarInput = document.getElementById('confirmarPassword');
confirmarInput.addEventListener('input', function () {
  if (this.value !== passwordInput.value) {
    mostrarError('errorConfirmar', 'Las contraseñas no coinciden');
    marcarCampo(this, false);
  } else if (this.value.length > 0) {
    mostrarExito('exitoConfirmar', '✓ Contraseñas coinciden');
    marcarCampo(this, true);
  }
});

// Teléfono
const telefonoRegex = /^\d{3}-\d{3}-\d{4}$/;
document.getElementById('telefono').addEventListener('input', function () {
  let valor = this.value.replace(/\D/g, '');
  if (valor.length >= 6) {
    valor = valor.substring(0, 3) + '-' + valor.substring(3, 6) + '-' + valor.substring(6, 10);
  } else if (valor.length >= 3) {
    valor = valor.substring(0, 3) + '-' + valor.substring(3);
  }
  this.value = valor;

  if (!telefonoRegex.test(valor)) {
    mostrarError('errorTelefono', 'Formato: 300-123-4567');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoTelefono', '✓ Teléfono válido');
    marcarCampo(this, true);
  }
});

// Fecha de nacimiento
const hoy = new Date();
document.getElementById('fechaNacimiento').addEventListener('change', function () {
  const fecha = new Date(this.value);
  const edad = hoy.getFullYear() - fecha.getFullYear();

  if (edad < 18) {
    mostrarError('errorFecha', 'Debes ser mayor de 18 años');
    marcarCampo(this, false);
  } else if (edad > 100) {
    mostrarError('errorFecha', 'Fecha no válida');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoFecha', `✓ Edad: ${edad} años`);
    marcarCampo(this, true);
  }
});

// Comentarios
const contador = document.getElementById('contadorComentarios');
document.getElementById('comentarios').addEventListener('input', function () {
  contador.textContent = this.value.length;
  contador.style.color = this.value.length > 450 ? '#dc3545' : this.value.length > 400 ? '#ffc107' : '#666';
  marcarCampo(this, true); // opcional
});

// Términos
const terminos = document.getElementById('terminos');
terminos.addEventListener('change', function () {
  if (!this.checked) {
    mostrarError('errorTerminos', 'Debes aceptar los términos y condiciones');
    marcarCampo(this, false);
  } else {
    ocultarMensaje('errorTerminos');
    marcarCampo(this, true);
  }
});

// Funciones auxiliares
function mostrarError(id, mensaje) {
  const el = document.getElementById(id);
  el.textContent = mensaje;
  el.style.display = 'block';
  ocultarMensaje(id.replace('error', 'exito'));
}

function mostrarExito(id, mensaje) {
  const el = document.getElementById(id);
  el.textContent = mensaje;
  el.style.display = 'block';
  ocultarMensaje(id.replace('exito', 'error'));
}

function ocultarMensaje(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function marcarCampo(campo, valido) {
  estadoValidacion[campo.name] = valido;
  campo.classList.remove('valido', 'invalido');
  campo.classList.add(valido ? 'valido' : 'invalido');
  actualizarProgreso();
  actualizarBotonEnvio();
}

function validarCampoTexto(id, errorId, exitoId) {
  const input = document.getElementById(id);
  input.addEventListener('input', function () {
    const valor = this.value.trim();
    const partes = valor.split(' ').filter(Boolean);

    if (valor.length < 3) {
      mostrarError(errorId, 'Debe tener al menos 3 caracteres');
      marcarCampo(this, false);
    } else if (partes.length < 1) {
      mostrarError(errorId, 'Debe contener al menos un nombre/apellido');
      marcarCampo(this, false);
    } else {
      mostrarExito(exitoId, '✓ Válido');
      marcarCampo(this, true);
    }
  });
}

function actualizarProgreso() {
  const total = Object.keys(estadoValidacion).length;
  const validos = Object.values(estadoValidacion).filter(v => v).length;
  const porcentaje = Math.round((validos / total) * 100);
  document.getElementById('barraProgreso').style.width = porcentaje + '%';
  document.getElementById('porcentajeProgreso').textContent = porcentaje + '%';
}

function actualizarBotonEnvio() {
  btnEnviar.disabled = !Object.values(estadoValidacion).every(v => v);
}

function calcularFortalezaPassword(password) {
  let puntos = 0;
  if (password.length >= 8) puntos++;
  if (password.length >= 12) puntos++;
  if (/[a-z]/.test(password)) puntos++;
  if (/[A-Z]/.test(password)) puntos++;
  if (/[0-9]/.test(password)) puntos++;
  if (/[^A-Za-z0-9]/.test(password)) puntos++;

  const niveles = ['muy débil', 'débil', 'media', 'fuerte', 'muy fuerte'];
  const nivel = Math.min(Math.floor(puntos / 1.2), 4);

  return { nivel, texto: niveles[nivel], puntos };
}

function actualizarBarraFortaleza(fortaleza) {
  const barra = document.getElementById('strengthBar');
  const clases = ['strength-weak', 'strength-weak', 'strength-medium', 'strength-strong', 'strength-very-strong'];
  barra.className = 'password-strength ' + clases[fortaleza.nivel];
}

// Envío del formulario con resumen
formulario.addEventListener('submit', function (e) {
  e.preventDefault();
  const datos = new FormData(this);
  let resumen = '';

  for (let [campo, valor] of datos.entries()) {
    if (valor && valor.trim() !== '') {
      resumen += `<div class="dato-resumen"><span class="etiqueta-resumen">${campo}:</span> ${valor}</div>`;
    }
  }

  document.getElementById('contenidoResumen').innerHTML = resumen;
  document.getElementById('resumenDatos').style.display = 'block';
  document.getElementById('resumenDatos').scrollIntoView({ behavior: 'smooth' });
});