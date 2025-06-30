package com.orchid.orchidbe.pojos;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orchids")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Orchid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orchid_id", nullable = false)
    private int id;

    @Column(name = "is_natural")
    private boolean isNatural;

    @Column(name = "orchid_description")
    private String description;

    @Column(name = "orchid_name")
    private String name;

    @Column(name = "orchid_url")
    private String url;

    private Double price;

    private boolean isAvailable;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;


}
