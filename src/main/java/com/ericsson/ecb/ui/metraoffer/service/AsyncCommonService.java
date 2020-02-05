package com.ericsson.ecb.ui.metraoffer.service;

import java.util.concurrent.CompletableFuture;

import org.springframework.scheduling.annotation.Async;

import com.ericsson.ecb.base.model.ApprovalsV2;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.Approvals;

@Async
public interface AsyncCommonService {

  public CompletableFuture<ApprovalsV2> asyncGetApprovals(Integer approvalId)
      throws EcbBaseException;

  public CompletableFuture<Boolean> asyncManageApprovalStatus(Approvals record)
      throws EcbBaseException;

}
