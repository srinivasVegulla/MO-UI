/**
 * 
 */
package com.ericsson.ecb.ui.metraoffer.config;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.LocalizedEntityConstants;
import com.ericsson.ecb.ui.metraoffer.utils.XSSValidator;

/**
 *
 */
@Aspect
@Configuration
public class SecurityValidationAspect {

  private static final String COM_ERICSSON_ECB_PKG_STARTS = "com.ericsson.ecb.";

  private final Logger logger = LoggerFactory.getLogger(SecurityValidationAspect.class);

  @Autowired
  private XSSValidator xssValidator;

  @Before("execution(* com.ericsson.ecb.ui.metraoffer.rest.*.*(..))"
      + "&& !@annotation(com.ericsson.ecb.ui.metraoffer.utils.IgnoreDefaultSecurityValidation)"
      + "&& !@target(com.ericsson.ecb.ui.metraoffer.utils.IgnoreDefaultSecurityValidation)")
  public void before(JoinPoint joinPoint) throws EcbBaseException, IOException {

    logger.debug(" Perform Security Validations ");
    StringBuilder stringBuilder = extractmethodArgumentsData(joinPoint);
    extractHttpServletReqParametersData(stringBuilder);
    xssValidator.validateXssstandards(stringBuilder.toString());
    logger.debug(" Allowed execution for {}", joinPoint);
  }

  /**
   * 
   * @param stringBuilder
   * @return
   * @throws EcbBaseException
   * @throws IOException
   */
  private StringBuilder extractHttpServletReqParametersData(StringBuilder stringBuilder)
      throws IOException {

    ServletRequestAttributes servletRequestAttributes =
        (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

    if (servletRequestAttributes != null) {
      HttpServletRequest httpServletRequest = servletRequestAttributes.getRequest();

      if (httpServletRequest instanceof MultiReadRequestWrapper) {
        MultiReadRequestWrapper multiReadRequestWrapper =
            (MultiReadRequestWrapper) httpServletRequest;
        String body = IOUtils.toString(multiReadRequestWrapper.getReader());
        stringBuilder.append(body);
      }
      stringBuilder.append(
          httpServletRequest.getParameter(LocalizedEntityConstants.LOGGED_IN_LANGUAGE_CODE));
    }
    return stringBuilder;
  }

  private StringBuilder extractmethodArgumentsData(JoinPoint joinPoint) {

    String[] valuesArray = null;
    StringBuilder stringBuilder = new StringBuilder();
    for (Object methodArgument : joinPoint.getArgs()) {
      if (methodArgument != null) {
        if (methodArgument instanceof String[]) {
          valuesArray = (String[]) methodArgument;
          stringBuilder.append(Arrays.toString(valuesArray));
        } else if (methodArgument instanceof String) {
          stringBuilder.append(methodArgument.toString());
        } else if (methodArgument instanceof Collection<?>) {
          extractCollectionsArgumentsData(stringBuilder, methodArgument);
        } else if (isECBObj(methodArgument)) {
          stringBuilder.append(ToStringBuilder.reflectionToString(methodArgument));
        }

      }
    }
    return stringBuilder;
  }

  private void extractCollectionsArgumentsData(StringBuilder stringBuilder, Object methodArgument) {
    Collection<?> values = (Collection<?>) methodArgument;
    Object obj = values.iterator().next();
    if (obj != null) {
      if (obj instanceof String) {
        stringBuilder.append(StringUtils.collectionToCommaDelimitedString(values));
      } else if (isECBObj(obj)) {
        for (Object value : values) {
          stringBuilder.append(ToStringBuilder.reflectionToString(value));
        }
      }
    }
  }

  private boolean isECBObj(Object methodArgument) {
    return methodArgument.getClass().getPackage().getName().contains(COM_ERICSSON_ECB_PKG_STARTS);
  }
}
