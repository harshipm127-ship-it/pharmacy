package com.pharmacy.inventory.service;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.common.exception.BadRequestException;
import com.pharmacy.common.exception.DuplicateResourceException;
import com.pharmacy.common.exception.IllegalOperationException;
import com.pharmacy.common.exception.ResourceNotFoundException;
import com.pharmacy.inventory.dto.CreateInventoryBatchRequest;
import com.pharmacy.inventory.dto.InventoryBatchAllocation;
import com.pharmacy.inventory.dto.InventoryBatchDetailsResponse;
import com.pharmacy.inventory.dto.InventoryBatchListResponse;
import com.pharmacy.inventory.dto.InventoryBatchResponse;
import com.pharmacy.inventory.dto.UpdateInventoryBatchRequest;
import com.pharmacy.inventory.entity.Inventory;
import com.pharmacy.inventory.entity.InventoryBatch;
import com.pharmacy.inventory.mapper.InventoryBatchMapper;
import com.pharmacy.inventory.repository.InventoryBatchRepository;
import com.pharmacy.inventory.repository.InventoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional
public class InventoryBatchServiceImp implements InventoryBatchService {


    private final InventoryRepository inventoryRepository;

    private final InventoryBatchRepository inventoryBatchRepository; 

    private final InventoryBatchMapper  inventoryBatchMapper;
    @Override
public ApiResponse<InventoryBatchResponse> createInventoryBatch(
        CreateInventoryBatchRequest request) {

    Inventory inventory = inventoryRepository
            .findByPublicId(request.inventoryPublicId())
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Inventory not found."));

    if (!inventory.isActive()) {
        throw new IllegalOperationException(
                "Cannot create batch for an inactive inventory.");
    }

    if (inventoryBatchRepository.existsByInventoryAndBatchNumber(
            inventory,
            request.batchNumber().trim())) {

        throw new DuplicateResourceException(
                "Batch number already exists for this inventory.");
    }

    if (request.manufacturingDate() != null &&
            request.manufacturingDate().isAfter(request.expiryDate())) {

        throw new BadRequestException(
                "Manufacturing date cannot be after expiry date.");
    }

    if (request.purchasePrice().compareTo(request.sellingPrice()) > 0) {

        throw new BadRequestException(
                "Selling price cannot be less than purchase price.");
    }

    if (request.sellingPrice().compareTo(request.mrp()) > 0) {

        throw new BadRequestException(
                "Selling price cannot be greater than MRP.");
    }

    // Entity creation 

    InventoryBatch inventoryBatch = inventoryBatchMapper.toEntity(request); 

    inventoryBatch.setInventory(inventory);

    InventoryBatch savedBatch = inventoryBatchRepository.save(inventoryBatch); 

    return new ApiResponse<>(
        true,
        "Inventory batch created successfully ", 
       inventoryBatchMapper.toResponse(savedBatch)
    );
}
    

