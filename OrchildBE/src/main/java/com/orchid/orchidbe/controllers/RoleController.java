package com.orchid.orchidbe.controllers;

import com.orchid.orchidbe.apis.MyApiResponse;
import com.orchid.orchidbe.dto.RoleDTO;
import com.orchid.orchidbe.pojos.Role;
import com.orchid.orchidbe.services.RoleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/roles")
@RequiredArgsConstructor
@Tag(name = "Role Api", description = "Operation related to Role")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("hasAnyRole('Admin')")
    public ResponseEntity<MyApiResponse<List<Role>>> getAll() {
        return MyApiResponse.success(roleService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    public ResponseEntity<MyApiResponse<Role>> getById(@PathVariable int id) {
        return MyApiResponse.success(roleService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin')")
    public ResponseEntity<MyApiResponse<Object>> add(
        @Valid @RequestBody RoleDTO.RoleReq req,
        BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                .collect(Collectors.toMap(
                    FieldError::getField,
                    FieldError::getDefaultMessage
                ));
            return MyApiResponse.validationError(errors);
        }

        roleService.add(req);
        return MyApiResponse.created();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin')")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody RoleDTO.RoleReq req) {
        roleService.update(id, req);
        return MyApiResponse.updated();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin')")
    public ResponseEntity<?> delete(@PathVariable int id) {
        roleService.delete(id);
        return MyApiResponse.noContent();
    }
}