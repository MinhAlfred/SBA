package com.orchid.orchidbe.exceptions;

import com.orchid.orchidbe.apis.MyApiResponse;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<MyApiResponse<Object>> handleNullPointerException
        (
        NullPointerException e) {
        log.error("NullPointerException: ", e);
        return MyApiResponse.error(
            HttpStatus.BAD_REQUEST,
            "Null pointer exception occurred",
            e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<MyApiResponse<Object>> handleIllegalArgumentException(
        IllegalArgumentException e) {
        log.error("IllegalArgumentException: ", e);
        return MyApiResponse.error(
            HttpStatus.BAD_REQUEST,
            "Invalid argument provided",
            e.getMessage());
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<MyApiResponse<Object>> handleJwtException(
            JwtException e) {
        log.error("JwtException: ", e);
        return MyApiResponse.error(
                HttpStatus.UNAUTHORIZED,
                "Invalid jwt token",
                e.getMessage());
    }
//    @ExceptionHandler(AccessDeniedException.class)
//    public ResponseEntity<MyApiResponse<Object>> handleAccessDenied(AccessDeniedException ex) {
//        log.error("JwtException: ", ex);
//        return MyApiResponse.error(
//                HttpStatus.FORBIDDEN,
//                "Access denied",
//                ex.getMessage());
//    }
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<MyApiResponse<Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
    String errorMessage = ex.getBindingResult().getFieldErrors().stream()
            .map(DefaultMessageSourceResolvable::getDefaultMessage)
            .collect(Collectors.joining(", "));

    return MyApiResponse.badRequest(errorMessage);
}


}