    @Override
    public ApiResponse<InventoryBatchResponse> updateInventoryBatch(UUID publicId,
            UpdateInventoryBatchRequest request) {
        
                
    InventoryBatch batch = inventoryBatchRepository
            .findByPublicId(publicId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Inventory batch not found."));

             if(inventoryBatchRepository
                .existsByInventoryAndBatchNumberAndIdNot(batch.getInventory(),
                 request.batchNumber().trim(), batch.getId())){
                    throw new DuplicateResourceException("Batch  number already exist  for this inventory"); 
                }
            if(request.manufacturingDate()!=null 
                && request.manufacturingDate()
                 .isAfter(request.expiryDate())){
                    throw  new BadRequestException("Manufacturing date cannot be after expiry date");
                }

                if(request.purchasePrice().compareTo(request.sellingPrice())>0){
                    throw new BadRequestException("Selling price cannot be less then purchase price");
                }
                if(request.sellingPrice().compareTo(request.mrp())>0){

                    throw new BadRequestException("Selling price cannot be greater then mrp");
                }
                batch.setBatchNumber(request.batchNumber().trim());
                batch.setManufacturingDate(request.manufacturingDate());
                batch.setExpiryDate(request.expiryDate());
                batch.setPurchasePrice(request.purchasePrice());
                batch.setMrp(request.mrp());
                 batch.setSellingPrice(request.sellingPrice());

                 if(request.active()!=null){
                    batch.setActive(request.active());
                 }
                 InventoryBatch updateBatch = 
                      inventoryBatchRepository.save(batch); 

            return  new ApiResponse<>(
                true, "INventoy Batch updated succssfully ", 
                inventoryBatchMapper.toResponse(updateBatch)
            ); 
    }

    @Override
    public ApiResponse<InventoryBatchDetailsResponse> getInventoryBatchByPublicId(
        UUID publicId){

            InventoryBatch inventoryBatch = inventoryBatchRepository.findByPublicId(publicId)
            .orElseThrow(() ->  new ResourceNotFoundException("INventory not found"));
         return new ApiResponse<>(
            true, "Inventory batch fetched successfully ", 
            inventoryBatchMapper.toDetailsResponse(inventoryBatch)
         );

        }

    @Override
    public ApiResponse<Page<InventoryBatchListResponse>> getAllInventoryBatches(Pageable pageable, String search) {
         
        
    Page<InventoryBatch> batchPage =
            inventoryBatchRepository.searchInventoryBatches(
                    search,
                    pageable);

                        Page<InventoryBatchListResponse> response =
            batchPage.map(inventoryBatchMapper::toListResponse);

    return new ApiResponse<>(
            true,
            "Inventory batches fetched successfully.",
            response);


    }

   @Override
public ApiResponse<Void> deleteInventoryBatch(
        UUID publicId) {

    InventoryBatch batch = inventoryBatchRepository
            .findByPublicId(publicId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Inventory batch not found."));

    if (!batch.isActive()) {
        throw new IllegalOperationException(
                "Inventory batch is already inactive.");
    }

    batch.setActive(false);

    inventoryBatchRepository.save(batch);

    return new ApiResponse<>(
            true,
            "Inventory batch deactivated successfully.",
            null);
}

  @Override
public ApiResponse<Void> restoreInventoryBatch(
        UUID publicId) {

    InventoryBatch batch = inventoryBatchRepository
            .findByPublicId(publicId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Inventory batch not found."));

    if (batch.isActive()) {
        throw new IllegalOperationException(
                "Inventory batch is already active.");
    }

    batch.setActive(true);

    inventoryBatchRepository.save(batch);

    return new ApiResponse<>(
            true,
            "Inventory batch restored successfully.",
            null);
}


  @Override
  public List<InventoryBatchAllocation> allocateStock(Inventory inventory, int requiredQuantity) {
       
        if (requiredQuantity<=0) {
     throw new BadRequestException("Required quantity must be greater than zero");
        }
 
      List<InventoryBatch> batches= 
      inventoryBatchRepository.findByInventoryOrderByExpiryDateAsc(inventory); 
      int remainingQuantity = requiredQuantity;

      List<InventoryBatchAllocation> allocations =
                       new ArrayList<>(); 

         LocalDate today =LocalDate.now();
         
         for(InventoryBatch batch: batches){
                if(!batch.isActive()){
                        continue; 
                }
                if(batch.getExpiryDate()==null || !batch.getExpiryDate().isAfter(today)){
                continue; 
                }
             
                if(batch.getAvailableQuantity()<=0){
                        continue; 
                }
            int allocatedQuantity = 
            Math.min(remainingQuantity, batch.getAvailableQuantity());     
          
            BigDecimal itemTotal=
            batch.getSellingPrice().multiply(BigDecimal.valueOf(allocatedQuantity)); 

            allocations.add(new InventoryBatchAllocation(
                batch.getPublicId(), 
                allocatedQuantity, 
                batch.getSellingPrice(), 
                itemTotal
            ));
        
            remainingQuantity-=allocatedQuantity; 

            if(remainingQuantity==0){
                break; 

            }
        }
            if(remainingQuantity>0){
                throw new BadRequestException("nsufficient stock available for the requested quantity"); 
            }
            return allocations;
        
         }
  }


