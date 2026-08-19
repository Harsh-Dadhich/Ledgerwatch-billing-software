# from datetime import datetime, timezone

# from bson import ObjectId

# from app.models.bill import Bill


# def get_summary(store_id: str) -> dict:
#     now = datetime.now(timezone.utc)
#     start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)

#     pipeline = [
#         {
#             "$match": {
#                 "store": ObjectId(store_id),
#                 "created_at": {"$gte": start_of_day},
#             }
#         },
#         {
#             "$group": {
#                 "_id": None,
#                 "total_sales": {"$sum": "$grand_total"},
#                 "order_count": {"$sum": 1},
#             }
#         },
#     ]
#     result = list(Bill.objects.aggregate(pipeline))

#     if not result:
#         return {"total_sales": 0, "order_count": 0, "avg_ticket": 0}

#     total_sales = result[0]["total_sales"]
#     order_count = result[0]["order_count"]
#     avg_ticket = round(total_sales / order_count, 2) if order_count else 0

#     return {
#         "total_sales": round(total_sales, 2),
#         "order_count": order_count,
#         "avg_ticket": avg_ticket,
#     }


# def get_recent_activity(store_id: str, limit: int) -> list[dict]:
#     bills = (
#         Bill.objects(store=store_id)
#         .order_by("-created_at")
#         .only("bill_number", "grand_total", "created_at")
#         .limit(min(limit, 50))
#     )
#     return [
#         {
#             "bill_number": b.bill_number,
#             "grand_total": b.grand_total,
#             "created_at": b.created_at.isoformat(),
#         }
#         for b in bills
#     ]

from bson import ObjectId

from app.core.time import start_of_ist_day_utc, to_ist_iso
from app.models.bill import Bill


def get_summary(store_id: str) -> dict:
    start_of_day = start_of_ist_day_utc()

    pipeline = [
        {
            "$match": {
                "store": ObjectId(store_id),
                "created_at": {"$gte": start_of_day},
                "is_voided": False,
            }
        },
        {
            "$group": {
                "_id": None,
                "total_sales": {"$sum": "$grand_total"},
                "order_count": {"$sum": 1},
            }
        },
    ]
    result = list(Bill.objects.aggregate(pipeline))

    if not result:
        return {"total_sales": 0, "order_count": 0, "avg_ticket": 0}

    total_sales = result[0]["total_sales"]
    order_count = result[0]["order_count"]
    avg_ticket = round(total_sales / order_count, 2) if order_count else 0

    return {
        "total_sales": round(total_sales, 2),
        "order_count": order_count,
        "avg_ticket": avg_ticket,
    }


def get_recent_activity(store_id: str, limit: int) -> list[dict]:
    bills = (
        Bill.objects(store=store_id, is_voided=False)
        .order_by("-created_at")
        .only("bill_number", "grand_total", "created_at")
        .limit(min(limit, 50))
    )
    return [
        {
            "bill_number": b.bill_number,
            "grand_total": b.grand_total,
            "created_at": to_ist_iso(b.created_at),
        }
        for b in bills
    ]