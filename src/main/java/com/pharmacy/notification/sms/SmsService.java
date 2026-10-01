package com.pharmacy.notification.sms;

public interface SmsService {

    void sendotp(String phoneNumber,  String otp);
}
