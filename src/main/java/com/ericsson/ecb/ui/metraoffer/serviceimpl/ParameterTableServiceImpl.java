package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.ericsson.ecb.catalog.client.ParameterTableClient;
import com.ericsson.ecb.catalog.client.ParameterTablePropertyClient;
import com.ericsson.ecb.catalog.model.ParameterTable;
import com.ericsson.ecb.catalog.model.ParameterTableProperty;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.EnumData;
import com.ericsson.ecb.metadata.client.MetadataConfigClient;
import com.ericsson.ecb.metadata.model.DefineService;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.ParameterTableMetadata;
import com.ericsson.ecb.ui.metraoffer.service.MasterDataService;
import com.ericsson.ecb.ui.metraoffer.service.ParameterTableService;

@Service
public class ParameterTableServiceImpl implements ParameterTableService {

  private static final Logger LOGGER = LoggerFactory.getLogger(ParameterTableServiceImpl.class);

  @Autowired
  private ParameterTablePropertyClient parameterTablePropertyClient;

  @Autowired
  private MasterDataService masterDataService;

  @Autowired
  private MetadataConfigClient metadataConfigClient;

  @Autowired
  private ParameterTableClient parameterTableClient;


  @Override
  public List<ParameterTableMetadata> getTableMetadata(Integer tableId) throws EcbBaseException {
    LOGGER.info("Fectching ParameterTableProperty for table id:{} ", tableId);
    Collection<ParameterTableProperty> tableProperties =
        getTableProperties(1, Integer.MAX_VALUE, null, "paramTableId==" + tableId).getRecords();
    LOGGER.info("Received ParameterTableProperty for size:{} ", tableProperties.size());
    if (!CollectionUtils.isEmpty(tableProperties)) {
      StringBuilder enumDataQuery = new StringBuilder();
      Map<String, ParameterTableProperty> operatorColumnMap =
          tableProperties.stream().filter(e -> e.getColumnName().endsWith("_op")).collect(
              Collectors.toMap(ParameterTableProperty::getColumnName, property -> property));
      List<ParameterTableMetadata> metadataList = new ArrayList<>();
      for (ParameterTableProperty tableProperty : tableProperties) {
        if (!tableProperty.getColumnName().endsWith("_op")) {
          ParameterTableMetadata parameterTableMetadata = new ParameterTableMetadata();
          BeanUtils.copyProperties(tableProperty, parameterTableMetadata);
          // FIX ME need to implement to get the display name of the column
          parameterTableMetadata.setDisplayName(tableProperty.getName());
          ParameterTableProperty opColumnObject =
              operatorColumnMap.get(parameterTableMetadata.getColumnName() + "_op");
          parameterTableMetadata.set_opParameterTableMetadata(opColumnObject);
          if (parameterTableMetadata.getColumnoperator() || opColumnObject != null) {
            parameterTableMetadata.setConditionColumn(true);
          }
          metadataList.add(parameterTableMetadata);
        }
        if (!StringUtils.isEmpty(tableProperty.getEnumName())
            && !StringUtils.isEmpty(tableProperty.getSpace())) {
          String enumNameAndSpace =
              tableProperty.getSpace() + "/" + tableProperty.getEnumName() + "/";
          if (enumDataQuery.indexOf(enumNameAndSpace) == -1) {
            enumDataQuery.append("name" + RsqlOperator.LIKE);
            enumDataQuery.append("'").append(enumNameAndSpace).append("%'");
            enumDataQuery.append(RsqlOperator.OR);
          }
        }
      }
      LOGGER.info("Filter query for enum data : {}", enumDataQuery);
      if (enumDataQuery.length() > 0) {
        Map<String, List<EnumData>> enumDataMap = getEnumDataForTableProperties(
            enumDataQuery.substring(0, enumDataQuery.lastIndexOf("or")));

        for (ParameterTableMetadata tableMetadata : metadataList) {
          if (enumDataMap != null && !StringUtils.isEmpty(tableMetadata.getEnumName())
              && !StringUtils.isEmpty(tableMetadata.getSpace())) {

            List<EnumData> enumDataList = new ArrayList<>();
            if (!tableMetadata.getRequired()) {
              EnumData enumData = new EnumData();
              enumDataList.add(enumData);
            }
            String name = tableMetadata.getSpace() + "/" + tableMetadata.getEnumName() + "/";
            enumDataList.addAll(enumDataMap.get(name.toLowerCase()));
            tableMetadata.setEnumData(enumDataList);
          }
        }
      }
      return metadataList;
    }
    return Collections.emptyList();
  }

