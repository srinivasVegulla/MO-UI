package com.ericsson.ecb.ui.metraoffer;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

import com.ericsson.ecb.ui.metraoffer.exception.MetraofferExceptionHandler;
import com.ericsson.ecb.ui.metraoffer.exception.PreconditionFailedException;

public class MetraofferExceptionHandlerTest {

  @InjectMocks
  MetraofferExceptionHandler metraofferExceptionHandler;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testExceptionHandlers() {
    metraofferExceptionHandler.handleRunTimeException(new RuntimeException("Runtime Exception"));
    metraofferExceptionHandler.handleDefault(new Exception("Default Exception"));
    metraofferExceptionHandler
        .handleIllegalArgumentException(new IllegalArgumentException("IllegalArgument"));
    metraofferExceptionHandler.handleHttpClientErrorException(
        new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR, "Http Client Exception"));
    metraofferExceptionHandler.handlePreconditionFailedException(
        new PreconditionFailedException("Precondition Failed Exception"));
  }
}
