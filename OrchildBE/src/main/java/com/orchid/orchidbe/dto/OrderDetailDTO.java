package com.orchid.orchidbe.dto;

    import jakarta.validation.constraints.NotNull;
    import jakarta.validation.constraints.Positive;
    import jakarta.validation.constraints.Min;

    public class OrderDetailDTO {

        public record OrderDetailReq(
            @NotNull(message = "Order ID cannot be null")
            @Positive(message = "Order ID must be positive")
            Integer orderId,

            @NotNull(message = "Orchid ID cannot be null")
            @Positive(message = "Orchid ID must be positive")
            Integer orchidId,

            @NotNull(message = "Quantity cannot be null")
            @Min(value = 1, message = "Quantity must be at least 1")
            Integer quantity,

            @NotNull(message = "Price cannot be null")
            @Positive(message = "Price must be positive")
            Double price


        ) {
        }

        public record OrderDetailUpReq(
                @NotNull(message = " ID cannot be null")
                @Positive(message = " ID must be positive")
                Integer id,

                @NotNull(message = "Order ID cannot be null")
                @Positive(message = "Order ID must be positive")
                Integer orderId,

                @NotNull(message = "Orchid ID cannot be null")
                @Positive(message = "Orchid ID must be positive")
                Integer orchidId,

                @NotNull(message = "Quantity cannot be null")
                @Min(value = 1, message = "Quantity must be at least 1")
                Integer quantity,

                @NotNull(message = "Price cannot be null")
                @Positive(message = "Price must be positive")
                Double price


        ) {
        }

        public record OrderDetailRes(
            Integer id,
            Integer orderId,
            Integer orchidId,
            Integer quantity,
            Double price
        ) {
        }
    }