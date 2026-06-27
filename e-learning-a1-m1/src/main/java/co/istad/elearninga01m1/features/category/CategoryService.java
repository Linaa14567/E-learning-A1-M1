package co.istad.elearninga01m1.features.category;

import co.istad.elearninga01m1.features.category.dto.CategoryCreateRequest;
import co.istad.elearninga01m1.features.category.dto.CategoryResponse;
import co.istad.elearninga01m1.features.category.dto.CategoryUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CategoryService {
    Page<Category> findAll(Pageable pageable);
    CategoryResponse createCategory(CategoryCreateRequest request);

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(Integer id);

    CategoryResponse updateCategory(Integer id, CategoryUpdateRequest request);

    void deleteCategory(Integer id);
}
