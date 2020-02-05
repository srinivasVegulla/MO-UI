package com.ericsson.ecb.ui.metraoffer.service;

import java.io.IOException;
import java.time.OffsetDateTime;

import javax.servlet.http.HttpServletResponse;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.AuditSummary;
import com.ericsson.ecb.ui.metraoffer.model.ChunkRule;
import com.ericsson.ecb.ui.metraoffer.model.RateChanges;

public interface AuditLogService {

  public static final String ENTITY_TYPE_CONDITION = "entityTypeId" + RsqlOperator.EQUAL + "2";

  public static final String[] EXPORT_CSV_HEADER =
      {"Time", "Audit ID", "User", "Logged In As", "Event", "Event ID", "Item", "Entity",
          "Entity ID", "Application Name", "Details", "Rule Set Start Date"};

  public static final String[] EXPORT_CSV_FIELD_MAPPING =
      {"createDt", "auditId", "user", "loggedInAs", "eventName", "eventId", "item", "item",
          "entityId", "applicationName", "details", "ruleSetStartDate"};

  public PaginatedList<AuditSummary> findAuditSummary(Integer page, Integer size, String[] sort,
      String query) throws EcbBaseException;

  public PaginatedList<AuditSummary> findRatesAuditSummary(Integer paramtableId, Integer templateId,
      Integer pricelistId, Integer page, Integer size, String[] sort, String query)
      throws EcbBaseException;

  public RateChanges findRateChanges(Integer scheduleId, Boolean scheduleAndMetadataInfo)
      throws EcbBaseException;

  public void exportToCsv(HttpServletResponse response, Integer paramtableId, Integer templateId,
      Integer pricelistId, Integer page, Integer size, String[] sort, String query)
      throws EcbBaseException, IOException;

  public PaginatedList<ChunkRule> diffRuleSet(Integer scheduleId, OffsetDateTime activeDate,
      Integer page, Integer size) throws EcbBaseException;

}
