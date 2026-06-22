# Deploying Tymely on Render with Supabase

This guide provides a step-by-step walkthrough for deploying the rebranded **Tymely** application. The stack consists of:
1. **Backend**: Spring Boot (Java 23) REST API.
2. **Frontend**: TanStack Start (React SSR) Web Application.
3. **Database**: Supabase PostgreSQL.

---

## Prerequisites

Before starting, make sure you have:
1. A **GitHub** repository containing your project.
2. A **Supabase** account and an active database project.
3. A **Render** account.

---

## Step 1: Prepare the Supabase Database

1. Log in to your [Supabase Dashboard](https://supabase.com/).
2. Select your project and navigate to **Project Settings** -> **Database**.
3. Under the **Connection string** section, locate the host and connection details.
   - **Host**: `db.sleoburmlfbxrjndejxk.supabase.co`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Port**: `5432`
   - **Password**: The password you set when creating the database.
4. Prepare your JDBC connection URL. Spring Boot requires a connection URL prefixed with `jdbc:postgresql://`.
   - **Standard Connection String**: `postgresql://postgres:[YOUR-PASSWORD]@db.sleoburmlfbxrjndejxk.supabase.co:5432/postgres`
   - **Spring Boot JDBC URL**: `jdbc:postgresql://db.sleoburmlfbxrjndejxk.supabase.co:5432/postgres`

---

## Step 2: Deploy the Backend on Render

The backend is built from the `backend` folder in your repository using a multi-stage Docker build.

1. Log in to [Render](https://render.com/).
2. Click **New** -> **Web Service**.
3. Select your GitHub repository.
4. In the Web Service configuration:
   - **Name**: `tymely-backend` (or a name of your choice).
   - **Region**: Select a region close to your database (or closest to your users).
   - **Branch**: `main` (or your deployment branch).
   - **Root Directory**: `backend` (this ensures Render uses the context of the backend folder).
   - **Runtime**: `Docker` (Render will automatically locate the `Dockerfile` inside the `backend` folder).
5. Scroll down to the **Environment Variables** section and add the following:

| Key | Value | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://db.sleoburmlfbxrjndejxk.supabase.co:5432/postgres` | Supabase JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Supabase DB User |
| `SPRING_DATASOURCE_PASSWORD` | `[YOUR-SUPABASE-PASSWORD]` | Supabase DB Password |
| `JWT_SECRET` | `5567729F2B4D6251655468576D5A7134743777217A25432A462D4A614E645267` | A secure 64-hex-character signing key |

6. Click **Create Web Service**.
7. Render will pull your repository, change context to the `backend` folder, execute the Docker build, and spin up the container.
8. Once deployed, note down the backend's URL (e.g., `https://tymely-backend.onrender.com`).

---

## Step 3: Deploy the Frontend on Render

Because **Tymely** uses **TanStack Start** (which features Server-Side Rendering (SSR) via Vinxi/Vite), it **cannot** be deployed as a static site. It must run as a **Web Service** with a Node environment to serve pages dynamically.

1. Click **New** -> **Web Service** on Render.
2. Select the same GitHub repository.
3. In the Web Service configuration:
   - **Name**: `tymely-frontend` (or a name of your choice).
   - **Region**: Match the backend region if possible.
   - **Branch**: `main` (or your deployment branch).
   - **Root Directory**: `frontend` (ensures Render compiles and runs the frontend folder context).
   - **Runtime**: `Docker` (Render will use `frontend/Dockerfile`).
4. Scroll down to the **Environment Variables** section and add:

| Key | Value | Description |
|---|---|---|
| `VITE_API_URL` | `https://tymely-backend.onrender.com` | The URL of your deployed backend service |

> [!IMPORTANT]
> Vite requires `VITE_` variables to be available at **build time** so they can be embedded into the client-side JavaScript bundle. Setting this environment variable in Render ensures it is present during the Docker build stage.

5. Click **Create Web Service**.
6. Render will build the container using `frontend/Dockerfile` (which runs `npm install`, `npm run build`, and starts the production preview server via `npm run preview`).
7. Once deployed, open the frontend Web Service URL to access your Tymely application.

---

## Verification & Troubleshooting

### CORS Issues
The Spring Boot backend is configured in `SecurityConfig.java` to support wildcard origins using origin patterns:
```java
configuration.setAllowedOriginPatterns(Collections.singletonList("*"));
configuration.setAllowCredentials(true);
```
This avoids CORS issues between your frontend web service and backend web service.

### Database Connection Failures
If the backend logs show connection timeout errors:
1. Double-check that your Supabase password does not contain special characters that require URL-encoding, or ensure the password is correctly formatted.
2. Verify that the `SPRING_DATASOURCE_URL` environment variable uses the prefix `jdbc:postgresql://`.

### Health Check Failures on Render
Render sends HTTP health checks to verify that the container has started successfully.
- **Backend**: Spring Boot binds to the dynamic `$PORT` environment variable automatically via `${PORT:8080}` in `application.properties`.
- **Frontend**: The `frontend/Dockerfile` configures Vite's preview server to bind to the dynamic `$PORT` environment variable:
  ```dockerfile
  CMD ["sh", "-c", "npm run preview -- --host 0.0.0.0 --port ${PORT}"]
  ```
Both services will correctly report healthy to Render's gateway.
