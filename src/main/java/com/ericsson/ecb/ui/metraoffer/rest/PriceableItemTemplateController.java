package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.catalog.model.PriceableItemTemplate;
import com.ericsson.ecb.catalog.model.PriceableItemTemplateWithInUse;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemRateTableModel;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.model.PricelistModel;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemTemplateService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = "PriceableItemInstanceTemplate",
    description = "This controller is used to get Priceable items of a product offer")
@RequestMapping(RestControllerUri.PRICEABLE_ITEM_TEMPLATE)
public class PriceableItemTemplateController {

  @Autowired
  private PriceableItemTemplateService priceableItemTemplateService;

  @ApiOperation(value = "findPriceableItemTemplateGridView",
      notes = "Retrieve a page of PriceableItemTemplates that match the supplied filter")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/GridView")
  public PaginatedList<PriceableItemTemplateModel> findPriceableItemTemplateGridView(
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query,
      @ApiParam(
          value = "Language to use when searching descriptions (from Language).  If not set, searches across all languages.",
          required = false) @RequestParam(required = false,
              name = "dLang") String descriptionLanguage,
      @ApiParam(
          value = "Set of filters to use, in format of localizedProperty=filter-text, (e.g., nameId=%Offer%). Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false,
              name = "dFilter") Set<String> descriptionFilters,
      @ApiParam(
          value = "Sorting criteria for localizedProperty in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria is not supported. Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false, name = "dSort") String descriptionSort)
      throws EcbBaseException {
    return priceableItemTemplateService.findPriceableItemTemplateGridView(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  /**
   * Retrieve PriceableItemTemplates that match the supplied filter.
   *
   * @param pageable the pagination settings to use
   * @param query the dynamic search criteria
   * @return the page of matching list of PriceableItemTemplate records
   */
  @ApiOperation(value = "findPriceableItemTemplate",
      notes = "Retrieve a page of PriceableItemTemplates that match the supplied filter")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public PaginatedList<PriceableItemTemplateWithInUse> findPriceableItemTemplate(
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query,
      @ApiParam(
          value = "Language to use when searching descriptions (from Language).  If not set, searches across all languages.",
          required = false) @RequestParam(required = false,
              name = "dLang") String descriptionLanguage,
      @ApiParam(
          value = "Set of filters to use, in format of localizedProperty=filter-text, (e.g., nameId=%Offer%). Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false,
              name = "dFilter") Set<String> descriptionFilters,
      @ApiParam(
          value = "Sorting criteria for localizedProperty in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria is not supported. Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false, name = "dSort") String descriptionSort)
      throws EcbBaseException {
    return priceableItemTemplateService.findPriceableItemTemplate(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  /**
   * Retrieve PriceableItemTemplates that match the supplied filter.
   *
   * @param pageable the pagination settings to use
   * @param query the dynamic search criteria
   * @return the page of matching list of PriceableItemTemplate records
   */
  @ApiOperation(value = "findPriceableItemTemplatesForOfferings",
      notes = "Retrieve a page of PriceableItemTemplates that match the supplied filter")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/offering-id/{offerId}")

  public PaginatedList<PriceableItemTemplateModel> findPriceableItemTemplatesForOfferings(
      @ApiParam(value = "boolean flag of whether it is Bundle or Product Offer",
          required = true) @RequestParam("isBundle") final Boolean isBundle,
      @ApiParam(value = "offerId of the Product Offer",
          required = true) @PathVariable("offerId") final Integer offerId,
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query,
      @ApiParam(
          value = "Language to use when searching descriptions (from Language).  If not set, searches across all languages.",
          required = false) @RequestParam(required = false,
              name = "dLang") String descriptionLanguage,
      @ApiParam(
          value = "Set of filters to use, in format of localizedProperty=filter-text, (e.g., nameId=%Offer%). Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false,
              name = "dFilter") Set<String> descriptionFilters,
      @ApiParam(
          value = "Sorting criteria for localizedProperty in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria is not supported. Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false, name = "dSort") String descriptionSort)
      throws EcbBaseException {
    return priceableItemTemplateService.findPriceableItemTemplatesForOfferings(isBundle, offerId,
        page, size, sort, query, descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "findInUseOfferings",
      notes = "Retrieve a In Use Product offer rows that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/InUseOfferings/priceable-item-template/{templateId}")
  public PaginatedList<ProductOfferData> findInUseOfferings(
      @PathVariable("templateId") Integer templateId,
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"templateId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query,
      @ApiParam(
          value = "Language to use when searching descriptions (from Language).  If not set, searches across all languages.",
          required = false) @RequestParam(required = false,
              name = "dLang") String descriptionLanguage,
      @ApiParam(
          value = "Set of filters to use, in format of localizedProperty=filter-text, (e.g., nameId=%Offer%). Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false,
              name = "dFilter") Set<String> descriptionFilters,
      @ApiParam(
          value = "Sorting criteria for localizedProperty in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria is not supported. Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false, name = "dSort") String descriptionSort)
      throws EcbBaseException {
    return priceableItemTemplateService.findInUseOfferings(templateId, page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "findInUseSharedRateList",
      notes = "Retrieve inUse Shared RateList rows that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/InUseSharedRateList/priceable-item-template/{templateId}")
  public PaginatedList<PricelistModel> findInUseSharedRateList(
      @PathVariable("templateId") Integer templateId,
      @ApiParam(value = "boolean flag of whether PI has childs",
      required = false) @RequestParam(required = false, name = "childPiTemplate")
      Set<Integer> childPiTemplate,
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"templateId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query,
      @ApiParam(
          value = "Language to use when searching descriptions (from Language).  If not set, searches across all languages.",
          required = false) @RequestParam(required = false,
              name = "dLang") String descriptionLanguage,
      @ApiParam(
          value = "Set of filters to use, in format of localizedProperty=filter-text, (e.g., nameId=%Offer%). Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false,
              name = "dFilter") Set<String> descriptionFilters,
      @ApiParam(
          value = "Sorting criteria for localizedProperty in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria is not supported. Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false, name = "dSort") String descriptionSort)
      throws EcbBaseException {
    return priceableItemTemplateService.findInUseSharedRateList(templateId, childPiTemplate, page, size,
        sort, query, descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "findViewChargeType", notes = "Retrieve Charge Type of GridView")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/view-type")
  public Map<PropertyKind, String> findViewChargeType() {
    return priceableItemTemplateService.findViewChargeType();
  }

  @ApiOperation(value = "findCreateChargeType", notes = "Retrieve Charge Type of Create")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/create-type")
  public Map<PropertyKind, String> findCreateChargeType() {
    return priceableItemTemplateService.findCreateChargeType();
  }

  @ApiOperation(value = "getPriceableItemTemplateDetails",
      notes = "Retrieve Priceable Item Template Details by supplied idendifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/priceable-item-template/{templateId}/kind/{kind}")
  public Object getPriceableItemTemplateDetails(@PathVariable("templateId") Integer templateId,
      @PathVariable("kind") PropertyKind kind) throws EcbBaseException {
    return priceableItemTemplateService.getPriceableItemTemplateDetails(templateId, kind);
  }

  @ApiOperation(value = "getPriceableItemTemplate",
      notes = "Retrieve Priceable Item Template by supplied idendifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/priceable-item-template/{templateId}")
  public PriceableItemTemplate getPriceableItemTemplate(
      @PathVariable("templateId") Integer templateId) throws EcbBaseException {
    return priceableItemTemplateService.getPriceableItemTemplate(templateId);
  }


  @ApiOperation(value = "deletePriceableItemTemplate",
      notes = "Delete Priceable Item Template by supplied idendifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE,
      value = "/priceable-item-template/{templateId}")
  public Boolean deletePriceableItemTemplate(@PathVariable("templateId") Integer templateId)
      throws EcbBaseException {
    return priceableItemTemplateService.deletePriceableItemTemplate(templateId);
  }

  @ApiOperation(value = "findInUseOfferingsOfExtendedProps", notes = "")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/kind/{kind}")
  public PaginatedList<ProductOfferData> findInUseOfferingsOfExtendedProps(
      @PathVariable("kind") final PropertyKind kind,
      @RequestParam(required = false, name = "page") final Integer page,
      @RequestParam(required = false, name = "size") final Integer size,
      @RequestParam(required = false, name = "sort") final String[] sort,
      @RequestParam(required = false, name = "query") final String query,
      @ApiParam(
          value = "Language to use when searching descriptions (from Language).  If not set, searches across all languages.",
          required = false) @RequestParam(required = false,
              name = "dLang") String descriptionLanguage,
      @ApiParam(
          value = "Set of filters to use, in format of localizedProperty=filter-text, (e.g., nameId=%Offer%). Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false,
              name = "dFilter") Set<String> descriptionFilters,
      @ApiParam(
          value = "Sorting criteria for localizedProperty in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria is not supported. Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false, name = "dSort") String descriptionSort)
      throws EcbBaseException {
    return priceableItemTemplateService.findInUseOfferingsOfExtendedProps(kind, page, size, sort,
        query, descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "getRateTableWithDecisionTypeName",
      notes = "Retrieve Ratetables with decisionTypeName by supplied idendifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/rate-table/{piId}")
  public List<PriceableItemRateTableModel> getRateTableWithDecisionTypeName(
      @PathVariable("piId") final Integer piId) throws EcbBaseException {
    return priceableItemTemplateService.getRateTableWithDecisionTypeName(piId);
  }
}
