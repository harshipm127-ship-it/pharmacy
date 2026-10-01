ALTER TABLE product_images
ADD COLUMN public_id UUID;

UPDATE product_images
SET public_id = gen_random_uuid();

ALTER TABLE product_images
ALTER COLUMN public_id SET NOT NULL;

ALTER TABLE product_images
ADD CONSTRAINT uk_product_images_public_id UNIQUE(public_id);