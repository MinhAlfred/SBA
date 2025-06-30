package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.CategoryDTO;
import com.orchid.orchidbe.pojos.Category;
import java.util.List;

public interface CategoryService {

    List<Category> getAll();
    Category getById(int id);
    void save(CategoryDTO.CategoryReq category);
    void update(int id, CategoryDTO.CategoryReq category);
    void delete(int id);


}