  @Override
  public List<ParameterTableMetadata> getTableMetadataWithDn(Integer paramTableId)
      throws EcbBaseException {

    List<ParameterTableMetadata> orderedTableMetadata = getTableMetadata(paramTableId);
    List<ParameterTableMetadata> parameterTableMetadataList = new ArrayList<>();
    DefineService defineServices =
        metadataConfigClient.getParameterTableMetadata(enumName(paramTableId)).getBody();

    Map<String, ParameterTableMetadata> parameterTableMetadataMap = new HashMap<>();
    orderedTableMetadata.forEach(parameterTableMetadata -> parameterTableMetadataMap
        .put(parameterTableMetadata.getDisplayName(), parameterTableMetadata));
    defineServices.getPropertyTypes().forEach(propertyType -> {
      ParameterTableMetadata parameterTableMetadata =
          parameterTableMetadataMap.get(propertyType.getDn());
      if (parameterTableMetadata != null) {
        if (!StringUtils.isBlank(propertyType.getDisplayName())) {
          parameterTableMetadata.setDisplayName(propertyType.getDisplayName());
        }
        parameterTableMetadataList.add(parameterTableMetadata);
      }
    });
    return parameterTableMetadataList;
  }

  private String enumName(Integer paramTableID) throws EcbBaseException {
    ParameterTable pricelistMappingsList =
        parameterTableClient.getParameterTable(paramTableID).getBody();
    String name = pricelistMappingsList.getName();
    return name.substring(name.lastIndexOf('/') + 1, name.length());
  }

  private PaginatedList<ParameterTableProperty> getTableProperties(Integer page, Integer size,
      String[] sort, String query) throws EcbBaseException {
    return parameterTablePropertyClient.findParameterTableProperty(page, size, sort, query)
        .getBody();
  }

  private Map<String, List<EnumData>> getEnumDataForTableProperties(String enumDataQuery)
      throws EcbBaseException {
    if (!enumDataQuery.isEmpty()) {
      LOGGER.info("Fetching EnumData for table properties with query : {}", enumDataQuery);
      Collection<EnumData> enumDataCollection =
          masterDataService.findEnumData(1, Integer.MAX_VALUE, null, enumDataQuery);
      LOGGER.info("Received EnumData for table properties size : {}", enumDataCollection.size());
      Map<String, List<EnumData>> enumDataMap = new HashMap<>();

      if (!enumDataCollection.isEmpty()) {
        enumDataCollection.forEach(enumData -> {
          String name = enumData.getName();
          String enumName = (name.substring(0, name.lastIndexOf('/') + 1)).toLowerCase();
          enumData.setName(name.substring(enumData.getName().lastIndexOf('/') + 1, name.length()));
          if (enumDataMap.get(enumName) == null) {
            List<EnumData> enumDataList = new ArrayList<>();
            enumDataList.add(enumData);
            enumDataMap.put(enumName, enumDataList);
          } else {
            List<EnumData> enumDataList = enumDataMap.get(enumName);
            enumDataList.add(enumData);
            enumDataMap.put(enumName, enumDataList);
          }
        });
      }
      return enumDataMap;
    }
    return Collections.emptyMap();
  }

}
