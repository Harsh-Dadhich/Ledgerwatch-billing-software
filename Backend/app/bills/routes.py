from fastapi import APIRouter, Depends, status

from app.auth.deps import CurrentUser, get_current_user, require_admin
from app.bills import service
from app.bills.payload import BillCreatePayload, BillOut

router = APIRouter(prefix="/bills", tags=["bills"])


@router.post("", response_model=BillOut, status_code=status.HTTP_201_CREATED)
def create_bill(payload: BillCreatePayload, current_user: CurrentUser = Depends(get_current_user)):
    return service.create_bill(payload, current_user.store_id, current_user.user_id)


@router.get("", response_model=list[BillOut])
def list_bills(
    limit: int = 50,
    skip: int = 0,
    current_user: CurrentUser = Depends(get_current_user),
):
    bills_with_names = service.list_bills(current_user.store_id, limit, skip)
    return [service.to_bill_out(bill, name) for bill, name in bills_with_names]


@router.get("/{bill_id}", response_model=BillOut)
def get_bill(bill_id: str, current_user: CurrentUser = Depends(get_current_user)):
    bill, salesperson_name = service.get_bill(bill_id, current_user.store_id)
    return service.to_bill_out(bill, salesperson_name)

@router.delete("/{bill_id}", response_model=BillOut)
def void_bill(bill_id: str, current_user: CurrentUser = Depends(require_admin)):
    return service.void_bill(bill_id, current_user.store_id, current_user.user_id)
