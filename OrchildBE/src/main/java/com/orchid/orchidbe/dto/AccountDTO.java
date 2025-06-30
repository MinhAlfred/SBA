package com.orchid.orchidbe.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
public class AccountDTO {

    public record AccountReq(
        @NotBlank String name,
        @Email String email,
        @NotBlank String password
    ) {

    }

    public record Update(
            @NotBlank String name,
            @Positive int roleId
    ) {

    }

    public record Login(
        @NotBlank String email,
        @NotBlank String password
    ) {

    }
    public record LoginRes(
            AccountRes user,
        String token
    ){
    }
    @Builder
    public record AccountRes(
            int id,
            String name,
            String email,
            String roleName
    ){}

}
