package com.pharmacy.otp.entity;

import java.time.LocalDateTime;

import com.pharmacy.common.entity.BaseEntity;
import com.pharmacy.otp.enums.OtpStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "otp_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpRequest extends BaseEntity{

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(name = "phone_number", nullable = false, length = 15)
        private String phoneNumber;

        @Column(name = "otp", nullable = false, length = 6)
        private String otp;

        @Builder.Default
@Column(name = "attempts", nullable = false)
private Integer attempts = 0;

@Builder.Default
@Enumerated(EnumType.STRING)
@Column(name = "status", nullable = false)
private OtpStatus status = OtpStatus.PENDING;
        @Column(name = "expires_at", nullable = false)
        private LocalDateTime expiresAt;

        @Column(name = "last_sent_at", nullable = false)
        private LocalDateTime lastSentAt;
}
