package com.orchid.orchidbe.apis;

import com.orchid.orchidbe.apis.MyApiResponse.Error;
import com.orchid.orchidbe.apis.MyApiResponse.Success;
import com.orchid.orchidbe.apis.MyApiResponse.ValidationError;
import java.time.Instant;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public sealed interface MyApiResponse<T>
    permits Error, Success, ValidationError {

    int getStatusCode();
    String getMessage();
    Instant getTimestamp();

    // ✅ Success record
    record Success<T>(
        int statusCode,
        String message,
        T data,
        Instant timestamp
    ) implements MyApiResponse<T> {
        @Override public int getStatusCode() { return statusCode; }
        @Override public String getMessage() { return message; }
        @Override public Instant getTimestamp() { return timestamp; }
    }

    // ✅ Error record
    record Error<T>(
        int statusCode,
        String message,
        String reason,
        Instant timestamp
    ) implements MyApiResponse<T> {
        @Override public int getStatusCode() { return statusCode; }
        @Override public String getMessage() { return message; }
        @Override public Instant getTimestamp() { return timestamp; }
    }

    record ValidationError<T>(
        int statusCode,
        String message,
        Map<String, String> fieldErrors,
        Instant timestamp
    ) implements MyApiResponse<T> {
        @Override public int getStatusCode() { return statusCode; }
        @Override public String getMessage() { return message; }
        @Override public Instant getTimestamp() { return timestamp; }
    }

    // ✅ Helper methods
    static <T> ResponseEntity<MyApiResponse<T>> success(T data) {
        return ResponseEntity.ok(new Success<>(
            200, "Success", data, Instant.now()
        ));
    }

    static <T> ResponseEntity<MyApiResponse<T>> created(T data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new Success<>(
            201, "Created successfully", data, Instant.now()
        ));
    }

    static <T> ResponseEntity<MyApiResponse<T>> created() {
        return ResponseEntity.status(HttpStatus.CREATED).body(new Success<>(
            201, "Created successfully", null, Instant.now()
        ));
    }

    static <T> ResponseEntity<MyApiResponse<T>> updated(T data) {
        return ResponseEntity.ok(new Success<>(
            200, "Updated successfully", data, Instant.now()
        ));
    }

    static <T> ResponseEntity<MyApiResponse<T>> updated() {
        return ResponseEntity.ok(new Success<>(
            200, "Updated successfully", null, Instant.now()
        ));
    }

    static <T> ResponseEntity<MyApiResponse<T>> badRequest(String reason) {
        return ResponseEntity.badRequest().body(new Error<>(
            400, "Bad Request", reason, Instant.now()
        ));
    }

    static ResponseEntity<MyApiResponse<Object>> validationError(Map<String, String> errors) {
        return ResponseEntity
            .badRequest()
            .body(new ValidationError<>(
                400,
                "Validation failed",
                errors,
                Instant.now()
            ));
    }

    static <T> ResponseEntity<MyApiResponse<T>> notFound(String reason) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Error<>(
            404, "Not Found", reason, Instant.now()
        ));
    }

    static <T> ResponseEntity<MyApiResponse<T>> noContent() {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new Success<>(
            204, "No Content", null, Instant.now()
        ));
    }

    static <T> ResponseEntity<MyApiResponse<T>> delete() {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Success<>(
                204, "Delete", null, Instant.now()
        ));
    }

    static <T> ResponseEntity<MyApiResponse<T>> error(
        HttpStatus status, String message, String reason
    ) {
        return ResponseEntity.status(status)
            .body(new Error<>(
                status.value(), message, reason, Instant.now()
            ));
    }
}

