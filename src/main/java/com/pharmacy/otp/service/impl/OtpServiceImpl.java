package com.pharmacy.otp.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.pharmacy.auth.repository.OtpRequestRepository;
import com.pharmacy.customer.repository.UserRepository;
import com.pharmacy.notification.sms.SmsService;
import com.pharmacy.otp.constant.OtpConstants;
import com.pharmacy.otp.entity.OtpRequest;
import com.pharmacy.otp.enums.OtpStatus;
import com.pharmacy.otp.service.OtpService;
import com.pharmacy.otp.util.OtpGenrator;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OtpServiceImpl implements OtpService{

    private final OtpRequestRepository otpRequestRepository;

        private final SmsService smsService;

         private final OtpGenrator otpGenrator;

    @Override
    public void sendOtp(String phoneNumber) {
        // not implemented yet
        LocalDateTime fifteenMinutesAgo= LocalDateTime.now().minusMinutes(15);

        Long requestCount = otpRequestRepository.
        countByPhoneNumberAndCreatedAtAfter(phoneNumber, fifteenMinutesAgo);

        if(requestCount>=OtpConstants.MAX_REQUEST_PER_15_MINUTES){
            throw new IllegalStateException("Maximum OTP request limit exceeded");
        }

        String otp= otpGenrator.genrateOtp(); 

      LocalDateTime now = LocalDateTime.now();

OtpRequest otpRequest = OtpRequest.builder()
        .phoneNumber(phoneNumber)
        .otp(otp)
        .attempts(0)
        .status(OtpStatus.PENDING)
        .lastSentAt(now)
        .expiresAt(now.plusMinutes(OtpConstants.OTP_EXPIRY_MINUTES))
        .build();

        otpRequestRepository.save(otpRequest);

        log.info("OTP for {} is  {} ", phoneNumber, otp);

        smsService.sendotp(phoneNumber, otp);
    }

    @Override
    public boolean verifyOtp(String phoneNumber, String otp) {
           OtpRequest otpRequest =
            otpRequestRepository.
            findTopByPhoneNumberAndStatusOrderByCreatedAtDesc(phoneNumber, OtpStatus.PENDING).
            orElseThrow(()-> new IllegalStateException("No active Otp found . "));

        if(otpRequest.getExpiresAt().isBefore(LocalDateTime.now())){
            otpRequest.setStatus(OtpStatus.EXPIRED);

            otpRequestRepository.save(otpRequest); 
            throw new IllegalStateException("OTP has Expired ");
        }

        if (!otpRequest.getOtp().equals(otp)){
            otpRequest.setAttempts(otpRequest.getAttempts()+1);
            if(otpRequest.getAttempts()>=OtpConstants.MAX_ATTEMPTS){
                otpRequest.setStatus(OtpStatus.FAILED);
            }
            otpRequestRepository.save(otpRequest);
            return false;
        }
        otpRequest.setStatus(OtpStatus.VERIFIED);
        otpRequestRepository.save(otpRequest);
 return true; 
    }

}
