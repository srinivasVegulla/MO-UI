package com.ericsson.ecb.ui.metraoffer.model;

import java.time.OffsetDateTime;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;

public class ProductOfferDataTest {

  @InjectMocks
  private ProductOfferData productOfferData;

  @Before
  public void init() {
    productOfferData = new ProductOfferData();
    productOfferData.setStartDate(OffsetDateTime.now());
    productOfferData.setEndDate(OffsetDateTime.now());
    productOfferData.setAvailableStartDate(OffsetDateTime.now());
    productOfferData.setAvailableEndDate(OffsetDateTime.now());
  }

  @Test
  public void shouldGetAvailStartDate() {
    productOfferData.getAvailStartDate();
  }

  @Test
  public void shouldGetAvailEndDate() {
    productOfferData.getAvailEndDate();
  }

  @Test
  public void shouldGetEffEndDate() {
    productOfferData.getEffEndDate();
  }

  @Test
  public void shouldGetEffStartDate() {
    productOfferData.getEffStartDate();
  }

  @Test
  public void shouldGetDeleteWithDates() {
    productOfferData.getDelete();
  }

  @Test
  public void shouldGetDeleteWithSubcriptionCount() {
    ProductOfferData productOfferData = new ProductOfferData();
    productOfferData.setSubcriptionCount(5);
    productOfferData.getDelete();
  }

  @Test
  public void shouldGetAddRemovePoPiWithDates() {
    productOfferData.getAddRemovePoPi();
  }

  @Test
  public void shouldGetAddRemovePoPiWithSubcriptionCount() {
    ProductOfferData productOfferData = new ProductOfferData();
    productOfferData.setSubcriptionCount(5);
    productOfferData.getAddRemovePoPi();
  }

}
