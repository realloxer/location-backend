# 📍 Location Backend Service

A **NestJS** backend service for managing **locations** with CRUD operations, using **TypeORM** and **PostgreSQL**, support the address location tree.

---

## 📌 Features

- Create Location: Add new locations with details such as name, building, and area.
- View Locations: Retrieve location information by ID or list all available locations.
- Update Location: Modify location attributes (e.g., name, area).
- Delete Location\*\*: Remove locations from the database.
- Validate input with DTOs to maintain data consistency and handle exceptions
- Implement logging for API and service using Logger.

---

## 🛠️ Tech Stack

- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **Jest**

## 📊 Database Schema

**Location Entity**  
| Field | Type | Description |
|----------------|----------|-------------------------|
| `id` | UUID | Primary Key |
| `locationNumber` | String | Unique Location Number |
| `locationName` | String | Name of the Location |
| `building` | String | Associated Building |
| `area` | Number | Area (in square meters) |
| `parent` | Location | Parent Location (nullable)|

---

## 🚀 Getting Started

### 1. Clone the repository:

```bash
git clone <repository-url>
cd location-backend
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Configure Environment:

Ensure PostgreSQL is running locally and configure it here:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_username
DATABASE_NAME=location_db

```

### 4. Start the Application:

```bash
npm run start:dev
```

# 📚 API Endpoints

## 1. Create Location

```
POST /locations
```

**Request Body:**

```json
{
  "locationNumber": "LOC-001",
  "locationName": "VN",
  "building": "Building A",
  "area": 100
}
```

**Response:**

```json
{
  "id": "uuid-123",
  "locationNumber": "LOC-001",
  "locationName": "VN",
  "building": "Building A",
  "area": 100,
  "parent": null,
  "children": []
}
```

---

## 2. Get All Locations

```
GET /locations
```

**Response:**

```json
[
  {
    "id": "10eec6f4-2e1d-4e4a-844f-95996dc43b6d",
    "building": "B",
    "locationName": "Level 5",
    "locationNumber": "B-05",
    "area": 150000,
    "parent": null,
    "children": [
      {
        "id": "5ec8b1c3-9cfd-4186-8d34-670dac2af082",
        "building": "B",
        "locationName": "Utility Room",
        "locationNumber": "B-05-11",
        "area": 10200
      },
      {
        "id": "97e5e8ff-e4ce-4efe-a26a-298286de8faf",
        "building": "B",
        "locationName": "Sanitary Room",
        "locationNumber": "B-05-12",
        "area": 12200
      }
    ]
  },
  {
    "id": "4ef4ea0b-04ef-47ad-8598-5f7a2830288e",
    "building": "AAA",
    "locationName": "nnj",
    "locationNumber": "",
    "area": 22,
    "parent": null,
    "children": []
  }
]
```

---

## 3. Get Location by ID

```
GET /locations/:id
```

**Example Request:**

```
GET /locations/10eec6f4-2e1d-4e4a-844f-95996dc43b6d
```

**Response:**

```json
{
  "id": "10eec6f4-2e1d-4e4a-844f-95996dc43b6d",
  "building": "B",
  "locationName": "Level 5",
  "locationNumber": "B-05",
  "area": 150000,
  "parent": {
    "id": "0dc246c3-9cfd-4186-8e36-679hbc2af082",
    "building": "B",
    "locationName": "Room2",
    "locationNumber": "B-05-11",
    "area": 10200
  },
  "children": [
    {
      "id": "5ec8b1c3-9cfd-4186-8d34-670dac2af082",
      "building": "B",
      "locationName": "Utility Room",
      "locationNumber": "B-05-11",
      "area": 10200
    },
    {
      "id": "97e5e8ff-e4ce-4efe-a26a-298286de8faf",
      "building": "B",
      "locationName": "Sanitary Room",
      "locationNumber": "B-05-12",
      "area": 12200
    }
  ]
}
```

---

## 4. Update Location

```
PUT /locations/:id
```

**Example Request:**

```
PUT /locations/uuid-123
```

**Request Body:**

```json
{
  "locationName": "Updated VN",
  "area": 120
}
```

**Response:**

```json
{
  "id": "uuid-123",
  "locationNumber": "LOC-001",
  "locationName": "Updated VN",
  "building": "Building A",
  "area": 120,
  "parent": null,
  "children": []
}
```

---

## 5. Delete Location

```
DELETE /locations/:id
```

**Example Request:**

```
DELETE /locations/uuid-123
```

**Response:**

```json
HTTP Status: 200
```
