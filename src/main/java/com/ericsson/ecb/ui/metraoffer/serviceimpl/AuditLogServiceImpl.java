package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import com.ericsson.ecb.base.client.AuditAggregatorClient;
import com.ericsson.ecb.base.model.AuditAggregator;
import com.ericsson.ecb.catalog.client.PricelistClient;
import com.ericsson.ecb.catalog.client.RateScheduleClient;
import com.ericsson.ecb.catalog.client.RuleSetClient;
import com.ericsson.ecb.catalog.model.Chunk;
import com.ericsson.ecb.catalog.model.RateSchedule;
import com.ericsson.ecb.catalog.model.Rule;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.AuditSummary;
import com.ericsson.ecb.ui.metraoffer.model.ChunkRule;
import com.ericsson.ecb.ui.metraoffer.model.RateChanges;
import com.ericsson.ecb.ui.metraoffer.service.AuditLogService;
import com.ericsson.ecb.ui.metraoffer.service.ParameterTableService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;
import com.ericsson.ecb.ui.metraoffer.utils.MoErrorMessagesUtil;

@Service
public class AuditLogServiceImpl implements AuditLogService {

  private static final Logger LOGGER = LoggerFactory.getLogger(AuditLogServiceImpl.class);

  @Autowired
  private AuditAggregatorClient auditAggregatorClient;

  @Autowired
  private RateScheduleClient rateScheduleClient;

  @Autowired
  private RuleSetClient ruleSetClient;

  @Autowired
  private PricelistClient pricelistClient;

  @Autowired
  private ParameterTableService parameterTableService;

  @Autowired
  private MoErrorMessagesUtil moErrorMessagesUtil;

  @Override
  public PaginatedList<AuditSummary> findAuditSummary(Integer pageIn, Integer sizeIn, String[] sort,
      String query) throws EcbBaseException {
    Integer page = pageIn != null ? pageIn : 1;
    Integer size = sizeIn != null ? sizeIn : Integer.MAX_VALUE;
    PaginatedList<AuditAggregator> paginatedRecords = auditAggregatorClient
        .findAuditAggregator(page, size, sort, filterByEntityType(query)).getBody();
    Collection<AuditAggregator> records = paginatedRecords.getRecords();
    List<AuditSummary> auditSummaryList = new ArrayList<>();
    if (!CollectionUtils.isEmpty(records)) {
      records.forEach(auditAggregator -> {
        AuditSummary auditSummary = new AuditSummary();
        BeanUtils.copyProperties(auditAggregator, auditSummary);
        auditSummary.setUser(auditAggregator.getLoginName() + "/" + auditAggregator.getSpace());
        if (auditAggregator.getEventId() != null && (auditAggregator.getEventId().equals(1400)
            || auditAggregator.getEventId().equals(1402))) {
          auditSummary.setRuleSetStartDate(auditAggregator.getCreateDt());
        }
        auditSummaryList.add(auditSummary);
      });
    }
    return createAuditSummaryPaginateList(paginatedRecords, auditSummaryList);
  }

