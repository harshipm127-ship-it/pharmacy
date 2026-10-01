package com.pharmacy.config.minioconfig;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import io.minio.BucketExistsArgs;
import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class MinioConnectionTest implements CommandLineRunner{

    private final MinioClient minioClient;

    @Override
    public void run(String... args) throws Exception {

        boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder()
                        .bucket("pharmacy-products")
                        .build());

  System.out.println("===============================");
        System.out.println("MinIO Bucket Exists : " + exists);
        System.out.println("===============================");    }
    
}
