# Run this project with Docker

## Requirements

Install Docker Desktop and keep it open.

## Run

Open terminal inside this project folder and run:

```bash
docker compose up --build
```

Frontend:

```txt
http://localhost:5173
```

Backend:

```txt
http://localhost:6500
```

MongoDB runs inside Docker on:

```txt
mongodb://localhost:27017
```

## Stop

```bash
docker compose down
```

## Stop and remove MongoDB data also

```bash
docker compose down -v
```

## Notes

- Uploaded images are stored in `server/uploads`.
- The backend container uses `MONGO_URI=mongodb://mongo:27017/express_project` from `docker-compose.yml`.
- The frontend currently calls `http://localhost:6500`, so open the frontend from your PC browser at `http://localhost:5173`.
