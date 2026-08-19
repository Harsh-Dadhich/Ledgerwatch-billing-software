from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.auth.routes import router as auth_router
from app.bills.routes import router as bills_router
from app.core.config import settings
from app.core.database import close_db, init_db
from app.core.limiter import limiter
from app.dashboard.routes import router as dashboard_router
from app.products.routes import router as products_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield
    close_db()


app = FastAPI(title="Ledgerwatch API", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(GZipMiddleware, minimum_size=500)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,  # required so the browser sends the httpOnly cookies
    allow_methods=["GET", "POST", "PATCH", "DELETE","PUT"],
    allow_headers=["Content-Type"],
)


@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


app.include_router(auth_router)
app.include_router(products_router)
app.include_router(bills_router)
app.include_router(dashboard_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
