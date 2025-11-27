# backend/api/llm.py
# gemini hellper
import os
import json
import google.generativeai as genai

# Configure Gemini using API key from environment
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("[WARN] GEMINI_API_KEY not found in environment. Using mock summaries.")
else:
    genai.configure(api_key=api_key)
    print("[INFO] Gemini configured successfully.")


def _mock_summary(user_query: str, stats: dict) -> str:
    areas = ", ".join(stats.get("areas", [])) or "the selected area"
    year_min = stats.get("min_year", "N/A")
    year_max = stats.get("max_year", "N/A")
    avg_price = stats.get("avg_price", "N/A")
    avg_demand = stats.get("avg_demand", "N/A")

    return (
        f"This is a mock analysis for {areas} based on data from {year_min} to {year_max}. "
        f"The average price in this period is approximately {avg_price}, "
        f"and the average demand index is around {avg_demand}. "
        f"Your query was: '{user_query}'. Gemini will generate richer insights once properly configured."
    )


def generate_summary(user_query: str, stats: dict) -> str:
    # If no API key → use mock
    if not api_key:
        return _mock_summary(user_query, stats)

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")

        compact_stats = {
            "areas": stats.get("areas", []),
            "min_year": stats.get("min_year"),
            "max_year": stats.get("max_year"),
            "avg_price": stats.get("avg_price"),
            "avg_demand": stats.get("avg_demand"),
            "price_per_year": stats.get("price_per_year", []),
            "demand_per_year": stats.get("demand_per_year", []),
        }

        prompt = f"""
You are a real estate market analysis assistant.

User query:
{user_query}

Structured data (JSON):
{json.dumps(compact_stats, indent=2)}

Using this data:
- Describe the overall trend for the locality/localities.
- Comment on price movement over the years.
- Comment on demand (based on total units).
- Give a short conclusion (investment/market perspective).

Constraints:
- Write 4 to 6 sentences.
- Be clear and simple (for non-technical users).
- Do NOT include JSON, bullet points, or code. Only plain text.
"""

        response = model.generate_content(prompt)
        text = (response.text or "").strip()

        if not text:
            return _mock_summary(user_query, stats)

        return text

    except Exception as e:
        # Fallback if Gemini call fails
        print("[ERROR] Gemini summary generation failed:", e)
        return _mock_summary(user_query, stats)
