package co.istad.lina.elearning.features.category;

import co.istad.lina.elearning.features.category.dto.CategoryRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    Category categoryRequestToCategory(CategoryRequest categoryRequest);

    co.istad.lina.elearning.features.category.dto.CategoryResponse categoryToCategoryResponse(Category category);

}
