# Real Estate Market Insight Chatbot

AI-powered real estate analysis tool built as a full-stack assignment project.  
It reads structured market data from Excel, analyzes it with Gemini, and exposes the results via a REST API and a React dashboard.

---

## 🚀 Features

### Backend (Django + DRF + Gemini)

- Reads market data from an Excel file (`realestate.xlsx`) using **pandas**.
- Single analysis endpoint:  
  `POST /api/analyze/`
- Supports:
  - Locality detection from natural-language queries
  - Year-wise aggregation of:
    - Average prices (flat weighted average rate)
    - Demand proxy (total units)
  - Per-locality filtering (e.g. _Wakad_, _Aundh_, _Ambegaon Budruk_ …)
  - **Compare mode**: query can mention multiple areas, all are analyzed.
- Uses **Gemini 2.5** to generate a natural-language market summary.
- JSON response includes:
  - `summary` – AI-generated text
  - `chart` – arrays for `years`, `price`, `demand`
  - `table` – cleaned raw records from Excel
  - `meta` – detected areas, row count

### Frontend (React + Vite)

- Modern single-page dashboard built with:
  - **React + Vite**
  - **Bootstrap 5** for layout
  - **Lucide icons**
  - **Recharts** for visualization
- Main UI features:
  - Smart query box (e.g. _“Give me analysis of Wakad”_, _“Compare Ambegaon Budruk and Aundh demand trends”_)
  - AI summary card
  - Line chart: **Price vs Demand** over years
  - Data table: key market stats per year & area

### Comparison Mode

When query includes multiple valid areas:

- Backend returns all matching areas.
- Frontend:
  - Shows **one card per area**
  - Each card contains:
    - Its own chart
    - Its own table
  - Cards are placed **side-by-side in a horizontally scrollable strip**.

### Export / Download

- **Excel export** using **ExcelJS**:
  - Single-area mode → one sheet with current table.
  - Compare mode → one sheet per area.
- **PDF export** using **jsPDF + jspdf-autotable**:
  - Single-area mode → Summary + table in one PDF.
  - Compare mode → one page per area with its own table.

---

## 🧱 Tech Stack

**Backend**

- Python 3.x
- Django 5.x
- Django REST Framework
- pandas, numpy
- google-generativeai (Gemini 2.5)
- python-dotenv

**Frontend**

- React (Vite)
- Bootstrap 5
- Recharts
- Lucide React icons
- ExcelJS + file-saver
- jsPDF + jspdf-autotable
- Axios

---

## 📁 Project Structure (high level)

```text
realestate-chatbot/
├── backend/
│   ├── manage.py
│   ├── realestate/           # Django project
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   └── api/                  # Django app
│       ├── views.py          # /api/analyze/ implementation
│       ├── excel_loader.py   # loads realestate.xlsx
│       ├── llm.py            # Gemini integration
│       ├── urls.py
│       └── data/
│           └── realestate.xlsx
└── frontend/
    └── realestate-ui/
        ├── index.html
        ├── vite.config.js
        └── src/
            ├── api.js
            ├── App.jsx
            ├── main.jsx
            └── components/
                ├── Header.jsx
                ├── ChatBox.jsx
                ├── Summary.jsx
                ├── ChartDisplay.jsx
                ├── TableDisplay.jsx
                ├── LoadingState.jsx
                ├── DownloadBar.jsx
                └── CompareAreaStrip.jsx
```

## ⚙️ Environment Variables (.env / .env.sample)

### Backend

A sample env file is provided as:

`  backend/.env.sample  `

Example content:

```
# backend/.env.sample
GEMINI_API_KEY=your_gemini_api_key_here
```

To use it:

```
 cd backend  cp
.env.sample .env   # Windows: copy .env.sample .env
```

Then edit .env and put your real Gemini API key.

settings.py loads it via:

```
from dotenv import load_dotenv
load_dotenv()
```

### Frontend

Currently the frontend uses a fixed base URL in src/api.js:

```
// src/api.js
  import axios from "axios";
  const api = axios.create
    ({
      baseURL: "http://127.0.0.1:8000/api",
    });
  export default api;   `
```

If needed, you can later refactor this to use VITE_API_BASE_URL via a frontend/.env.sample, but it is not required for this version.

## 🛠 How to Run (Full Stack)

### 1\. Backend – Django API

From project root:

`  cd backend  `

#### 1.1 Create & activate virtual environment

```
  python -m venv venv
  # Windows:  venv\Scripts\activate
  # macOS / Linux:  # source venv/bin/activate
