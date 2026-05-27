from fastapi import APIRouter

from app.services.market_data.fred import get_macro_dashboard

router = APIRouter(prefix="/macro", tags=["macro"])


@router.get("/dashboard")
async def macro_dashboard():
    return get_macro_dashboard()
