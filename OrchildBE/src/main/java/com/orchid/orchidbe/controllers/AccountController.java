package com.orchid.orchidbe.controllers;

import com.orchid.orchidbe.apis.MyApiResponse;
import com.orchid.orchidbe.dto.AccountDTO;
import com.orchid.orchidbe.pojos.Account;
import com.orchid.orchidbe.services.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/accounts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Account Api", description = "Operation related to Account")
public class AccountController {

    private final AccountService accountService;

    @GetMapping("")
    @PreAuthorize("hasRole('Admin')")
    @Operation(summary = "Get all accounts", description = "Returns a list of all accounts")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved all accounts")
    public ResponseEntity<MyApiResponse<List<Account>>> getAccounts() {
        log.info("Fetching all accounts");
        return MyApiResponse.success(accountService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get accounts", description = "Returns a accounts")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved all accounts")
    public ResponseEntity<MyApiResponse<Account>> getAccountById(@PathVariable int id) {
        return MyApiResponse.success(accountService.getById(id));
    }

    @PostMapping("/register")
    @Operation(summary = "Create new account", description = "Creates a new account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Account created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input or email already exists")
    })
    public ResponseEntity<MyApiResponse<Object>> createAccount(
        @RequestBody @Valid AccountDTO.AccountReq accountReq
    ) {
        accountService.add(accountReq);
        return MyApiResponse.created();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    @Operation(summary = "Update account", description = "Updates an existing account by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Account updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input or email already exists"),
        @ApiResponse(responseCode = "404", description = "Account not found")
    })
    public ResponseEntity<MyApiResponse<Object>> updateAccount(
        @PathVariable int id,
        @RequestBody @Valid AccountDTO.Update accountReq
    ) {
        accountService.update(id, accountReq);
        return MyApiResponse.updated();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    @Operation(summary = "Delete account", description = "Deletes an account by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Account deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Account not found")
    })
    public ResponseEntity<MyApiResponse<Object>> deleteAccount(@PathVariable int id) {
        accountService.delete(id);
        return MyApiResponse.noContent();

    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Logs in an account and returns a JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "400", description = "Invalid credentials"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<MyApiResponse<AccountDTO.LoginRes>> login(
        @RequestBody AccountDTO.Login accountReq
    ) {
        var accountRes = accountService.login(accountReq.email(), accountReq.password());
        if (accountRes == null) {
            return MyApiResponse.badRequest("Invalid credentials");
        }
        return MyApiResponse.success(accountRes);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('Admin', 'User')")
    @Operation(summary = "Get current account", description = "Returns the currently authenticated account")
    public ResponseEntity<MyApiResponse<AccountDTO.AccountRes>> getCurrentAccount() {
        return MyApiResponse.success(accountService.getCurrentAccount());
    }

}
