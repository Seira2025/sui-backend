# Seira Backend

This repository now includes a lightweight Python backend so you can drive the storefront with real data.

## Stack

- **Flask 3** for the HTTP server and REST API
- **SQLAlchemy 2** for the ORM layer
- **SQLite** for local persistence (file stored at `backend/app.db`)

## Project layout

```
backend/
│  app.py          # Flask entry point with API + page-serving routes
│  config.py       # Centralised paths and constants
│  database.py     # Engine + session helpers
│  models.py       # SQLAlchemy ORM models
│  seed.py         # Utility script that (re)creates and seeds the DB
home.html, products.html, ...  # Existing static frontend pages
requirements.txt                # Backend dependencies
```

## Getting started

1. **Create a virtual environment (recommended)**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
3. **Create & seed the database**
   ```bash
   python3 -m backend.seed
   ```
   This will drop existing tables, recreate them, and insert demo categories, products, and a sample order.
4. **Run the API**
   ```bash
   flask --app backend.app --debug run
   ```
   or
   ```bash
   python3 backend/app.py
   ```

The server exposes:

- `GET /api/health` – quick status check
- `GET /api/categories` – list categories with product counts
- `GET /api/products?category=<slug>&search=<term>` – filterable catalog
- `GET /api/products/<id>` – product detail
- `POST /api/orders` – create an order (expects `customer` + `items` JSON)
- `GET /api/orders/<id>` – fetch an order summary
- `GET /pages/<page>` – serves the original static HTML (`home`, `products`, `product`, `cart`, `order`, `shipping`)

Visiting `http://localhost:5000/` redirects to the home page so you can still browse the existing UI while hitting the new API endpoints via your preferred client.

## Example order payload

```json
{
  "customer": {
    "name": "Jamie Lee",
    "email": "jamie@example.com",
    "address1": "500 Market St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94105",
    "country": "USA"
  },
  "items": [
    {"product_id": 1, "quantity": 2},
    {"product_id": 4, "quantity": 1}
  ]
}
```

## Next steps

- Add authentication if you need protected admin endpoints.
- Replace SQLite with Postgres by updating `SQLALCHEMY_DATABASE_URI` in `backend/config.py`.
