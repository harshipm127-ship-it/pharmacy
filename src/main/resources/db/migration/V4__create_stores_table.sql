CREATE TABLE stores (
    id UUID PRIMARY KEY,

    public_id UUID NOT NULL UNIQUE,

    code VARCHAR(20) NOT NULL UNIQUE,

    name VARCHAR(100) NOT NULL,

    address_line_1 VARCHAR(255) NOT NULL,

    address_line_2 VARCHAR(255),

    landmark VARCHAR(150),

    area VARCHAR(100) NOT NULL,

    city VARCHAR(100) NOT NULL,

    state VARCHAR(100) NOT NULL,

    country VARCHAR(100) NOT NULL,

    postal_code VARCHAR(15) NOT NULL,

    phone_number VARCHAR(15),

    email VARCHAR(150),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL
);