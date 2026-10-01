package com.pharmacy.config.minioconfig.storage.service;

import java.io.InputStream;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MinioServiceImpl implements MinioService {

@Value("${minio.bucket-name}")
private String bucketName;
    private final MinioClient minioClient;

@Override
public String uploadFile(MultipartFile file, String folder) {

    try (InputStream inputStream = file.getInputStream()) {

        String originalFileName = file.getOriginalFilename();

        String extension = "";

        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        String objectName = folder + "/" + UUID.randomUUID() + extension;

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .stream(inputStream, file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build());

        return objectName;
    } catch (Exception e) {
        throw new RuntimeException("Failed to upload file to MinIO", e);
    }
}@Override
public String getObjectUrl(String objectName) {
    try {
        return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .method(Method.GET)
                        .build());
    } catch (Exception e) {
        throw new RuntimeException("Failed to generate object URL", e);
    }
}

    @Override
    public void deleteFile(String objectName) {
        
        try{

             minioClient.removeObject(
                RemoveObjectArgs.builder()
                .bucket(bucketName)
                .object(objectName)
                .build());
        }catch(Exception e){
            throw new RuntimeException("Failed to delete file from MinIO", e);
        }
    }
}
