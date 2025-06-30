package com.orchid.orchidbe.controllers;

import com.orchid.orchidbe.apis.MyApiResponse;
import com.orchid.orchidbe.dto.CategoryDTO;
import com.orchid.orchidbe.pojos.Category;
import com.orchid.orchidbe.services.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/categories")
@RequiredArgsConstructor
@Tag(name = "Categories Api", description = "Operations related to Categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    @Operation(summary = "Get all categories", description = "Returns a list of all categories")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved all categories")
    public ResponseEntity<MyApiResponse<List<Category>>> getCategories() {
        return MyApiResponse.success(categoryService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    @Operation(summary = "Get category by ID", description = "Returns a category by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Category found"),
        @ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<MyApiResponse<Category>> getCategoryById(@PathVariable int id) {
        return MyApiResponse.success(categoryService.getById(id));
    }
    @PreAuthorize("hasRole('Admin')")
    @PostMapping("")
    @Operation(summary = "Create new category", description = "Creates a new category")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Category created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input or category name already exists")
    })
    public ResponseEntity<MyApiResponse<Object>> createCategory(
        @RequestBody @Valid CategoryDTO.CategoryReq categoryReq
    ) {
        categoryService.save(categoryReq);
        return MyApiResponse.created();
    }
    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{id}")
    @Operation(summary = "Update category", description = "Updates an existing category by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Category updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input or category name already exists"),
        @ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<MyApiResponse<Object>> updateCategory(
        @PathVariable int id,
        @RequestBody @Valid CategoryDTO.CategoryReq categoryReq
    ) {
        categoryService.update(id, categoryReq);
        return MyApiResponse.updated();
    }
    @PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete category", description = "Deletes a category by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Category deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<MyApiResponse<Object>> deleteCategory(@PathVariable int id) {
        categoryService.delete(id);
        return MyApiResponse.noContent();
    }
}