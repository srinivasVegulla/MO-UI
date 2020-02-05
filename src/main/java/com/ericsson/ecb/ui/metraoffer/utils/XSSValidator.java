package com.ericsson.ecb.ui.metraoffer.utils;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.Normalizer;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.exception.EcbValidationException;

/**
 * Filters Http requests and removes malicious characters/strings (i.e. XSS) from the Query String
 */
@Component
public class XSSValidator {

  private static final String FILE_SEPARATOR = "file:///";
  private static final String SECURITY_CONFIG_SUFFIX_PATH = "default/securityConfig/";
  private static final String ECB_STATIC_RESOURCE_LOCATION = "ecb.static.resource.location";
  private static final String AND_OPERATOR = " AND ";
  private static final String OR_OPERATOR = " OR ";
  private static final String UTF_8_ENCODING = "UTF-8";
  private static final String NULL_IDENTIFICATION = "\0";
  private static final String EMPTY_STRING = "";
  private static final String COMMA = ",";
  private static final String SECURITY_VALIDATION_RULES_YML = "security-validations-config.yml";

  private Map<String, String> securityValidationRules;

  private final Logger logger = LoggerFactory.getLogger(XSSValidator.class);

  @Autowired
  private Environment environment;

  @Autowired
  private MoErrorMessagesUtil moErrorMessagesUtil;

  /**
   * Removes all the potentially malicious characters from a string
   * 
   * @param value the raw string
   * @return
   * @return the sanitized string
   * @throws EcbBaseException
   * @throws UnsupportedEncodingException
   */
  public void validateXssstandards(String value)
      throws EcbBaseException, UnsupportedEncodingException {
    logger.debug(" Entering validateXssstandards :: {} ", value);
    if (value != null) {
      String errorMsg = isValid(value);

      if (errorMsg != null) {
        throw new EcbValidationException(errorMsg);
      }
    }
    logger.debug(" Exit validateXssstandards :: ");
  }

  /**
   * 
   * @param value
   * @return
   * @throws EcbBaseException
   * @throws UnsupportedEncodingException
   */
  public String isValid(String value) throws EcbBaseException, UnsupportedEncodingException {

    String normalizedValue = Normalizer.normalize(value, Normalizer.Form.NFD);

    normalizedValue = normalizedValue.replaceAll(NULL_IDENTIFICATION, EMPTY_STRING);

    normalizedValue = encodeDecodeValue(normalizedValue);

    getSecurityValidationRules();

    return validateSecurityPatterns(normalizedValue);
  }

  /**
   * Validate the Security Patterns
   * 
   * @param normalizedValue - the value that needs to be validated
   * 
   * @return the error message if any incorrect request or value as null
   */
  private String validateSecurityPatterns(String normalizedValue) {

    String errorMsg = null;
    String[] validationPattern = null;
    for (Map.Entry<String, String> entry : securityValidationRules.entrySet()) {
      validationPattern = entry.getValue().split(COMMA);
      if (validationPattern != null && validationPattern.length >= 2) {
        if (validationPattern[0].contains(AND_OPERATOR)) {
          errorMsg = validateANDLogicalPattern(normalizedValue, errorMsg, validationPattern);
        } else if (validationPattern[0].contains(OR_OPERATOR)) {
          errorMsg = validateORLogicalPattern(normalizedValue, errorMsg, validationPattern);
        } else {
          errorMsg = validatePattern(normalizedValue, validationPattern[0], validationPattern[1]);
        }
      }
      if (errorMsg != null) {
        break;
      }
    }
    return errorMsg;
  }

  private String validateORLogicalPattern(String normalizedValue, String errorMsg,
      String[] validationPattern) {
    String[] multiValidationPatterns;
    multiValidationPatterns = validationPattern[0].split(OR_OPERATOR);
    if (isAnyPatternsMatched(normalizedValue, multiValidationPatterns)) {
      errorMsg = validationPattern[1];
    }
    return errorMsg;
  }

  private String validateANDLogicalPattern(String normalizedValue, String errorMsg,
      String[] validationPattern) {
    String[] multiValidationPatterns = validationPattern[0].split(AND_OPERATOR);
    if (isAllPatternsMatched(normalizedValue, multiValidationPatterns)) {
      errorMsg = validationPattern[1];
    }
    return errorMsg;
  }

