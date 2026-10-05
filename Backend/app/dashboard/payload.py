from pydantic import BaseModel
 
 
class SalesTrendPoint(BaseModel):
    date: str  # "2026-10-03" (IST calendar day)
    total: float
    orders: int
 
 
class TopProductRow(BaseModel):
    product_id: str
    name: str
    units: float
    revenue: float
 
 
class PaymentSplitRow(BaseModel):
    method: str  # "cash" | "online" | "due"
    total: float
    count: int
 
 
class HourRow(BaseModel):
    hour: int  # 0-23, IST
    total: float
    orders: int
