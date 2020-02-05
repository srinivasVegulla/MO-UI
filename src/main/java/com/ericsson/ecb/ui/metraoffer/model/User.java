package com.ericsson.ecb.ui.metraoffer.model;

import com.ericsson.ecb.customer.model.AccountMapper;

public class User extends AccountMapper {

  private static final long serialVersionUID = 1L;

  private Integer partitionId;

  public Integer getPartitionId() {
    return partitionId;
  }

  public void setPartitionId(Integer partitionId) {
    this.partitionId = partitionId;
  }

}
