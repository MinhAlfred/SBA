package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.RoleDTO;
import com.orchid.orchidbe.pojos.Role;
import java.util.List;

public interface RoleService {

    List<Role> getAll();
    Role getById(int id);
    void add(RoleDTO.RoleReq role);
    void update(int id , RoleDTO.RoleReq role);
    void delete(int id);

}
