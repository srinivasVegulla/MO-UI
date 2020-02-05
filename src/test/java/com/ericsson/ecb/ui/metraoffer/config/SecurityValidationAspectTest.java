package com.ericsson.ecb.ui.metraoffer.config;

import static org.mockito.Mockito.when;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collection;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.ericsson.ecb.catalog.model.ReasonCode;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.utils.XSSValidator;

public class SecurityValidationAspectTest {

  private static final String TEST_DATA = "testData";

  @InjectMocks
  private SecurityValidationAspect securityValidationAspect;

  @Mock
  private XSSValidator xssValidator;

  @Mock
  private JoinPoint joinPoint;

  @Mock
  private HttpServletRequest httpServletRequest;

  @Mock
  private MultiReadRequestWrapper multiReadRequestWrapper;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testArgumentsEmptyData() throws EcbBaseException, IOException {
    Object[] objArray = new Object[0];
    when(joinPoint.getArgs()).thenReturn(objArray);
    securityValidationAspect.before(joinPoint);
    Assert.assertTrue(true);
  }

  @Test
  public void testStringArguments() throws EcbBaseException, IOException {
    Object[] objArray = new Object[1];
    objArray[0] = TEST_DATA;
    when(joinPoint.getArgs()).thenReturn(objArray);
    securityValidationAspect.before(joinPoint);
    Assert.assertTrue(true);
  }

  @Test
  public void testStringArrayArguments() throws EcbBaseException, IOException {
    Object[] objArray = new Object[1];
    String[] strArray = new String[1];
    strArray[0] = TEST_DATA;
    objArray[0] = strArray;
    when(joinPoint.getArgs()).thenReturn(objArray);
    RequestContextHolder
        .setRequestAttributes(new ServletRequestAttributes(multiReadRequestWrapper));
    when(multiReadRequestWrapper.getReader()).thenReturn(prepareBufferedReader());
    securityValidationAspect.before(joinPoint);
    Assert.assertTrue(true);
  }

  @Test
  public void testStringCollectionArguments() throws EcbBaseException, IOException {
    Object[] objArray = new Object[1];
    Collection<String> strCollection = new ArrayList<>();
    strCollection.add(TEST_DATA);
    objArray[0] = strCollection;
    when(joinPoint.getArgs()).thenReturn(objArray);
    RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(httpServletRequest));
    when(httpServletRequest.getAttribute(Mockito.anyString())).thenReturn("us");

    securityValidationAspect.before(joinPoint);
    Assert.assertTrue(true);
  }

  @Test
  public void testECBObj() throws EcbBaseException, IOException {
    Object[] objArray = new Object[1];
    objArray[0] = prepareReasonCode();
    when(joinPoint.getArgs()).thenReturn(objArray);

    securityValidationAspect.before(joinPoint);
    Assert.assertTrue(true);
  }

  @Test
  public void testStringCollectionECBObj() throws EcbBaseException, IOException {
    Object[] objArray = new Object[1];
    Collection<ReasonCode> strCollection = new ArrayList<>();
    strCollection.add(prepareReasonCode());
    objArray[0] = strCollection;
    when(joinPoint.getArgs()).thenReturn(objArray);

    securityValidationAspect.before(joinPoint);
    Assert.assertTrue(true);
  }

  @Test
  public void testECBObjInValid() throws EcbBaseException, IOException {
    Object[] objArray = new Object[1];
    objArray[0] = prepareReasonCode();
    when(joinPoint.getArgs()).thenReturn(objArray);

    securityValidationAspect.before(joinPoint);
    Assert.assertTrue(true);
  }

  private ReasonCode prepareReasonCode() {
    ReasonCode reasonCode = new ReasonCode();
    reasonCode.setDescription("ReasonCodeDesc");
    reasonCode.setDescriptionId(123);
    reasonCode.setDisplayName("ReasonCodeDispName");
    reasonCode.setDisplayNameId(456);
    reasonCode.setName("ReasonCode");
    return reasonCode;
  }

  private BufferedReader prepareBufferedReader() {
    InputStream is = new ByteArrayInputStream(TEST_DATA.getBytes());
    BufferedReader bfReader = new BufferedReader(new InputStreamReader(is));
    return bfReader;
  }

}
