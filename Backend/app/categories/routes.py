from fastapi import APIRouter, Depends, status

from app.auth.deps import (
    CurrentUser,
    get_current_user,
    require_admin,
)

from app.categories import service
from app.categories.payload import (
    CategoryResponse,
    CreateCategoryRequest,
    UpdateCategoryRequest,
)

router = APIRouter(
    prefix="/categories",
    tags=["categories"],
)


@router.get(
    "",
    response_model=list[CategoryResponse],
)
def list_categories(
    current_user: CurrentUser = Depends(
        get_current_user
    ),
):
    categories = service.list_categories(
        current_user.store_id
    )

    return [
        service.to_category_out(c)
        for c in categories
    ]


@router.get(
    "/{category_id}",
    response_model=CategoryResponse,
)
def get_category(
    category_id: str,
    current_user: CurrentUser = Depends(
        get_current_user
    ),
):
    category = service.get_category(
        category_id,
        current_user.store_id,
    )

    return service.to_category_out(
        category
    )


@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_category(
    payload: CreateCategoryRequest,
    current_user: CurrentUser = Depends(
        require_admin
    ),
):
    category = service.create_category(
        payload,
        current_user.store_id,
        current_user.user_id,
    )

    return service.to_category_out(
        category
    )


@router.patch(
    "/{category_id}",
    response_model=CategoryResponse,
)
def update_category(
    category_id: str,
    payload: UpdateCategoryRequest,
    current_user: CurrentUser = Depends(
        require_admin
    ),
):
    category = service.update_category(
        category_id,
        payload,
        current_user.store_id,
    )

    return service.to_category_out(
        category
    )


@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_category(
    category_id: str,
    current_user: CurrentUser = Depends(
        require_admin
    ),
):
    service.delete_category(
        category_id,
        current_user.store_id,
    )