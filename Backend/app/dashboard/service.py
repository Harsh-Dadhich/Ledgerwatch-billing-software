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
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo


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

IST_NAME = "Asia/Kolkata"
IST = ZoneInfo(IST_NAME)
 
 
def _window(days: int):
    """
    'Last N days' = today plus the previous N-1 days, from IST midnight.
    Returns (start as an IST datetime, start as naive UTC for Mongo queries).
    """
    now_ist = datetime.now(IST)
    start_ist = (now_ist - timedelta(days=days - 1)).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    start_utc = start_ist.astimezone(timezone.utc).replace(tzinfo=None)
    return start_ist, start_utc
 
 
def _match_stage(store_id: str, since_utc: datetime) -> dict:
    """
    Raw Mongo filter: this store's bills in the window, voided ones excluded.
    Built through MongoEngine so field names and reference types match the model.
    `is_voided__ne=True` also keeps bills created before the field existed.
    """
    return Bill.objects(
        store=store_id,  # <-- use the same field name as list_bills
        is_voided__ne=True,
        created_at__gte=since_utc,
    )._query
 
 
def _aggregate(pipeline: list):
    return Bill._get_collection().aggregate(pipeline)
 
 
def sales_trend(store_id: str, days: int) -> list[dict]:
    start_ist, since_utc = _window(days)
    rows = _aggregate(
        [
            {"$match": _match_stage(store_id, since_utc)},
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": "$created_at",
                            "timezone": IST_NAME,
                        }
                    },
                    "total": {"$sum": "$grand_total"},
                    "orders": {"$sum": 1},
                }
            },
        ]
    )
    by_day = {r["_id"]: r for r in rows}
 
    # Fill days with no bills so the line chart doesn't skip them.
    points = []
    for i in range(days):
        day = (start_ist + timedelta(days=i)).date().isoformat()
        row = by_day.get(day)
        points.append(
            {
                "date": day,
                "total": round(row["total"], 2) if row else 0.0,
                "orders": row["orders"] if row else 0,
            }
        )
    return points
 
 
def top_products(store_id: str, days: int, limit: int) -> list[dict]:
    _, since_utc = _window(days)
    rows = _aggregate(
        [
            {"$match": _match_stage(store_id, since_utc)},
            {"$unwind": "$items"},
            {
                "$group": {
                    "_id": "$items.product_id",
                    "name": {"$last": "$items.name"},
                    "units": {"$sum": "$items.quantity"},
                    "revenue": {"$sum": "$items.line_total"},
                }
            },
            {"$sort": {"units": -1, "revenue": -1}},
            {"$limit": limit},
        ]
    )
    return [
        {
            "product_id": str(r["_id"]),
            "name": r["name"],
            "units": r["units"],
            "revenue": round(r["revenue"], 2),
        }
        for r in rows
    ]
 
 
def payment_split(store_id: str, days: int) -> list[dict]:
    _, since_utc = _window(days)
    rows = _aggregate(
        [
            {"$match": _match_stage(store_id, since_utc)},
            {
                "$group": {
                    "_id": "$payment_method",
                    "total": {"$sum": "$grand_total"},
                    "count": {"$sum": 1},
                }
            },
            {"$sort": {"total": -1}},
        ]
    )
    return [
        {"method": r["_id"], "total": round(r["total"], 2), "count": r["count"]}
        for r in rows
    ]
 
 
def sales_by_hour(store_id: str, days: int) -> list[dict]:
    _, since_utc = _window(days)
    rows = _aggregate(
        [
            {"$match": _match_stage(store_id, since_utc)},
            {
                "$group": {
                    "_id": {"$hour": {"date": "$created_at", "timezone": IST_NAME}},
                    "total": {"$sum": "$grand_total"},
                    "orders": {"$sum": 1},
                }
            },
        ]
    )
    by_hour = {r["_id"]: r for r in rows}
    return [
        {
            "hour": h,
            "total": round(by_hour[h]["total"], 2) if h in by_hour else 0.0,
            "orders": by_hour[h]["orders"] if h in by_hour else 0,
        }
        for h in range(24)
    ]
 