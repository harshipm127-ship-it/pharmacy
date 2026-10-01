-- ==========================================================
-- Catalog Module
-- Department -> Category -> SubCategory
-- ==========================================================

-- ==========================================================
-- Departments
-- ==========================================================
CREATE TABLE departments (

    id UUID PRIMARY KEY,

    public_id UUID NOT NULL UNIQUE,

    name VARCHAR(100) NOT NULL,

    description VARCHAR(500),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT uk_department_name
        UNIQUE (name)
);

-- ==========================================================
-- Categories
-- ==========================================================
CREATE TABLE categories (

    id UUID PRIMARY KEY,

    public_id UUID NOT NULL UNIQUE,

    department_id UUID NOT NULL,

    name VARCHAR(100) NOT NULL,

    description VARCHAR(500),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_category_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE RESTRICT,

    CONSTRAINT uk_department_category_name
        UNIQUE (department_id, name)
);

-- ==========================================================
-- Sub Categories
-- ==========================================================
CREATE TABLE sub_categories (

    id UUID PRIMARY KEY,

    public_id UUID NOT NULL UNIQUE,

    category_id UUID NOT NULL,

    name VARCHAR(100) NOT NULL,

    description VARCHAR(500),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_subcategory_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT uk_category_subcategory_name
        UNIQUE (category_id, name)
);