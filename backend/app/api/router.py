from fastapi import APIRouter

from app.api.routes import auth, blog, macro, markets, watchlist

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(markets.router)
api_router.include_router(macro.router)
api_router.include_router(watchlist.router)
api_router.include_router(blog.router)
