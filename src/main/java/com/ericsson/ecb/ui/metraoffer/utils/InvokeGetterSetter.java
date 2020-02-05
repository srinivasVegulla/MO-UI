package com.ericsson.ecb.ui.metraoffer.utils;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ericsson.ecb.common.exception.EcbBaseException;

public class InvokeGetterSetter {

  private InvokeGetterSetter() {}

  private static final Logger LOGGER = LoggerFactory.getLogger(InvokeGetterSetter.class);

  public static Object invokeGetter(final Object obj, final String name) throws EcbBaseException {

    final Class<?> klass = obj.getClass();

    try {
      final BeanInfo info = Introspector.getBeanInfo(klass);
      for (final PropertyDescriptor descriptor : info.getPropertyDescriptors()) {
        if (name.equals(descriptor.getName())) {
          final Method reader = descriptor.getReadMethod();
          if (reader != null) {
            if (!reader.isAccessible()) {
              reader.setAccessible(true);
            }
            return reader.invoke(obj);
          }
          break;
        }
      }
    } catch (final IntrospectionException | ReflectiveOperationException ie) {
      LOGGER.error("Exception while InvokeGetterSetter: {}", ie.getMessage());
      throw new EcbBaseException(ie.getMessage());
    }
    return null;
  }


  public static void invokeSetter(final Object obj, final String name, final Object value)
      throws EcbBaseException {

    final Class<?> klass = obj.getClass();

    try {
      final BeanInfo info = Introspector.getBeanInfo(klass);
      for (final PropertyDescriptor descriptor : info.getPropertyDescriptors()) {
        if (name.equals(descriptor.getName())) {
          final Method writer = descriptor.getWriteMethod();
          if (writer != null) {
            if (!writer.isAccessible()) {
              writer.setAccessible(true);
            }
            writer.invoke(obj, value);
          }
          break;
        }
      }
    } catch (final IntrospectionException | ReflectiveOperationException ie) {
      LOGGER.error("Exception while invokeSetter: {}", ie.getMessage());
      throw new EcbBaseException(ie.getMessage());
    }
  }

  public static void invokeSetters(final Object obj, final Map<String, Object> valueMap)
      throws EcbBaseException {

    final Class<?> klass = obj.getClass();

    try {
      final BeanInfo info = Introspector.getBeanInfo(klass);
      for (final PropertyDescriptor descriptor : info.getPropertyDescriptors()) {
        String name = descriptor.getName();
        if (valueMap.keySet().contains(name)) {
          final Method writer = descriptor.getWriteMethod();
          if (writer != null) {
            if (!writer.isAccessible()) {
              writer.setAccessible(true);
            }
            writer.invoke(obj, valueMap.get(name));
          }
        }
      }

    } catch (final IntrospectionException | ReflectiveOperationException ie) {
      LOGGER.error("Exception while invokeSetters: {}", ie.getMessage());
      throw new EcbBaseException(ie.getMessage());
    }
  }

  public static Map<String, Object> invokeGetters(final Object obj, final Set<String> names)
      throws EcbBaseException {
    Map<String, Object> resultMap = new HashMap<>();
    final Class<?> klass = obj.getClass();
    try {
      final BeanInfo info = Introspector.getBeanInfo(klass);
      for (final PropertyDescriptor descriptor : info.getPropertyDescriptors()) {
        String name = descriptor.getName();
        if (names.contains(name)) {
          final Method reader = descriptor.getReadMethod();
          if (reader != null) {
            if (!reader.isAccessible()) {
              reader.setAccessible(true);
            }
            resultMap.put(name, reader.invoke(obj));
          }
        }
      }
    } catch (final IntrospectionException | ReflectiveOperationException ie) {
      LOGGER.error("Exception while invokeGetters: {}", ie.getMessage());
      throw new EcbBaseException(ie.getMessage());
    }
    return resultMap;
  }
}
