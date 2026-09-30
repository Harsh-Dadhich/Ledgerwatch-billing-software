from fastapi import HTTPException, status
import io
import math
import pandas as pd

from app.core.logger import get_logger
from app.models.product import Product
from app.core.enums import StockTransactionType
from app.models.stock_transaction import StockTransaction
from app.products.payload import LowStockProductResponse, ProductCreatePayload, ProductOut, ProductUpdatePayload,BulkImportResult, BulkImportRowError
from app.categories.service import get_or_create_category
from app.brands.service import get_or_create_brand
from mongoengine.queryset.visitor import Q

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


# def list_products(store_id: str) -> list[Product]:
#     # .only() trims the fields fetched over the wire -- this list is
#     # read on every dashboard/bill-creation load, so keep it lean.
#     return (
#         Product.objects(store=store_id, is_active=True)
#         .only(
#             # "id", "name", "price", "quantity", "is_active"
#                 "id",
#                 "name",
#                 "sku",
#                 "barcode",
#                 "category",
#                 "brand",
#                 "purchase_price",
#                 "price",
#                 "mrp",
#                 "gst_pct",
#                 "quantity",
#                 "min_stock",
#                 "is_active",).order_by("name")
#             )

def list_products(
    store_id: str,
    search: str | None = None,
    category=None,
    page: int = 1,
    page_size: int = 20,
):
    query = Product.objects(
        store=store_id,
        is_active=True,
    )

    if search:
        search = search.strip()

        if search:
            query = query.filter(
                Q(name__icontains=search)
                | Q(sku__icontains=search)
                | Q(barcode__icontains=search)
                | Q(brand__icontains=search)
                | Q(category__icontains=search)
            )
    if category:
        category = category.strip()

        if category:
            query = query.filter(
                category__iexact=category
            )

    total = query.count()

    skip = (page - 1) * page_size

    products = (
        query
        .only(
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
            "is_active",
        )
        .order_by("name")
        .skip(skip)
        .limit(page_size)
    )

    total_pages = (
        math.ceil(total / page_size)
        if total > 0
        else 0
    )

    return {
        "items": [
            to_product_out(product)
            for product in products
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }

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

# MAX_IMPORT_ROWS = 5000
# REQUIRED_IMPORT_COLUMNS = {"name", "price"}


# def _clean_str(value) -> str | None:
#     if value is None or (isinstance(value, float) and pd.isna(value)):
#         return None
#     s = str(value).strip()
#     return s or None


# def _clean_float(value) -> float | None:
#     if value is None or (isinstance(value, float) and pd.isna(value)):
#         return None
#     try:
#         return float(value)
#     except (TypeError, ValueError):
#         return None


# def _parse_import_file(filename: str, raw_bytes: bytes) -> pd.DataFrame:
#     lower = filename.lower()
#     try:
#         if lower.endswith(".csv"):
#             df = pd.read_csv(io.BytesIO(raw_bytes))
#         elif lower.endswith((".xlsx", ".xls")):
#             df = pd.read_excel(io.BytesIO(raw_bytes))
#         else:
#             raise HTTPException(status_code=400, detail="Upload a .csv or .xlsx file")
#     except HTTPException:
#         raise
#     except Exception:
#         raise HTTPException(status_code=400, detail="Could not read this file -- is it a valid CSV/Excel file?")

#     df.columns = df.columns.str.strip()
#     missing = REQUIRED_IMPORT_COLUMNS - set(df.columns)
#     if missing:
#         raise HTTPException(
#             status_code=400,
#             detail=f"Missing required column(s): {', '.join(sorted(missing))}. Download the template and match its headers exactly.",
#         )
#     if len(df) > MAX_IMPORT_ROWS:
#         raise HTTPException(status_code=400, detail=f"Too many rows ({len(df)}) -- split into files of {MAX_IMPORT_ROWS} or fewer")

#     return df


# def bulk_import_products(filename: str, raw_bytes: bytes, store_id: str, created_by: str) -> BulkImportResult:
#     df = _parse_import_file(filename, raw_bytes)

#     created = 0
#     updated = 0
#     errors: list[BulkImportRowError] = []

#     for idx, row in df.iterrows():
#         row_num = idx + 2  # +1 for 0-index, +1 for the header row
#         try:
#             name = _clean_str(row.get("name"))
#             if not name:
#                 raise ValueError("Name is required")

#             price = _clean_float(row.get("price"))
#             if price is None or price <= 0:
#                 raise ValueError("Price must be a number greater than 0")

#             sku = _clean_str(row.get("sku"))
#             fields = dict(
#                 name=name,
#                 price=price,
#                 barcode=_clean_str(row.get("barcode")),
#                 category=_clean_str(row.get("category")),
#                 brand=_clean_str(row.get("brand")),
#                 purchase_price=_clean_float(row.get("purchase_price")),
#                 mrp=_clean_float(row.get("mrp")),
#                 gst_pct=_clean_float(row.get("gst_pct")) or 0,
#                 min_stock=_clean_float(row.get("min_stock")) or 0,
#             )
#             quantity = _clean_float(row.get("quantity"))

#             existing = Product.objects(store=store_id, sku=sku, is_active=True).first() if sku else None

#             if existing:
#                 for key, value in fields.items():
#                     setattr(existing, key, value)
#                 # Deliberately not touching quantity here -- see the
#                 # design note above.
#                 existing.save()
#                 updated += 1
#             else:
#                 product = Product(
#                     sku=sku, quantity=quantity, store=store_id, created_by=created_by, **fields,
#                 ).save()
#                 if quantity is not None:
#                     StockTransaction(
#                         product=product, store=store_id,
#                         transaction_type=StockTransactionType.OPENING.value,
#                         quantity=quantity, notes="Bulk import opening stock",
#                         created_by=created_by,
#                     ).save()
#                 created += 1

#         except Exception as e:
#             errors.append(BulkImportRowError(row=row_num, error=str(e)))

#     return BulkImportResult(rows_found=len(df), created=created, updated=updated, errors=errors)

MAX_IMPORT_ROWS = 5000
REQUIRED_IMPORT_COLUMNS = {"name", "price"}


def _clean_str(value) -> str | None:
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None

    s = str(value).strip()
    return s or None


def _clean_float(value) -> float | None:
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None

    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _parse_import_file(filename: str, raw_bytes: bytes) -> pd.DataFrame:
    lower = filename.lower()

    try:
        if lower.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(raw_bytes))

        elif lower.endswith((".xlsx", ".xls")):
            df = pd.read_excel(io.BytesIO(raw_bytes))

        else:
            raise HTTPException(
                status_code=400,
                detail="Upload a .csv or .xlsx file",
            )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not read this file -- is it a valid CSV/Excel file?",
        )

    df.columns = df.columns.str.strip()

    missing = REQUIRED_IMPORT_COLUMNS - set(df.columns)

    if missing:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Missing required column(s): "
                f"{', '.join(sorted(missing))}. "
                "Download the template and match its headers exactly."
            ),
        )

    if len(df) > MAX_IMPORT_ROWS:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Too many rows ({len(df)}) -- "
                f"split into files of {MAX_IMPORT_ROWS} or fewer"
            ),
        )

    return df


