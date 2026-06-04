package co.istad.elearninga01m1.features.category;

import co.istad.elearninga01m1.features.category.dto.CategoryCreateRequest;
import co.istad.elearninga01m1.features.category.dto.CategoryResponse;
import co.istad.elearninga01m1.features.category.dto.CategoryUpdateRequest;
import co.istad.elearninga01m1.features.category.mapper.CategoryMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepo categoryRepo;
    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryRepo categoryRepo, CategoryMapper categoryMapper) {
        this.categoryRepo = categoryRepo;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public Page<Category> findAll(Pageable pageable) {
        return categoryRepo.findAll(pageable);
    }

    @Override
    public CategoryResponse createCategory(CategoryCreateRequest request) {

        if (categoryRepo.existsByNameIgnoreCaseAndIsDeletedFalse(request.name())) {
            throw new RuntimeException("Category name already exists");
        }

        Category category = categoryMapper.fromCreateRequest(request);
        Category savedCategory = categoryRepo.save(category);

        return categoryMapper.toResponse(savedCategory);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepo.findByIsDeletedFalse();
        return categoryMapper.toResponseList(categories);
    }

    @Override
    public CategoryResponse getCategoryById(Integer id) {
        Category category = categoryRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return categoryMapper.toResponse(category);
    }

    @Override
    public CategoryResponse updateCategory(Integer id, CategoryUpdateRequest request) {
        Category category = categoryRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        categoryMapper.updateCategoryFromRequest(request, category);

        Category updatedCategory = categoryRepo.save(category);

        return categoryMapper.toResponse(updatedCategory);
    }

    @Override
    public void deleteCategory(Integer id) {
        Category category = categoryRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setIsDeleted(true);
        categoryRepo.save(category);
    }

}