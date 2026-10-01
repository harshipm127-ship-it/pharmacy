package com.pharmacy.auth.repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.otp.entity.OtpRequest;
import com.pharmacy.otp.enums.OtpStatus;


public interface OtpRequestRepository extends JpaRepository<OtpRequest, Long> {

    Optional<OtpRequest> findTopByPhoneNumberAndStatusOrderByCreatedAtDesc(
            String phoneNumber,
            OtpStatus status);

    Optional<OtpRequest> findTopByPhoneNumberOrderByCreatedAtDesc(
            String phoneNumber);

    List<OtpRequest> findByPhoneNumberAndStatus(
            String phoneNumber,
            OtpStatus status);

    List<OtpRequest> findByExpiresAtBefore(LocalDateTime dateTime);

    void deleteByExpiresAtBefore(LocalDateTime dateTime);

    long countByPhoneNumberAndCreatedAtAfter(
            String phoneNumber,
            LocalDateTime dateTime);
}