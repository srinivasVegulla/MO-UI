package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.base.client.ApprovalsV2Client;
import com.ericsson.ecb.base.client.ExtendedApprovalsV2Client;
import com.ericsson.ecb.base.model.ApprovalsV2;
import com.ericsson.ecb.common.authz.ApprovalStatus;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.Approvals;
import com.ericsson.ecb.ui.metraoffer.service.AsyncCommonService;

@Service
public class AsyncCommonServiceImpl implements AsyncCommonService {

  @Autowired
  private ApprovalsV2Client approvalsV2Client;

  @Autowired
  private ExtendedApprovalsV2Client extendedApprovalsV2Client;

  @Override
  public CompletableFuture<Boolean> asyncManageApprovalStatus(Approvals record)
      throws EcbBaseException {
    Boolean result = extendedApprovalsV2Client
        .manageApprovalStatus(record.getApprovalId(),
            ApprovalStatus.valueOf(record.getCurrentState().toUpperCase()), record.getComment())
        .getBody();
    return CompletableFuture.completedFuture(result);
  }

  @Override
  public CompletableFuture<ApprovalsV2> asyncGetApprovals(Integer approvalId)
      throws EcbBaseException {
    ApprovalsV2 approvalsV2 = approvalsV2Client.getApprovalsV2(approvalId).getBody();
    return CompletableFuture.completedFuture(approvalsV2);
  }

}
