-- V1 already creates this table for new installations. Keep this migration safe
-- for databases created from the full migration history.
CREATE TABLE IF NOT EXISTS user_credentials(
    id BIGSERIAL PRIMARY KEY,
    
    public_id UUID NOT NULL UNIQUE,

    user_id BIGINT NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_user_credentials_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
