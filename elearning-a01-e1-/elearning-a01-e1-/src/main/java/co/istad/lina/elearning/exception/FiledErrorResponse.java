package co.istad.lina.elearning.exception;

public record FiledErrorResponse(
        String filed,
        String reason
) {
}
