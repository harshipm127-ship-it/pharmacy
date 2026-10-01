package com.pharmacy.customer.service.imp;

import java.util.List;
import org.springframework.stereotype.Service;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.common.exception.BadRequestException;
import com.pharmacy.customer.dto.request.CreateAddressRequest;
import com.pharmacy.customer.dto.request.UpdateAddressRequest;
import com.pharmacy.customer.dto.response.AddressResponse;
import com.pharmacy.customer.entity.CustomerAddress;
import com.pharmacy.customer.entity.User;
import com.pharmacy.customer.repository.CustomerAddressRepository;
import com.pharmacy.customer.service.CustomerAddressService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerAddressServiceImp implements CustomerAddressService{

        private final CustomerAddressRepository customerAddressRepository; 
    @Override
    public ApiResponse<List<AddressResponse>> getAddresses(User user) {
         List<AddressResponse> addresses =
            customerAddressRepository
                    .findByUser(user)
                    .stream()
                    .map(this::mapToResponse)
                    .toList();

        return new ApiResponse<>(
            true,
            "Addresses retrieved successfully.",
            addresses
    );
    }

    @Override
    public ApiResponse<AddressResponse> addAddress(User user ,CreateAddressRequest request) {
        
        boolean hasExistingAddress= !customerAddressRepository
           .findByUser(user).isEmpty(); 

           /*
         * First address automatically becomes default.
         *
         * Otherwise, it becomes default only when the
         * customer checked "Set as default".
         */
        boolean makeDefault =
                request.isDefault() || !hasExistingAddress;

                  /*
         * If this address is going to become default,
         * remove default status from the existing address.
         */
           if(makeDefault){
                customerAddressRepository.findByUserAndIsDefaultTrue(user)
                    .ifPresent(existingDefault ->
                            existingDefault.setDefault(false));
                  }
               CustomerAddress address =
                CustomerAddress.builder()
                        .user(user)
                        .addressType(request.getAddressType())
                        .recipientName(
                                request.getRecipientName().trim()
                        )
                        .phoneNumber(
                                request.getPhoneNumber().trim()
                        )
                        .addressLine1(
                                request.getAddressLine1().trim()
                        )
                        .addressLine2(
                                trimOrNull(
                                        request.getAddressLine2()
                                )
                        )
                        .landmark(
                                trimOrNull(
                                        request.getLandmark()
                                )
                        )
                        .city(
                                request.getCity().trim()
                        )
                        .state(
                                request.getState().trim()
                        )
                        .postalCode(
                                request.getPostalCode().trim()
                        )
                        .country(
                                request.getCountry().trim()
                        )
                         .latitude(request.getLatitude())
                        .longitude(request.getLongitude())
                        .isDefault(makeDefault)
                        .build();

        CustomerAddress savedAddress =
                customerAddressRepository.save(address);
 return new ApiResponse<>(
                true,
                "Address added successfully.",
                mapToResponse(savedAddress)
        );
    }    


    @Override
    public ApiResponse<AddressResponse> updateAddress(User user, Long addressId, UpdateAddressRequest request) {

     CustomerAddress address = customerAddressRepository.findByIdAndUser(addressId, user)
      .orElseThrow(() -> new BadRequestException("Address not found."));
       /*
         * If a non-default address is being changed to default,
         * remove the existing default first.
         */
        if(request.isDefault() && !address.isDefault()){
           customerAddressRepository.findByUserAndIsDefaultTrue(user)
           .ifPresent(existingDefault ->
                            existingDefault.setDefault(false));
                
            address.setDefault(true);
        }

/*
         * Do not allow the current default address to become
         * non-default without selecting another default.
         */
        if(address.isDefault() && !request.isDefault()){

            throw new  BadRequestException("This is your default address. "
                    + "Please make another address default "
                    + "before removing the default status."); 
        }
        address.setAddressType(request.getAddressType());
           address.setRecipientName(
                request.getRecipientName().trim()
        );

        address.setPhoneNumber(
                request.getPhoneNumber().trim()
        );

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
        address.setLatitude(request.getLatitude());
        address.setLongitude(request.getLongitude());

        CustomerAddress savedAddress =
                customerAddressRepository.save(address);


        return new ApiResponse<>(
                true,
                "Address updated successfully.",
                mapToResponse(savedAddress)
        );    }

    @Override
    public ApiResponse<Void> deleteAddress(User user, Long addressId) {

        CustomerAddress address = customerAddressRepository.findByIdAndUser(addressId, user)
        .orElseThrow(()-> new BadRequestException("Address not found. "));

        //Find  how may address the customer has 

        long addressCount = customerAddressRepository.findByUser(user).size(); 

          //Do not allow deleting the only address if it is the default address

          if(address.isDefault() && addressCount >1){
            throw new BadRequestException
            ("Default address cannot be deleted. "+ "Please make another address default first");

          }
          customerAddressRepository.delete(address);
           return new ApiResponse<>(
                true,
                "Address deleted successfully.",
                null
        );
    }

@Transactional
@Override
public ApiResponse<AddressResponse> makeDefault(User user, Long addressId) {
     
        CustomerAddress address = customerAddressRepository.findByIdAndUser(addressId, user)
     .orElseThrow(()->new BadRequestException("Address not found"));

     //Already default 

     if(address.isDefault()){
        return new ApiResponse<>(
                    true,
                    "Address is already the default address.",
                    mapToResponse(address)
            );
     }
     //remove default from the current address 


     customerAddressRepository.findByUserAndIsDefaultTrue(user)
     .ifPresent(existingDefault -> existingDefault.setDefault(false));

     //make selected address default 

     address.setDefault(true);
     CustomerAddress savedAddress = customerAddressRepository.save(address);
       return new ApiResponse<>(
                true,
                "Default address updated successfully.",
                mapToResponse(savedAddress)
        );
}
     /*
     * =========================================================
     * ENTITY -> RESPONSE
     * =========================================================
     */
    private AddressResponse mapToResponse(
            CustomerAddress address) {

        return new AddressResponse(
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
    }
     /*
     * =========================================================
     * STRING HELPER
     * =========================================================
     */
    private String trimOrNull(String value) {

        if (value == null
                || value.trim().isEmpty()) {

            return null;
        }
        return value.trim();
    }

}
