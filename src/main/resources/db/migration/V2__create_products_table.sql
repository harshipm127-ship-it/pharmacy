CREATE TABLE products (
    id UUID PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    sku VARCHAR(50) NOT NULL UNIQUE,

    name VARCHAR(255) NOT NULL,

    short_description VARCHAR(500),

    description TEXT,

    mrp NUMERIC(10,2) NOT NULL,

    selling_price NUMERIC(10,2) NOT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL
);

-- Search by SKU
CREATE UNIQUE INDEX idx_products_sku
ON products(sku);

-- Search products by name
CREATE INDEX idx_products_name
ON products(name);

-- Filter active/inactive products
CREATE INDEX idx_products_active
ON products(active);

-- Sort by latest products
CREATE INDEX idx_products_created_at
ON products(created_at);

-- Filter active products ordered by creation date
CREATE INDEX idx_products_active_created
ON products(active, created_at DESC);