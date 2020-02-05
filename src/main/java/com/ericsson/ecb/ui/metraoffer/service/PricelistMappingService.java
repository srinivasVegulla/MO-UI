package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Collection;
import java.util.Set;

import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.PricelistMappingModel;

public interface PricelistMappingService {

  public PricelistMappingModel getPricelistMappingByOfferId(Integer offerId)
      throws EcbBaseException;

  public Collection<PricelistMapping> findPricelistMapping(String[] sort, String query)
      throws EcbBaseException;

  public PricelistMappingModel getPricelistMappingByPiInstanceParentId(Integer offerId,
      Integer piInstanceParentId) throws EcbBaseException;

  public Set<Integer> getPricelistMappingItemTemplateIdsByOfferId(Integer offerId)
      throws EcbBaseException;

  public PricelistMapping updatePricelistMapping(PricelistMapping record) throws EcbBaseException;

  public Collection<PricelistMapping> findPricelistMappingByOfferId(Set<Integer> offerId)
      throws EcbBaseException;
}
