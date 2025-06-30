package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.OrchidDTO;
import com.orchid.orchidbe.pojos.Orchid;
import java.util.List;

public interface OrchidService {

    List<OrchidDTO.OrchidRes> getAll();
    List<OrchidDTO.OrchidRes> getAllAvailable();
    OrchidDTO.OrchidRes getById(int id);
    OrchidDTO.OrchidRes add(OrchidDTO.OrchidReq orchid);
    OrchidDTO.OrchidRes update(OrchidDTO.OrchidUpReq orchid, int id);
    void delete(Integer orchid);

}
