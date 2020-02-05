package com.ericsson.ecb.ui.metraoffer.exception;

import java.io.UnsupportedEncodingException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.exception.EcbExceptionResponse;
import com.ericsson.ecb.common.exception.EcbNotFoundException;
import com.ericsson.ecb.common.exception.EcbValidationException;
import com.ericsson.ecb.ui.metraoffer.model.ExceptionResponse;
import com.ericsson.ecb.ui.metraoffer.utils.XSSValidator;
import com.fasterxml.jackson.core.JsonParseException;
import com.netflix.client.ClientException;

import feign.FeignException;
import feign.RetryableException;

@ControllerAdvice
public class MetraofferExceptionHandler {

  private static final String INVALID_SQL_SYNTAX = "Invalid RSQL Syntax";
  private static final String RSQL_PARSER_TOKEN_MGR_ERROR = "cz.jirutka.rsql.parser";
  private static final String CLIENT_EXCEPTION = "com.netflix.client.ClientException";
  private static final String RETRYABL_EEXCEPTION = "feign.RetryableException";
  private static final String UNABLE_TO_PROCESS = "Unable to process the Request. Please try again";
  private static final String SEMI_COLON = ";";
  private static final String HYPHEN = "-";

  private static final String INVALID_REQUEST_MESSAGE = "Invalid Request Message";
  private static final String INVALID_JSON_REQUEST = "Invalid JSON Request";
  private static final String SERVICE_DOWN =
      "Service cannot be found. Please contact system administrator";


  private static final Logger LOGGER = LoggerFactory.getLogger(MetraofferExceptionHandler.class);

