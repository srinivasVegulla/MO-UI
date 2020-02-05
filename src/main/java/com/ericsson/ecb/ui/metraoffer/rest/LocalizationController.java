package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.Description;
import com.ericsson.ecb.common.model.Language;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.Localization;
import com.ericsson.ecb.ui.metraoffer.service.LocalizationService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = "Localization-api", description = "This table interacts with Localization")
@RequestMapping(RestControllerUri.LOCALIZATION)
public class LocalizationController {

  @Autowired
  private LocalizationService localizationService;


  @ApiOperation(value = "findLocalization", notes = "Retrieve")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public PaginatedList<Localization> findLocalization(
      @RequestParam(required = false, name = "page") Integer page,
      @RequestParam(required = false, name = "size") Integer size,
      @RequestParam(required = false, name = "sort") String[] sort,
      @RequestParam(required = false, name = "query") String query) throws EcbBaseException {
    return localizationService.findLocalization(page, size, sort, query);
  }

  @ApiOperation(value = "findSubscribableItemLocalization", notes = "Retrieve")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/subscribable-item/{offerId}")
  public PaginatedList<Localization> findSubscribableItemLocalization(
      @PathVariable("offerId") final Integer offerId,
      @RequestParam(required = false, name = "page") Integer page,
      @RequestParam(required = false, name = "size") Integer size,
      @RequestParam(required = false, name = "sort") String[] sort,
      @RequestParam(required = false, name = "query") String query) throws EcbBaseException {
    return localizationService.findSubscribableItemLocalization(offerId, page, size, sort, query);
  }

  /**
   * Retrieve language rows that match the supplied filter
   *
   * @param pageable the pagination settings to use
   * @param query the dynamic search criteria
   * @return the page of matching Language records
   */
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/Language")
  @ApiOperation(value = "findLanguage",
      notes = "Retrieve a page of Language rows that match the supplied filter")
  public Collection<Language> findLanguage(
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query)
      throws EcbBaseException {
    return localizationService.findLanguage(page, size, sort, query);
  }


  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/pi-template/{piTemplateId}")
  @ApiOperation(value = "findPiTemplateLocalization",
      notes = "Retrieve a page of Language rows that match the supplied filter")
  public PaginatedList<Localization> findPiTemplateLocalization(
      @PathVariable("piTemplateId") final Integer piTemplateId,
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query)
      throws EcbBaseException {
    return localizationService.findPiTemplateLocalization(piTemplateId, page, size, sort, query);
  }


  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/pi-instanceId/{piInstanceId}")
  @ApiOperation(value = "findPiInstanceLocalization",
      notes = "Retrieve a page of Language rows that match the supplied filter")
  public PaginatedList<Localization> findPiInstanceLocalization(
      @PathVariable("piInstanceId") final Integer piInstanceId,
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query)
      throws EcbBaseException {
    return localizationService.findPiInstanceLocalization(piInstanceId, page, size, sort, query);
  }


  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/subscription-properties/{specId}")
  @ApiOperation(value = "getSubscriptionPropLocalization",
      notes = "Retrieve a page of Language rows that match the supplied filter")
  public PaginatedList<Localization> getSubscriptionPropLocalization(
      @PathVariable("specId") final Integer specId,
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query)
      throws EcbBaseException {
    return localizationService.getSubscriptionPropLocalization(specId, page, size, sort, query);
  }

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT)
  @ApiOperation(value = "updateLocalization", notes = "update the list of Localization records")
  public ResponseEntity<Collection<Description>> updateLocalization(
      @RequestBody final List<Localization> localizations,
      @RequestParam(required = false, name = "selectedLangs") Set<String> selectedLangs)
      throws EcbBaseException {
    return new ResponseEntity<>(
        localizationService.updateLocalization(localizations, selectedLangs), HttpStatus.OK);
  }

  @RequestMapping(value = "/exportToCsv", method = RequestMethod.POST)
  public void exportToCsv(HttpServletResponse response,
      @RequestParam(required = false, name = "page") Integer page,
      @RequestParam(required = false, name = "size") Integer size,
      @RequestParam(required = false, name = "sort") String[] sort,
      @RequestParam(required = false, name = "query") String query,
      @RequestBody(required = false) LinkedHashMap<String, String> fileHeaderMap,
      @RequestParam(required = false, name = "languageCode") Set<String> languageCode)
      throws Exception {
    localizationService.exportToCsv(response, page, size, sort, query, fileHeaderMap, languageCode);
  }

  @RequestMapping(value = "/uploadFromCsv", method = RequestMethod.POST)
  public ResponseEntity<Integer> importFromCsv(@RequestParam("file") MultipartFile file)
      throws EcbBaseException {
    return new ResponseEntity<>(localizationService.importFromCsv(file), HttpStatus.OK);
  }
}
