CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE roles
(
    id BIGSERIAL, 
    public_id UUID NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_roles PRIMARY KEY (id),
    CONSTRAINT uk_roles_name UNIQUE (name),
    CONSTRAINT uk_roles_public_id UNIQUE (public_id)
);

INSERT INTO roles (name, description)
VALUES
('ADMIN', 'System Administrator'),
('CUSTOMER', 'Customer'),
('PHARMACIST', 'Pharmacist'),
('DELIVERY_PARTNER', 'Delivery Partner');

COMMENT ON TABLE roles IS 'Stores application roles.';

CREATE TYPE user_status AS ENUM
(
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'BLOCKED'
);

CREATE TABLE users
(
    id BIGSERIAL,
    public_id UUID NOT NULL DEFAULT gen_random_uuid(),
    role_id BIGINT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    profile_image_url VARCHAR(500),
    email VARCHAR(150),
    phone_number VARCHAR(20) NOT NULL,
    status user_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_public_id UNIQUE (public_id),
    CONSTRAINT uk_users_phone_number UNIQUE (phone_number),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT
);
CREATE INDEX idx_users_role_id ON users (role_id);
CREATE TYPE login_type AS ENUM ('OTP', 'PASSWORD');

CREATE TABLE user_credentials(
     id BIGSERIAL,
    public_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id BIGINT NOT NULL,
    login_type login_type NOT NULL,
    password_hash VARCHAR(255),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_user_credentials PRIMARY KEY (id),
    CONSTRAINT uk_user_credentials_public_id UNIQUE (public_id),
    constraint uk_user_credentials_user_id UNIQUE (user_id),
    CONSTRAINT fk_user_credentials_user

        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
CREATE INDEX idx_user_credentials_user_id 
ON user_credentials (user_id);
CREATE TABLE customer_addresses
(
    id BIGSERIAL,
    public_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id BIGINT NOT NULL,

    recipient_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    address_type VARCHAR(50) NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    landmark VARCHAR(255),

    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),

    is_default BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_customer_addresses PRIMARY KEY (id),
    CONSTRAINT uk_customer_addresses_public_id UNIQUE (public_id),

    CONSTRAINT fk_customer_addresses_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

COMMENT ON TABLE customer_addresses IS
'Stores customer delivery addresses.';

CREATE INDEX idx_customer_addresses_user_id
ON customer_addresses(user_id);

CREATE INDEX idx_customer_addresses_postal_code
ON customer_addresses(postal_code);


CREATE TABLE otp_requests(

    id BIgSERIAL,
    public_id UUID NOT NULL DEFAULT gen_random_uuid(),
    phone_number VARCHAR(15) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    last_sent_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_otp_requests PRIMARY KEY (id),
    CONSTRAINT uk_otp_requests_public_id UNIQUE (public_id)
);

    CREATE INDEX idx_otp_requests_phone_number ON otp_requests (phone_number);

    CREATE INDEX idx_otp_requests_status ON otp_requests (status);

    CREATE INDEX idx_otp_requests_expires_at ON otp_requests (expires_at);

