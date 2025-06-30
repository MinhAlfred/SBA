package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.AccountDTO;
import com.orchid.orchidbe.pojos.Account;
import java.util.List;

public interface AccountService {

    List<Account> getAll();
    AccountDTO.LoginRes login(String email, String password);
    Account getById(int id);
    void add(AccountDTO.AccountReq account);
    void update(int id, AccountDTO.Update account);
    void delete(int id);
    AccountDTO.AccountRes getCurrentAccount();
}
