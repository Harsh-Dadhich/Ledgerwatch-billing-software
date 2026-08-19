from fastapi import APIRouter, Depends, status

from app.auth.deps import CurrentUser, get_current_user, require_admin
from app.products import service
from app.products.payload import ProductCreatePayload, ProductOut, ProductUpdatePayload

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
def list_products(current_user: CurrentUser = Depends(get_current_user)):
    products = service.list_products(current_user.store_id)
    return [service.to_product_out(p) for p in products]

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: str, current_user: CurrentUser = Depends(get_current_user)):
    product = service.get_product(product_id, current_user.store_id)
    return service.to_product_out(product)


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreatePayload, current_user: CurrentUser = Depends(require_admin)):
    product = service.create_product(payload, current_user.store_id, current_user.user_id)
    return service.to_product_out(product)


@router.patch("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: str,
    payload: ProductUpdatePayload,
    current_user: CurrentUser = Depends(require_admin),
):
    product = service.update_product(product_id, payload, current_user.store_id)
    return service.to_product_out(product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: str, current_user: CurrentUser = Depends(require_admin)):
    service.delete_product(product_id, current_user.store_id)
