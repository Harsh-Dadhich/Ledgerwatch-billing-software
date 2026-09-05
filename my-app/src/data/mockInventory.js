// TEMPORARY MOCK DATA -- this whole file goes away once the inventory
// backend/API exists. Every page in pages/inventory/ imports from here
// instead of calling a real endpoint, so swapping to real data later
// means changing imports in those files, not rewriting the UI.

export const mockInventorySummary = {
  totalProducts: 1245,
  totalStockValue: 1254300,
  lowStockCount: 28,
  categoryCount: 14,
};

export const mockLowStockAlerts = [
  { name: "Amul Milk", stock: 3, minStock: 10 },
  { name: "Lays Classic", stock: 5, minStock: 20 },
  { name: "Pepsi 750ml", stock: 2, minStock: 15 },
];

export const mockTopSelling = [
  { name: "Coca Cola 750ml", soldThisMonth: 1250 },
  { name: "Lays Magic Masala", soldThisMonth: 980 },
  { name: "Dairy Milk", soldThisMonth: 750 },
];

export const mockProducts = [
  { id: "1", name: "Coca Cola 750ml", sku: "CC750", category: "Beverages", stock: 45, sellPrice: 40, status: "Active" },
  { id: "2", name: "Pepsi 750ml", sku: "PP750", category: "Beverages", stock: 32, sellPrice: 40, status: "Active" },
  { id: "3", name: "Lays Magic Masala", sku: "LM50", category: "Snacks", stock: 18, sellPrice: 20, status: "Active" },
  { id: "4", name: "Amul Milk 500ml", sku: "AM500", category: "Dairy", stock: 7, sellPrice: 32, status: "Active" },
];

export const mockProductDetail = {
  name: "Coca Cola 750ml",
  sku: "CC750",
  barcode: "890123456789",
  brand: "Coca Cola",
  category: "Beverages",
  purchasePrice: 30,
  sellingPrice: 40,
  mrp: 45,
  gst: 18,
  currentStock: 42,
  minStock: 20,
  stockSummary: { opening: 20, purchases: 50, sales: -25, adjustments: -3 },
};

export const mockCategories = [
  { name: "Beverages", productCount: 145 },
  { name: "Snacks", productCount: 245 },
  { name: "Dairy", productCount: 89 },
  { name: "Grocery", productCount: 421 },
];

export const mockBrands = [
  { name: "Coca Cola", productCount: 25 },
  { name: "Pepsi", productCount: 18 },
  { name: "Amul", productCount: 45 },
  { name: "Britannia", productCount: 89 },
  { name: "Parle", productCount: 112 },
];

export const mockStockHistory = [
  { date: "01-Jul", type: "Opening", qty: 20, balance: 20 },
  { date: "05-Jul", type: "Purchase", qty: 50, balance: 70 },
  { date: "08-Jul", type: "Sale", qty: -10, balance: 60 },
  { date: "10-Jul", type: "Sale", qty: -5, balance: 55 },
  { date: "12-Jul", type: "Damage", qty: -3, balance: 52 },
  { date: "15-Jul", type: "Adjustment", qty: -10, balance: 42 },
];

export const mockLowStock = [
  { name: "Amul Milk", stock: 3, minStock: 10 },
  { name: "Pepsi 750ml", stock: 2, minStock: 15 },
  { name: "Lays Classic", stock: 5, minStock: 20 },
];

export const mockBulkImportPreview = {
  fileName: "Products.xlsx",
  detectedColumns: [
    { source: "Item Name", mapsTo: "Product Name" },
    { source: "Price", mapsTo: "Selling Price" },
    { source: "Cost", mapsTo: "Purchase Price" },
    { source: "Qty", mapsTo: "Opening Stock" },
    { source: "GST", mapsTo: "GST" },
  ],
  rowsFound: 5000,
  validRows: 4932,
  duplicates: 50,
  errors: 18,
};
