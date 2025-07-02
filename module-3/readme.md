# Docker Data & Volumes - Complete Study Notes

## 🗂️ Understanding Data in Docker

### The Core Problem

- **Images are read-only** - once created, they can't change (must rebuild to update)
- **Containers add a read-write layer** on top of images
- **Two major problems** with container data:
  1. **Data doesn't persist** - lost when container is removed
  2. **No host filesystem interaction** - changes in host aren't reflected in container

### Solution Overview

- **Problem 1 (Data Persistence)** → **Volumes**
- **Problem 2 (Host Interaction)** → **Bind Mounts**

---

## 📊 Types of Data in Docker

| Data Type            | Description              | Location         | Persistence                  | Access       |
| -------------------- | ------------------------ | ---------------- | ---------------------------- | ------------ |
| **Application Data** | Code + Environment       | Images           | Fixed, rebuild required      | Read-only    |
| **Temporary Data**   | User input, temp files   | Container memory | Lost on container stop       | Read + Write |
| **Permanent Data**   | User accounts, databases | Volumes          | Survives container lifecycle | Read + Write |

---

## 📁 Docker Volumes

### What are Volumes?

- **Folders/files on host machine** connected to container paths
- **Managed by Docker** (you don't control exact location)
- **Data persists** even when container is removed
- **Perfect for data you don't need to edit directly**

### Types of Volumes

#### 1. **Anonymous Volumes**

```bash
docker run -v /app/data IMAGE
```

**Characteristics:**

- Created for **single container**
- **Automatically removed** with `--rm` flag
- **Cannot be shared** between containers
- **Cannot be reused** (even with same image)
- Useful to prevent **Bind Mount overwrites**

#### 2. **Named Volumes**

```bash
docker run -v my-volume:/app/data IMAGE
```

**Characteristics:**

- **Not tied** to specific container
- **Never removed automatically** (manual removal required)
- **Can be shared** across containers
- **Can be reused** across container restarts
- **Best for persistent data**

---

## 🔗 Bind Mounts

### What are Bind Mounts?

- **You specify the exact host path**
- **Great for development** (e.g., source code)
- **Not recommended for production**
- **Perfect for data you need to edit**

### Creating Bind Mounts

```bash
docker run -v /absolute/host/path:/container/path IMAGE
```

**Key Points:**

- Must use **absolute paths** on host
- **Great for development** environments
- **Live updates** - changes reflect immediately
- **Managed by you**, not Docker

---

## 🔧 Volume Commands

### Creating Volumes

```bash
docker run -v /path/in/container IMAGE
```

Create Anonymous Volume

```bash
docker run -v volume-name:/path/in/container IMAGE
```

Create Named Volume

```bash
docker run -v /host/path:/container/path IMAGE
```

Create Bind Mount

### Managing Volumes

```bash
docker volume ls
```

List all active volumes

```bash
docker volume create VOLUME_NAME
```

Create new named volume (usually automatic)

```bash
docker volume rm VOLUME_NAME
```

Remove volume by name

```bash
docker volume prune
```

Remove all unused volumes

---

## 📋 Volume Comparison Table

| Feature               | Anonymous        | Named           | Bind Mount    |
| --------------------- | ---------------- | --------------- | ------------- |
| **Created for**       | Single container | General use     | Development   |
| **Tied to container** | Yes              | No              | No            |
| **Survives removal**  | No (with --rm)   | Yes             | Yes           |
| **Shareable**         | No               | Yes             | Yes           |
| **Reusable**          | No               | Yes             | Yes           |
| **Management**        | Docker           | Docker          | Developer     |
| **Use case**          | Temporary data   | Persistent data | Editable data |
| **Production ready**  | Limited          | Yes             | No            |

---

## 🏗️ Container Architecture

### Image Layers (Read-Only)

```
┌─────────────────────────────────────┐
│        Container (Read-Write)       │
├─────────────────────────────────────┤
│    Container Layer (Read-Write)     │
├─────────────────────────────────────┤
│    Image Layer 3 (Read-Only)       │
├─────────────────────────────────────┤
│    Image Layer 2 (Read-Only)       │
├─────────────────────────────────────┤
│    Image Layer 1 (Read-Only)       │
└─────────────────────────────────────┘
```

### Volume Mounting Process

```
Host Machine                Container
┌─────────────────┐        ┌─────────────────┐
│   /host/path    │ ←────→ │ /container/path │
│   - file1.txt   │        │   - file1.txt   │
│   - file2.txt   │        │   - file2.txt   │
└─────────────────┘        └─────────────────┘
```

---

## 🔧 Build Arguments vs Environment Variables

### Build Arguments (ARG)

- **Available only during build time**
- **NOT accessible** in CMD or application code
- Set during build:

```bash
docker build --build-arg ARG_NAME=value .
```

### Environment Variables (ENV)

- **Available in Dockerfile AND application**
- Set in Dockerfile:

```dockerfile
ENV VAR_NAME=value
```

- Set at runtime:

```bash
docker run --env VAR_NAME=value IMAGE
```

---

## 🎯 Best Practices & Use Cases

### When to Use Anonymous Volumes

- **Temporary container data** that shouldn't persist
- **Preventing Bind Mount overwrites**
- **Cache directories** that shouldn't be shared

### When to Use Named Volumes

- **Database files** that must persist
- **Log files** for long-term storage
- **Uploaded files** that survive container updates
- **Any data** that multiple containers might need

### When to Use Bind Mounts

- **Development environments** with live code updates
- **Configuration files** you need to edit
- **Source code** during development
- **Any data** you need direct access to

---

## 📝 Quick Reference Commands

### Volume Creation Patterns

```bash
# Anonymous Volume
docker run -v /app/data nginx

# Named Volume
docker run -v logs:/app/logs nginx

# Bind Mount (Development)
docker run -v $(pwd):/app/code nginx

# Multiple Volumes
docker run -v logs:/app/logs -v $(pwd):/app/code nginx
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect VOLUME_NAME

# Remove specific volume
docker volume rm VOLUME_NAME

# Clean up unused volumes
docker volume prune
```

---

## 🎯 Key Takeaways

1. **Images are read-only** - container adds read-write layer
2. **Container data is temporary** - lost when container removed
3. **Named Volumes** = best for persistent data you don't edit
4. **Bind Mounts** = perfect for development and editable data
5. **Anonymous Volumes** = useful for temporary data and preventing overwrites
6. **Volumes are managed by Docker** - Bind Mounts managed by you
7. **Use Bind Mounts in development** - Named Volumes in production
8. **Data in volumes survives** container lifecycle
