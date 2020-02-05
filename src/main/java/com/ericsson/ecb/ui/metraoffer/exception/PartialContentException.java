package com.ericsson.ecb.ui.metraoffer.exception;

import com.ericsson.ecb.common.exception.EcbBaseException;

public class PartialContentException extends EcbBaseException {

  private static final long serialVersionUID = 1L;

  public PartialContentException() {}

  public PartialContentException(String message) {
    super(message);
  }

  public PartialContentException(String message, Throwable cause) {
    super(message, cause);
  }

  public PartialContentException(Throwable cause) {
    super(cause);
  }

  public PartialContentException(String message, Throwable cause, boolean enableSuppression,
      boolean writableStackTrace) {
    super(message, cause, enableSuppression, writableStackTrace);
  }
}
