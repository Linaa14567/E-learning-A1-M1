package co.istad.elearninga01m1.features.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryCreateRequest(

        @NotBlank(message = "Name is required")
        @Size(max = 50, message = "Name must not exceed 50 characters")
        String name,

        @NotBlank(message = "Icon is required")
        @Size(max = 50, message = "Icon must not exceed 50 characters")
        String icon,

        Boolean isPublished
) {
}