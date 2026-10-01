CREATE TABLE inventory_batches (

    id UUID PRIMARY KEY,

    public_id UUID NOT NULL UNIQUE,

    inventory_id UUID NOT NULL,

    batch_number VARCHAR(100) NOT NULL,

    manufacturing_date DATE,

    expiry_date DATE NOT NULL,

    purchase_price NUMERIC(10,2) NOT NULL,

    mrp NUMERIC(10,2) NOT NULL,

    selling_price NUMERIC(10,2) NOT NULL,

    received_quantity INTEGER NOT NULL,

    available_quantity INTEGER NOT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_inventory_batch_inventory
        FOREIGN KEY (inventory_id)
        REFERENCES inventory(id)
        ON DELETE RESTRICT,

    CONSTRAINT uk_inventory_batch_number
        UNIQUE (inventory_id, batch_number)
);