package com.ericsson.ecb.ui.metraoffer.utils;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.exception.EcbConfigResourceNotFoundException;
import com.ericsson.ecb.common.exception.EcbInvalidConfigResourceNameException;
import com.ericsson.ecb.common.exception.EcbValidationException;

public class XSSValidatorTest {

  @InjectMocks
  private XSSValidator xssvalidator;

  private Map<String, String> securityValidationRules;

  private String RESOURCE_URL = "https://localhost:8074/api/";

  @Before
  public void init()
      throws EcbConfigResourceNotFoundException, EcbInvalidConfigResourceNameException {
    MockitoAnnotations.initMocks(this);

    securityValidationRules = new HashMap<>();
    securityValidationRules.put("ONLOAD_ONERROR_TAG",
        "onload(.*?)= OR onerror(.*?)=,Input consists invalid JSP tag content");
    securityValidationRules.put("VBSCRIPT_TAG",
        "vbscript:,Input consists invalid vbscript content");
    securityValidationRules.put("JAVASCRIPT_TAG",
        "javascript:,Input consists invalid javascript content");
    securityValidationRules.put("EXPRESSION_TAG",
        "expression\\((.*?)\\),Input consists invalid expression tag content");
    securityValidationRules.put("EVAL_TAG",
        "eval\\((.*?)\\),Input consists invalid eval tag content");
    securityValidationRules.put("SCRIPT_LONESOME_TAG",
        "<script(.*?)>,Input consists invalid script content");
    securityValidationRules.put("SCRIPT_END_TAG",
        "<script(.*?)>,Input consists invalid script content");
    securityValidationRules.put("SCRIPT_TAG", "</script>,Input consists invalid script content");
    securityValidationRules.put("SRC_TAG_WITH_DOUBLE_QUOTE",
        "src\\s*=\\\"(.*?)\\\",Input consists invalid src content");
    securityValidationRules.put("SRC_TAG_WITH_SINGLE_QUOTE",
        "src\\s*=\\'(.*?)\\',Input consists invalid src content");
    securityValidationRules.put("XML_TAG", "]]>><,Input consists invalid XML content");
    securityValidationRules.put("SQL_INJECTION_TAG",
        "select\\s*[\\\\*]\\s*from AND sleep\\s*\\(,Request consists invalid SQL script");
    securityValidationRules.put("SLEEP_TAG",
        "start-sleep -s (.*) OR sleep (.*),Request consists invalid content");
    xssvalidator.setSecurityValidationRules(securityValidationRules);

  }

  @Test
  public void testEvalTag() throws EcbBaseException, UnsupportedEncodingException {
    String errorMsg = xssvalidator.isValid(
        "+eval(compile('for x in range(1):\\n import time\\n time.sleep(20)','a','single'))+'");
    Assert.assertNotNull(errorMsg);
    Assert.assertEquals("Input consists invalid eval tag content", errorMsg);
  }

  @Test
  public void testScriptTag() throws EcbBaseException, UnsupportedEncodingException {
    String errorMsg = xssvalidator.isValid(RESOURCE_URL + "Localization/subscribable-item/3194?"
        + "page=%3Cscript%3Ealert%281%29%3B%3C%2Fscript%3E&size=25&sort=kindType%7Casc&loggedInLangCode=us");
    Assert.assertNotNull(errorMsg);
    Assert.assertEquals("Input consists invalid script content", errorMsg);
  }

  @Test
  public void testOnErrorTag() throws EcbBaseException, UnsupportedEncodingException {
    String errorMsg = xssvalidator.isValid(
        "{\"name\":\"AdjustmentReason123\",\"displayName\":\"AdjustmentReason123\",\"description\":\"l9enb<img src=a onerror=alert(1)>m58b8\"}");
    Assert.assertNotNull(errorMsg);
    Assert.assertEquals("Input consists invalid JSP tag content", errorMsg);
  }

  @Test
  public void testOnLoadTag() throws EcbBaseException, UnsupportedEncodingException {
    String errorMsg = xssvalidator.isValid(
        "{\"name\":\"AdjustmentReason123\",\"displayName\":\"AdjustmentReason123\",\"description\":\"l9enb<img src=a onload=alert(1)>m58b8\"}");
    Assert.assertNotNull(errorMsg);
    Assert.assertEquals("Input consists invalid JSP tag content", errorMsg);
  }

