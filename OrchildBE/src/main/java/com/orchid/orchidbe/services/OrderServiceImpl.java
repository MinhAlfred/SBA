package com.orchid.orchidbe.services;

import com.orchid.orchidbe.configs.JwtUtil;
import com.orchid.orchidbe.dto.OrderDTO;
import com.orchid.orchidbe.pojos.Account;
import com.orchid.orchidbe.pojos.Order;
import com.orchid.orchidbe.pojos.OrderDetail;
import com.orchid.orchidbe.repositories.AccountRepository;
import com.orchid.orchidbe.repositories.OrchidRepository;
import com.orchid.orchidbe.repositories.OrderDetailRepository;
import com.orchid.orchidbe.repositories.OrderRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{
    private  final OrderRepository orderRepository;
    private final AccountRepository accountRepository;
    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    OrchidRepository orchidRepository;
    @Autowired
    JwtUtil jwtUtil;

    @Override
    public List<OrderDTO.OrderRes> getAll() {
        return orderRepository.findAll().stream()
                .map(this::mapToOrderRes)
                .toList();
    }

    @Override
    public OrderDTO.OrderRes getById(int id) {
        return orderRepository.findById(id)
                .map(this::mapToOrderRes)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + id));
    }

    @Override
    public List<OrderDTO.OrderRes> getByAccount() {
        Account account = getCurrentAccount();
        return orderRepository.findByAccountId(account.getId()).stream()
                .map(this::mapToOrderRes)
                .toList();
    }

    private Account getCurrentAccount() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        String username = securityContext.getAuthentication().getName();
        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("Haven't login yet");
        }
        return accountRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("Account not found with email: " + username));
    }

    @Override
    public OrderDTO.OrderRes add(OrderDTO.OrderReq order) {
        Account account = getCurrentAccount();
        var newOrder = new Order();
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setOrderStatus(Order.OrderStatus.PENDING);
        newOrder.setAccount(account);
        orderRepository.save(newOrder);
        double totalAmount = 0;
        List<OrderDetail> details = order.orderDetails().stream().map(d -> {
            OrderDetail detail = new OrderDetail();
            detail.setOrder(newOrder);  // Gán foreign key
            detail.setOrchid(orchidRepository.findById(d.productId()).orElseThrow(() -> new IllegalArgumentException("Orchid not found with ID: " + d.productId())));
            detail.setQuantity(d.quantity());
            return detail;
        }).toList();
        for (OrderDetail detail : details) {
            totalAmount += detail.getOrchid().getPrice() * detail.getQuantity();
        }
        orderDetailRepository.saveAll(details);
        newOrder.setTotalAmount(totalAmount);
        orderRepository.save(newOrder);
        return mapToOrderRes(newOrder,
                details);
    }

    @Override
    @Transactional
    public OrderDTO.OrderRes update(OrderDTO.OrderUpReq order, int id) {
        var existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + id));
        if(!existingOrder.getOrderStatus().equals(Order.OrderStatus.PENDING)) {
            throw new IllegalArgumentException("Order is not in PENDING status and cannot be updated");
        }
        orderDetailRepository.deleteByOrderId(id);
        double totalAmount = 0;
        List<OrderDetail> details = order.orderDetails().stream().map(d -> {
            OrderDetail detail = new OrderDetail();
            detail.setOrder(existingOrder);  // Gán foreign key
            detail.setOrchid(orchidRepository.findById(d.productId()).orElseThrow(() -> new IllegalArgumentException("Orchid not found with ID: " + d.productId())));
            detail.setQuantity(d.quantity());
            return detail;
        }).toList();
        for (OrderDetail detail : details) {
            totalAmount += detail.getOrchid().getPrice() * detail.getQuantity();
        }
        existingOrder.setTotalAmount(totalAmount);
        orderDetailRepository.saveAll(details);
        orderRepository.save(existingOrder);
        return  mapToOrderRes(existingOrder, details);
    }

    @Override
    public void delete(int id) {
        var existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + id));
        existingOrder.setOrderStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(existingOrder);
    }

    @Override
    public OrderDTO.OrderRes pay(int id) {
        var existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + id));
        if (existingOrder.getOrderStatus() != Order.OrderStatus.PENDING) {
            throw new IllegalArgumentException("Order is not in PENDING status");
        }
        Account account = existingOrder.getAccount();
        if(account!= getCurrentAccount()) {
            throw new IllegalArgumentException("You are not authorized to pay this order");
        }
        existingOrder.setOrderStatus(Order.OrderStatus.COMPLETED);
        orderRepository.save(existingOrder);
        return mapToOrderRes(existingOrder);
    }

    private OrderDTO.OrderRes mapToOrderRes(Order order,List<OrderDetail> details) {
        return new OrderDTO.OrderRes(
            order.getId(),
            order.getTotalAmount(),
            order.getOrderDate(),
            order.getOrderStatus(),
            order.getAccount().getId(),
            details.stream().map(
                detail -> new OrderDTO.OrderDetailRes(
                    detail.getOrchid().getId(),
                    detail.getOrchid().getName(),
                    detail.getOrchid().getUrl(),
                    detail.getOrchid().getCategory() != null ? detail.getOrchid().getCategory().getName() : "Unknown",
                    detail.getQuantity(),
                    detail.getOrchid().getPrice()
                )
            ).toList()
        );
    }
    private OrderDTO.OrderRes mapToOrderRes(Order order) {
        return mapToOrderRes(order, orderDetailRepository.findByOrderId(order.getId()));
    }
}
