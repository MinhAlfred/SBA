package com.orchid.orchidbe.controllers;

import com.orchid.orchidbe.apis.MyApiResponse;
import com.orchid.orchidbe.dto.OrchidDTO;
import com.orchid.orchidbe.dto.OrchidDTO.OrchidReq;
import com.orchid.orchidbe.dto.OrchidDTO.OrchidRes;
import com.orchid.orchidbe.services.OrchidService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/orchids")
@RequiredArgsConstructor
@Tag(name = "Orchid Api", description = "Operations related to Orchid")
public class OrchidController {

    private final OrchidService orchidService;

    @GetMapping("")
    @PreAuthorize("hasAnyRole('Admin')")
    @Operation(summary = "Get all orchids", description = "Retrieve a list of all orchids")
    public ResponseEntity<MyApiResponse<List<OrchidRes>>> getAllOrchids() {
        return MyApiResponse.success(orchidService.getAll());
    }

    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    @Operation(summary = "Get all orchids", description = "Retrieve a list of all orchids")
    public ResponseEntity<MyApiResponse<List<OrchidRes>>> getAllOrchidsAvailable() {
        return MyApiResponse.success(orchidService.getAllAvailable());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    @Operation(summary = "Get orchid by ID", description = "Retrieve a specific orchid by its ID")
    public ResponseEntity<MyApiResponse<OrchidRes>> getOrchidById(@PathVariable Integer id) {
        return MyApiResponse.success(orchidService.getById(id));
    }

    @PostMapping("")
    @PreAuthorize("hasRole('Admin')")
    @Operation(summary = "Create new orchid", description = "Create a new orchid record")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<MyApiResponse<OrchidRes>> createOrchid(@Valid @RequestBody OrchidReq orchidReq) {
        return MyApiResponse.created(orchidService.add(orchidReq));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    @Operation(summary = "Update orchid", description = "Update an existing orchid by its ID")
    public ResponseEntity<MyApiResponse<Object>> updateOrchid(
            @PathVariable Integer id,
            @Valid @RequestBody OrchidDTO.OrchidUpReq orchidReq) {
        orchidService.update(orchidReq, id);
        return MyApiResponse.updated();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    @Operation(summary = "Delete orchid", description = "Delete an orchid by its ID")
    @ApiResponse(responseCode = "204", description = "Orchid successfully deleted")
    public ResponseEntity<MyApiResponse<Object>> deleteOrchid(@PathVariable Integer id) {
        orchidService.delete(id);
        return MyApiResponse.delete();
    }
}