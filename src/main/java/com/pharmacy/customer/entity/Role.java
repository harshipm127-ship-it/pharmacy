package com.pharmacy.customer.entity;

import com.pharmacy.common.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "roles", uniqueConstraints = 
{@UniqueConstraint(name = "role_name_unique", columnNames = "name")
})
public class Role  extends BaseEntity{ 

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     @Column(name = "name", nullable = false, length = 50)
     private String name;
    @Column(name = "description", columnDefinition = "TEXT")
     private String description;

 }
