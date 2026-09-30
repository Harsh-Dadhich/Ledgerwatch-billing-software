from fastapi import APIRouter, Depends, Query, status

from app.auth.deps import CurrentUser, get_current_user, require_admin
from app.products import service
from app.products.payload import LowStockProductResponse, ProductCreatePayload, ProductOut,ProductListResponse, ProductUpdatePayload
from fastapi import UploadFile, File
from fastapi.responses import Response
from app.products.payload import BulkImportResult

router = APIRouter(prefix="/products", tags=["products"])


# @router.get("", response_model=list[ProductOut])
# def list_products(current_user: CurrentUser = Depends(get_current_user)):
#     products = service.list_products(current_user.store_id)
#     return [service.to_product_out(p) for p in products]

@router.get(
    "",
    response_model=ProductListResponse,
)
def list_products(
    search: str | None = Query(
        default=None,
        description="Search by product name, SKU, barcode, brand, or category",
    ),
    category: str | None = Query(
        default=None,
        description="Filter products by category",
    ),
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    current_user: CurrentUser = Depends(get_current_user),
):
    return service.list_products(
        store_id=current_user.store_id,
        search=search,
        category=category,
        page=page,
        page_size=page_size,
    )

@router.get(
    "/low-stock",
    response_model=list[LowStockProductResponse],
)
def list_low_stock_products(
    current_user: CurrentUser = Depends(
        get_current_user
    ),
):

    products = service.list_low_stock_products(
        current_user.store_id
    )

    return [
        service.to_low_stock_out(product)
        for product in products
    ]

@router.get("/bulk-import/template")
def download_import_template(current_user: CurrentUser = Depends(require_admin)):
    csv_content = (
        "name,sku,barcode,category,brand,purchase_price,price,mrp,gst_pct,quantity,min_stock\n"
        "Coca Cola 750ml,CC750,8901234567890,Beverages,Coca Cola,30,40,45,18,100,20\n"
    )
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=product_import_template.csv"},
    )


@router.post("/bulk-import", response_model=BulkImportResult)
async def bulk_import(file: UploadFile = File(...), current_user: CurrentUser = Depends(require_admin)):
    raw_bytes = await file.read()
    return service.bulk_import_products(file.filename, raw_bytes, current_user.store_id, current_user.user_id)

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

