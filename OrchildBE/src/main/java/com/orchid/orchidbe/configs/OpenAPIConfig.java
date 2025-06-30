package com.orchid.orchidbe.configs;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@OpenAPIDefinition(
    info = @Info(title = "Orchid Service API", description = "Orchid API documentation", version = "1.0"),
    security = @SecurityRequirement(name = "bearer-key")
)
@SecurityScheme(
    name = "bearer-key",
    scheme = "bearer",
    type = SecuritySchemeType.HTTP,
    in = SecuritySchemeIn.HEADER

)
public class OpenAPIConfig {

}
