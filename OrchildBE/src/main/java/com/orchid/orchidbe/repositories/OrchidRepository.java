package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.pojos.Orchid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrchidRepository extends JpaRepository<Orchid, Integer> {
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, int id);

    Optional<Orchid> findByCategory_Id(int categoryId);
}
