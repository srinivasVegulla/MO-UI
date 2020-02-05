package com.ericsson.ecb.ui.metraoffer.service;

import java.util.List;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.ParameterTableMetadata;

public interface ParameterTableService {

  public List<ParameterTableMetadata> getTableMetadata(Integer tableId) throws EcbBaseException;

  public List<ParameterTableMetadata> getTableMetadataWithDn(Integer paramTableId)
      throws EcbBaseException;
}
