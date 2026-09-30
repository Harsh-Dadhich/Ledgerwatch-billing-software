from fastapi import HTTPException, status

from app.models.product import Product
from app.models.stock_transaction import StockTransaction

from app.stock_transactions.payload import (
    CreateStockTransactionRequest,
    StockTransactionResponse,
)

from app.core.logger import get_logger
from app.core.enums import StockTransactionType

logger = get_logger(__name__)

def to_stock_transaction_out(
    transaction: StockTransaction,
) -> StockTransactionResponse:

    return StockTransactionResponse(
        id=str(transaction.id),
        product_id=str(transaction.product.id),
        transaction_type=transaction.transaction_type,
        quantity=transaction.quantity,
        notes=transaction.notes,
        created_at=transaction.created_at,
    )

def create_stock_transaction(
    payload: CreateStockTransactionRequest,
    store_id: str,
    created_by: str,
) -> StockTransaction:

    product = Product.objects(
        id=payload.product_id,
        store=store_id,
        is_active=True,
    ).first()

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    # qty = payload.quantity

    # if payload.transaction_type == StockTransactionType.OPENING:
    #     product.quantity = qty

    # elif payload.transaction_type == StockTransactionType.PURCHASE:
    #     product.quantity = (product.quantity or 0) + qty

    # elif payload.transaction_type == StockTransactionType.SALE:

    #     current_stock = product.quantity or 0

    #     if current_stock < qty:
    #         raise HTTPException(
    #             status_code=status.HTTP_409_CONFLICT,
    #             detail=(
    #                 f"Not enough stock for {product.name}"
    #             ),
    #         )

    #     product.quantity = current_stock - qty

    # elif payload.transaction_type == StockTransactionType.DAMAGE:

    #     current_stock = product.quantity or 0

    #     if current_stock < qty:
    #         raise HTTPException(
    #             status_code=status.HTTP_409_CONFLICT,
    #             detail=(
    #                 f"Not enough stock for {product.name}"
    #             ),
    #         )

    #     product.quantity = current_stock - qty
    qty = payload.quantity
    ttype = payload.transaction_type

    if ttype == StockTransactionType.OPENING:

        product.quantity = qty
        product.save()

    elif ttype == StockTransactionType.ADJUSTMENT:

        product.quantity = qty
        product.save()

    elif ttype == StockTransactionType.PURCHASE:

        product = Product.objects(
            id=product.id,
            store=store_id,
        ).modify(
            new=True,
            inc__quantity=qty,
        )

    elif ttype in (
        StockTransactionType.SALE,
        StockTransactionType.DAMAGE,
    ):

    # Inventory not tracked
        if product.quantity is None:

            pass

        else:

            product = Product.objects(
                id=product.id,
                store=store_id,
                quantity__gte=qty,
            ).modify(
                new=True,
                dec__quantity=qty,
            )

            if product is None:

                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Not enough stock",
                )

        # elif payload.transaction_type == StockTransactionType.ADJUSTMENT:

        #     product.quantity = qty

    # product.save()

    transaction = StockTransaction(
        product=product,
        store=store_id,
        transaction_type=payload.transaction_type.value,
        quantity=qty,
        notes=payload.notes,
        created_by=created_by,
    ).save()

    logger.info(
        "Stock transaction created: "
        "store=%s product=%s type=%s qty=%s",
        store_id,
        product.id,
        payload.transaction_type.value,
        qty,
    )

    return transaction

def list_product_transactions(
    product_id: str,
    store_id: str,
) -> list[StockTransaction]:

    return (
        StockTransaction.objects(
            product=product_id,
            store=store_id,
        )
        .order_by("-created_at")
    )