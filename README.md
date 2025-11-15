# User Manager - Angular Application

Aplicación web Angular 17 para gestión de usuarios con operaciones CRUD completas e interfaz Material Design.

## 📋 Descripción

User Manager es una aplicación web frontend desarrollada con Angular 17 que permite gestionar usuarios con operaciones CRUD (Create, Read, Update, Delete) completas. Se conecta a una API REST externa para realizar las operaciones.

## 🚀 Características

- ✅ Angular 17.3.0 con TypeScript 5.3.3
- ✅ Material Design UI
- ✅ CRUD completo de usuarios
- ✅ Responsive design
- ✅ Validación de formularios
- ✅ Manejo de errores
- ✅ Componentes reutilizables

## 📋 Requisitos

- Node.js 20.x LTS o superior
- npm 9.x o superior
- Angular CLI 17.3.0

## ⚙️ Instalación

### Instalar Dependencias

```bash
# Instalar dependencias
npm install

# O con yarn
yarn install
```

### Instalar Angular CLI Globalmente

```bash
npm install -g @angular/cli@17.3.0
```

## 🏃 Desarrollo

### Servidor de Desarrollo

```bash
# Iniciar servidor de desarrollo
ng serve

# O con npm
npm start
```

La aplicación estará disponible en `http://localhost:4300/`

### Servidor de Desarrollo con Puerto Específico

```bash
ng serve --port 4300
```

### Compilación para Producción

```bash
# Compilar para producción
ng build --configuration production

# Los archivos compilados estarán en dist/usermanager/
```

## 🧪 Testing

### Ejecutar Tests Unitarios

```bash
# Ejecutar tests unitarios
ng test

# O con npm
npm test

# Ejecutar tests en modo watch
ng test --watch
```

### Ejecutar Tests E2E

```bash
# Ejecutar tests end-to-end (requiere protractor)
ng e2e

# O con npm
npm run e2e
```

### Cobertura de Código

```bash
# Generar reporte de cobertura
ng test --code-coverage

# Ver reporte en: coverage/index.html
```

## 📁 Estructura del Proyecto

```
usermanager/
├── src/
│   ├── app/
│   │   ├── app.component.*
│   │   ├── app.module.ts
│   │   ├── app-routing.module.ts
│   │   ├── demo/
│   │   │   └── demo.component.*
│   │   ├── shared/
│   │   │   └── shared.module.ts
│   │   └── usermanager/
│   │       ├── components/
│   │       │   ├── main-content/
│   │       │   ├── new-employee-dialog/
│   │       │   └── ...
│   │       ├── services/
│   │       │   └── user.service.ts
│   │       └── models/
│   │           └── user.model.ts
│   ├── assets/
│   │   ├── avatars.svg
│   │   └── employeeData.json
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles.scss
│   └── index.html
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Configuración

### Variables de Entorno

#### environment.ts (Desarrollo)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  apiBaseUrl: 'https://arsene.azurewebsites.net/User'
};
```

#### environment.prod.ts (Producción)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.production.com/api',
  apiBaseUrl: 'https://arsene.azurewebsites.net/User'
};
```

### Configuración de API

Actualizar `apiBaseUrl` en `src/environments/environment.*.ts` con la URL de tu API.

## 📡 API Integration

La aplicación se conecta a la API REST externa:

- **Base URL**: `https://arsene.azurewebsites.net/User`
- **Endpoints**:
  - `GET /User` - Lista todos los usuarios
  - `GET /User/{id}` - Obtiene un usuario por ID
  - `POST /User` - Crea un nuevo usuario
  - `PUT /User/{id}` - Actualiza un usuario
  - `DELETE /User/{id}` - Elimina un usuario

## 🎨 Componentes Principales

### Main Content Component

Componente principal que muestra la lista de usuarios y permite realizar operaciones CRUD.

**Ubicación**: `src/app/usermanager/components/main-content/`

### New Employee Dialog

Dialog para crear/editar usuarios.

**Ubicación**: `src/app/usermanager/components/new-employee-dialog/`

### User Service

Servicio que maneja la comunicación con la API.

**Ubicación**: `src/app/usermanager/services/user.service.ts`

## 🔐 Seguridad

### CORS

Asegurar que el backend tenga configurado CORS para permitir el origen de la aplicación Angular.

```typescript
// En el backend
cors.allowed-origins=http://localhost:4300,https://production-domain.com
```

### Autenticación (Futuro)

Para agregar autenticación:
1. Implementar interceptor HTTP para JWT tokens
2. Crear servicio de autenticación
3. Proteger rutas con guards

## 🚀 Build y Deploy

### Build de Producción

```bash
# Build optimizado para producción
ng build --configuration production

# Build con configuración específica
ng build --configuration production --output-path=dist/prod
```

### Deploy en Netlify

```bash
# Build
ng build --configuration production

# Deploy
netlify deploy --prod --dir=dist/usermanager
```

### Deploy en Vercel

```bash
# Build
ng build --configuration production

# Deploy
vercel --prod
```

### Deploy en Firebase Hosting

```bash
# Build
ng build --configuration production

# Deploy
firebase deploy
```

## 📦 Dependencias Principales

- **@angular/core**: ^17.3.0
- **@angular/material**: ^17.3.0
- **@angular/cdk**: ^17.3.0
- **rxjs**: ~7.8.1
- **zone.js**: ~0.14.6
- **typescript**: ~5.3.3

## 🛠️ Desarrollo

### Generar Nuevo Componente

```bash
ng generate component components/nombre-componente
```

### Generar Nuevo Servicio

```bash
ng generate service services/nombre-servicio
```

### Generar Nuevo Módulo

```bash
ng generate module nombre-modulo
```

### Linting

```bash
# Ejecutar linter
ng lint

# Corregir automáticamente
ng lint --fix
```

## 🔧 Troubleshooting

### Error: Module not found

1. Verificar que todas las dependencias estén instaladas: `npm install`
2. Verificar imports en los archivos TypeScript
3. Verificar configuración de rutas en `app-routing.module.ts`

### Error: CORS

1. Verificar configuración de CORS en el backend
2. Verificar que `apiBaseUrl` sea correcto
3. Verificar que el backend esté ejecutándose

### Error: Cannot find module '@angular/...'

1. Reinstalar dependencias: `rm -rf node_modules && npm install`
2. Verificar versión de Angular CLI: `ng version`
3. Actualizar Angular: `ng update @angular/core @angular/cli`

### Error: Port already in use

```bash
# Usar puerto diferente
ng serve --port 4301
```

## 📚 Documentación Adicional

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🧪 Ejemplos de Uso

### Usar User Service

```typescript
import { UserService } from './services/user.service';

constructor(private userService: UserService) {}

// Obtener usuarios
this.userService.getUsers().subscribe(users => {
  console.log(users);
});

// Crear usuario
this.userService.createUser(user).subscribe(response => {
  console.log('Usuario creado:', response);
});
```

## 📞 Soporte

Para reportar issues o hacer preguntas:
1. Abre un issue en el repositorio
2. Revisa la documentación principal: [../README.md](../README.md)
3. Consulta la documentación de Angular: https://angular.io/docs

---

**Versión**: 1.0.0  
**Angular**: 17.3.0  
**Última actualización**: Enero 2025
