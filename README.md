# AgileAvengers – Plataforma AI para Servicio al Cliente 🤖📞

**AgileAvengers** es una plataforma web diseñada para **potenciar el servicio al cliente en startups** mediante inteligencia artificial. Nuestra solución permite analizar llamadas, generar reportes emocionales y facilitar la toma de decisiones, todo con una interfaz intuitiva y gamificada.

---

##  Misión

Empoderar a las startups con inteligencia artificial para transformar la manera en que se comunican con sus clientes. Ayudamos a los equipos de soporte a tomar decisiones proactivas, reducir tiempos de respuesta y mejorar la satisfacción del cliente, convirtiendo cada interacción en una oportunidad para fidelizar y fortalecer la reputación de la empresa.

##  Visión

Revolucionar el servicio al cliente mediante el uso de inteligencia artificial, mejorando la eficiencia, empatía y calidad del servicio.

##  Valores

- **Innovación centrada en el usuario**: Soluciones reales para necesidades reales.
- **Accesibilidad**: Tecnología para todos.
- **Responsabilidad**: Productos seguros, confiables y éticos.
- **Colaboración**: Comunicación abierta y trabajo en equipo.
- **Transparencia**: Procesos claros, uso responsable de los datos.

---

##  Roles en la plataforma

| Rol        | Subir llamadas | Ver información propia | Ver info del equipo | Ver info de todos | Borrar llamadas |
|------------|----------------|-------------------------|---------------------|-------------------|------------------|
| **Agent**      | ✅ Sí           | ✅ Sí                   | ❌ No               | ❌ No             | ❌ No            |
| **Team Leader**| ❌ No           | ✅ Parcial              | ✅ Sí               | ❌ No             | ✅ Sí            |
| **Admin**      | ❌ No           | ✅ Parcial              | ✅ Sí               | ✅ Sí             | ✅ Sí            |

---

##  Funcionalidades principales

- **Dashboard general**: Visualización mensual de la satisfacción del cliente.
- **Subida de llamadas** *(según rol)*.
- **Mini arcade integrado**: Juega Tetris, Snake o Ajedrez mientras se procesan las llamadas.
- **Análisis automático de llamadas**:
  - Transcripción con AI.
  - Detección de emociones.
  - Generación automática de reportes y archivos PDF.
- **Dashboard personalizado**:
  - Agentes: Acceden a su información.
  - Team Leaders/Admins: Visualizan equipos o toda la organización.
- **Gestión de sesiones**: Inicio/cierre de sesión seguro.

---

##  Tecnologías utilizadas

###  Frontend

- [React.js](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [tailwind](https://tailwindcss.com/) 
- [TypeScript](https://www.typescriptlang.org/)

###  Backend

- [Python](https://www.python.org/)
- [Flask](https://flask.palletsprojects.com/)

### Inteligencia Artificial

- [Hugging Face Transformers](https://huggingface.co/transformers/)
- [OpenAI API](https://platform.openai.com/): Sugerencias para mejorar la atención.

### Otros

- Oracle VM
- MySQL
- Postman para testing de endpoints

---

## Instalación y ejecución

### 1. Clona el repositorio

```bash
git clone https://github.com/fabian12341/AgileAvengers.git
cd AgileAvengers
