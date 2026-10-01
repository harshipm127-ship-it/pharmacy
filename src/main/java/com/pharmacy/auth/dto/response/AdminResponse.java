package com.pharmacy.auth.dto.response;

import java.util.UUID;

public record AdminResponse(

    UUID publicId, 

    String firstName, 
    String lastName, 

    String email, 
    String phoneNumber, 

    String role, 
    String Status
) {

}
