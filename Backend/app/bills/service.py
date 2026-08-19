from bson import ObjectId
from fastapi import HTTPException, status


from app.products.service import restore_product_stock, decrement_product_stock
from app.bills.payload import BillCreatePayload, BillLineItemOut, BillOut
from app.core.cache import get_idempotent_result, set_idempotent_result
from app.core.logger import get_logger
from app.models.bill import Bill, BillLineItem
from app.models.product import Product
from app.models.user import Store, User
from app.core.time import to_ist_iso
from datetime import datetime, timezone

from fastapi import HTTPException, status

logger = get_logger(__name__)


def _generate_bill_number(store_id: str) -> str:
    """Atomically increments the store's counter and returns a sequential
    bill number, e.g. INV-000001, INV-000002, ...

    Store.objects(...).modify() maps to MongoDB's findAndModify, which is
    atomic on a single document -- two staff creating bills at the same
    instant will still get distinct, gap-free sequential numbers, with
    no separate locking needed.
    """
    store = Store.objects(id=store_id).modify(new=True, inc__bill_sequence=1)
    if store is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Store not found")
    return f"INV-{store.bill_sequence:06d}"


def to_bill_out(bill: Bill, salesperson_name: str) -> BillOut:
    return BillOut(
        id=str(bill.id),
        bill_number=bill.bill_number,
        salesperson_name=salesperson_name,
        items=[
            BillLineItemOut(
                product_id=str(item.product.id),
                name=item.name,
                unit_price=item.unit_price,
                quantity=item.quantity,
                discount_pct=item.discount_pct,
                line_total=item.line_total,
            )
            for item in bill.items
        ],
        subtotal=bill.subtotal,
        bill_discount_pct=bill.bill_discount_pct,
        grand_total=bill.grand_total,
        # created_at=bill.created_at.isoformat(),
        created_at=to_ist_iso(bill.created_at),
        is_voided=bill.is_voided,
    )


# def create_bill(payload: BillCreatePayload, store_id: str, salesperson_id: str) -> BillOut:
#     if payload.idempotency_key:
#         cached = get_idempotent_result(store_id, payload.idempotency_key)
#         if cached is not None:
#             logger.info("Idempotent bill replay: store=%s key=%s", store_id, payload.idempotency_key)
#             return BillOut(**cached)

#     line_items: list[BillLineItem] = []
#     subtotal = 0.0

#     decremented: list[tuple[str, float]] = []

#     decremented: list[tuple[str, float]] = []

#     try:

#         for requested_item in payload.items:

#             product = Product.objects(
#                 id=requested_item.product_id,
#                 store=store_id,
#                 is_active=True,
#             ).first()

#             if product is None:
#                 raise HTTPException(
#                     status_code=status.HTTP_404_NOT_FOUND,
#                     detail=f"Product {requested_item.product_id} not found",
#                 )

#             decrement_product_stock(
#                 str(product.id),
#                 store_id,
#                 requested_item.quantity,
#             )

#             if product.quantity is not None:
#                 decremented.append(
#                     (
#                         str(product.id),
#                         requested_item.quantity,
#                     )
#                 )

#             effective_price = (
#                 requested_item.unit_price
#                 if requested_item.unit_price is not None
#                 else product.price
#             )

#             line_total = round(
#                 effective_price
#                 * requested_item.quantity
#                 * (1 - requested_item.discount_pct / 100),
#                 2,
#             )

#             subtotal += line_total

#             line_items.append(
#                 BillLineItem(
#                     product=product,
#                     name=product.name,
#                     unit_price=effective_price,
#                     quantity=requested_item.quantity,
#                     discount_pct=requested_item.discount_pct,
#                     line_total=line_total,
#                 )
#             )

#     except HTTPException:

#         for pid, qty in decremented:
#             restore_product_stock(
#                 pid,
#                 store_id,
#                 qty,
#             )

#         raise
#     # for requested_item in payload.items:
#     #     product = Product.objects(
#     #         id=requested_item.product_id, store=store_id, is_active=True
#     #     ).first()
#     #     if product is None:
#     #         raise HTTPException(
#     #             status_code=status.HTTP_404_NOT_FOUND,
#     #             detail=f"Product {requested_item.product_id} not found",
#     #         )

#     #     # A staff member can override the catalogue price at the counter
#     #     # (e.g. a negotiated price); falls back to the catalogue price
#     #     # if not supplied. Either way it's snapshotted onto the bill.
#     #     effective_price = (
#     #         requested_item.unit_price if requested_item.unit_price is not None else product.price
#     #     )

#     #     line_total = round(
#     #         effective_price * requested_item.quantity * (1 - requested_item.discount_pct / 100),
#     #         2,
#     #     )
#     #     subtotal += line_total

#     #     line_items.append(
#     #         BillLineItem(
#     #             product=product,
#     #             name=product.name,
#     #             unit_price=effective_price,
#     #             quantity=requested_item.quantity,
#     #             discount_pct=requested_item.discount_pct,
#     #             line_total=line_total,
#     #         )
#     #     )

#     # subtotal = round(subtotal, 2)
#     # grand_total = round(subtotal * (1 - payload.bill_discount_pct / 100), 2)

#     # bill = Bill(
#     #     bill_number=_generate_bill_number(store_id),
#     #     store=store_id,
#     #     salesperson=salesperson_id,
#     #     items=line_items,
#     #     subtotal=subtotal,
#     #     bill_discount_pct=payload.bill_discount_pct,
#     #     grand_total=grand_total,
#     # ).save()
#     # update_product_quantity(line_items, store_id)

