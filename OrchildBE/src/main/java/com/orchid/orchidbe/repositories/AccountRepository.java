package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.pojos.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {

    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, int id);
    Optional<Account> findByEmail(String email);
}
