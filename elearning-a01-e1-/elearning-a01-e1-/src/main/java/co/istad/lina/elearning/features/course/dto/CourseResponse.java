package co.istad.lina.elearning.features.course.dto;

import co.istad.lina.elearning.features.category.dto.CategoryResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CourseResponse(
         String slug,
         String keyword, // use for SEO
         String title,
         String description,
         String thumbnail,
         Float starRating,
         Integer countRating,
         Float totalHours,
         String level,
         BigDecimal price,
         Float discountPercent,
         LocalDateTime createdAt,
         LocalDateTime updatedAt,
         CategoryResponse category,
         String instructorName,
         Boolean isPublished
) {
}
