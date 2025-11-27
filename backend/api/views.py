# backend/api/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import numpy as np 

from .excel_loader import df
from .llm import generate_summary


@api_view(["POST"])
def analyze(request):
    if df is None:
        return Response(
            {"error": "Excel data not loaded on server."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    query = request.data.get("query", "").strip()
    if not query:
        return Response(
            {"error": "Query is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # 1) Very simple area detection from query 
 
    AREA_COL = "final location"  
    YEAR_COL = "year"
    PRICE_COL = "flat - weighted average rate"
    DEMAND_COL = "total units"

    if AREA_COL not in df.columns:
        return Response(
            {"error": f"Expected column '{AREA_COL}' not found in Excel."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # Get all unique area names
    all_areas = df[AREA_COL].dropna().unique().tolist()

    # Find which area names are mentioned in the query (very simple matching)
    matched_areas = [
        area for area in all_areas if area.lower() in query.lower()
    ]

    if not matched_areas:
        # fallback: just return whole dataset summary
        filtered_df = df.copy()
        matched_areas = ["All Areas"]
    else:
        filtered_df = df[df[AREA_COL].isin(matched_areas)].copy()

    if filtered_df.empty:
        return Response(
            {"error": "No data found for given query/area."},
            status=status.HTTP_404_NOT_FOUND,
        )

    #   2) Build chart data (price & demand per year)  
    if YEAR_COL not in df.columns:
        return Response(
            {"error": f"Expected column '{YEAR_COL}' not found in Excel."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # Group by year and compute average price/demand
    grouped = filtered_df.groupby(YEAR_COL).agg({
        PRICE_COL: "mean" if PRICE_COL in filtered_df.columns else "mean",
        DEMAND_COL: "mean" if DEMAND_COL in filtered_df.columns else "mean",
    })

    # Reset index to regular columns
    grouped = grouped.reset_index()

    years = grouped[YEAR_COL].tolist()
    prices = grouped[PRICE_COL].tolist() if PRICE_COL in grouped.columns else []
    demands = grouped[DEMAND_COL].tolist() if DEMAND_COL in grouped.columns else []

    chart_data = {
        "years": years,
        "price": prices,
        "demand": demands,
    }

    #   3) Table data (limited rows to avoid huge response)  
    safe_df = filtered_df.replace({np.nan: None})  # convert NaN → None
    table_records = safe_df.head(200).to_dict(orient="records")

    #   4) Build stats for summary  
    min_year = (
        int(filtered_df[YEAR_COL].min())
        if YEAR_COL in filtered_df.columns and not np.isnan(filtered_df[YEAR_COL].min())
        else None
    )

    max_year = (
        int(filtered_df[YEAR_COL].max())
        if YEAR_COL in filtered_df.columns and not np.isnan(filtered_df[YEAR_COL].max())
        else None
    )
    # price
    if PRICE_COL in filtered_df.columns:
        mean_price = filtered_df[PRICE_COL].mean()
        avg_price = float(mean_price) if not np.isnan(mean_price) else None
    else:
        avg_price = None
    # demand
    if DEMAND_COL in filtered_df.columns:
        mean_demand = filtered_df[DEMAND_COL].mean()
        avg_demand = float(mean_demand) if not np.isnan(mean_demand) else None
    else:
        avg_demand = None

    stats = {
        "areas": matched_areas,
        "min_year": min_year,
        "max_year": max_year,
        "avg_price": avg_price,
        "avg_demand": avg_demand,
        "price_per_year": grouped[[YEAR_COL, PRICE_COL]].to_dict(orient="records")
        if PRICE_COL in grouped.columns else [],
        "demand_per_year": grouped[[YEAR_COL, DEMAND_COL]].to_dict(orient="records")
        if DEMAND_COL in grouped.columns else [],
    }

    #   5) Get summary (mock for now)  
    summary = generate_summary(query, stats)

    #   6) Return response  
    return Response(
        {
            "summary": summary,
            "chart": chart_data,
            "table": table_records,
            "meta": {
                "areas": matched_areas,
                "rows_returned": len(table_records),
            },
        }
    )