  @Override
  public void exportToCsv(HttpServletResponse response, Integer paramtableId, Integer templateId,
      Integer pricelistId, Integer pageIn, Integer sizeIn, String[] sort, String query)
      throws EcbBaseException, IOException {

    String csvFileName = "export.csv";
    response.setContentType("text/csv");
    String headerKey = "Content-Disposition";
    String headerValue = String.format("attachment; filename=\"%s\"", csvFileName);
    response.setHeader(headerKey, headerValue);
    PaginatedList<AuditSummary> paginatedRecords;
    Integer page = pageIn != null ? pageIn : 1;
    Integer size = sizeIn != null ? sizeIn : Integer.MAX_VALUE;
    if (Stream.of(paramtableId, templateId, pricelistId).allMatch(x -> x == null)) {
      LOGGER.info("Fetching global audit summary to export..");
      paginatedRecords = findAuditSummary(page, size, sort, query);
    } else {
      LOGGER.info("Fetching rates specific audit summary to export..");
      paginatedRecords =
          findRatesAuditSummary(paramtableId, templateId, pricelistId, page, size, sort, query);
    }
    ICsvBeanWriter csvWriter =
        new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);
    csvWriter.writeHeader(EXPORT_CSV_HEADER);
    Collection<AuditSummary> records = paginatedRecords.getRecords();
    for (AuditSummary auditSummary : records) {
      csvWriter.write(auditSummary, EXPORT_CSV_FIELD_MAPPING);
    }
    csvWriter.close();
  }

  @Override
  public PaginatedList<AuditSummary> findRatesAuditSummary(Integer paramtableId, Integer templateId,
      Integer pricelistId, Integer pageIn, Integer sizeIn, String[] sort, String query)
      throws EcbBaseException {
    String scheduleQuery = "ptId==" + paramtableId + RsqlOperator.AND + "itemTemplateId=="
        + templateId + RsqlOperator.AND + "pricelistId==" + pricelistId;
    Collection<RateSchedule> scheduleRecords = rateScheduleClient
        .findRateSchedule(1, Integer.MAX_VALUE, null, scheduleQuery, null, null, null).getBody()
        .getRecords();
    if (!CollectionUtils.isEmpty(scheduleRecords)) {
      List<Integer> schedIds =
          scheduleRecords.stream().map(RateSchedule::getSchedId).collect(Collectors.toList());
      Integer page = pageIn != null ? pageIn : 1;
      Integer size = sizeIn != null ? sizeIn : Integer.MAX_VALUE;
      String scheduleFilter = "entityId" + RsqlOperator.IN
          + StringUtils.replace(StringUtils.replace(schedIds.toString(), "[", "("), "]", ")");
      query =
          (query == null) ? scheduleFilter : query.concat(RsqlOperator.AND).concat(scheduleFilter);
      return findAuditSummary(page, size, sort, query);
    }
    return null;
  }

  @Override
  public RateChanges findRateChanges(Integer scheduleId, Boolean scheduleAndMetadataInfo)
      throws EcbBaseException {
    LOGGER.info("Find Rate changes for scheduleId:{}", scheduleId);
    RateChanges rateChanges = new RateChanges();
    if (scheduleAndMetadataInfo == null || scheduleAndMetadataInfo) {
      RateSchedule rateSchedule = null;
      try {
        rateSchedule = rateScheduleClient.getRateSchedule(scheduleId).getBody();
      } catch (HttpClientErrorException e) {
        if (e.getMessage().contains("entity not found")) {
          throw new EcbBaseException(moErrorMessagesUtil.getErrorMessages("SCHED_PO_DELETE"));
        } else {
          throw new EcbBaseException(e.getMessage());
        }
      }
      rateChanges.setRateSchedule(rateSchedule);
      rateChanges
          .setPricelist(pricelistClient.getPricelist(rateSchedule.getPricelistId()).getBody());
      rateChanges
          .setTableMetadata(parameterTableService.getTableMetadataWithDn(rateSchedule.getPtId()));
    }
    return rateChanges;
  }

  @Override
  public PaginatedList<ChunkRule> diffRuleSet(Integer scheduleId, OffsetDateTime activeDate,
      Integer page, Integer size) throws EcbBaseException {
    List<Chunk<Rule>> rulesDiff = null;
    try {
      rulesDiff = ruleSetClient.diffRuleSet(scheduleId, activeDate, true);
    } catch (HttpClientErrorException e) {
      if (e.getMessage().contains("entity not found")) {
        throw new EcbBaseException(moErrorMessagesUtil.getErrorMessages("SCHED_PO_DELETE"));
      } else {
        throw new EcbBaseException(e.getMessage());
      }
    }
    List<ChunkRule> chunkRuleList = new ArrayList<>();
    rulesDiff.forEach(rulesDiffTmp -> {
      List<Rule> original = rulesDiffTmp.getOriginalItems();
      List<Rule> revised = rulesDiffTmp.getRevisedItems();
      Integer itemsSize = 0;
      if (!CollectionUtils.isEmpty(original)) {
        itemsSize = original.size();
      } else if (!CollectionUtils.isEmpty(revised)) {
        itemsSize = revised.size();
      }
      if (itemsSize > 0) {
        chunkRuleList.addAll(getChunkRuleList(itemsSize, rulesDiffTmp, original, revised));
      }
    });
    return CommonUtils.customPaginatedList(chunkRuleList, page, size);
  }

  private List<ChunkRule> getChunkRuleList(Integer itemsSize, Chunk<Rule> rulesDiffTmp,
      List<Rule> original, List<Rule> revised) {
    List<ChunkRule> chunkRuleList = new ArrayList<>();
    for (int i = 0; i < itemsSize; i++) {
      ChunkRule chunkRule = new ChunkRule();
      BeanUtils.copyProperties(rulesDiffTmp, chunkRule);
      if (!CollectionUtils.isEmpty(original)) {
        chunkRule.setOriginalItem(original.get(i));
      }
      if (!CollectionUtils.isEmpty(revised)) {
        chunkRule.setRevisedItem(revised.get(i));
      }
      chunkRuleList.add(chunkRule);
    }
    return chunkRuleList;
  }

  private PaginatedList<AuditSummary> createAuditSummaryPaginateList(
      PaginatedList<AuditAggregator> paginatedlist, List<AuditSummary> records) {
    PaginatedList<AuditSummary> paginatedAuditSummary = new PaginatedList<>();
    paginatedAuditSummary.setTotalPages(paginatedlist.getTotalPages());
    paginatedAuditSummary.setTotalCount(paginatedlist.getTotalCount());
    paginatedAuditSummary.setCurrentPage(paginatedlist.getCurrentPage());
    paginatedAuditSummary.setTotalPageSize(paginatedlist.getTotalPageSize());
    paginatedAuditSummary.setRecords(records);
    return paginatedAuditSummary;
  }

  private String filterByEntityType(String query) {
    return StringUtils.isEmpty(query) ? ENTITY_TYPE_CONDITION
        : query + RsqlOperator.AND + ENTITY_TYPE_CONDITION;
  }
}
