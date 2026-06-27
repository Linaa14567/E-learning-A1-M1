package co.istad.elearninga01m1.features.category.dto;

public record CategoryResponse(
        Integer id,
        String name,
        String icon,
        Boolean isDeleted,
        Boolean isPublished
) {
}