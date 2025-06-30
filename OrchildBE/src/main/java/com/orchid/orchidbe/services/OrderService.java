package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.OrderDTO;
import com.orchid.orchidbe.pojos.Account;
import com.orchid.orchidbe.pojos.Order;
import java.util.List;

public interface OrderService {

    List<OrderDTO.OrderRes> getAll();
    OrderDTO.OrderRes getById(int id);
    List<OrderDTO.OrderRes> getByAccount();
    OrderDTO.OrderRes add(OrderDTO.OrderReq order);
    OrderDTO.OrderRes update(OrderDTO.OrderUpReq order, int id);
    void delete(int id);
    OrderDTO.OrderRes pay( int id);
}
