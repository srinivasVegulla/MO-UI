package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.ParameterTableClient;
import com.ericsson.ecb.catalog.client.ParameterTablePropertyClient;
import com.ericsson.ecb.catalog.model.ParameterTable;
import com.ericsson.ecb.catalog.model.ParameterTableProperty;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.model.EnumData;
import com.ericsson.ecb.metadata.client.MetadataConfigClient;
import com.ericsson.ecb.metadata.model.DefineService;
import com.ericsson.ecb.metadata.model.PropertyType;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.ParameterTableServiceImpl;

public class ParameterTableServiceImplTest {

  @Mock
  private ParameterTablePropertyClient parameterTablePropertyClient;

  @Mock
  private MasterDataService masterDataService;

  @InjectMocks
  private ParameterTableServiceImpl parameterTableServiceImpl;

  @Mock
  private MetadataConfigClient metadataConfigClient;

  @Mock
  private ParameterTableClient parameterTableClient;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void shouldGetTableMetadata() throws Exception {
    PaginatedList<ParameterTableProperty> tablePropertyPaginated = new PaginatedList<>();
    List<ParameterTableProperty> properties = new ArrayList<>();
    ParameterTableProperty tableProperty = new ParameterTableProperty();
    tableProperty.setColumnName("Column1");
    tableProperty.setColumnoperator(false);
    tableProperty.setSpace("metratech.com/testSpace");
    tableProperty.setEnumName("testEnum");
    tableProperty.setRequired(false);
    tableProperty.setName("DN");
    ParameterTableProperty tableProperty1 = new ParameterTableProperty();
    tableProperty1.setColumnName("Column1_op");
    tableProperty1.setName("DN");
    properties.add(tableProperty);
    properties.add(tableProperty1);
    tablePropertyPaginated.setRecords(properties);
    ResponseEntity<PaginatedList<ParameterTableProperty>> tablePropertyPaginatedList =
        new ResponseEntity<PaginatedList<ParameterTableProperty>>(tablePropertyPaginated,
            HttpStatus.OK);

    List<EnumData> enumDataRecords = new ArrayList<>();
    EnumData enumData = new EnumData();
    enumData.setName("metratech.com/testSpace/testEnum/");
    enumData.setEnumDataId(11);
    enumDataRecords.add(enumData);

    when(masterDataService.findEnumData(1, Integer.MAX_VALUE, null,
        "name=like='metratech.com/testSpace/testEnum/%' ")).thenReturn(enumDataRecords);

    when(parameterTablePropertyClient.findParameterTableProperty(1, Integer.MAX_VALUE, null,
        "paramTableId==1")).thenReturn(tablePropertyPaginatedList);
    parameterTableServiceImpl.getTableMetadata(1);
  }

  @Test
  public void shouldGetTableMetadataWithDn() throws Exception {

    PaginatedList<ParameterTableProperty> tablePropertyPaginated = new PaginatedList<>();
    List<ParameterTableProperty> properties = new ArrayList<>();
    ParameterTableProperty tableProperty = new ParameterTableProperty();
    tableProperty.setColumnName("Column1");
    tableProperty.setColumnoperator(false);
    tableProperty.setSpace("metratech.com/testSpace");
    tableProperty.setEnumName("testEnum");
    tableProperty.setRequired(false);
    tableProperty.setName("DN");
    ParameterTableProperty tableProperty1 = new ParameterTableProperty();
    tableProperty1.setColumnName("Column1_op");
    tableProperty1.setName("DN");
    properties.add(tableProperty);
    properties.add(tableProperty1);
    tablePropertyPaginated.setRecords(properties);
    ResponseEntity<PaginatedList<ParameterTableProperty>> tablePropertyPaginatedList =
        new ResponseEntity<PaginatedList<ParameterTableProperty>>(tablePropertyPaginated,
            HttpStatus.OK);
    List<EnumData> enumDataRecords = new ArrayList<>();
    EnumData enumData = new EnumData();
    enumData.setName("metratech.com/testSpace/testEnum/");
    enumData.setEnumDataId(11);
    enumDataRecords.add(enumData);

    when(masterDataService.findEnumData(1, Integer.MAX_VALUE, null,
        "name=like='metratech.com/testSpace/testEnum/%' ")).thenReturn(enumDataRecords);
    when(parameterTablePropertyClient.findParameterTableProperty(1, Integer.MAX_VALUE, null,
        "paramTableId==1")).thenReturn(tablePropertyPaginatedList);
    ParameterTable parameterTable = new ParameterTable();
    parameterTable.setName("sample/data");
    ResponseEntity<ParameterTable> rateScheduleRsp =
        new ResponseEntity<ParameterTable>(parameterTable, HttpStatus.OK);
    when(parameterTableClient.getParameterTable(1)).thenReturn(rateScheduleRsp);

    String enumName = "data";
    DefineService defineService = new DefineService();

    List<PropertyType> propertyTypesList = new ArrayList<>();
    PropertyType propertyType = new PropertyType();
    propertyType.setDn("DN");
    propertyType.setDisplayName("sample DN");
    propertyTypesList.add(propertyType);
    defineService.setPropertyTypes(propertyTypesList);

    ResponseEntity<DefineService> rsp =
        new ResponseEntity<DefineService>(defineService, HttpStatus.OK);
    when(metadataConfigClient.getParameterTableMetadata(enumName)).thenReturn(rsp);
    parameterTableServiceImpl.getTableMetadataWithDn(1);
  }
}
