from fastapi import HTTPException, status

from app.categories.service import _entity_analytics
from app.core.logger import get_logger
from app.models.brand import Brand
from app.brands.payload import (
    CreateBrandRequest,
    UpdateBrandRequest,
    BrandResponse
)
from app.models.brand import Brand  # <-- adjust to your Brand model path
 


logger = get_logger(__name__)


def to_brand_out(brand: Brand) -> BrandResponse:
    return BrandResponse(
        id=str(brand.id),
        name=brand.name,
        description=brand.description,
        is_active=brand.is_active,
    )


def list_brands(store_id: str) -> list[Brand]:
    return (
        Brand.objects(
            store=store_id,
            is_active=True,
        )
        .only(
            "id",
            "name",
            "description",
            "is_active",
        )
        .order_by("name")
    )


def get_brand(brand_id: str, store_id: str) -> Brand:
    brand = Brand.objects(
        id=brand_id,
        store=store_id,
    ).first()

    if brand is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found",
        )

    return brand


def create_brand(
    payload: CreateBrandRequest,
    store_id: str,
    created_by: str,
) -> Brand:

    existing = Brand.objects(
        store=store_id,
        name=payload.name,
        # is_active=True,
    ).first()

    if existing:
        # raise HTTPException(
        #     status_code=status.HTTP_409_CONFLICT,
        #     detail="Brand already exists",
        # )
        if existing.is_active:
            raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Brand already exists",
            )

        existing.is_active = True
        existing.description = payload.description
        existing.save()

        logger.info(
            "Brand reactivated: store=%s brand=%s",
            store_id,
            existing.id,
        )

        return existing

    brand = Brand(
        name=payload.name,
        description=payload.description,
        store=store_id,
        created_by=created_by,
    ).save()

    logger.info(
        "Brand created: store=%s brand=%s",
        store_id,
        brand.id,
    )

    return brand


def update_brand(
    brand_id: str,
    payload: UpdateBrandRequest,
    store_id: str,
) -> Brand:

    brand = Brand.objects(
        id=brand_id,
        store=store_id,
    ).first()

    if brand is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found",
        )

    if payload.name is not None:
        brand.name = payload.name

    if payload.description is not None:
        brand.description = payload.description

    if payload.is_active is not None:
        brand.is_active = payload.is_active

    brand.save()

    return brand


def delete_brand(
    brand_id: str,
    store_id: str,
) -> None:

    brand = Brand.objects(
        id=brand_id,
        store=store_id,
    ).first()

    if brand is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found",
        )

    brand.is_active = False
    brand.save()

    logger.info(
        "Brand soft-deleted: store=%s brand=%s",
        store_id,
        brand.id,
    )
def get_or_create_brand(
    name: str,
    store_id: str,
    created_by: str,
) -> Brand:
    name = name.strip()

    existing = Brand.objects(
        store=store_id,
        name=name,
    ).first()

    if existing:
        if not existing.is_active:
            existing.is_active = True
            existing.save()

            logger.info(
                "Brand reactivated during product import: store=%s brand=%s",
                store_id,
                existing.id,
            )

        return existing

    brand = Brand(
        name=name,
        store=store_id,
        created_by=created_by,
        is_active=True,
    ).save()

    logger.info(
        "Brand created during product import: store=%s brand=%s",
        store_id,
        brand.id,
    )
     
def brand_analytics(store_id, days: int):
    return _entity_analytics(store_id, days, "brand", Brand, "Unbranded")

    return brand