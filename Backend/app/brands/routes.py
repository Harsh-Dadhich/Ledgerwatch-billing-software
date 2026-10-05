from fastapi import APIRouter, Depends, Query, status

from app.auth.deps import (
    CurrentUser,
    get_current_user,
    require_admin,
)

from app.brands import service
from app.brands.payload import (
    BrandResponse,
    CreateBrandRequest,
    UpdateBrandRequest,
    BrandAnalyticsRow,
)

router = APIRouter(
    prefix="/brands",
    tags=["brands"],
)


@router.get(
    "",
    response_model=list[BrandResponse],
)
def list_brands(
    current_user: CurrentUser = Depends(
        get_current_user
    ),
):
    brands = service.list_brands(
        current_user.store_id
    )

    return [
        service.to_brand_out(b)
        for b in brands
    ]

@router.get("/brand-analytics", response_model=list[BrandAnalyticsRow])
def brand_analytics(
    days: int = Query(30, ge=1, le=90),
    current_user: CurrentUser = Depends(get_current_user),
):
    return service.brand_analytics(current_user.store_id, days)


@router.get(
    "/{brand_id}",
    response_model=BrandResponse,
)
def get_brand(
    brand_id: str,
    current_user: CurrentUser = Depends(
        get_current_user
    ),
):
    brand = service.get_brand(
        brand_id,
        current_user.store_id,
    )

    return service.to_brand_out(
        brand
    )


@router.post(
    "",
    response_model=BrandResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_brand(
    payload: CreateBrandRequest,
    current_user: CurrentUser = Depends(
        require_admin
    ),
):
    brand = service.create_brand(
        payload,
        current_user.store_id,
        current_user.user_id,
    )

    return service.to_brand_out(
        brand
    )


@router.patch(
    "/{brand_id}",
    response_model=BrandResponse,
)
def update_brand(
    brand_id: str,
    payload: UpdateBrandRequest,
    current_user: CurrentUser = Depends(
        require_admin
    ),
):
    brand = service.update_brand(
        brand_id,
        payload,
        current_user.store_id,
    )

    return service.to_brand_out(
        brand
    )


@router.delete(
    "/{brand_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_brand(
    brand_id: str,
    current_user: CurrentUser = Depends(
        require_admin
    ),
):
    service.delete_brand(
        brand_id,
        current_user.store_id,
    )