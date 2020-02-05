package com.ericsson.ecb.ui.metraoffer.config;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.HttpMethod;

import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.ericsson.ecb.ui.metraoffer.utils.MoRsqlParser;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@ControllerAdvice
public class MoGetResponseBodyAdvice implements ResponseBodyAdvice<Object> {

  private static final Logger LOGGER = LoggerFactory.getLogger(MoGetResponseBodyAdvice.class);

  private ObjectMapper objectMapper;

  @PostConstruct
  public void serializingObjectMapper() {
    objectMapper = new ObjectMapper();
    JavaTimeModule javaTimeModule = new JavaTimeModule();
    javaTimeModule.addSerializer(LocalDate.class, new LocalDateSerializer());
    javaTimeModule.addDeserializer(LocalDate.class, new LocalDateDeserializer());
    objectMapper.registerModule(javaTimeModule);
    objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
  }

  @Override
  public boolean supports(MethodParameter returnType,
      Class<? extends HttpMessageConverter<?>> converterType) {
    Boolean flag = Boolean.FALSE;
    RequestMapping requestMapping = returnType.getMethodAnnotation(RequestMapping.class);
    if (requestMapping != null && ArrayUtils.contains(requestMapping.method(), RequestMethod.GET)) {
      flag = Boolean.TRUE;
    }
    return flag;
  }

  @Override
  public Object beforeBodyWrite(Object body, MethodParameter returnType,
      MediaType selectedContentType, Class<? extends HttpMessageConverter<?>> selectedConverterType,
      ServerHttpRequest request, ServerHttpResponse response) {
    HttpServletRequest servletRequest = ((ServletServerHttpRequest) request).getServletRequest();
    if (HttpMethod.GET.equals(request.getMethod().name())) {
      String query = servletRequest.getParameter("query");
      String[] dFilterValues = servletRequest.getParameterMap().get("dFilter");
      LOGGER.info("query: {}, dFilterValues:{}", query, dFilterValues);
      Map<String, String> filterMap = new HashMap<>();
      try {
        filterMap = MoRsqlParser.parseQuerydFilterToMap(query, dFilterValues);
      } catch (Exception e) {
        LOGGER.error("exception occured while parsing query: {} ,  dFilter: {}, error message : {}",
            query, dFilterValues, e.getMessage());
      }
      if (MapUtils.isNotEmpty(filterMap)) {
        JsonNode jsonNode = objectMapper.convertValue(body, JsonNode.class);
        try {
          if (jsonNode instanceof ObjectNode) {
            ((ObjectNode) jsonNode).putPOJO("filter", filterMap);
            LOGGER.info("filter json :{}", filterMap);
            body = objectMapper.convertValue(jsonNode, Object.class);
          }
        } catch (Exception e) {
          LOGGER.error(
              "Exception occured while adding filter : {} to json body , error message : {} ",
              filterMap, e.getMessage());
        }
      }
    }
    return body;
  }

  private class LocalDateSerializer extends JsonSerializer<LocalDate> {
    @Override
    public void serialize(LocalDate value, JsonGenerator gen, SerializerProvider serializers)
        throws IOException {
      gen.writeString(value.format(DateTimeFormatter.ISO_DATE_TIME));
    }
  }

  private class LocalDateDeserializer extends JsonDeserializer<LocalDate> {
    @Override
    public LocalDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
      return LocalDate.parse(p.getValueAsString(), DateTimeFormatter.ISO_DATE_TIME);
    }
  }

}


