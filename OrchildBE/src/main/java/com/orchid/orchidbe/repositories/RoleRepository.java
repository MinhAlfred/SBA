package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.pojos.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    boolean existsByName(String name);

    Role findByName(String user);
}
