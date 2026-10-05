from fastapi import APIRouter, Depends

from app.auth.deps import CurrentUser, get_current_user
from app.dashboard import service
from fastapi import Query
from app.dashboard.payload import SalesTrendPoint, TopProductRow, PaymentSplitRow, HourRow

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
def get_summary(current_user: CurrentUser = Depends(get_current_user)):
    return service.get_summary(current_user.store_id)


@router.get("/recent-activity")
def get_recent_activity(current_user: CurrentUser = Depends(get_current_user), limit: int = 10):
    return service.get_recent_activity(current_user.store_id, limit)

@router.get("/sales-trend", response_model=list[SalesTrendPoint])
def sales_trend(
    days: int = Query(7, ge=1, le=90),
    current_user: CurrentUser = Depends(get_current_user),
):
    return service.sales_trend(current_user.store_id, days)
 
 
@router.get("/top-products", response_model=list[TopProductRow])
def top_products(
    days: int = Query(30, ge=1, le=90),
    limit: int = Query(5, ge=1, le=20),
    current_user: CurrentUser = Depends(get_current_user),
):
    return service.top_products(current_user.store_id, days, limit)
 
 
@router.get("/payment-split", response_model=list[PaymentSplitRow])
def payment_split(
    days: int = Query(30, ge=1, le=90),
    current_user: CurrentUser = Depends(get_current_user),
):
    return service.payment_split(current_user.store_id, days)
 
 
@router.get("/sales-by-hour", response_model=list[HourRow])
def sales_by_hour(
    days: int = Query(30, ge=1, le=90),
    current_user: CurrentUser = Depends(get_current_user),
):
    return service.sales_by_hour(current_user.store_id, days)
 