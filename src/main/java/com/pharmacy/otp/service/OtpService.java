
package com.pharmacy.otp.service;

public interface OtpService {

    void sendOtp(String phoneNumbeString);

    boolean verifyOtp(String phoneNumber, String otp); 
}
