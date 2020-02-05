package com.ericsson.ecb.ui.metraoffer.config;

import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import com.ericsson.ecb.ui.metraoffer.model.ExceptionResponse;

import feign.Response;
import feign.Util;
import feign.codec.ErrorDecoder;

@Component
@Primary
public class FeignErrorDecoder implements ErrorDecoder {

  private static final Logger LOGGER = LoggerFactory.getLogger(FeignErrorDecoder.class);
  private ErrorDecoder delegate = new ErrorDecoder.Default();

  @Override
  public Exception decode(String methodKey, Response response) {
    try {
      String responseBody = Util.toString(response.body().asReader());
      ExceptionResponse exception =
          new ObjectMapper().readValue(responseBody, ExceptionResponse.class);
      return new HttpClientErrorException(HttpStatus.valueOf(exception.getCode()),
          exception.getMessage(), null, null, null);
    } catch (Exception ex) {
      LOGGER.error("Exception rasisd while decoding FeignException " + ex.getCause(), ex);
    }
    return delegate.decode(methodKey, response);
  }
}
