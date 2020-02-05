package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.validation.constraints.NotNull;

import org.apache.commons.collections.MapUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.base.client.ApprovalsV2Client;
import com.ericsson.ecb.base.client.AuditAggregatorClient;
import com.ericsson.ecb.base.client.ExtendedApprovalsV2Client;
import com.ericsson.ecb.base.model.ApprovalsV2;
import com.ericsson.ecb.base.model.AuditAggregator;
import com.ericsson.ecb.base.model.ViewChangeDetails;
import com.ericsson.ecb.catalog.client.PricelistClient;
import com.ericsson.ecb.catalog.client.RateScheduleClient;
import com.ericsson.ecb.catalog.model.Pricelist;
import com.ericsson.ecb.catalog.model.RateSchedule;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.authz.ApprovalStatus;
import com.ericsson.ecb.common.exception.EcbAuthorizationException;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyConstants;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.Approvals;
import com.ericsson.ecb.ui.metraoffer.model.OfferingViewChangeDetails;
import com.ericsson.ecb.ui.metraoffer.model.RatesViewChangeDetails;
import com.ericsson.ecb.ui.metraoffer.service.ApprovalsService;
import com.ericsson.ecb.ui.metraoffer.utils.ApprovalsUtil;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;
import com.google.gson.Gson;

@Service
public class ApprovalsServiceImpl implements ApprovalsService {

  @Autowired
  private ApprovalsV2Client approvalsV2Client;

  @Autowired
  private ExtendedApprovalsV2Client extendedApprovalsV2Client;

  @Autowired
  private AuditAggregatorClient auditAggregatorClient;

  @Autowired
  private RateScheduleClient rateScheduleClient;

  @Autowired
  private PricelistClient pricelistClient;

  @Autowired
  private ApprovalsUtil approvalsUtil;

  private static final String OFFERING_UPDATE_CHANGE_TYPE = "OfferingUpdate";
  private static final String RATE_UPDATE_CHANGE_TYPE = "RateUpdate";

  private static final String ALLOW_MORE_THAN_ONE_TRUE = "allowMoreThanOneTrue";
  private static final String ALLOW_MORE_THAN_ONE_FALSE = "allowMoreThanOneFalse";
  private static final String MESSAGE = "message";

  private static final Logger LOGGER = LoggerFactory.getLogger(ApprovalsServiceImpl.class);

  @Override
  public PaginatedList<Approvals> findOfferingUpdatePendingApprovals(Integer offerId, Integer page,
      Integer size, String[] sort, String queryIn) throws EcbBaseException {
    String query = PropertyConstants.CHANGE_TYPE + RsqlOperator.EQUAL + OFFERING_UPDATE_CHANGE_TYPE;
    if (StringUtils.isNotBlank(queryIn))
      query = queryIn + RsqlOperator.AND + query;
    return findPendingApprovals(offerId, page, size, sort, query);
  }

  private Collection<Approvals> findOfferingUpdatePendingApprovals(@NotNull Integer offerId)
      throws EcbBaseException {
    return findOfferingUpdatePendingApprovals(offerId, 1, Integer.MAX_VALUE, null, null)
        .getRecords();
  }

  @Override
  public PaginatedList<Approvals> findRateUpdatePendingApprovals(Integer scheduleId, Integer page,
      Integer size, String[] sort, String queryIn) throws EcbBaseException {
    String query = PropertyConstants.CHANGE_TYPE + RsqlOperator.EQUAL + RATE_UPDATE_CHANGE_TYPE;
    if (StringUtils.isNotBlank(queryIn))
      query = queryIn + RsqlOperator.AND + query;
    return findPendingApprovals(scheduleId, page, size, sort, query);
  }

  private Collection<Approvals> findRateUpdatePendingApprovals(Integer scheduleId)
      throws EcbBaseException {
    return findRateUpdatePendingApprovals(scheduleId, 1, Integer.MAX_VALUE, null, null)
        .getRecords();
  }

