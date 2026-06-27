package co.istad.elearninga01m1.features.category.mapper;

import co.istad.elearninga01m1.features.category.Category;
import co.istad.elearninga01m1.features.category.dto.CategoryCreateRequest;
import co.istad.elearninga01m1.features.category.dto.CategoryResponse;
import co.istad.elearninga01m1.features.category.dto.CategoryUpdateRequest;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "courses", ignore = true)
    @Mapping(target = "isDeleted", constant = "false")
    @Mapping(target = "isPublished", expression = "java(request.isPublished() != null ? request.isPublished() : true)")
    Category fromCreateRequest(CategoryCreateRequest request);

    CategoryResponse toResponse(Category category);

    List<CategoryResponse> toResponseList(List<Category> categories);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "courses", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    void updateCategoryFromRequest(CategoryUpdateRequest request, @MappingTarget Category category);
}