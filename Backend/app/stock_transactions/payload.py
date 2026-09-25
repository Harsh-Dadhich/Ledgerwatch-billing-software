from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.core.enums import StockTransactionType


class CreateStockTransactionRequest(BaseModel):
    product_id: str
    transaction_type: StockTransactionType
    quantity: float
    notes: Optional[str] = None

class StockTransactionResponse(BaseModel):
    id: str
    product_id: str
    transaction_type: str
    quantity: float
    notes: Optional[str] = None
    created_at: datetime