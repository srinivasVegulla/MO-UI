package com.ericsson.ecb.ui.metraoffer.config;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

public class MultiReadRequestWrapper extends HttpServletRequestWrapper {

  private String requestData;

  public MultiReadRequestWrapper(HttpServletRequest request)
      throws IOException {
    super(request);
    requestData = "";
    StringBuilder stringBuilderObj = new StringBuilder();
    BufferedReader bufferedReader = request.getReader();

    String line;
    while ((line = bufferedReader.readLine()) != null) {
      stringBuilderObj.append(line);
    }
    requestData = stringBuilderObj.toString();
  }

  @Override
  public ServletInputStream getInputStream() throws IOException {
    final ByteArrayInputStream byteArrayInputStream =
        new ByteArrayInputStream(requestData.getBytes());
    return new ServletInputStream() {
      public int read() throws IOException {
        return byteArrayInputStream.read();
      }

      @Override
      public boolean isFinished() {
        return false;
      }

      @Override
      public boolean isReady() {
        return false;
      }

      @Override
      public void setReadListener(ReadListener readListener) {
    	  //Overriden Method

      }
    };
  }

  @Override
  public BufferedReader getReader() throws IOException {
    return new BufferedReader(new InputStreamReader(getInputStream()));
  }
}
