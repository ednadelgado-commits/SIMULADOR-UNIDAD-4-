# SIMULADOR-UNIDAD-4

Este repositorio contiene un **simulador 3D interactivo** desarrollado con **Three.js**, donde se pueden visualizar y activar dinámicamente:

- Técnicas de **relleno de polígonos**
- Tipos de **iluminación**
- Técnicas de **sombreado** (flat, Gouraud, Phong)
- Aplicación de **texturas** y **shaders personalizados**
- Transformaciones 3D: posición, rotación y escala
- Agregado y selección de objetos dentro del entorno 3D

El objetivo es permitir al usuario **explorar visualmente** cómo funcionan estos conceptos en tiempo real dentro de un espacio tridimensional.

---

##  Objetivo del Proyecto
Desarrollar un simulador interactivo que permita **aprender, comparar y experimentar** con las principales técnicas utilizadas en el modelado e iluminación 3D, proporcionando una herramienta visual fácil de usar para estudiantes de gráficos por computadora.

---
## Integrantes del equipo y roles

| Nombre | Rol |
|--------|------|
| **Edna Alejandra Moreno Delgado** | Desarrollo principal del simulador, lógica de sombreado y materiales |
| **Eric García** | Integración de interfaz, controles y estructura del proyecto |
| **Josué Neri** | Investigación técnica, pruebas y documentación |


## ▶ Video de uso del simulador  
Demostración completa del funcionamiento del simulador:

https://drive.google.com/file/d/1Is_jeD2D6RWbbRmq2SxLQ9ACfrxZB4bu/view?usp=drive_link

## 🧩 Instrucciones de uso

1. Abrir `index.html` en el navegador.
2. En el panel lateral puedes:
   - Agregar objetos (**cubo, esfera, cilindro**)
   - Seleccionar el color del material
   - Cambiar el tipo de sombreado (Flat, Gouraud, Phong)
   - Activar textura
   - Aplicar shader fractal
3. En el área 3D puedes:
   - Rotar la cámara con el mouse
   - Hacer zoom
   - Seleccionar y manipular objetos
4. Usa los botones para:
   - Restablecer material
   - Cambiar iluminación
   - Probar las distintas técnicas de sombreado

---


---

## Tecnologías utilizadas

- **HTML5 / CSS3 / JavaScript**
- **Three.js** (motor 3D)
- **GLSL** para shaders personalizados
- **OrbitControls** para navegación en 3D
- **Texturas .jpg / .png**

---

##  Pasos para instalar librerías

Puedes usar **CDN** (más simple) o **npm**.

###  Opción 1: CDNs (recomendado)

En tu `index.html` agrega:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://threejs.org/examples/js/controls/OrbitControls.js"></script>

