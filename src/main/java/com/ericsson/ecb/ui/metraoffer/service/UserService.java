package com.ericsson.ecb.ui.metraoffer.service;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.User;

public interface UserService {

  public User getUserDetails(String loginName) throws EcbBaseException;

}
