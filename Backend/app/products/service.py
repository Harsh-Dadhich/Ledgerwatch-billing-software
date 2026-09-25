from fastapi import HTTPException, status

from app.core.logger import get_logger
from app.models.product import Product
from app.products.payload import LowStockProductResponse, ProductCreatePayload, ProductOut, ProductUpdatePayload

logger = get_logger(__name__)


def to_product_out(product: Product) -> ProductOut:
    return ProductOut(
        # id=str(product.id), name=product.name,
        # price=product.price, quantity=product.quantity if product.quantity is not None else 0, is_active=product.is_active,
        id=str(product.id),

        name=product.name,

        sku=product.sku,

        barcode=product.barcode,

        category=product.category,

        brand=product.brand,

        purchase_price=product.purchase_price,

        price=product.price,

        mrp=product.mrp,

        gst_pct=product.gst_pct,

        quantity=(
            product.quantity
            if product.quantity is not None
            else 0
        ),

        min_stock=product.min_stock,

        is_active=product.is_active,
    )


def list_products(store_id: str) -> list[Product]:
    # .only() trims the fields fetched over the wire -- this list is
    # read on every dashboard/bill-creation load, so keep it lean.
    return (
        Product.objects(store=store_id, is_active=True)
        .only(
            # "id", "name", "price", "quantity", "is_active"
                "id",
                "name",
                "sku",
                "barcode",
                "category",
                "brand",
                "purchase_price",
                "price",
                "mrp",
                "gst_pct",
                "quantity",
                "min_stock",
                "is_active",).order_by("name")
            )

def get_product(product_id: str, store_id: str) -> Product:
    product = Product.objects(id=product_id, store=store_id).first()
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product

def create_product(payload: ProductCreatePayload, store_id: str, created_by: str) -> Product:
    product = Product(
        # name=payload.name,
        # price=payload.price,
        # quantity=payload.quantity,
        # store=store_id,
        # created_by=created_by,
        name=payload.name,

        sku=payload.sku,

        barcode=payload.barcode,

        category=payload.category,

        brand=payload.brand,

        purchase_price=payload.purchase_price,

        price=payload.price,

        mrp=payload.mrp,

        gst_pct=payload.gst_pct,

        quantity=payload.quantity,

        min_stock=payload.min_stock,

        store=store_id,

        created_by=created_by,
    ).save()
    logger.info("Product created: store=%s product=%s", store_id, product.id)
    return product


def update_product(product_id: str, payload: ProductUpdatePayload, store_id: str) -> Product:
    product = Product.objects(id=product_id, store=store_id).first()
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    if payload.name is not None:
        product.name = payload.name
    if payload.price is not None:
        product.price = payload.price
    if payload.quantity is not None:
        product.quantity = payload.quantity
    if payload.is_active is not None:
        product.is_active = payload.is_active
    if payload.sku is not None:
        product.sku = payload.sku
    if payload.barcode is not None:
      product.barcode = payload.barcode

    if payload.category is not None:
        product.category = payload.category

    if payload.brand is not None:
        product.brand = payload.brand

    if payload.purchase_price is not None:
        product.purchase_price = payload.purchase_price

    if payload.mrp is not None:
        product.mrp = payload.mrp

    if payload.gst_pct is not None:
        product.gst_pct = payload.gst_pct

    if payload.min_stock is not None:
        product.min_stock = payload.min_stock
    product.save()
    return product


def delete_product(product_id: str, store_id: str) -> None:
    product = Product.objects(id=product_id, store=store_id).first()
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    # Soft delete: past bills already snapshot name/price, so this is safe
    # and preserves the product's history instead of destroying it.
    product.is_active = False
    product.save()
    logger.info("Product soft-deleted: store=%s product=%s", store_id, product_id)

# def update_product_quantity(product_id:str, store_id:str, quantity:float) ->Product:
#     product = Product.objects(id=product_id, store=store_id).first()
#     if product is None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
#     if quantity == 0:
#         product.quantity = 0
#     else:
#         product.quantity -= quantity
#     product.save()
#     return product

def decrement_product_stock(product_id: str, store_id: str, amount: float) -> Product:
    """Atomically checks AND decrements stock in a single DB operation.
    This is the key fix for the race condition: two simultaneous bills
    for the same product can no longer both read the same starting
    quantity and both succeed. The quantity__gte filter means the
    decrement only happens if enough stock currently exists -- checking
    and updating are the same atomic step, not two separate ones.
    """
    # product = Product.objects(
    #     id=product_id, store=store_id, quantity__gte=amount
    # ).modify(new=True, dec__quantity=amount)

    # if product is None:
    #     existing = Product.objects(id=product_id, store=store_id).first()
    #     if existing is None:
    #         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    #     raise HTTPException(
    #         status_code=status.HTTP_409_CONFLICT,
    #         detail=f"Not enough stock for {existing.name} (have {existing.quantity}, need {amount})",
    #     )
    # return product
    product = Product.objects(
        id=product_id, store=store_id, quantity__gte=amount
    ).modify(new=True, dec__quantity=amount)

    if product is None:
        existing = Product.objects(id=product_id, store=store_id).first()
        if existing is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Not enough stock for {existing.name} (have {existing.quantity}, need {amount})",
        )
    return product


def restore_product_stock(product_id: str, store_id: str, amount: float) -> None:
    """Reverses a decrement -- used to roll back items already
    decremented earlier in the same bill if a later item fails.
    """
    Product.objects(id=product_id, store=store_id).update(inc__quantity=amount)

def list_low_stock_products(store_id: str):

    products = Product.objects(
        store=store_id,
        is_active=True,
        quantity__ne=None,
        min_stock__ne=None,
    )

    return [
        product
        for product in products
        if product.quantity <= product.min_stock
    ]

def to_low_stock_out(product: Product):

    return LowStockProductResponse(
        id=str(product.id),
        name=product.name,
        sku=product.sku,
        quantity=product.quantity,
        min_stock=product.min_stock,
    )