  private PaginatedList<Approvals> findPendingApprovals(@NotNull Integer uniqueItemId, Integer page,
      Integer size, String[] sort, String queryIn) throws EcbBaseException {
    StringBuilder query = new StringBuilder();
    query.append(PropertyConstants.UNIQUE_ITEM_ID).append(RsqlOperator.EQUAL).append(uniqueItemId)
        .append(RsqlOperator.AND).append(PropertyConstants.CURRENT_STATE).append(RsqlOperator.IN)
        .append('(').append(ApprovalStatus.PENDING.name()).append(',')
        .append(ApprovalStatus.FAILEDTOAPPLY.name()).append(')');
    if (StringUtils.isNotBlank(queryIn))
      query.append(RsqlOperator.AND).append(queryIn);
    return findApprovals(page, size, sort, query.toString());
  }

  private PaginatedList<Approvals> findApprovals(Integer page, Integer size, String[] sort,
      String query) throws EcbBaseException {
    PaginatedList<Approvals> approvals = new PaginatedList<>();
    List<Approvals> approvalsList = new ArrayList<>();
    PaginatedList<ApprovalsV2> records =
        approvalsV2Client.findApprovalsV2(page, size, sort, query).getBody();
    for (ApprovalsV2 approvalsV2 : records.getRecords()) {
      Approvals approval = new Approvals();
      BeanUtils.copyProperties(approvalsV2, approval);
      approvalsList.add(approval);
    }
    CommonUtils.copyPaginatedList(records, approvals);
    approvals.setRecords(approvalsList);
    return approvals;
  }

  @Override
  public Map<String, Object> getOfferingApprovalsStatus(Integer offerId) throws EcbBaseException {
    Map<String, Object> map = getDefaultApprovalStatusMap();
    if (approvalsUtil.isUpdatePoApprovalEnabled()) {
      Collection<Approvals> pendingApprovals = findOfferingUpdatePendingApprovals(offerId);
      if (!CollectionUtils.isEmpty(pendingApprovals)) {
        map.put(Constants.HAS_PENDING_APPROVALS, Boolean.TRUE);
        if (approvalsUtil.isUpdatePoApprovalAllowMoreThanOne()) {
          map.put(Constants.APPROVALS_WARNING_MSG, ALLOW_MORE_THAN_ONE_TRUE);
        } else {
          map.put(Constants.APPROVALS_WARNING_MSG, ALLOW_MORE_THAN_ONE_FALSE);
          map.put(Constants.ENABLE_APPROVALS_EDIT, Boolean.FALSE);
        }
      }
    }
    return map;
  }

  @Override
  public Map<String, Object> getRateApprovalsStatus(Integer sheduleId) throws EcbBaseException {
    Map<String, Object> map = getDefaultApprovalStatusMap();
    if (approvalsUtil.isCreateRuleSetApprovalEnabled()) {
      Collection<Approvals> pendingApprovals = Collections.emptyList();
      try {
        pendingApprovals = findRateUpdatePendingApprovals(sheduleId);
      } catch (EcbAuthorizationException ex) {
        LOGGER.warn("Unable to find pending approvals since logged in user is not UNAUTHORIZED :{}",
            ex.getMessage());
      }
      if (!CollectionUtils.isEmpty(pendingApprovals)) {
        map.put(Constants.HAS_PENDING_APPROVALS, Boolean.TRUE);
        if (approvalsUtil.isCreateRuleSetApprovalAllowMoreThanOne()) {
          map.put(Constants.APPROVALS_WARNING_MSG, ALLOW_MORE_THAN_ONE_TRUE);
        } else {
          map.put(Constants.APPROVALS_WARNING_MSG, ALLOW_MORE_THAN_ONE_FALSE);
          map.put(Constants.ENABLE_APPROVALS_EDIT, Boolean.FALSE);
        }
      }
    }
    return map;
  }

  @Override
  public OfferingViewChangeDetails offeringViewChangeDetails(Integer approvalId)
      throws EcbBaseException {

    @SuppressWarnings("unchecked")
    List<ViewChangeDetails> viewChangeDetails =
        (List<ViewChangeDetails>) extendedApprovalsV2Client.viewChangeDetails(approvalId).getBody();

    OfferingViewChangeDetails offeringViewChangeDetails = new OfferingViewChangeDetails();
    offeringViewChangeDetails.getChangeDetails().addAll(viewChangeDetails);
    PaginatedList<AuditAggregator> changeHistoryRecords = getChangeHistoryRecords(approvalId);
    offeringViewChangeDetails.setChangeHistory(changeHistoryRecords);
    return offeringViewChangeDetails;
  }