def bulk_import_products(
    filename: str,
    raw_bytes: bytes,
    store_id: str,
    created_by: str,
) -> BulkImportResult:

    df = _parse_import_file(filename, raw_bytes)

    created = 0
    updated = 0
    errors: list[BulkImportRowError] = []

    for idx, row in df.iterrows():

        row_num = idx + 2  # +1 for 0-index, +1 for header row

        try:
            # ---------------------------------------------------------
            # 1. Basic product fields
            # ---------------------------------------------------------

            name = _clean_str(row.get("name"))

            if not name:
                raise ValueError("Name is required")

            price = _clean_float(row.get("price"))

            if price is None or price <= 0:
                raise ValueError("Price must be a number greater than 0")

            sku = _clean_str(row.get("sku"))

            # ---------------------------------------------------------
            # 2. Category and Brand
            # ---------------------------------------------------------
            # These are still stored as strings on Product.
            #
            # We ALSO make sure the corresponding Category and Brand
            # master records exist.
            # ---------------------------------------------------------

            category_name = _clean_str(row.get("category"))
            brand_name = _clean_str(row.get("brand"))

            # Create/reuse/reactivate Category
            if category_name:
                get_or_create_category(
                    name=category_name,
                    store_id=store_id,
                    created_by=created_by,
                )

            # Create/reuse/reactivate Brand
            if brand_name:
                get_or_create_brand(
                    name=brand_name,
                    store_id=store_id,
                    created_by=created_by,
                )

            # ---------------------------------------------------------
            # 3. Product fields
            # ---------------------------------------------------------

            fields = dict(
                name=name,
                price=price,
                barcode=_clean_str(row.get("barcode")),
                category=category_name,
                brand=brand_name,
                purchase_price=_clean_float(
                    row.get("purchase_price")
                ),
                mrp=_clean_float(
                    row.get("mrp")
                ),
                gst_pct=_clean_float(
                    row.get("gst_pct")
                ) or 0,
                min_stock=_clean_float(
                    row.get("min_stock")
                ) or 0,
            )

            quantity = _clean_float(row.get("quantity"))

            # ---------------------------------------------------------
            # 4. Check whether product already exists
            # ---------------------------------------------------------

            existing = (
                Product.objects(
                    store=store_id,
                    sku=sku,
                    is_active=True,
                ).first()
                if sku
                else None
            )

            # ---------------------------------------------------------
            # 5. Update existing product
            # ---------------------------------------------------------

            if existing:

                for key, value in fields.items():
                    setattr(existing, key, value)

                # Deliberately do NOT update quantity here.
                #
                # Quantity is managed through stock transactions.
                # This preserves your existing behavior.

                existing.save()

                updated += 1

            # ---------------------------------------------------------
            # 6. Create new product
            # ---------------------------------------------------------

            else:

                product = Product(
                    sku=sku,
                    quantity=quantity,
                    store=store_id,
                    created_by=created_by,
                    **fields,
                ).save()

                # -----------------------------------------------------
                # 7. Opening stock transaction
                # -----------------------------------------------------

                if quantity is not None:

                    StockTransaction(
                        product=product,
                        store=store_id,
                        transaction_type=(
                            StockTransactionType.OPENING.value
                        ),
                        quantity=quantity,
                        notes="Bulk import opening stock",
                        created_by=created_by,
                    ).save()

                created += 1

        except Exception as e:

            errors.append(
                BulkImportRowError(
                    row=row_num,
                    error=str(e),
                )
            )

    # -------------------------------------------------------------
    # 8. Return import result
    # -------------------------------------------------------------

    return BulkImportResult(
        rows_found=len(df),
        created=created,
        updated=updated,
        errors=errors,
    )