#     salesperson = User.objects(id=salesperson_id).only("name").first()
#     bill_out = to_bill_out(bill, salesperson.name if salesperson else "Unknown")

#     if payload.idempotency_key:
#         set_idempotent_result(store_id, payload.idempotency_key, bill_out.model_dump())

#     logger.info("Bill created: store=%s bill=%s total=%s", store_id, bill.bill_number, grand_total)
#     return bill_out

def create_bill(payload: BillCreatePayload, store_id: str, salesperson_id: str) -> BillOut:
    if payload.idempotency_key:
        cached = get_idempotent_result(store_id, payload.idempotency_key)
        if cached is not None:
            logger.info("Idempotent bill replay: store=%s key=%s", store_id, payload.idempotency_key)
            return BillOut(**cached)

    line_items: list[BillLineItem] = []
    subtotal = 0.0
    decremented: list[tuple[str, float]] = []  # for rollback if a later item fails

    try:
        for requested_item in payload.items:
            product = Product.objects(
                id=requested_item.product_id, store=store_id, is_active=True
            ).first()
            if product is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product {requested_item.product_id} not found",
                )

            effective_price = (
                requested_item.unit_price if requested_item.unit_price is not None else product.price
            )
            line_total = round(
                effective_price * requested_item.quantity * (1 - requested_item.discount_pct / 100),
                2,
            )
            subtotal += line_total

            # Atomic check + decrement -- raises 409 here if stock is insufficient.

                # THIS CHECK is what's likely missing or misplaced in your version --
    # decrement_product_stock must only be called when quantity is a
        # real number, never when it's None (untracked).
            if product.quantity is not None:
                decrement_product_stock(requested_item.product_id, store_id, requested_item.quantity)
                decremented.append((requested_item.product_id, requested_item.quantity))
                # decrement_product_stock(requested_item.product_id, store_id, requested_item.quantity)
                # decremented.append((requested_item.product_id, requested_item.quantity))

            line_items.append(
                BillLineItem(
                    product=product,
                    name=product.name,
                    unit_price=effective_price,
                    quantity=requested_item.quantity,
                    discount_pct=requested_item.discount_pct,
                    line_total=line_total,
                )
            )
    except HTTPException:
        # A later product failed (not found / out of stock) -- undo any
        # stock already decremented earlier in this same bill attempt,
        # so a failed bill never leaves inventory in a half-updated state.
        for pid, qty in decremented:
            restore_product_stock(pid, store_id, qty)
        raise

    subtotal = round(subtotal, 2)
    grand_total = round(subtotal * (1 - payload.bill_discount_pct / 100), 2)

    bill = Bill(
        bill_number=_generate_bill_number(store_id),
        store=store_id,
        salesperson=salesperson_id,
        items=line_items,
        subtotal=subtotal,
        bill_discount_pct=payload.bill_discount_pct,
        grand_total=grand_total,
    ).save()

    salesperson = User.objects(id=salesperson_id).only("name").first()
    bill_out = to_bill_out(bill, salesperson.name if salesperson else "Unknown")

    if payload.idempotency_key:
        set_idempotent_result(store_id, payload.idempotency_key, bill_out.model_dump())

    logger.info("Bill created: store=%s bill=%s total=%s", store_id, bill.bill_number, grand_total)
    return bill_out

def list_bills(store_id: str, limit: int, skip: int,page: int = 1,
        page_size: int = 10,) -> list[tuple[Bill, str]]:
    """Returns (bill, salesperson_name) pairs.

    Batches the salesperson lookup into a single query instead of one
    query per bill -- listing 50 bills used to mean 51 DB round-trips.
    """
    bills = list(
        Bill.objects(store=store_id, is_voided=False)
        .order_by("-created_at")
        .skip(skip)
        # .skip((page - 1) * page_size)
        .limit(min(limit, 200))
    )

    salesperson_ids = {bill.salesperson.id for bill in bills}
    salespeople = {
        str(u.id): u.name for u in User.objects(id__in=list(salesperson_ids)).only("id", "name")
    }

    return [
        (bill, salespeople.get(str(bill.salesperson.id), "Unknown"))
        for bill in bills
    ]


def get_bill(bill_id: str, store_id: str) -> tuple[Bill, str]:
    bill = Bill.objects(id=bill_id, store=store_id).first()
    if bill is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found")
    salesperson = User.objects(id=bill.salesperson.id).only("name").first()
    return bill, (salesperson.name if salesperson else "Unknown")

def void_bill(bill_id: str, store_id: str, voided_by_user_id: str) -> BillOut:
    """Marks a bill as voided instead of deleting it. Used for mistaken
    entries or a customer changing their mind -- the record stays in the
    database (matters for GST/audit records) but is excluded from sales
    lists and totals going forward.
    """
    bill = Bill.objects(id=bill_id, store=store_id).first()
    if bill is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found")

    if bill.is_voided:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Bill is already voided")

    bill.is_voided = True
    bill.voided_at = datetime.now(timezone.utc)
    # bill.voided_by = voided_by_user_id
    bill.voided_by = ObjectId(voided_by_user_id)
    bill.save()

    logger.info("Bill voided: store=%s bill=%s by=%s", store_id, bill.bill_number, voided_by_user_id)

    salesperson = User.objects(id=bill.salesperson.id).only("name").first()
    return to_bill_out(bill, salesperson.name if salesperson else "Unknown")