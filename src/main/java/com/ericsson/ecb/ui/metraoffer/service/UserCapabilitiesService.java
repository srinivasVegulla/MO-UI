package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.ericsson.ecb.common.exception.EcbBaseException;

public interface UserCapabilitiesService {

	/**
	 * Retrieve the User Capabilities. If Capability is defined in system then it
	 * will return true or false based an User assigned capabilities otherwise it
	 * will be null value
	 * 
	 * @param httpServletRequest - the HttpServletRequest instance having the
	 *                           logged-in User information
	 * @throws EcbBaseException
	 */
	public Map<String, Map<String, Boolean>> findUserCapabilities(HttpServletRequest httpServletRequest)
			throws EcbBaseException;

	/**
	 * Retrieve the User Capabilities per feature. If Capability is defined in
	 * system then it will return true or false based an User assigned capabilities
	 * otherwise it will be null value
	 * 
	 * @param httpServletRequest - the HttpServletRequest instance having the
	 *                           logged-in User information
	 * @param entity             - the Widget value of the requested capability
	 * @param feature            - the Feature value of the requested capability
	 * 
	 * @throws EcbBaseException
	 */
	public Boolean findUserCapabilitiesPerFeature(HttpServletRequest httpServletRequest, String entity, String feature)
			throws EcbBaseException;

	
    
  
}
