package com.orchid.orchidbe.dto;

import jakarta.validation.constraints.NotNull;

public class RoleDTO {

    @NotNull(message="Name is not blank")
    public record RoleReq(
        String name
    ){

    }



}
