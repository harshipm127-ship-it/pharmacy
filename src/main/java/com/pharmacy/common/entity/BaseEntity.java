package com.pharmacy.common.entity;



import java.time.*;
import java.util.UUID;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@MappedSuperclass
public class BaseEntity {

    @Column(name = "public_id", nullable = false, unique = true, updatable = false)
    @Getter
    @Setter(AccessLevel.NONE)
    private UUID publicId;

   @Column(name = "created_at", nullable = false, updatable = false)
   @Setter(AccessLevel.NONE)
private LocalDateTime createdAt;

@Column(name = "updated_at", nullable = false)
@Setter(AccessLevel.NONE)
private LocalDateTime updatedAt;


  @PrePersist
protected void onCreate() {
    LocalDateTime now = LocalDateTime.now();

    if (publicId == null) {
        publicId = UUID.randomUUID();
    }

    createdAt = now;
    updatedAt = now;
}

@PreUpdate
protected void onUpdate() {
    updatedAt = LocalDateTime.now();

}
}
