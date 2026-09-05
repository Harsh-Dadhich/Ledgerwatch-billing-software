// TEMPORARY MOCK DATA -- this new billing screen is a static UI preview.
// Once wired to the real backend, swap these imports for productsApi
// calls (see src/api/products.js) inside NewBilling.jsx -- the rest of
// the UI doesn't need to change.

export const mockBillingCategories = ["All", "Beverages", "Snacks", "Dairy", "Grocery", "Personal Care", "Others"];

export const mockBillingProducts = [
  { id: "1", name: "Coca Cola 750ml", variant: "750 ml", sku: "CC750", barcode: "8901234567890", category: "Beverages", price: 40, stock: 45 },
  { id: "2", name: "Pepsi 750ml", variant: "750 ml", sku: "PP750", barcode: "8901234567891", category: "Beverages", price: 40, stock: 32 },
  { id: "3", name: "Lays Classic", variant: "52g", sku: "LM50", barcode: "8901234567892", category: "Snacks", price: 20, stock: 18 },
  { id: "4", name: "Amul Milk 500ml", variant: "500 ml", sku: "AM500", barcode: "8901234567893", category: "Dairy", price: 32, stock: 7 },
  { id: "5", name: "Dairy Milk 60g", variant: "60 g", sku: "DM60", barcode: "8901234567894", category: "Snacks", price: 25, stock: 25 },
];

export const mockBillingTotalProductCount = 1250;
