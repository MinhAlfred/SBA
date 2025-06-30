package com.orchid.orchidbe.services;

import com.orchid.orchidbe.configs.JwtUtil;
import com.orchid.orchidbe.dto.AccountDTO;
import com.orchid.orchidbe.pojos.Account;
import com.orchid.orchidbe.pojos.Role;
import com.orchid.orchidbe.repositories.AccountRepository;
import java.util.List;

import com.orchid.orchidbe.repositories.OrderRepository;
import com.orchid.orchidbe.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {
    @Autowired
    AccountRepository accountRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtil jwtUtil;

    @Override
    public List<Account> getAll() {
        return accountRepository.findAll();
    }

    @Override
    public AccountDTO.LoginRes login(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        Account account = (Account) authentication.getPrincipal();
        return getAccountRes(account);
    }

    @Override
    public Account getById(int id) {
        return accountRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Account not found"));
    }

    @Override
    public void add(AccountDTO.AccountReq account) {

        if (accountRepository.existsByEmail(account.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        var newAccount = new Account();
        newAccount.setName(account.name());
        newAccount.setEmail(account.email());
        newAccount.setPassword(passwordEncoder.encode(account.password())); // Password should be encoded before saving
        newAccount.setRole(roleRepository.findByName("User")); // Default role, can be changed later

        accountRepository.save(newAccount);
    }

    @Override
    public void update(int id, AccountDTO.Update account) {

        var existingAccount = accountRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Account not found"));

            Role role = roleRepository.findById(account.roleId())
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));
        existingAccount.setRole(role);
        existingAccount.setName(account.name());

        accountRepository.save(existingAccount);
    }

    @Override
    public void delete(int id) {
        var existingAccount = accountRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        var orders = orderRepository.findByAccountId(id);
        if (!orders.isEmpty()) {
            throw new IllegalArgumentException("Cannot delete account with existing orders");
        }
        accountRepository.delete(existingAccount);
    }

    @Override
    public AccountDTO.AccountRes getCurrentAccount() {
    UserDetails userDetails = (UserDetails) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(userDetails instanceof Account account)) {
            throw new UsernameNotFoundException("User not found");
        }
        return AccountDTO.AccountRes.builder()
                .id(account.getId())
                .name(account.getName())
                .email(account.getEmail())
                .roleName(account.getRole().getName())
                .build();
    }

    private AccountDTO.LoginRes getAccountRes(Account account) {
        var user = AccountDTO.AccountRes.builder()
                .id(account.getId())
                .name(account.getName())
                .email(account.getEmail())
                .roleName(account.getRole().getName())
                .build();
        return new AccountDTO.LoginRes(
                user,
            jwtUtil.generateToken(account)
        );
    }



}
