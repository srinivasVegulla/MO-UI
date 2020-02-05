package com.ericsson.ecb.ui.metraoffer.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.TreeNode;
import com.ericsson.ecb.ui.metraoffer.service.HierarchyService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(value = "TreeNode",
    description = "This controller produces the property kind hierarcy based on supplied kind")
@RequestMapping(RestControllerUri.HIERACHY)
public class HierarchyController {

  @Autowired
  private HierarchyService hierarchyService;

  @ApiOperation(value = "getPropertyKindHierarchy",
      notes = "Retrieves complete hierarchy data of  supplied valid property kind")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{id}")
  public ResponseEntity<TreeNode> getPropertyKindHierarchy(@PathVariable("id") Integer id)
      throws EcbBaseException {
    return new ResponseEntity<>(hierarchyService.getPropertyKindHierarchy(id), HttpStatus.OK);
  }

}
