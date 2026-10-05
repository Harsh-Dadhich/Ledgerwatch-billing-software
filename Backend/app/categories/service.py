from fastapi import HTTPException, status
# from bson import ObjectId
import logging
 
from bson import DBRef, ObjectId
from mongoengine import ReferenceField
 
from app.models.bill import Bill
 
from app.models.product import Product  # <-- adjust to your Product model path
from app.models.category import Category
from app.dashboard.service import _window, _match_stage, _aggregate

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

def _oid(value):
    """Bill items may hold the product as an ObjectId, a str or a DBRef; normalise to ObjectId."""
    if isinstance(value, DBRef):
        value = value.id
    if isinstance(value, ObjectId):
        return value
    try:
        return ObjectId(str(value))
    except Exception:
        return None
 
 
logger = logging.getLogger(__name__)
 
 
def _item_product_expr():
    """
    Mongo expression for "the product this bill item points at".
 
    The key is read from the Bill model itself (db_field included), so it works however
    the item stores the product: product_id, product, or a custom db_field. If items are
    plain dicts (no model), it falls back to product_id / product.
    """
    names = []
    try:
        item_cls = Bill._fields["items"].field.document_type
        for name, f in item_cls._fields.items():
            is_product_ref = isinstance(f, ReferenceField) and f.document_type is Product
            if "product" in name.lower() or is_product_ref:
                names.append(f.db_field or name)
    except Exception:
        pass
    names = list(dict.fromkeys(names + ["product_id", "product"]))
 
    expr = None
    for key in reversed(names):
        expr = f"$items.{key}" if expr is None else {"$ifNull": [f"$items.{key}", expr]}
    return expr
 
 
def _entity_analytics(store_id, days: int, field: str, master_cls, fallback_label: str):
    """
    One row per master record (category/brand), merged from:
      - stock side: active products grouped by `field`
      - sales side: non-voided bill items in the window, mapped to their product's `field`
 
    `field` on Product may be stored as a plain name or as a reference (ObjectId);
    both are resolved to the master record's name. Master records with no products
    or sales still appear, so a newly added category shows up straight away.
    """
    _, since_utc = _window(days)
 
    # All records, including soft-deleted ones, so a product that still points at a
    # deleted category resolves to its name instead of showing a raw id.
    masters = list(master_cls.objects(store=store_id))
    id_to_name = {str(m.id): m.name for m in masters}
 
    def blank(name, mid=None):
        return {
            "id": mid, "name": name, "products": 0, "stock": 0.0,
            "low_stock": 0, "units": 0.0, "revenue": 0.0,
        }
 
    # Only active records get a row up front (same as list_categories). A deleted one
    # shows up only if active products or sales still reference it.
    rows = {
        m.name: blank(m.name, str(m.id))
        for m in masters
        if getattr(m, "is_active", True)
    }
 
    def row_for(raw):
        name = fallback_label if raw in (None, "") else id_to_name.get(str(raw), str(raw))
        if name not in rows:
            rows[name] = blank(name)
        return rows[name]
 
    # ---- stock side ----
    stock_rows = Product._get_collection().aggregate(
        [
            {"$match": Product.objects(store=store_id, is_active=True)._query},
            {
                "$group": {
                    "_id": f"${field}",
                    "products": {"$sum": 1},
                    "stock": {"$sum": {"$ifNull": ["$quantity", 0]}},
                    # $gt vs null is true only for real numbers (untracked products are skipped)
                    "low_stock": {
                        "$sum": {
                            "$cond": [
                                {"$and": [
                                    {"$gt": ["$quantity", None]},
                                    {"$lte": ["$quantity", "$min_stock"]},
                                ]},
                                1,
                                0,
                            ]
                        }
                    },
                }
            },
        ]
    )
    for r in stock_rows:
        row = row_for(r["_id"])
        row["products"] += r["products"]
        row["stock"] += r["stock"]
        row["low_stock"] += r["low_stock"]
 
    # ---- sales side: total per product first, then map product -> category/brand ----
    sold = list(
        _aggregate(
            [
                {"$match": _match_stage(store_id, since_utc)},
                {"$unwind": "$items"},
                {
                    "$group": {
                        "_id": _item_product_expr(),
                        "units": {"$sum": "$items.quantity"},
                        "revenue": {"$sum": "$items.line_total"},
                    }
                },
            ]
        )
    )
    oids = [o for o in (_oid(s["_id"]) for s in sold) if o is not None]
    # Raw read (no ReferenceField dereferencing), so no extra query per product.
    raw_by_product = {
        str(p["_id"]): p.get(field)
        for p in Product._get_collection().find({"_id": {"$in": oids}}, {field: 1})
    }
    unmatched, first_bad = 0, None
    for s in sold:
        oid = _oid(s["_id"])
        if oid is None or str(oid) not in raw_by_product:
            unmatched += 1
            first_bad = s["_id"] if first_bad is None else first_bad
        row = row_for(raw_by_product.get(str(oid)) if oid is not None else None)
        row["units"] += s["units"]
        row["revenue"] += s["revenue"]
    if unmatched:
        logger.warning(
            "analytics(%s): %d of %d sold products could not be matched to a product "
            "(first unmatched key: %r). If this is every product, the bill-item product "
            "key is not what the Bill model says.",
            field, unmatched, len(sold), first_bad,
        )
 
    return [
        {**r, "stock": round(r["stock"], 2), "units": round(r["units"], 2),
         "revenue": round(r["revenue"], 2)}
        for r in rows.values()
    ]
 
 
def category_analytics(store_id, days: int):
    return _entity_analytics(store_id, days, "category", Category, "Uncategorized")
 

    return category