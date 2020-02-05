package com.ericsson.ecb.ui.metraoffer.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

import com.ericsson.ecb.ui.metraoffer.constants.Constants;

public class DateUtility {

  /**
   * Return SimpleDateFormat based on the format provided.
   * 
   * @param format .
   * @return DateFormat .
   */
  public static DateFormat getDateFormatter(String format) {
    return new SimpleDateFormat(format);
  }

  public static String convertOffsetDateToString(OffsetDateTime offsetDateTime) {
    try {
      String offsetDate = offsetDateTime.format(DateTimeFormatter.ISO_DATE).substring(0, 10);
      DateFormat to = getDateFormatter(Constants.SIMPLE_DATE_FORMAT);
      DateFormat from = new SimpleDateFormat(Constants.OFFSET_DATE_FORMAT);
      return to.format(from.parse(offsetDate));
    } catch (ParseException e) {
      e.printStackTrace();
    }
    return null;
  }

  public static Long convertOffsetDateToMillisecond(OffsetDateTime offsetDateTime) {
    try {
      if (offsetDateTime != null) {
        String offsetDate = offsetDateTime.format(DateTimeFormatter.ISO_DATE).substring(0, 10);
        DateFormat from = new SimpleDateFormat(Constants.OFFSET_DATE_FORMAT);
        return from.parse(offsetDate).getTime();
      }
    } catch (ParseException e) {
      e.printStackTrace();
    }
    return null;
  }

 

}
