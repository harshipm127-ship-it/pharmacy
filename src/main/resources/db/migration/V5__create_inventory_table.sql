CREATE TABLE inventory (

    id UUID PRIMARY KEY,

    public_id UUID NOT NULL UNIQUE,

    product_id UUID NOT NULL,

    store_id UUID NOT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_inventory_product
        FOREIGN KEY (product_id)
        REFERENCES products(id),

    CONSTRAINT fk_inventory_store
        FOREIGN KEY (store_id)
        REFERENCES stores(id),

    CONSTRAINT uk_inventory_product_store
        UNIQUE (product_id, store_id)
);