  @Autowired
  private XSSValidator xssValidator;

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ExceptionResponse> handleRunTimeException(RuntimeException ex) {
    LOGGER.error("MetraofferExceptionHandler: RuntimeException ", ex);
    HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    String errorMsg = ex.getMessage();
    if (ex.getMessage().contains(CLIENT_EXCEPTION)) {
      httpStatus = HttpStatus.SERVICE_UNAVAILABLE;
      errorMsg = SERVICE_DOWN;
    }
    ExceptionResponse exception = new ExceptionResponse(httpStatus.value(), errorMsg);
    return new ResponseEntity<>(exception, httpStatus);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ExceptionResponse> handleIllegalArgumentException(
      IllegalArgumentException ex) {
    LOGGER.error("MetraofferExceptionHandler: IllegalArgumentException ", ex);
    String message = ex.getMessage();
    if (message.contains(HYPHEN)) {
      message = message.split(HYPHEN)[0];
    }
    ExceptionResponse exception = new ExceptionResponse(HttpStatus.BAD_REQUEST.value(), message);
    return new ResponseEntity<>(exception, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(PreconditionFailedException.class)
  public ResponseEntity<ExceptionResponse> handlePreconditionFailedException(Exception ex) {
    LOGGER.error("MetraofferExceptionHandler: PreconditionFailedException ", ex);
    ExceptionResponse exception =
        new ExceptionResponse(HttpStatus.PRECONDITION_FAILED.value(), ex.getMessage());
    return new ResponseEntity<>(exception, HttpStatus.PRECONDITION_FAILED);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ExceptionResponse> handleDefault(Exception ex) {
    LOGGER.error("MetraofferExceptionHandler: DefaultException ", ex);
    ExceptionResponse exception = new ExceptionResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
        ex == null || ex.getMessage() == null ? "Default Exception " : ex.getMessage());
    return new ResponseEntity<>(exception, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(EcbBaseException.class)
  public ResponseEntity<ExceptionResponse> handleEcbBaseException(Exception ex) {
    LOGGER.error("MetraofferExceptionHandler: DefaultException ", ex);
    HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
    String errorMsg = ex.getMessage();

    if (ex.getMessage().contains(CLIENT_EXCEPTION)
        || ex.getMessage().contains(RETRYABL_EEXCEPTION)) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      errorMsg = SERVICE_DOWN;
    }
    ExceptionResponse exception = new ExceptionResponse(status.value(), errorMsg);
    return new ResponseEntity<>(exception, status);
  }

  @ExceptionHandler(HttpClientErrorException.class)
  public ResponseEntity<ExceptionResponse> handleHttpClientErrorException(
      HttpClientErrorException ex) {
    LOGGER.error("MetraofferExceptionHandler: HttpClientErrorException code: {}, message: {} ",
        ex.getRawStatusCode(), ex.getStatusText());
    LOGGER.error("MetraofferExceptionHandler: HttpClientErrorException ", ex);
    ExceptionResponse exception = null;
    ResponseEntity<ExceptionResponse> exceptionResponse = null;
    if (ex.getStatusText().contains(RSQL_PARSER_TOKEN_MGR_ERROR)) {
      exception = new ExceptionResponse(HttpStatus.BAD_REQUEST.value(), INVALID_SQL_SYNTAX);
      exceptionResponse = new ResponseEntity<>(exception, HttpStatus.BAD_REQUEST);
    } else {
      exception = new ExceptionResponse(ex.getRawStatusCode(), ex.getStatusText());
      exceptionResponse = new ResponseEntity<>(exception, ex.getStatusCode());
    }
    return exceptionResponse;
  }

  @ExceptionHandler(JsonParseException.class)
  public ResponseEntity<ExceptionResponse> handleJsonParseException(JsonParseException ex) {
    LOGGER.error("MetraofferExceptionHandler: JsonParseException ", ex);
    ExceptionResponse exception =
        new ExceptionResponse(HttpStatus.BAD_REQUEST.value(), INVALID_JSON_REQUEST);
    return new ResponseEntity<>(exception, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ExceptionResponse> handleHttpMessageNotReadableException(
      HttpMessageNotReadableException ex) {
    LOGGER.error("MetraofferExceptionHandler: HttpMessageNotReadableException ", ex);
    ExceptionResponse exception =
        new ExceptionResponse(HttpStatus.BAD_REQUEST.value(), INVALID_REQUEST_MESSAGE);
    return new ResponseEntity<>(exception, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<ExceptionResponse> handleMethodArgumentTypeMismatchException(
      MethodArgumentTypeMismatchException ex) {
    LOGGER.error("MetraofferExceptionHandler: MethodArgumentTypeMismatchException ", ex);
    String message = ex.getMessage();

    /**
     * Code to resolve the security concerns and display of the incorrect input value
     */
    if (message.contains(SEMI_COLON)) {
      message = message.split(SEMI_COLON)[0];
    }

    ExceptionResponse exception = new ExceptionResponse(HttpStatus.BAD_REQUEST.value(), message);
    return new ResponseEntity<>(exception, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(EcbValidationException.class)
  public ResponseEntity<ExceptionResponse> handleEcbValidationException(EcbValidationException ex) {
    LOGGER.error("MetraofferExceptionHandler: EcbValidationException ", ex);
    ExceptionResponse exception =
        new ExceptionResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
    return new ResponseEntity<>(exception, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(FeignException.class)
  public ResponseEntity<ExceptionResponse> handleFeignException(FeignException ex) {
    LOGGER.error("MetraofferExceptionHandler: FeignException ", ex);
    ExceptionResponse exception =
        new ExceptionResponse(HttpStatus.BAD_REQUEST.value(), UNABLE_TO_PROCESS);
    return new ResponseEntity<>(exception, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<ExceptionResponse> handleIllegalStateException(IllegalStateException ex)
      throws UnsupportedEncodingException, EcbBaseException {
    LOGGER.error("MetraofferExceptionHandler: IllegalStateException ", ex);
    String errorMsg = ex.getMessage();
    String validateErrorMsg = xssValidator.isValid(errorMsg);
    ExceptionResponse exception = null;
    if (validateErrorMsg != null) {
      exception = new ExceptionResponse(HttpStatus.BAD_REQUEST.value(), validateErrorMsg);
    } else {
      exception = new ExceptionResponse(HttpStatus.BAD_REQUEST.value(), errorMsg);
    }
    return new ResponseEntity<>(exception, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(PartialContentException.class)
  public ResponseEntity<ExceptionResponse> handlePartialContentException(
      PartialContentException ex) {
    LOGGER.error("MetraofferExceptionHandler: PartialContentException ", ex);
    ExceptionResponse exception =
        new ExceptionResponse(HttpStatus.PARTIAL_CONTENT.value(), ex.getMessage());
    return new ResponseEntity<>(exception, HttpStatus.PARTIAL_CONTENT);
  }

  @ExceptionHandler(EcbNotFoundException.class)
  public ResponseEntity<EcbExceptionResponse> handleNotFoundException(EcbNotFoundException ex) {
    LOGGER.error("ECBApiExceptionHandler: EcbNotFoundException ", ex);
    EcbExceptionResponse exception =
        new EcbExceptionResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
    return new ResponseEntity<>(exception, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(RetryableException.class)
  public ResponseEntity<EcbExceptionResponse> handleRetryableException(RetryableException ex) {
    LOGGER.error("ECBApiExceptionHandler: RetryableException -> ECB API Service request is timeout",
        ex);
    EcbExceptionResponse exception =
        new EcbExceptionResponse(HttpStatus.REQUEST_TIMEOUT.value(), SERVICE_DOWN);
    return new ResponseEntity<>(exception, HttpStatus.REQUEST_TIMEOUT);
  }

  @ExceptionHandler(ClientException.class)
  public ResponseEntity<EcbExceptionResponse> handleClientException(ClientException ex) {
    LOGGER.error(
        "ECBApiExceptionHandler: ClientException -> ECB API Service is not available in the service discovery",
        ex);
    EcbExceptionResponse exception =
        new EcbExceptionResponse(HttpStatus.SERVICE_UNAVAILABLE.value(), SERVICE_DOWN);
    return new ResponseEntity<>(exception, HttpStatus.SERVICE_UNAVAILABLE);
  }
}
