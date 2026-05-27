from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.blog import BlogPost

router = APIRouter(prefix="/blog", tags=["blog"])


class BlogPostOut(BaseModel):
    id: UUID
    slug: str
    title: str
    excerpt: str
    category: str
    author_name: str
    author_avatar: Optional[str]
    cover_image: Optional[str]
    read_time_minutes: int
    featured: bool
    published_at: str

    model_config = {"from_attributes": True}


class BlogPostDetail(BlogPostOut):
    content: str


@router.get("", response_model=List[BlogPostOut])
async def list_posts(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
):
    q = select(BlogPost).order_by(BlogPost.published_at.desc())
    if category:
        q = q.where(BlogPost.category == category)
    if featured is not None:
        q = q.where(BlogPost.featured == featured)
    result = await db.execute(q.limit(20))
    posts = result.scalars().all()
    return [
        BlogPostOut(
            **{**p.__dict__, "published_at": p.published_at.isoformat()},
        )
        for p in posts
    ]


@router.get("/{slug}", response_model=BlogPostDetail)
async def get_post(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BlogPost).where(BlogPost.slug == slug))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return BlogPostDetail(
        id=post.id,
        slug=post.slug,
        title=post.title,
        excerpt=post.excerpt,
        content=post.content,
        category=post.category,
        author_name=post.author_name,
        author_avatar=post.author_avatar,
        cover_image=post.cover_image,
        read_time_minutes=post.read_time_minutes,
        featured=post.featured,
        published_at=post.published_at.isoformat(),
    )
