package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Set;

import com.ericsson.ecb.catalog.model.Discount;
import com.ericsson.ecb.catalog.model.DiscountTemplate;
import com.ericsson.ecb.catalog.model.LocalizedDiscountTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.DiscountModel;

public interface PriceableItemDiscountService {

  public DiscountModel getDiscountDetails(Integer propId) throws EcbBaseException;

  public Discount updateDiscount(Discount discount, Integer propId) throws EcbBaseException;

  public DiscountModel createDiscountPriceableItemTemplate(LocalizedDiscountTemplate record)
      throws EcbBaseException;

  public Discount getDiscount(Integer propId) throws EcbBaseException;

  public PaginatedList<Discount> findDiscount(Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public Boolean updateDiscountPriceableItemTemplate(DiscountTemplate record, Set<String> fields,
      Integer propId) throws EcbBaseException;

}
