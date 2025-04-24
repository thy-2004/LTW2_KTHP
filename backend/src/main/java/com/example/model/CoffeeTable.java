package com.example.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tables")
@Data
public class CoffeeTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int tableNumber; // Số bàn
    private String content;  // Nội dung (text)
    private String status;   // Trạng thái: CHUA_DAT hoặc DA_DAT
}