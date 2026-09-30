from fastapi import HTTPException, status

from app.core.logger import get_logger
from app.models.category import Category
from app.categories.payload import (
    CategoryResponse,
    CreateCategoryRequest,
    UpdateCategoryRequest,
)

logger = get_logger(__name__)


def to_category_out(category: Category) -> CategoryResponse:
    return CategoryResponse(
        id=str(category.id),
        name=category.name,
        description=category.description,
        is_active=category.is_active,
    )


def list_categories(store_id: str) -> list[Category]:
    return (
        Category.objects(
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


def get_category(category_id: str, store_id: str) -> Category:
    category = Category.objects(
        id=category_id,
        store=store_id,
    ).first()

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    return category


def create_category(
    payload: CreateCategoryRequest,
    store_id: str,
    created_by: str,
) -> Category:

    existing = Category.objects(
        store=store_id,
        name=payload.name,
        # is_active=True,
    ).first()
    print("STORE:", store_id)
    print("NAME:", payload.name)
    print("EXISTING:", existing)

    if existing:
        # raise HTTPException(
        #     status_code=status.HTTP_409_CONFLICT,
        #     detail="Category already exists",
        # )
        if existing.is_active:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Category already exists",
            )

        existing.is_active = True
        existing.description = payload.description
        existing.save()
        logger.info(
            "Category reactivated: store=%s category=%s",
            store_id,
            existing.id,
        )

        return existing

    category = Category(
        name=payload.name,
        description=payload.description,
        store=store_id,
        created_by=created_by,
    ).save()

    logger.info(
        "Category created: store=%s category=%s",
        store_id,
        category.id,
    )

    return category


def update_category(
    category_id: str,
    payload: UpdateCategoryRequest,
    store_id: str,
) -> Category:

    category = Category.objects(
        id=category_id,
        store=store_id,
    ).first()

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    if payload.name is not None:
        category.name = payload.name

    if payload.description is not None:
        category.description = payload.description

    if payload.is_active is not None:
        category.is_active = payload.is_active

    category.save()

    return category


def delete_category(
    category_id: str,
    store_id: str,
) -> None:

    category = Category.objects(
        id=category_id,
        store=store_id,
    ).first()

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    category.is_active = False
    category.save()

    logger.info(
        "Category soft-deleted: store=%s category=%s",
        store_id,
        category_id,
    )

def get_or_create_category(
    name: str,
    store_id: str,
    created_by: str,
) -> Category:
    name = name.strip()

    existing = Category.objects(
        store=store_id,
        name=name,
    ).first()

    if existing:
        if not existing.is_active:
            existing.is_active = True
            existing.save()

            logger.info(
                "Category reactivated during product import: store=%s category=%s",
                store_id,
                existing.id,
            )

        return existing

    category = Category(
        name=name,
        store=store_id,
        created_by=created_by,
        is_active=True,
    ).save()

    logger.info(
        "Category created during product import: store=%s category=%s",
        store_id,
        category.id,
    )

    return category