package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.CategoryDTO;
import com.orchid.orchidbe.pojos.Category;
import com.orchid.orchidbe.repositories.CategoryRepository;
import java.util.List;

import com.orchid.orchidbe.repositories.OrchidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private final OrchidRepository orchidRepository;

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getById(int id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    @Override
    public void save(CategoryDTO.CategoryReq category) {

        if (categoryRepository.existsByName(category.name())) {
            throw new IllegalArgumentException("Category with name " + category.name() + " already exists");
        }

        var newCategory = new Category();
        newCategory.setName(category.name());

        categoryRepository.save(newCategory);
    }

    @Override
    public void update(int id, CategoryDTO.CategoryReq category) {

        var existingCategory = getById(id);

        if (categoryRepository.existsByNameAndIdNot(category.name(), id)) {
            throw new IllegalArgumentException("Category with name " + category.name() + " already exists");
        }

        existingCategory.setName(category.name());

        categoryRepository.save(existingCategory);

    }

    @Override
    public void delete(int id) {
        var orchids = orchidRepository.findByCategory_Id(id);
        if(orchids.isPresent()) {
            throw new IllegalArgumentException("Cannot delete category with existing orchids");
        }
        var existingCategory = getById(id);
        categoryRepository.delete(existingCategory);
    }
}