  @Test
  public void testExpressionTag() throws EcbBaseException, UnsupportedEncodingException {
    String errorMsg = xssvalidator.isValid(
        "+expression(compile('for x in range(1):\\n import time\\n time.sleep(20)','a','single'))+'");
    Assert.assertNotNull(errorMsg);
    Assert.assertEquals("Input consists invalid expression tag content", errorMsg);
  }

  @Test
  public void testScriptLoneSomeTag() throws EcbBaseException, UnsupportedEncodingException {
    String errorMsg = xssvalidator
        .isValid(RESOURCE_URL + "AdjustmentsReasonCode?loggedInLangCode=us<script src='test.js'/>");
    Assert.assertNotNull(errorMsg);
    Assert.assertEquals("Input consists invalid script content", errorMsg);
  }

  @Test
  public void testSrcDoubleQuoteTag() throws EcbBaseException, UnsupportedEncodingException {
    String errorMsg = xssvalidator.isValid(
        RESOURCE_URL + "AdjustmentsReasonCode?loggedInLangCode=us<script src=\"test.js\"/>");
    Assert.assertNotNull(errorMsg);
    Assert.assertEquals("Input consists invalid src content", errorMsg);
  }

  @Test
  public void testScriptEndTag() throws EcbBaseException, UnsupportedEncodingException {
    String errorMsg = xssvalidator.isValid(
        RESOURCE_URL + "AdjustmentsReasonCode?loggedInLangCode=us<script>alert(1)</script>");
    Assert.assertNotNull(errorMsg);
    Assert.assertEquals("Input consists invalid script content", errorMsg);
  }

  @Test
  public void testXmlTag() throws EcbBaseException, UnsupportedEncodingException {
    String errorMsg =
        xssvalidator.isValid(RESOURCE_URL + "AdjustmentsReasonCode?loggedInLangCode=us]]>><");
    Assert.assertNotNull(errorMsg);
    Assert.assertEquals("Input consists invalid XML content", errorMsg);
  }

  @Test
  public void testStartSleepTag() throws EcbBaseException, UnsupportedEncodingException {
    String errorMsg = xssvalidator.isValid(RESOURCE_URL
        + "Localization?page=1&size=25&sort=kindType%7Cdesc%3Bstart-sleep+-s+%7B0%7D&loggedInLangCode=us\r\n"
        + "\r\n" + "");
    Assert.assertNotNull(errorMsg);
    Assert.assertEquals("Request consists invalid content", errorMsg);
  }

  @Test
  public void testSleepTag() throws EcbBaseException, UnsupportedEncodingException {
    String errorMsg = xssvalidator
        .isValid(RESOURCE_URL + "NonRecurring?loggedInLangCode=us%3Bsleep+%7B0%7D%3B\r\n");
    Assert.assertNotNull(errorMsg);
    Assert.assertEquals("Request consists invalid content", errorMsg);
    testSqlInjection();
  }

  @Test
  public void testSqlInjection() throws EcbBaseException, UnsupportedEncodingException {
    String errorMsg = xssvalidator.isValid(
        RESOURCE_URL + "NonRecurring?loggedInLangCode=us(select*from(select(sleep(20)))a)--");
    Assert.assertNotNull(errorMsg);
    Assert.assertEquals("Request consists invalid SQL script", errorMsg);
  }

  @Test(expected = EcbValidationException.class)
  public void testSqlInjectionValidateXSSStandards()
      throws EcbBaseException, UnsupportedEncodingException {
    xssvalidator.validateXssstandards(
        RESOURCE_URL + "NonRecurring?loggedInLangCode=us(select*from(select(sleep(20)))a)--");
  }

  @Test
  public void testValid() throws EcbBaseException, UnsupportedEncodingException {
    String errorMsg = xssvalidator.isValid(RESOURCE_URL + "NonRecurring?loggedInLangCode=us");
    Assert.assertNull(errorMsg);
  }

  @Test
  public void testValidateXSSStandards() throws EcbBaseException, UnsupportedEncodingException {
    xssvalidator.validateXssstandards(RESOURCE_URL + "NonRecurring?loggedInLangCode=us");
    Assert.assertTrue(true);
  }

  @Test
  public void testValidateXSSStandardsNull() throws EcbBaseException, UnsupportedEncodingException {
    xssvalidator.validateXssstandards(null);
    Assert.assertTrue(true);
  }

  @Test
  public void testValidateXSSStandardsSlash()
      throws EcbBaseException, UnsupportedEncodingException {
    xssvalidator.validateXssstandards("loggedInAs=like=%system_user/Admin%");
    Assert.assertTrue(true);
  }
}