  private boolean isAnyPatternsMatched(String normalizedValue, String[] validationPatterns) {
    Pattern scriptPattern;
    boolean anyMatch = false;
    for (String validationPattern : validationPatterns) {
      scriptPattern = Pattern.compile(validationPattern,
          Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
      if (scriptPattern.matcher(normalizedValue).find()) {
        anyMatch = true;
        break;
      }
    }
    return anyMatch;
  }

  private boolean isAllPatternsMatched(String normalizedValue, String[] validationPatterns) {
    Pattern scriptPattern;
    boolean allMatches = true;

    if (validationPatterns == null) {
      allMatches = false;
    } else {
      for (String validationPattern : validationPatterns) {
        scriptPattern = Pattern.compile(validationPattern,
            Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
        if (!scriptPattern.matcher(normalizedValue).find()) {
          allMatches = false;
          break;
        }
      }
    }

    return allMatches;
  }

  private String validatePattern(String normalizedValue, String patternDetails, String errorMsg) {
    Pattern scriptPattern;
    scriptPattern = Pattern.compile(patternDetails,
        Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
    if (scriptPattern.matcher(normalizedValue).find()) {
      return errorMsg;
    }
    return null;
  }

  /**
   * 
   * @param normalizedValue
   * @return
   * @throws UnsupportedEncodingException
   */
  private String encodeDecodeValue(String normalizedValue) throws UnsupportedEncodingException {
    return decode(URLEncoder.encode(normalizedValue, UTF_8_ENCODING));
  }

  /**
   * 
   * @param url
   * @return
   * @throws UnsupportedEncodingException
   */
  private String decode(String url) throws UnsupportedEncodingException {
    String prevURL = "";
    String decodeURL = url;
    try {
      if (StringUtils.isNotBlank(decodeURL) && StringUtils.isBlank(prevURL)) {
        while (!prevURL.equals(decodeURL)) {
          prevURL = decodeURL;
          decodeURL = URLDecoder.decode(decodeURL, UTF_8_ENCODING);
        }
      }
    } catch (IllegalArgumentException illegalArgumentException) {
      logger.warn(" Exception while decoding the value {} ",
          decodeURL + " " + illegalArgumentException.getMessage());
    }
    return decodeURL;
  }

  /**
   * Retrieves the security validation from externalize file
   * 
   * @return the map of values
   */
  @SuppressWarnings("unchecked")
  @PostConstruct
  private Map<String, String> getSecurityValidationRules() throws EcbBaseException {
    if (securityValidationRules != null && !securityValidationRules.isEmpty()) {
      return securityValidationRules;
    }
    synchronized (this) {
      try {
        securityValidationRules = new HashMap<>();
        Yaml yaml = new Yaml();
        File file =
            new File(getResourcePath(SECURITY_CONFIG_SUFFIX_PATH + SECURITY_VALIDATION_RULES_YML));
        try (InputStream stream = new ByteArrayInputStream(FileUtils.readFileToByteArray(file))) {
          securityValidationRules.putAll(yaml.loadAs(stream, HashMap.class));
        }
      } catch (Exception exception) {
        logger.error("Error reading the security validation rules file", exception);
        throw new EcbBaseException(moErrorMessagesUtil
            .getErrorMessages("ERR_READING_SECURITY_VALIDATION_RULES", exception.getMessage()));
      }

      if (securityValidationRules.isEmpty()) {
        logger.warn("Security Validation Rules has empty configuration");
      }

      return securityValidationRules;
    }
  }

  /**
   * Creates Security validations file resource path
   */
  private String getResourcePath(String resourceFileName) {
    String filePath = environment.getProperty(ECB_STATIC_RESOURCE_LOCATION) + resourceFileName;
    if (filePath.contains(FILE_SEPARATOR)) {
      filePath = filePath.replace(FILE_SEPARATOR, "");
    }
    return filePath;
  }

  public void setSecurityValidationRules(Map<String, String> securityValidationRules) {
    this.securityValidationRules = securityValidationRules;
  }

}
