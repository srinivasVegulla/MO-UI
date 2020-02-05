package com.ericsson.ecb.ui.metraoffer.model;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;


/**
 * <p>
 * Java class for anonymous complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
* &lt;complexType>
*   &lt;complexContent>
*     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
*       &lt;sequence>
*         &lt;element name="constraint_set">
*           &lt;complexType>
*             &lt;complexContent>
*               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
*                 &lt;sequence>
*                   &lt;element name="actions">
*                     &lt;complexType>
*                       &lt;complexContent>
*                         &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
*                           &lt;sequence>
*                             &lt;element name="action">
*                               &lt;complexType>
*                                 &lt;complexContent>
*                                   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
*                                     &lt;sequence>
*                                       &lt;element name="prop_name" type="{http://www.w3.org/2001/XMLSchema}string"/>
*                                       &lt;element name="prop_value" type="{http://www.w3.org/2001/XMLSchema}int"/>
*                                     &lt;/sequence>
*                                   &lt;/restriction>
*                                 &lt;/complexContent>
*                               &lt;/complexType>
*                             &lt;/element>
*                           &lt;/sequence>
*                         &lt;/restriction>
*                       &lt;/complexContent>
*                     &lt;/complexType>
*                   &lt;/element>
*                   &lt;element name="constraint" maxOccurs="unbounded">
*                     &lt;complexType>
*                       &lt;complexContent>
*                         &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
*                           &lt;sequence>
*                             &lt;element name="prop_name" type="{http://www.w3.org/2001/XMLSchema}string"/>
*                             &lt;element name="condition" type="{http://www.w3.org/2001/XMLSchema}string"/>
*                             &lt;element name="prop_value" type="{http://www.w3.org/2001/XMLSchema}int"/>
*                           &lt;/sequence>
*                         &lt;/restriction>
*                       &lt;/complexContent>
*                     &lt;/complexType>
*                   &lt;/element>
*                 &lt;/sequence>
*               &lt;/restriction>
*             &lt;/complexContent>
*           &lt;/complexType>
*         &lt;/element>
*       &lt;/sequence>
*     &lt;/restriction>
*   &lt;/complexContent>
* &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlRootElement(name = "configdata")
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {"constraintSet"})
public class Configdata {

  @XmlElement(name = "constraint_set", required = true)
  protected List<Configdata.ConstraintSet> constraintSet;

  /**
   * Gets the value of the constraintSet property.
   * 
   * @return possible object is {@link Configdata.ConstraintSet }
   * 
   */
  public List<Configdata.ConstraintSet> getConstraintSet() {
    if (constraintSet == null) {
      constraintSet = new ArrayList<>();
    }
    return this.constraintSet;
  }

  /**
   * Sets the value of the constraintSet property.
   * 
   * @param value allowed object is {@link Configdata.ConstraintSet }
   * 
   */
  public void setConstraintSet(List<ConstraintSet> value) {
    this.constraintSet = value;
  }


  /**
   * <p>
   * Java class for anonymous complex type.
   * 
   * <p>
   * The following schema fragment specifies the expected content contained within this class.
   * 
   * <pre>
   * &lt;complexType>
   *   &lt;complexContent>
   *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
   *       &lt;sequence>
   *         &lt;element name="actions">
   *           &lt;complexType>
   *             &lt;complexContent>
   *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
   *                 &lt;sequence>
   *                   &lt;element name="action">
   *                     &lt;complexType>
   *                       &lt;complexContent>
   *                         &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
   *                           &lt;sequence>
   *                             &lt;element name="prop_name" type="{http://www.w3.org/2001/XMLSchema}string"/>
   *                             &lt;element name="prop_value" type="{http://www.w3.org/2001/XMLSchema}int"/>
   *                           &lt;/sequence>
   *                         &lt;/restriction>
   *                       &lt;/complexContent>
   *                     &lt;/complexType>
   *                   &lt;/element>
   *                 &lt;/sequence>
   *               &lt;/restriction>
   *             &lt;/complexContent>
   *           &lt;/complexType>
   *         &lt;/element>
   *         &lt;element name="constraint" maxOccurs="unbounded">
   *           &lt;complexType>
   *             &lt;complexContent>
   *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
   *                 &lt;sequence>
   *                   &lt;element name="prop_name" type="{http://www.w3.org/2001/XMLSchema}string"/>
   *                   &lt;element name="condition" type="{http://www.w3.org/2001/XMLSchema}string"/>
   *                   &lt;element name="prop_value" type="{http://www.w3.org/2001/XMLSchema}int"/>
   *                 &lt;/sequence>
   *               &lt;/restriction>
   *             &lt;/complexContent>
   *           &lt;/complexType>
   *         &lt;/element>
   *       &lt;/sequence>
   *     &lt;/restriction>
   *   &lt;/complexContent>
   * &lt;/complexType>
   * </pre>
   * 
   * 
   */
  @XmlAccessorType(XmlAccessType.FIELD)
  @XmlType(name = "", propOrder = {"actions", "constraint"})
  public static class ConstraintSet {

    @XmlElement(required = true)
    protected Configdata.ConstraintSet.Actions actions;
    @XmlElement(required = true)
    protected List<Configdata.ConstraintSet.Constraint> constraint;

    /**
     * Gets the value of the actions property.
     * 
     * @return possible object is {@link Configdata.ConstraintSet.Actions }
     * 
     */
    public Configdata.ConstraintSet.Actions getActions() {
      return actions;
    }

    /**
     * Sets the value of the actions property.
     * 
     * @param value allowed object is {@link Configdata.ConstraintSet.Actions }
     * 
     */
    public void setActions(Configdata.ConstraintSet.Actions value) {
      this.actions = value;
    }

    /**
     * Gets the value of the constraint property.
     * 
     * <p>
     * This accessor method returns a reference to the live list, not a snapshot. Therefore any
     * modification you make to the returned list will be present inside the JAXB object. This is
     * why there is not a <CODE>set</CODE> method for the constraint property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * 
     * <pre>
     * getConstraint().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Configdata.ConstraintSet.Constraint }
     * 
     * 
     */
    public List<Configdata.ConstraintSet.Constraint> getConstraint() {
      if (constraint == null) {
        constraint = new ArrayList<>();
      }
      return this.constraint;
    }


    /**
     * <p>
     * Java class for anonymous complex type.
     * 
     * <p>
     * The following schema fragment specifies the expected content contained within this class.
     * 
     * <pre>
     * &lt;complexType>
     *   &lt;complexContent>
     *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *       &lt;sequence>
     *         &lt;element name="action">
     *           &lt;complexType>
     *             &lt;complexContent>
     *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *                 &lt;sequence>
     *                   &lt;element name="prop_name" type="{http://www.w3.org/2001/XMLSchema}string"/>
     *                   &lt;element name="prop_value" type="{http://www.w3.org/2001/XMLSchema}int"/>
     *                 &lt;/sequence>
     *               &lt;/restriction>
     *             &lt;/complexContent>
     *           &lt;/complexType>
     *         &lt;/element>
     *       &lt;/sequence>
     *     &lt;/restriction>
     *   &lt;/complexContent>
     * &lt;/complexType>
     * </pre>
     * 
     * 
     */
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"action"})
    public static class Actions {

      @XmlElement(required = true)
      protected List<Configdata.ConstraintSet.Actions.Action> action;

      /**
       * Gets the value of the action property.
       * 
       * @return possible object is {@link Configdata.ConstraintSet.Actions.Action }
       * 
       */
      public List<Configdata.ConstraintSet.Actions.Action> getAction() {
        if (action == null) {
          action = new ArrayList<>();
        }
        return this.action;
      }



      /**
       * <p>
       * Java class for anonymous complex type.
       * 
       * <p>
       * The following schema fragment specifies the expected content contained within this class.
       * 
       * <pre>
       * &lt;complexType>
       *   &lt;complexContent>
       *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
       *       &lt;sequence>
       *         &lt;element name="prop_name" type="{http://www.w3.org/2001/XMLSchema}string"/>
       *         &lt;element name="prop_value" type="{http://www.w3.org/2001/XMLSchema}int"/>
       *       &lt;/sequence>
       *     &lt;/restriction>
       *   &lt;/complexContent>
       * &lt;/complexType>
       * </pre>
       * 
       * 
       */
      @XmlAccessorType(XmlAccessType.FIELD)
      @XmlType(name = "", propOrder = {"propName", "propValue"})
      public static class Action {

        @XmlElement(name = "prop_name", required = true)
        protected String propName;
        @XmlElement(name = "prop_value")
        protected String propValue;

        /**
         * Gets the value of the propName property.
         * 
         * @return possible object is {@link String }
         * 
         */
        public String getPropName() {
          return propName;
        }

        /**
         * Sets the value of the propName property.
         * 
         * @param value allowed object is {@link String }
         * 
         */
        public void setPropName(String value) {
          this.propName = value;
        }

        /**
         * Gets the value of the propValue property.
         * 
         */
        public String getPropValue() {
          return propValue;
        }

        /**
         * Sets the value of the propValue property.
         * 
         */
        public void setPropValue(String value) {
          this.propValue = value;
        }

      }

    }


    /**
     * <p>
     * Java class for anonymous complex type.
     * 
     * <p>
     * The following schema fragment specifies the expected content contained within this class.
     * 
     * <pre>
     * &lt;complexType>
     *   &lt;complexContent>
     *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *       &lt;sequence>
     *         &lt;element name="prop_name" type="{http://www.w3.org/2001/XMLSchema}string"/>
     *         &lt;element name="condition" type="{http://www.w3.org/2001/XMLSchema}string"/>
     *         &lt;element name="prop_value" type="{http://www.w3.org/2001/XMLSchema}int"/>
     *       &lt;/sequence>
     *     &lt;/restriction>
     *   &lt;/complexContent>
     * &lt;/complexType>
     * </pre>
     * 
     * 
     */
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {"propName", "condition", "propValue"})
    public static class Constraint {

      @XmlElement(name = "prop_name", required = true)
      protected String propName;
      @XmlElement(required = true)
      protected String condition;
      @XmlElement(name = "prop_value")
      protected String propValue;

      /**
       * Gets the value of the propName property.
       * 
       * @return possible object is {@link String }
       * 
       */
      public String getPropName() {
        return propName;
      }

      /**
       * Sets the value of the propName property.
       * 
       * @param value allowed object is {@link String }
       * 
       */
      public void setPropName(String value) {
        this.propName = value;
      }

      /**
       * Gets the value of the condition property.
       * 
       * @return possible object is {@link String }
       * 
       */
      public String getCondition() {
        return condition;
      }

      /**
       * Sets the value of the condition property.
       * 
       * @param value allowed object is {@link String }
       * 
       */
      public void setCondition(String value) {
        this.condition = value;
      }

      /**
       * Gets the value of the propValue property.
       * 
       */
      public String getPropValue() {
        return propValue;
      }

      /**
       * Sets the value of the propValue property.
       * 
       */
      public void setPropValue(String value) {
        this.propValue = value;
      }

    }

  }

  @Override
  public int hashCode() {
    return HashCodeBuilder.reflectionHashCode(this, false);
  }

  @Override
  public boolean equals(Object o) {
    return EqualsBuilder.reflectionEquals(this, o, false);
  }

  @Override
  public String toString() {
    return ToStringBuilder.reflectionToString(this);
  }
}
