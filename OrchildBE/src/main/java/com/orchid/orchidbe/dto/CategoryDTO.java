package com.orchid.orchidbe.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryDTO {

    public record CategoryReq(
        @NotBlank String name
    ){

    }

}
