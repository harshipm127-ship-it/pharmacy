package com.pharmacy.customer.service.imp;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.common.exception.DuplicateResourceException;
import com.pharmacy.common.exception.ResourceNotFoundException;
import com.pharmacy.customer.dto.request.CompleteCustomerProfileRequest;
import com.pharmacy.customer.dto.response.AddressResponse;
import com.pharmacy.customer.dto.response.CustomerProfileResponse;
import com.pharmacy.customer.entity.CustomerAddress;
import com.pharmacy.customer.entity.User;
import com.pharmacy.customer.repository.CustomerAddressRepository;
import com.pharmacy.customer.repository.UserRepository;
import com.pharmacy.customer.service.CustomerProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerProfileServiceImpl
        implements CustomerProfileService {

    private final UserRepository userRepository;
    private final CustomerAddressRepository customerAddressRepository;

    @Override
  public ApiResponse<CustomerProfileResponse> completeProfile(
        User user,
        CompleteCustomerProfileRequest request) {

        if (user == null) {
            throw new UnsupportedOperationException(
                    "Authenticated user must be provided by the controller."
            );
        }

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmailAndIdNot(
                email,
                user.getId())) {

            throw new DuplicateResourceException(
                    "Email is already registered."
            );
        }

        /*
         * Update user profile
         */
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(email);

        userRepository.save(user);

        /*
         * Create the customer's first/default address.
         */
       CustomerAddress address =
        customerAddressRepository
                .findByUserAndIsDefaultTrue(user)
                .orElse(null);

if (address == null) {

    // No default address exists, so create the first one
    address = CustomerAddress.builder()
            .user(user)
            .addressType(request.getAddressType())
            .recipientName(
                    buildFullName(
                            request.getFirstName(),
                            request.getLastName()
                    )
            )
            .phoneNumber(user.getPhoneNumber())
            .addressLine1(request.getAddressLine1().trim())
            .addressLine2(
                    trimOrNull(request.getAddressLine2())
            )
            .landmark(
                    trimOrNull(request.getLandmark())
            )
            .city(request.getCity().trim())
            .state(request.getState().trim())
            .postalCode(request.getPostalCode().trim())
            .country(request.getCountry().trim())
            .isDefault(true)
            .build();

} else {

    // Default address already exists.
    // Update that address instead of creating another one.

    address.setAddressType(request.getAddressType());

    address.setRecipientName(
            buildFullName(
                    request.getFirstName(),
                    request.getLastName()
            )
    );

    address.setPhoneNumber(user.getPhoneNumber());

    address.setAddressLine1(
            request.getAddressLine1().trim()
    );

    address.setAddressLine2(
            trimOrNull(request.getAddressLine2())
    );

    address.setLandmark(
            trimOrNull(request.getLandmark())
    );

    address.setCity(
            request.getCity().trim()
    );

    address.setState(
            request.getState().trim()
    );

    address.setPostalCode(
            request.getPostalCode().trim()
    );

    address.setCountry(
            request.getCountry().trim()
    );

    // It remains the default address
    address.setDefault(true);
}

address = customerAddressRepository.save(address);

        CustomerProfileResponse response =
                buildResponse(user, address);

        return new ApiResponse<>(
                true,
                "Customer profile completed successfully.",
                response
        );
    }

    private CustomerProfileResponse buildResponse(
            User user,
            CustomerAddress address) {

        AddressResponse addressResponse =
        new AddressResponse(
                address.getId(),
                address.getPublicId() != null
                        ? address.getPublicId().toString()
                        : null,
                address.getAddressType(),
                address.getRecipientName(),
                address.getPhoneNumber(),
                address.getAddressLine1(),
                address.getAddressLine2(),
                address.getLandmark(),
                address.getCity(),
                address.getState(),
                address.getPostalCode(),
                address.getCountry(),
                address.getLatitude(),
                address.getLongitude(),
                address.isDefault()
        );

        return new CustomerProfileResponse(
                user.getId(),
                user.getPublicId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole().getName(),
                user.getStatus().name(),
                addressResponse
        );
    }

    private String buildFullName(
            String firstName,
            String lastName) {

        return firstName.trim()
                + " "
                + lastName.trim();
    }

    private String trimOrNull(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
    

    @Override
    public ApiResponse<CustomerProfileResponse> getProfile(User user) {
        CustomerAddress address= 
        customerAddressRepository.findByUserAndIsDefaultTrue(user)
        .orElseThrow(()-> new ResourceNotFoundException("User Addres Not found . "));

        CustomerProfileResponse response= buildResponse(user, address); 

        return new ApiResponse<>(
                true, 
                "User profile retrived successfully,", 
                response
        ); 
    }
    
}