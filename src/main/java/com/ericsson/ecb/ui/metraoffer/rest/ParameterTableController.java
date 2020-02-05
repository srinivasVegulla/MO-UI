package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.ParameterTableMetadata;
import com.ericsson.ecb.ui.metraoffer.service.ParameterTableService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(value = "RateTable", description = "This table interacts with AuditLog rest end points ")
@RequestMapping(RestControllerUri.PARAMETER_TABLE)
public class ParameterTableController {

  @Autowired
  private ParameterTableService parameterTableService;

  @ApiOperation(value = "getTableMetadataWithDn",
      notes = "Retrieves a Parameter Table metadata based on supplied table id")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/metadata/{tableId}")
  public List<ParameterTableMetadata> getTableMetadataWithDn(
      @PathVariable("tableId") Integer tableId) throws EcbBaseException {
    return parameterTableService.getTableMetadataWithDn(tableId);
  }
}
