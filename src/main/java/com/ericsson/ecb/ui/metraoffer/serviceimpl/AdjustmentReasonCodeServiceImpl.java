package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.Collection;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.ExtendedReasonCodeClient;
import com.ericsson.ecb.catalog.client.ReasonCodeClient;
import com.ericsson.ecb.catalog.model.LocalizedReasonCode;
import com.ericsson.ecb.catalog.model.ReasonCode;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentReasonCodeService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

@Service
public class AdjustmentReasonCodeServiceImpl implements AdjustmentReasonCodeService {

  @Autowired
  private ReasonCodeClient reasonCodeClient;

  @Autowired
  private ExtendedReasonCodeClient extendedReasonCodeClient;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private EntityHelper entityHelper;

  @Override
  public ReasonCode getReasonCode(Integer propId) throws EcbBaseException {
    ReasonCode reasonCode = reasonCodeClient.getReasonCode(propId).getBody();
    return localizedEntityService.localizedGetEntity(reasonCode);
  }

  @Override
  public Collection<ReasonCode> findReasonCode(Collection<Integer> propId) throws EcbBaseException {
    String query =
        CommonUtils.getQueryStringFromCollection(propId, PropertyRsqlConstants.PROP_ID_IN);
    return findReasonCode(1, Integer.MAX_VALUE, null, query, null, null, null).getRecords();
  }

  @Override
  public PaginatedList<ReasonCode> findReasonCode(Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    PaginatedList<ReasonCode> reasonCodes = findReasonCodeFromApi(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
    return localizedEntityService.localizedFindEntity(reasonCodes);
  }

  private PaginatedList<ReasonCode> findReasonCodeFromApi(Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    return reasonCodeClient.findReasonCode(page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort).getBody();
  }

  @Override
  public Boolean deleteReasonCode(Integer propId) throws EcbBaseException {
    return extendedReasonCodeClient.deleteReasonCode(propId).getBody();
  }

  @Override
  public Boolean updateReasonCode(ReasonCode record, Set<String> fields, Integer propId)
      throws EcbBaseException {
    return entityHelper.updateSelective(record, fields, propId);
  }

  @Override
  public ReasonCode createReasonCode(LocalizedReasonCode reasonCode) throws EcbBaseException {
    localizedEntityService.localizedCreateEntity(reasonCode);
    return reasonCodeClient.createReasonCode(reasonCode).getBody();
  }
}
