package com.ericsson.ecb.ui.metraoffer.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ericsson.ecb.common.authz.Caps;
import com.ericsson.ecb.common.exception.EcbBaseException;

@Component
public class ApprovalsUtil {

  @Autowired
  private Caps caps;

  private static final String UPDATE_PO_APPROVAL =
      "ecb.catalog.rest.BaseProductOfferController.updateSelectiveProductOffer.approval.enabled";
  private static final String UPDATE_PO_APPROVAL_ALLOW_MORE_THAN_ONE =
      "ecb.catalog.rest.BaseProductOfferController.updateSelectiveProductOffer.approval.allowMoreThanOnePendingChange";
  private static final String CREATE_RULE_SET_APPROVAL =
      "ecb.catalog.rest.RuleSetController.createRuleSet.approval.enabled";
  private static final String CREATE_RULE_SET_APPROVAL_ALLOW_MORE_THAN_ONE =
      "ecb.catalog.rest.RuleSetController.createRuleSet.approval.allowMoreThanOnePendingChange";

  public Boolean isUpdatePoApprovalEnabled() throws EcbBaseException {
    return Boolean.valueOf(caps.getApiCapabilities().get(UPDATE_PO_APPROVAL));
  }

  public Boolean isUpdatePoApprovalAllowMoreThanOne() throws EcbBaseException {
    return Boolean.valueOf(caps.getApiCapabilities().get(UPDATE_PO_APPROVAL_ALLOW_MORE_THAN_ONE));
  }

  public Boolean isCreateRuleSetApprovalEnabled() throws EcbBaseException {
    return Boolean.valueOf(caps.getApiCapabilities().get(CREATE_RULE_SET_APPROVAL));
  }

  public Boolean isCreateRuleSetApprovalAllowMoreThanOne() throws EcbBaseException {
    return Boolean
        .valueOf(caps.getApiCapabilities().get(CREATE_RULE_SET_APPROVAL_ALLOW_MORE_THAN_ONE));
  }

}
