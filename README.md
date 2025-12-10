# Gulag Cleaner Web App

This is a complete, deployable web application for [Gulag Cleaner](https://github.com/YM162/gulagcleaner), a tool to remove ads from university PDF notes (Wuolah, StuDocu).

## Project Structure

```
.
├── app
│   ├── backend
│   │   └── main.py       # FastAPI application
│   └── frontend
│       ├── index.html    # Frontend structure
│       ├── style.css     # Premium styling
│       └── script.js     # Frontend logic
├── Dockerfile            # For containerized deployment
├── requirements.txt      # Python dependencies
└── start.sh              # Local startup script
```

## Running Locally

1.  **Prerequisites**: Python 3.12+ installed.
2.  **Setup & Run**:
    ```bash
    ./start.sh
    ```
    This script will set up a virtual environment, install dependencies, and start the server at `http://localhost:8000`.

## Deployment (Docker)

To deploy this application using Docker:

1.  **Build the image**:
    ```bash
    docker build -t gulag-cleaner-web .
    ```

2.  **Run the container**:
    ```bash
    docker run -p 8000:8000 gulag-cleaner-web
    ```

3.  Access the app at `http://localhost:8000`.

## Deployment to Cloud (e.g., Dokploy, Railway, Render)

Since this project includes a standard `Dockerfile`, you can deploy it to any platform that supports Docker deployments.

-   **Dokploy**: Point it to this repository (or upload the files) and select "Dockerfile" as the build method.
-   **Railway/Render**: Connect your repository; they will automatically detect the Dockerfile.

## Features

-   **Drag & Drop Interface**: Easy to use modern UI.
-   **Real-time Processing**: Fast ad removal using the `gulagcleaner` Python library.
-   **Responsive Design**: Works on mobile and desktop.
-   **Dark Mode**: Sleek dark aesthetic.
