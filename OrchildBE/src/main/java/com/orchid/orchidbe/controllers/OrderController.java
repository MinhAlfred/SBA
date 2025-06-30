package com.orchid.orchidbe.controllers;

import com.orchid.orchidbe.apis.MyApiResponse;
import com.orchid.orchidbe.dto.OrderDTO;
import com.orchid.orchidbe.dto.OrderDTO.OrderReq;
import com.orchid.orchidbe.dto.OrderDTO.OrderRes;
import com.orchid.orchidbe.services.OrderService;
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
@RequestMapping("${api.prefix}/orders")
@RequiredArgsConstructor
@Tag(name = "Order Api", description = "Operations related to Order")
public class OrderController {


    private final OrderService orderService;
    @GetMapping("")
    @PreAuthorize("hasRole('Admin')")
    @Operation(summary = "Get all orders", description = "Retrieve a list of all orders")
    public ResponseEntity<MyApiResponse<List<OrderRes>>> getAllOrders() {
        return MyApiResponse.success(orderService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    @Operation(summary = "Get order by ID", description = "Retrieve a specific order by its ID")
    public ResponseEntity<MyApiResponse<OrderRes>> getOrderById(@PathVariable Integer id) {
        return MyApiResponse.success(orderService.getById(id));
    }

    @PostMapping("")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    @Operation(summary = "Create new order", description = "Create a new order record")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<MyApiResponse<OrderRes>> createOrder(@Valid @RequestBody OrderReq orderReq) {
        return MyApiResponse.created(orderService.add(orderReq));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    @Operation(summary = "Update order", description = "Update an existing order by its ID")
    public ResponseEntity<MyApiResponse<OrderRes>> updateOrder(
            @PathVariable Integer id,
            @Valid @RequestBody OrderDTO.OrderUpReq orderReq) {
        return MyApiResponse.updated(orderService.update(orderReq, id));
    }

    @PostMapping("/success/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    @Operation(summary = "Pay", description = "Pay successfully for an order")
    public ResponseEntity<MyApiResponse<OrderRes>> payOrder(
            @PathVariable Integer id
           ) {
        orderService.pay(id);
        return MyApiResponse.updated();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    @Operation(summary = "Delete order", description = "Delete an order by its ID")
    @ApiResponse(responseCode = "204", description = "Order successfully deleted")
    public ResponseEntity<MyApiResponse<Object>> deleteOrder(@PathVariable Integer id) {
        orderService.delete(id);
        return MyApiResponse.delete();
    }

    @GetMapping("/user")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    @Operation(summary = "Get orders by user", description = "Retrieve a list of orders for the authenticated user")
    public ResponseEntity<MyApiResponse<List<OrderRes>>> getOrdersByUser() {
        return MyApiResponse.success(orderService.getByAccount());
    }
}