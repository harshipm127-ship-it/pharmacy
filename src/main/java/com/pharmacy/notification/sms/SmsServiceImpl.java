package com.pharmacy.notification.sms;

import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SmsServiceImpl implements SmsService {

    @Override
    public void sendotp(String phoneNumber, String otp) {


 log.info("==========================================");
        log.info("SMS SENT");
        log.info("To      : {}", phoneNumber);
        log.info("Message : Your OTP is {}", otp);
        log.info("==========================================");    }
}
