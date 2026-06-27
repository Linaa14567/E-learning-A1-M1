package co.istad.lina.elearning.features.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CategoryRequest(

        @NotBlank(message = "Category name is required")
        @Size(min = 2, max = 255)
        String name,

        @NotNull(message = "Status isDeleted is required")
        Boolean isDeleted

) {
}
