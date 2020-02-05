package com.ericsson.ecb.ui.metraoffer.exception;

public class PreconditionFailedException extends Exception {

  private static final long serialVersionUID = 2507011277526040908L;

  public PreconditionFailedException() {

  }

  public PreconditionFailedException(String message) {

    super(message);
  }

  public PreconditionFailedException(String message, Throwable cause) {
    super(message, cause);
  }

}
