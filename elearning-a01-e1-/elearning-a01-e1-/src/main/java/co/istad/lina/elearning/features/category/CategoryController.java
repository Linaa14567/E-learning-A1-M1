package co.istad.lina.elearning.features.category;

import co.istad.lina.elearning.features.category.dto.CategoryRequest;
import co.istad.lina.elearning.features.category.dto.CategoryResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final co.istad.lina.elearning.features.category.CategoryService categoryService;

    @GetMapping
    public Page<CategoryResponse> findCategories(
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "25") int pageSize
    ) {
        return categoryService.findCategories(pageNumber, pageSize);
    }


    @GetMapping("/{id}")
    public CategoryResponse findCategoryById(@PathVariable Integer id) {
        return categoryService.findCategoryById(id);
    }


    @PostMapping
    public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest categoryRequest) {
        return categoryService.createCategory(categoryRequest);
    }


    @PutMapping("/{id}")
    public CategoryResponse updateCategory(@PathVariable Integer id, @Valid @RequestBody CategoryRequest categoryRequest) {
        return categoryService.updateCategory(id, categoryRequest);
    }


    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
    }

}
