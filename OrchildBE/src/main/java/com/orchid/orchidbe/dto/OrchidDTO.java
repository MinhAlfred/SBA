package com.orchid.orchidbe.dto;

        import com.orchid.orchidbe.pojos.Category;
        import jakarta.validation.constraints.NotBlank;
        import jakarta.validation.constraints.NotNull;
        import jakarta.validation.constraints.Positive;
        import jakarta.validation.constraints.Size;

        public class OrchidDTO {

            public record OrchidReq(
                @NotNull(message = "Natural status cannot be null")
                boolean isNatural,

                @Size(max = 500, message = "Description cannot exceed 500 characters")
                String description,

                @NotBlank(message = "Name cannot be blank")
                @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
                String name,

                @NotBlank(message = "URL cannot be blank")
                String url,

                @NotNull(message = "Price cannot be null")
                @Positive(message = "Price must be positive")
                Double price,

                @NotNull(message = "Status cannot be null")
                boolean isAvailable,

                int categoryId
            ) {
            }

            public record OrchidUpReq(

                    @NotNull(message = "Natural status cannot be null")
                    boolean isNatural,

                    @Size(max = 500, message = "Description cannot exceed 500 characters")
                    String description,

                    @NotBlank(message = "Name cannot be blank")
                    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
                    String name,

                    @NotBlank(message = "URL cannot be blank")
                    String url,

                    @NotNull(message = "Price cannot be null")
                    @Positive(message = "Price must be positive")
                    Double price,

                    @NotNull(message = "Status cannot be null")
                    boolean isAvailable,
                    int categoryId

            ) {
            }

            // Add a response record for consistency
            public record OrchidRes(
                Integer id,
                boolean isNatural,
                String description,
                String name,
                String url,
                Double price,
                boolean isAvailable,
                Category categoryId
            ) {
            }
        }