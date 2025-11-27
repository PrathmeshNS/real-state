# backend/api/excel_loader.py
import os
import pandas as pd

# Path to Excel file inside the api/data folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXCEL_PATH = os.path.join(BASE_DIR, "data", "realestate.xlsx")

# Load once at import time
try:
    df = pd.read_excel(EXCEL_PATH)
    df.columns = [col.strip() for col in df.columns]
    print("[INFO] Excel loaded with shape:", df.shape)
    print("[INFO] Columns:", df.columns.tolist())

except Exception as e:
    print("[ERROR] Failed to load Excel:", e)
    df = None