  @Override
  public RatesViewChangeDetails ratesViewChangeDetails(Integer scheduleId, Integer approvalId)
      throws EcbBaseException {

    @SuppressWarnings("unchecked")
    List<LinkedHashMap<String, Object>> rules =
        (ArrayList<LinkedHashMap<String, Object>>) extendedApprovalsV2Client
            .viewChangeDetails(approvalId).getBody();

    RatesViewChangeDetails ratesViewChangeDetails = new RatesViewChangeDetails();
    ratesViewChangeDetails.getChangeDetails().addAll(rules);
    PaginatedList<AuditAggregator> changeHistoryRecords = getChangeHistoryRecords(approvalId);
    ratesViewChangeDetails.setChangeHistory(changeHistoryRecords);
    RateSchedule rateSchedule = rateScheduleClient.getRateSchedule(scheduleId).getBody();
    ratesViewChangeDetails.setRateSchedule(rateSchedule);
    Pricelist priceList = pricelistClient.getPricelist(rateSchedule.getPricelistId()).getBody();
    ratesViewChangeDetails.setPricelist(priceList);
    return ratesViewChangeDetails;
  }

  @Override
  public Boolean approveApprovals(List<Approvals> approvalsList) throws EcbBaseException {
    Map<Integer, String> errorMap = new HashMap<>();
    Integer approvalsId = null;
    for (int i = 0; i < approvalsList.size(); i++) {
      try {
        Approvals approvals = approvalsList.get(i);
        approvalsId = approvals.getApprovalId();
        extendedApprovalsV2Client.manageApprovalStatus(approvalsId,
            ApprovalStatus.valueOf(approvals.getCurrentState().toUpperCase()),
            approvals.getComment());
      } catch (Exception e) {
        CommonUtils.handleExceptions(e, null);
        String errormsg = "Failed to validate the request. Reason:";
        if (e.getMessage().contains(errormsg)) {
          String errorMessage = StringUtils.substringAfter(e.getMessage(), errormsg);
          ObjectMapper mapper = new ObjectMapper();
          try {
            HashMap<String, String> map =
                mapper.readValue(errorMessage, new TypeReference<Map<String, String>>() {});
            errorMap.put(approvalsId, map.get(MESSAGE));
          } catch (IOException ioe) {
            errorMap.put(approvalsId, e.getMessage());
          }
        } else {
          errorMap.put(approvalsId, e.getMessage());
        }
      }
    }
    if (MapUtils.isNotEmpty(errorMap)) {
      Gson json = new Gson();
      throw new EcbBaseException(json.toJson(errorMap));
    }
    return Boolean.TRUE;
  }

  private Map<String, Object> getDefaultApprovalStatusMap() {
    Map<String, Object> map = new HashMap<>();
    map.put(Constants.HAS_PENDING_APPROVALS, Boolean.FALSE);
    map.put(Constants.APPROVALS_WARNING_MSG, StringUtils.EMPTY);
    map.put(Constants.ENABLE_APPROVALS_EDIT, Boolean.TRUE);
    return map;
  }

  @Override
  public PaginatedList<AuditAggregator> findApprovalChangeHistory(Integer approvalId, Integer page,
      Integer size, String[] sort, String queryIn) throws EcbBaseException {
    String query = PropertyConstants.ENTITY_ID + RsqlOperator.EQUAL + approvalId + RsqlOperator.AND
        + PropertyRsqlConstants.ENTITY_TYPE_ID_EQUAL + "10";
    if (StringUtils.isNoneBlank(queryIn))
      query = RsqlOperator.AND + queryIn;
    return auditAggregatorClient.findAuditAggregator(page, size, sort, query).getBody();
  }

  private PaginatedList<AuditAggregator> getChangeHistoryRecords(Integer approvalId)
      throws EcbBaseException {
    String[] sort = new String[1];
    sort[0] = PropertyConstants.CREATE_DATE + RsqlOperator.PIPE + RsqlOperator.DESC;
    return findApprovalChangeHistory(approvalId, 1, Integer.MAX_VALUE, sort, null);
  }
}
