from fastapi import APIRouter, Depends, status

from app.auth.deps import (
    CurrentUser,
    get_current_user,
    require_admin,
)

from app.stock_transactions import service

from app.stock_transactions.payload import (
    CreateStockTransactionRequest,
    StockTransactionResponse,
)

router = APIRouter(
    prefix="/stock-transactions",
    tags=["stock-transactions"],
)


@router.post(
    "",
    response_model=StockTransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_stock_transaction(
    payload: CreateStockTransactionRequest,
    current_user: CurrentUser = Depends(
        require_admin
    ),
):
    transaction = service.create_stock_transaction(
        payload,
        current_user.store_id,
        current_user.user_id,
    )

    return service.to_stock_transaction_out(
        transaction
    )


@router.get(
    "/product/{product_id}",
    response_model=list[StockTransactionResponse],
)
def list_product_transactions(
    product_id: str,
    current_user: CurrentUser = Depends(
        get_current_user
    ),
):
    transactions = (
        service.list_product_transactions(
            product_id,
            current_user.store_id,
        )
    )

    return [
        service.to_stock_transaction_out(t)
        for t in transactions
    ]