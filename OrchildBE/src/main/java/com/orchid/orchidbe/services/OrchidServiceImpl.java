package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.OrchidDTO;
import com.orchid.orchidbe.pojos.Orchid;
import com.orchid.orchidbe.repositories.CategoryRepository;
import com.orchid.orchidbe.repositories.OrchidRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrchidServiceImpl implements OrchidService  {

    private final OrchidRepository orchidRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public List<OrchidDTO.OrchidRes> getAll() {
        return orchidRepository.findAll().stream()
                .map(this::mapToOrchidRes)
                .toList();
    }

    @Override
    public List<OrchidDTO.OrchidRes> getAllAvailable() {
        return orchidRepository.findAll().stream()
                .filter(Orchid::isAvailable)
                .map(this::mapToOrchidRes)
                .toList();
    }



    @Override
    public OrchidDTO.OrchidRes getById(int id) {
        return orchidRepository.findById(id).map(this::mapToOrchidRes).orElseThrow(() -> new IllegalArgumentException("Orchid not found"));
    }

    @Override
    public OrchidDTO.OrchidRes add(OrchidDTO.OrchidReq orchid) {
        if(orchidRepository.existsByName(orchid.name())) {
            throw new IllegalArgumentException("Orchid with name " + orchid.name() + " already exists");
        }
        var category = categoryRepository.findById(orchid.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        var newOrchid = new Orchid();
        newOrchid.setNatural(orchid.isNatural());
        newOrchid.setDescription(orchid.description());
        newOrchid.setName(orchid.name());
        newOrchid.setUrl(orchid.url());
        newOrchid.setPrice(orchid.price());
        newOrchid.setAvailable(orchid.isAvailable());
        newOrchid.setCategory(category);
        orchidRepository.save(newOrchid);
        return mapToOrchidRes(newOrchid);
    }

    @Override
    public OrchidDTO.OrchidRes update(OrchidDTO.OrchidUpReq orchid, int id) {
        var existingOrchid = orchidRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Orchid not found"));

        if (orchidRepository.existsByNameAndIdNot(orchid.name(), id) ){
            throw new IllegalArgumentException("Orchid with name " + orchid.name() + " already exists");
        }
        var category = categoryRepository.findById(orchid.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
//        orchidRepository.deleteById(id);
//        var newOrchid = new Orchid();
        existingOrchid.setNatural(orchid.isNatural());
        existingOrchid.setDescription(orchid.description());
        existingOrchid.setName(orchid.name());
        existingOrchid.setUrl(orchid.url());
        existingOrchid.setPrice(orchid.price());
        existingOrchid.setAvailable(orchid.isAvailable());
        existingOrchid.setCategory(category);
        orchidRepository.save(existingOrchid);
        return mapToOrchidRes(existingOrchid);
    }

    @Override
    public void delete(Integer orchid) {
        var existingOrchid = orchidRepository.findById(orchid)
                .orElseThrow(() -> new IllegalArgumentException("Orchid not found"));
        existingOrchid.setAvailable(false);
        orchidRepository.save(existingOrchid);
    }

    private OrchidDTO.OrchidRes mapToOrchidRes(Orchid orchid) {
        return new OrchidDTO.OrchidRes(
                orchid.getId(),
                orchid.isNatural(),
                orchid.getDescription(),
                orchid.getName(),
                orchid.getUrl(),
                orchid.getPrice(),
                orchid.isAvailable(),
                orchid.getCategory());
    }


}
