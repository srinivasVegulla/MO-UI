package com.ericsson.ecb.ui.metraoffer.utils;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.ArrayUtils;

import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;

import cz.jirutka.rsql.parser.RSQLParser;
import cz.jirutka.rsql.parser.ast.AndNode;
import cz.jirutka.rsql.parser.ast.ComparisonNode;
import cz.jirutka.rsql.parser.ast.ComparisonOperator;
import cz.jirutka.rsql.parser.ast.Node;

public final class MoRsqlParser {

  private MoRsqlParser() {}

  private static final ComparisonOperator LIKE = new ComparisonOperator(RsqlOperator.LIKE);
  private static final ComparisonOperator EQUAL = new ComparisonOperator(RsqlOperator.EQUAL);

  private static final ComparisonOperator NOT_EQUAL =
      new ComparisonOperator(RsqlOperator.NOT_EQUAL);

  private static final ComparisonOperator GREATER_THAN =
      new ComparisonOperator(RsqlOperator.GREATER_THAN);

  private static final ComparisonOperator GREATER_THAN_EQUAL =
      new ComparisonOperator(RsqlOperator.GREATER_THAN_EQUAL);

  private static final ComparisonOperator LESS_THAN =
      new ComparisonOperator(RsqlOperator.LESS_THAN);

  private static final ComparisonOperator LESS_THAN_EQUAL =
      new ComparisonOperator(RsqlOperator.LESS_THAN_EQUAL);

  private static final ComparisonOperator BETWEEN =
      new ComparisonOperator(RsqlOperator.BETWEEN, true);

  private static final ComparisonOperator IN = new ComparisonOperator(RsqlOperator.IN, true);



  public static Node parse(String query) {
    return rsqlParser().parse(query);
  }

  public static RSQLParser rsqlParser() {
    return new RSQLParser(getRsqlOperators());
  }

  private static Set<ComparisonOperator> getRsqlOperators() {
    Set<ComparisonOperator> operators = new HashSet<>();
    operators.add(LIKE);
    operators.add(EQUAL);
    operators.add(NOT_EQUAL);
    operators.add(GREATER_THAN);
    operators.add(GREATER_THAN_EQUAL);
    operators.add(LESS_THAN);
    operators.add(LESS_THAN_EQUAL);
    operators.add(BETWEEN);
    operators.add(IN);
    return operators;
  }

  public static Map<String, String> checkDuplicateParams(String query) {
    Map<String, String> distinctMap = new HashMap<>();
    Map<String, String> duplicateMap = new HashMap<>();
    if (StringUtils.isNotBlank(query)) {
      Node node = parse(query);
      getDistinctNodeMap(node, distinctMap, duplicateMap);
    }
    return duplicateMap;
  }

  public static Map<String, String> parseToMap(String query) {
    Map<String, String> map = new HashMap<>();
    Node node = parse(query);
    getNodeMap(node, map);
    return map;
  }

  public static Map<String, String> dFilterToMap(String[] dFilterValues) {
    HashMap<String, String> map = new HashMap<>();
    if (ArrayUtils.isNotEmpty(dFilterValues)) {
      List<String> filterStr = Arrays.asList(dFilterValues);
      filterStr.forEach(str -> {
        String[] t = str.split("=");
        map.put(t[0], t[1]);
      });
    }
    return map;
  }

  public static Map<String, String> parseQuerydFilterToMap(String query, String[] dFilterValues) {
    HashMap<String, String> map = new HashMap<>();
    if (StringUtils.isNotBlank(query)) {
      map.putAll(parseToMap(query));
    }
    if (ArrayUtils.isNotEmpty(dFilterValues)) {
      map.putAll(dFilterToMap(dFilterValues));
    }
    return trimSpecialCharacters(map);
  }

  public static Map<String, String> trimSpecialCharacters(Map<String, String> map) {
    map.forEach((k, v) -> map.put(k, v.replaceAll("%|'", "")));
    return map;
  }

  private static void getNodeMap(Node node, Map<String, String> map) {
    if (node instanceof ComparisonNode) {
      ComparisonNode comparisonNode = (ComparisonNode) node;
      String key = comparisonNode.getSelector();
      if (!map.containsKey(key)) {
        map.put(key, StringUtils.join(comparisonNode.getArguments(), ","));
      }
    } else if (node instanceof AndNode) {
      AndNode andNode = (AndNode) node;
      andNode.getChildren().forEach(childNode -> getNodeMap(childNode, map));
    }
  }

  private static void getDistinctNodeMap(Node node, Map<String, String> distinctMap,
      Map<String, String> dubplicateMap) {
    if (node instanceof ComparisonNode) {
      ComparisonNode comparisonNode = (ComparisonNode) node;
      String key = comparisonNode.getSelector();
      if (distinctMap.containsKey(key)) {
        dubplicateMap.put(key, StringUtils.join(comparisonNode.getArguments(), ","));
      } else {
        distinctMap.put(key, StringUtils.join(comparisonNode.getArguments(), ","));
      }
    } else if (node instanceof AndNode) {
      AndNode andNode = (AndNode) node;
      andNode.getChildren()
          .forEach(childNode -> getDistinctNodeMap(childNode, distinctMap, dubplicateMap));
    }
  }
}
