package com.orchid.orchidbe.dto;

import com.orchid.orchidbe.pojos.Order.OrderStatus;
import jakarta.validation.constraints.*;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public class OrderDTO {

    public record OrderReq(
            @NotNull(message = "Order details cannot be null")
            @Size(min = 1, message = "At least one order detail is required")
            List<OrderDetailReq> orderDetails
    ) {
    }

    public record OrderDetailReq(
            @Positive Integer productId,
            @Positive Integer quantity
    ) {}

    public record OrderUpReq(
            @NotNull(message = "Order details cannot be null")
            @Size(min = 1, message = "At least one order detail is required")
            List<OrderDetailReq> orderDetails
    ) {
    }

    public record OrderRes(
        Integer id,
        Double totalAmount,
        LocalDateTime orderDate,
        OrderStatus orderStatus,
        Integer accountId,
        List<OrderDetailRes> orderDetails
    ) {
    }

    public record OrderDetailRes(
            Integer orchidId,
            String name,
            String url,
            String categoryName,
            Integer quantity,
            Double price
    ) {
    }
}
