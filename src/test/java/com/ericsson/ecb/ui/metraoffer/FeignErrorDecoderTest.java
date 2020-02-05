package com.ericsson.ecb.ui.metraoffer;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import com.ericsson.ecb.ui.metraoffer.config.FeignErrorDecoder;
import com.ericsson.ecb.ui.metraoffer.model.ExceptionResponse;

import feign.Response;
import feign.Response.Body;

public class FeignErrorDecoderTest {

  @InjectMocks
  FeignErrorDecoder feignErrorDecoder;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testFeignErrorDecoder() {
    Body body = new Response.Body() {

      @Override
      public void close() throws IOException {}

      @Override
      public Integer length() {
        return null;
      }

      @Override
      public boolean isRepeatable() {
        return false;
      }

      @Override
      public Reader asReader() throws IOException {
        ExceptionResponse response = new ExceptionResponse();
        response.setCode(500);
        response.setMessage("Exception messge from api");
        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = mapper.writeValueAsString(response);
        InputStream is = new ByteArrayInputStream(jsonInString.getBytes());
        Reader bfReader = new BufferedReader(new InputStreamReader(is));
        return bfReader;
      }

      @Override
      public InputStream asInputStream() throws IOException {
        return null;
      }
    };
    Map<String, Collection<String>> headers = new HashMap<String, Collection<String>>();
    Response response =
        Response.builder().status(500).reason("").headers(headers).body(body).build();
    feignErrorDecoder.decode("", response);
  }

  @Test
  public void shouldgetFeignErrorDecoderException() {
    Body body = new Response.Body() {

      @Override
      public void close() throws IOException {}

      @Override
      public Integer length() {
        return null;
      }

      @Override
      public boolean isRepeatable() {
        return false;
      }

      @Override
      public Reader asReader() throws IOException {
        return null;
      }

      @Override
      public InputStream asInputStream() throws IOException {
        return null;
      }
    };
    Map<String, Collection<String>> headers = new HashMap<String, Collection<String>>();
    Response response =
        Response.builder().status(500).reason("").headers(headers).body(body).build();
    feignErrorDecoder.decode("", response);
  }



}
