package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections4.map.CaseInsensitiveMap;
import org.springframework.web.multipart.MultipartFile;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.Description;
import com.ericsson.ecb.common.model.Language;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.Localization;

public interface LocalizationService {

  public static String PROP_ID_IN = "propId" + RsqlOperator.IN;

  public static String OFFER_ID_IN = "offerId" + RsqlOperator.IN;

  public static String KIND = "kind";

  public static String KIND_IN = KIND + RsqlOperator.IN;

  public static String ENGLISH_US_CODE = "us";

  public static String ENGLISH_US_DESCRIPTION = "English(US)";

  public static String ENGLISH_UK_CODE = "gb";

  public static String ENGLISH_UK_DESCRIPTION = "English(UK)";

  public static final String OBJECT_TYPE_HEADER = "Object Type";

  public static final String OBJECT_NAME_HEADER = "Object Name";

  public static final String OBJECT_PROPERTY_HEADER = "Property";

  public static final String DISPLAY_NAME = "Display Name";

  public static final String DESC_ID_HEADER = "descId";

  public static final String OBJECT_TYPE = "ObjectType";

  public static final String OBJECT_NAME = "ObjectName";

  public static final String PROPERTY = "Property";

  public static final String DESC_ID = "descId";

  public static final String OBJECT_TYPE_HEADER_NAME = "ObjectTypeHeader";

  public static final String OBJECT_NAME_HEADER_NAME = "ObjectNameHeader";

  public static final String PROPERTY_HEADER_NAME = "PropertyHeader";

  public static final String DESC_ID_HEADER_NAME = "descIdHeader";

  public static final String ROW_NUNBER = "RowNo";

  public static final String COLUMN_NUMBER = "ColumnNo";

  public static final String ERROR_MSG_KEY = "ErrorMessage";

  public static final String ERROR_MSG_INVALID_HEADERS =
      "Invalid Headers, Check if headers are correct and have proper commas.";

  public static final String NOT_VALID_LANG_CODE = " - is not a valid language code.";

  public static final String NOT_VALID_HEADER = " is not a valid header.";

  public static final String INVALID_HEADERS = "Invalid Headers, ";

  public Collection<Language> findLanguage(Integer page, Integer size, String[] sort, String query)
      throws EcbBaseException;

  public Collection<Description> updateLocalization(List<Localization> localizationList,
      Set<String> selectedLangs) throws EcbBaseException;

  public PaginatedList<Localization> findSubscribableItemLocalization(Integer offerId, Integer page,
      Integer size, String[] sort, String query) throws EcbBaseException;

  public PaginatedList<Localization> findLocalization(Integer page, Integer size, String[] sort,
      String query) throws EcbBaseException;

  public PaginatedList<Localization> findPiTemplateLocalization(Integer pItemplateId, Integer page,
      Integer size, String[] sort, String queryIn) throws EcbBaseException;

  public PaginatedList<Localization> findPiInstanceLocalization(Integer pIInstanceId, Integer page,
      Integer size, String[] sort, String queryIn) throws EcbBaseException;

  void exportToCsv(HttpServletResponse response, Integer page, Integer size, String[] sort,
      String query, LinkedHashMap<String, String> fileHeaderMap, Set<String> langguageCode)
      throws Exception;

  public Map<String, Integer> getLanguageCodeMap() throws EcbBaseException;

  public CaseInsensitiveMap<String, Integer> getLanguageCodeCaseInsensitiveMap()
      throws EcbBaseException;

  public Map<Integer, String> getDescsBylangCodeId(Set<Integer> descIds, Integer langId)
      throws EcbBaseException;

  public Integer importFromCsv(MultipartFile file) throws EcbBaseException;

  public PaginatedList<Localization> getSubscriptionPropLocalization(Integer specId, Integer page,
      Integer size, String[] sort, String query) throws EcbBaseException;
}