```

#### 1.2 Install dependencies

`  pip install -r requirements.txt  `

(if there is no requirements.txt, install manually:)

`  pip install django djangorestframework pandas numpy google-generativeai python-dotenv  `

#### 1.3 Setup .env from .env.sample

`  cp .env.sample .env        # Windows: copy .env.sample .env  `

Then open .env and set:

`  GEMINI_API_KEY=your_real_gemini_key_here  `

#### 1.4 Place the Excel file

Make sure your Excel data file is present at:

`  backend/api/data/realestate.xlsx  `

The code expects important columns (after stripping spaces), for example:

- final location
- year
- flat - weighted average rate
- total units
- and other \*\_sold - igr fields used in the tables.

#### 1.5 Apply migrations & run server

```
python manage.py migrate
python manage.py runserver
```

Backend will run at:

`  http://127.0.0.1:8000  `

API endpoint:

`  http://127.0.0.1:8000/api/analyze/  `

### 2\. Frontend – React (Vite) UI

Open a **new terminal** (keep backend running) and from project root:

`  cd frontend/realestate-ui  `

#### 2.1 Install dependencies

`  npm install  `

This installs:

- react, react-dom
- vite
- axios
- bootstrap
- recharts
- lucide-react
- exceljs, file-saver
- jspdf, jspdf-autotable

#### 2.2 Run dev server

`  npm run dev  `

Vite will show a URL like:

`  http://127.0.0.1:5173  `

Open that in your browser.

Make sure:

- **Backend** is running at http://127.0.0.1:8000
- **Frontend** is running at http://127.0.0.1:5173

## 🌐 API – /api/analyze/

**URL**

```
   POST /api/analyze/
   Content-Type: application/json
```

**Body Example**

```
  {
    "query": "Give me analysis of Wakad"
  }
```

**Response Shape**

```
{
  "summary": "…AI generated text…",
    "chart":
    {
      "years": [2020, 2021, 2022, 2023, 2024],
      "price": [9116.94, 9289.03, 9734.90, 9959.56, 10277.82],
      "demand": [4325, 5030, 4397, 4471, 1814]
    },
      "table":
      [
        {
          "final location": "Wakad",
          "year": 2020,
          "city": "Pune",
          "flat - weighted average rate": 9116.94,
          "total units": 4325,
          "flat_sold - igr": 3244,
          "office_sold - igr": 139,
          "shop_sold - igr": 109,
          "residential_sold - igr": 3264,
          "total_sales - igr": 20983019240.0,
          "...": "..."
        }
      ],
      "meta":
      {
        "areas": ["Wakad"],
        "rows_returned": 5
      }
}
```

## 🧮 Frontend Behaviour

- **ChatBox** sends { query } → /api/analyze/.
- **Summary** displays summary from backend (Gemini 2.5).
- **Normal mode** (meta.areas.length === 1):

  - 1 chart (price vs demand over years).
  - 1 table (year, area, avg price, total units, res sold, office sold).

- **Compare mode** (meta.areas.length > 1):

  - Horizontally scrollable strip.
  - One card per area:

    - Area-specific chart.
    - Area-specific table.

## 📤 Export / Downloads

Buttons appear above the charts/tables:

### Single-area mode

- **Download Data (Excel)**

  - Generates an .xlsx file with one sheet (current area data).

- **Download Data (PDF)**

  - Generates a PDF with:

    - Title
    - Area name
    - AI summary
    - Table of metrics

### Compare mode

- **Download Comparison (Excel)**

  - One sheet per area (multi-sheet workbook).

- **Download Comparison (PDF)**

  - One page per area (multi-page PDF).

## 🧪 Example Queries

Try:

- Give me analysis of Wakad
- Show price trend for Aundh
- Compare Ambegaon Budruk and Aundh demand trends
- Compare Wakad, Aundh and Ambegaon Budruk from 2020 to 2024

The last two will trigger **compare mode**.

## ✅ Status

- ✅ Backend: /api/analyze/ working with Excel + Gemini 2.5
- ✅ Frontend: React dashboard with charts, tables, and AI summary
- ✅ Compare mode: multiple areas with separate visuals
- ✅ Export: Excel + PDF for both single and compare modes
