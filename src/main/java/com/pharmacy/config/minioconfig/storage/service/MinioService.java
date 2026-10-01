package com.pharmacy.config.minioconfig.storage.service;

import org.springframework.web.multipart.MultipartFile;

public interface MinioService {

    /**
     * Uploads a file to MinIO.
     *
     * @param file Multipart file
     * @param folder Folder inside the bucket
     * @return Object name stored in MinIO
     */
    String uploadFile(MultipartFile file, String folder);

    /**
     * Deletes a file from MinIO.
     */
    void deleteFile(String objectName);

    /**
     * Returns the URL of an object.
     */
    String getObjectUrl(String objectName);
}