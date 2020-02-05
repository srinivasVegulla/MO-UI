package com.ericsson.ecb.ui.metraoffer.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.PostConstruct;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.web.client.HttpClientErrorException;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.LocalizedEntityConstants;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.netflix.client.ClientException;

import feign.RetryableException;

public class CommonUtils {

  private CommonUtils() {}

  private static Set<String> localizationProps = new HashSet<>();

  public static <T> String getQueryStringFromCollection(Collection<T> collection, String prefix) {
    String query = StringUtils.EMPTY;
    if (!CollectionUtils.isEmpty(collection)) {
      query = prefix + collection.toString().replace('[', '(').replace(']', ')').replace(", ", ",");
    }
    return query;
  }

  public static void copyPaginatedList(PaginatedList<?> source, PaginatedList<?> target) {
    target.setTotalCount(source.getTotalCount());
    target.setTotalPageSize(source.getTotalPageSize());
    target.setCurrentPage(source.getCurrentPage());
    target.setTotalPages(source.getTotalPages());
  }

  public static <T> PaginatedList<T> customPaginatedList(Collection<T> collection, Integer pageIn,
      Integer sizeIn) {

    Integer page = pageIn != null ? pageIn : 1;
    Integer size = sizeIn != null ? sizeIn : collection.size();

    PaginatedList<T> paginatedList = new PaginatedList<>();
    paginatedList.setCurrentPage(page);
    paginatedList.setTotalPageSize(size);

    if (CollectionUtils.isEmpty(collection)) {
      paginatedList.setRecords(new ArrayList<>());
      return paginatedList;
    }

    List<T> list = new ArrayList<>(collection);

    Integer total = list.size();
    Integer totalPages = (total / size);
    if (total % size != 0)
      totalPages++;

    Integer totalRecs = size * page;
    Integer pageStartIndex = totalRecs - size == 0 ? 1 : totalRecs - (size - 1);
    Integer pageEndIndex = totalRecs <= total ? totalRecs : total;

    paginatedList.setTotalCount(list.size());
    paginatedList.setTotalPages(totalPages);

    if (pageStartIndex > pageEndIndex) {
      paginatedList.setRecords(new ArrayList<>());
    } else {
      paginatedList.setRecords(list.subList(pageStartIndex - 1, pageEndIndex));
    }
    return paginatedList;
  }

  public static void handleExceptions(Exception ex, ResponseModel responseModel)
      throws EcbBaseException {
    if (ex instanceof RetryableException || ex instanceof ClientException) {
      throw new EcbBaseException(ex);
    }
    if (responseModel != null) {
      if (ex instanceof HttpClientErrorException) {
        HttpClientErrorException e = (HttpClientErrorException) ex;
        responseModel.setCode(e.getRawStatusCode());
        responseModel.setData(e.getStatusText());
      } else {
        responseModel.setCode(500);
        responseModel.setData(ex.getMessage());
      }
    }
  }

  public static Set<String> getNonLocalizedProps(Collection<String> fields) {
    Set<String> nonLocalizedFields = new HashSet<>();
    Set<String> localizedFields = getAllLocalizedProps();
    fields.forEach(field -> {
      if (!localizedFields.contains(field))
        nonLocalizedFields.add(field);
    });
    return nonLocalizedFields;
  }

  public static Set<String> getLocalizedProps(Collection<String> fields) {
    Set<String> localizedFields = new HashSet<>();
    Set<String> allLocalizedFields = getAllLocalizedProps();
    fields.forEach(field -> {
      if (allLocalizedFields.contains(field))
        localizedFields.add(field);
    });
    return localizedFields;
  }

  @PostConstruct
  public static Set<String> getAllLocalizedProps() {
    localizationProps.add(LocalizedEntityConstants.NAME);
    localizationProps.add(LocalizedEntityConstants.DISPLAY_NAME);
    localizationProps.add(LocalizedEntityConstants.DESCRIPTION);
    localizationProps.add(LocalizedEntityConstants.UNIT_DISPLAY_NAME);
    localizationProps.add(LocalizedEntityConstants.VALUES);
    return localizationProps;
  }
}
