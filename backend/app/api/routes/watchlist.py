from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.watchlist import WatchlistItem

router = APIRouter(prefix="/watchlist", tags=["watchlist"])


class WatchlistCreate(BaseModel):
    symbol: str
    asset_type: str
    name: str | None = None


class WatchlistOut(BaseModel):
    id: UUID
    symbol: str
    asset_type: str
    name: str | None

    model_config = {"from_attributes": True}


@router.get("", response_model=List[WatchlistOut])
async def list_watchlist(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(WatchlistItem).where(WatchlistItem.user_id == user.id))
    return result.scalars().all()


@router.post("", response_model=WatchlistOut)
async def add_watchlist(
    data: WatchlistCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    item = WatchlistItem(
        user_id=user.id,
        symbol=data.symbol.upper(),
        asset_type=data.asset_type,
        name=data.name,
    )
    db.add(item)
    try:
        await db.flush()
    except Exception:
        raise HTTPException(status_code=400, detail="Already in watchlist")
    return item


@router.delete("/{item_id}")
async def remove_watchlist(
    item_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(WatchlistItem).where(WatchlistItem.id == item_id, WatchlistItem.user_id == user.id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    await db.delete(item)
    return {"message": "Removed"}
