# Docker Images, Containers & Volumes - Study Notes

## 🏗️ Docker Images

### What are Images?

- **Blueprint/Template** for containers
- **Read-only** files containing:
  - Application code
  - Operating system
  - Runtime environment
  - Tools and dependencies
- Images don't run by themselves - they need to be executed as containers

### How Images are Created

- **Pre-built Images**: Available on DockerHub (official images)
- **Custom Images**: Built using Dockerfiles

### Dockerfile Basics

- Contains instructions executed during image build (`docker build .`)
- Each instruction creates a **layer** in the image
- Layers enable efficient rebuilding and sharing
- **CMD instruction** is special: executes when container starts, not during build

---

## 📦 Docker Containers

### What are Containers?

- **Running instances** of images
- Created with `docker run` command
- Adds a thin **read-write layer** on top of the image
- Multiple containers can run from the same image
- All containers run in **isolation** (no shared data)

### Key Points

- Containers are what actually get executed (development & production)
- Need to create and start a container to run the application inside

---

## 🛠️ Essential Docker Commands

### Building Images

```bash
docker build .
```

Build image from Dockerfile

```bash
docker build -t NAME:TAG .
```

Build with custom name and tag

### Running Containers

```bash
docker run IMAGE_NAME
```

Create and start container

```bash
docker run --name NAME IMAGE
```

Assign custom name to container

```bash
docker run -d IMAGE
```

Run in detached mode (background)

```bash
docker run -it IMAGE
```

Run in interactive mode

```bash
docker run --rm IMAGE
```

Auto-remove container when stopped

### Managing Containers & Images

```bash
docker ps
```

List running containers

```bash
docker ps -a
```

List all containers (including stopped)

```bash
docker images
```

List all local images

```bash
docker rm CONTAINER
```

Remove container

```bash
docker rmi IMAGE
```

Remove image

```bash
docker container prune
```

Remove all stopped containers

```bash
docker image prune
```

Remove dangling images

```bash
docker image prune -a
```

Remove all local images

### Registry Operations

```bash
docker push IMAGE
```

Push image to registry

```bash
docker pull IMAGE
```

Pull image from registry

---

## 💾 Data Types in Docker

| Data Type            | Description              | Storage Location | Persistence                  |
| -------------------- | ------------------------ | ---------------- | ---------------------------- |
| **Application Data** | Code + Environment       | Images           | Fixed, read-only             |
| **Temporary Data**   | User input, temp files   | Container memory | Lost when container stops    |
| **Permanent Data**   | User accounts, databases | Volumes          | Survives container lifecycle |

---

## 📁 Docker Volumes

### What are Volumes?

- Folders on host machine **mounted** into containers
- Data persists even if container stops/restarts
- Containers can read and write data to volumes

### Types of External Data Storage

#### 1. **Anonymous Volumes**

```bash
docker run -v /app/data ...
```

- Created for single container
- Survives restart (unless `--rm` used)
- Cannot be shared between containers
- Cannot be reused

#### 2. **Named Volumes**

```bash
docker run -v data:/app/data ...
```

- Not tied to specific container
- Survives container removal
- Can be shared between containers
- Can be reused across restarts
- Managed by Docker

#### 3. **Bind Mounts**

```bash
docker run -v /path/to/code:/app/code ...
```

- You specify exact host path
- Great for development (e.g., source code)
- Can be shared between containers
- Can be reused across restarts
- Managed by you (not Docker)

### Volume Comparison Summary

| Feature               | Anonymous | Named  | Bind Mount |
| --------------------- | --------- | ------ | ---------- |
| **Tied to container** | Yes       | No     | No         |
| **Survives removal**  | No\*      | Yes    | Yes        |
| **Shareable**         | No        | Yes    | Yes        |
| **Reusable**          | No        | Yes    | Yes        |
| **Management**        | Docker    | Docker | User       |

\*Unless `--rm` is used

---

## 🔧 Variables in Docker

### Build Arguments (ARG)

- Available **only during build time**
- Used in Dockerfile, not in running application
- Set with: `docker build --build-arg`
- **NOT accessible** in CMD or application code

### Environment Variables (ENV)

- Available in **both Dockerfile and application**
- Set in Dockerfile with `ENV` instruction
- Set at runtime with: `docker run --env`
- **Accessible** in running application

---

## 📊 Data Persistence Summary

### Images (Read-Only)

- Once created, need rebuild to change
- Don't store application data
- Contain fixed application code and environment

### Containers (Read-Write)

- Can store data while running
- **Data is lost** when container stops
- Need volumes for persistent data

### Volumes (Solution for Persistence)

- Store data outside containers
- Data survives container lifecycle
- Enable data sharing between containers

---

## 🎯 Key Takeaways

1. **Images** are blueprints, **Containers** are running instances
2. **Container data is temporary** - use volumes for persistence
3. **Named volumes** are best for persistent data you don't need to edit
4. **Bind mounts** are perfect for development and editable data
5. **Environment variables** make containers configurable
6. **Layers** in images enable efficient building and sharing
