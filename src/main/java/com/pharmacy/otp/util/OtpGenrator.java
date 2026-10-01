package com.pharmacy.otp.util;

import java.security.SecureRandom;

import org.springframework.stereotype.Component;

@Component
public class OtpGenrator {

    private static final SecureRandom RANDOM= new SecureRandom();
    
    
    public String genrateOtp(){
     

        int otp = 100000+ RANDOM.nextInt(900000);
        return String.valueOf(otp);
    }
}
