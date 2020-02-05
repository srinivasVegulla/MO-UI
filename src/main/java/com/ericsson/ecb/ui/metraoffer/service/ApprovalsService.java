package com.ericsson.ecb.ui.metraoffer.service;

import java.util.List;
import java.util.Map;

import javax.validation.constraints.NotNull;

import com.ericsson.ecb.base.model.AuditAggregator;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.Approvals;
import com.ericsson.ecb.ui.metraoffer.model.OfferingViewChangeDetails;
import com.ericsson.ecb.ui.metraoffer.model.RatesViewChangeDetails;

public interface ApprovalsService {

  public PaginatedList<Approvals> findOfferingUpdatePendingApprovals(@NotNull Integer offerId,
      Integer page, Integer size, String[] sort, String queryIn) throws EcbBaseException;

  public PaginatedList<Approvals> findRateUpdatePendingApprovals(@NotNull Integer scheduleId,
      Integer page, Integer size, String[] sort, String queryIn) throws EcbBaseException;

  public Map<String, Object> getOfferingApprovalsStatus(Integer offerId) throws EcbBaseException;

  public Map<String, Object> getRateApprovalsStatus(Integer scheduleId) throws EcbBaseException;

  public Boolean approveApprovals(List<Approvals> approvalsList) throws EcbBaseException;

  public OfferingViewChangeDetails offeringViewChangeDetails(Integer approvalId)
      throws EcbBaseException;

  public RatesViewChangeDetails ratesViewChangeDetails(Integer scheduleId, Integer approvalId)
      throws EcbBaseException;

  public PaginatedList<AuditAggregator> findApprovalChangeHistory(Integer approvalId, Integer page,
      Integer size, String[] sort, String queryIn) throws EcbBaseException;

}
