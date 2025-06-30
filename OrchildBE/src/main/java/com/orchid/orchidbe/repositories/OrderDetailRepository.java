package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.pojos.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    boolean existsByOrderIdAndOrchidId(Integer orderId, Integer orchidId);
    boolean existsById(Integer id);
    List<OrderDetail> findByOrderId(Integer orderId);
    void deleteByOrderId(Integer orderId);
}
