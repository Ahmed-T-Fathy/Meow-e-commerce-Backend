interface User {
    id?: string;
    username?: string;
    email?: string;
    phone?: string;
    role?: string;
    is_verified?: boolean;
}

interface Product {
    id?: string;
    name?: string;
    short_description?: string | null;
    description?: string;
    price?: string;
    after_discount_price?: string;
    created_at?: string;
    updated_at?: string;
}

interface ProductVariant {
    id?: string;
    size?: string;
    stock?: number;
    product?: Product;
}

interface InvoiceItem {
    quantity?: number;
    price?: string;
    product_variant?: ProductVariant;
}

interface Invoice {  
    status?: string;
    total_price?: number;
    beforeDiscount?: number;
    discount?: number;
    tax?: number;
    deliveryService?: number;
    user?: User;
    invoice_items?: InvoiceItem[];
}
