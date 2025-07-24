## ⚙️ Requisitos Previos

Antes de ejecutar este proyecto asegúrate de tener instalado:

- **Node.js** (>= v18)
- **Angular CLI** (`npm install -g @angular/cli`)
- **.NET SDK 7.0** o superior
- **SQL Server Express** o **LocalDB**

---

## 📦 Instalación

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tuusuario/tu-repo.git
cd tu-repo
````

### 2️⃣ Configurar el Backend
```bash
cd backend

Restaurar dependencias:
dotnet restore

Ajustar la cadena de conexión en appsettings.json:
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=SegurosDb;Trusted_Connection=True;"
}

Ejecutar las migraciones:
dotnet ef database update

Correr la API:
dotnet run
````

### 3️⃣ Configurar el Frontend
````bash
cd ../frontend

Instalar dependencias:
npm install

Ejecutar la app:
ng serve
