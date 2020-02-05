package com.ericsson.ecb.ui.metraoffer.common;

import java.util.Collection;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;

public interface LocalizedEntityService {

  public <T> T localizedCreateEntity(T obj) throws EcbBaseException;

  public <T> T localizedUpdateEntity(T obj) throws EcbBaseException;

  public <T> Collection<T> localizedUpdateAllEntity(Collection<T> paginatedObjList)
      throws EcbBaseException;

  public <T> T localizedGetEntity(T obj) throws EcbBaseException;

  public <T> PaginatedList<T> localizedFindEntity(PaginatedList<T> objList) throws EcbBaseException;

  public String getLoggedInLangCode();

  public Integer getLoggedInLangCodeId() throws EcbBaseException;
}
