package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.ericsson.ecb.catalog.client.ExtendedProductOfferBundleClient;
import com.ericsson.ecb.catalog.client.PricelistMappingClient;
import com.ericsson.ecb.catalog.client.ProductOfferClient;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.ProductOffer;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.TreeNode;
import com.ericsson.ecb.ui.metraoffer.model.TreeNodeType;
import com.ericsson.ecb.ui.metraoffer.service.HierarchyService;
import com.ericsson.ecb.ui.metraoffer.utils.MoErrorMessagesUtil;

@Service
public class HierarchyServiceImpl implements HierarchyService {

  private static final Logger LOGGER = LoggerFactory.getLogger(HierarchyServiceImpl.class);

  @Autowired
  private ProductOfferClient productOfferClient;

  @Autowired
  private PricelistMappingClient pricelistMappingClient;

  @Autowired
  private ExtendedProductOfferBundleClient extendedProductOfferBundleClient;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private MoErrorMessagesUtil moErrorMessagesUtil;

  public static final String PRICELIST_CONDITION =
      PropertyRsqlConstants.SUBSCRIPTION_ID_IS_NULL_TRUE + RsqlOperator.AND
          + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_TRUE;

  @Override
  public TreeNode getPropertyKindHierarchy(Integer id) throws EcbBaseException {
    ProductOffer productOffer = productOfferClient.getProductOffer(id).getBody();
    TreeNode treeNode;
    if (productOffer != null) {
      LOGGER.info("Tree Navigation received id : {}, isBundle:{}", productOffer.getOfferId(),
          productOffer.getBundle());
      treeNode = createBaseNode(productOffer, null);
      if (productOffer.getBundle()) {
        prepareBundleHierarchy(treeNode);
      } else {
        treeNode.setChildren(preparePiNodes(getPricelistMapping(PropertyRsqlConstants.OFFER_ID_EQUAL
            + treeNode.getId() + RsqlOperator.AND + PRICELIST_CONDITION)));
      }
    } else {
      LOGGER.info("Subscribable item not found in the system for id: {}", id);
      throw new IllegalArgumentException(
          moErrorMessagesUtil.getErrorMessages("SUBCRIBABLE_ITEM_NOT_FOUND"));
    }
    updateTreeNodeLocalization(treeNode);
    return treeNode;
  }

  void updateTreeNodeLocalization(TreeNode treeNode) throws EcbBaseException {
    List<TreeNode> treeNodeList = new ArrayList<>();
    getTreeNodeList(treeNode, treeNodeList);
    PaginatedList<TreeNode> paginatedList = new PaginatedList<>();
    paginatedList.setRecords(treeNodeList);
    localizedEntityService.localizedFindEntity(paginatedList);
  }

  private void getTreeNodeList(TreeNode treeNode, List<TreeNode> resultNode) {
    resultNode.add(treeNode);
    if (CollectionUtils.isEmpty(treeNode.getChildren()))
      return;
    for (TreeNode child : treeNode.getChildren()) {
      resultNode.add(child);
      getTreeNodeList(child, resultNode);
    }
  }

  private void prepareBundleHierarchy(TreeNode treeNode) throws EcbBaseException {
    List<ProductOffer> productOffers =
        extendedProductOfferBundleClient.findProductOfferInBundle(treeNode.getId()).getBody();
    LOGGER.info("Tree Navigation avaialable product offers inside a bundle :{}",
        productOffers.size());
    List<Integer> offerIds = null;
    if (!CollectionUtils.isEmpty(productOffers)) {
      offerIds = productOffers.stream().map(ProductOffer::getOfferId).collect(Collectors.toList());
    } else {
      offerIds = new ArrayList<>();
    }
    offerIds.add(0, treeNode.getId());
    String offerIdCondition = PropertyRsqlConstants.OFFER_ID_IN + "("
        + offerIds.toString().substring(1, offerIds.toString().length() - 1) + ")";
    String query = offerIdCondition + RsqlOperator.AND + PRICELIST_CONDITION;

    Collection<PricelistMapping> pricelistMappingRecords = getPricelistMapping(query);
    LOGGER.info("Tree Navigation total priceable items based on query param:{}",
        pricelistMappingRecords.size());
    Map<Integer, ArrayList<PricelistMapping>> pricelistMappingMap = new HashMap<>();
    if (!CollectionUtils.isEmpty(pricelistMappingRecords)) {
      pricelistMappingRecords.forEach(pricelistMapping -> {
        ArrayList<PricelistMapping> records = null;
        if (pricelistMappingMap.get(pricelistMapping.getOfferId()) == null) {
          records = new ArrayList<>();
        } else {
          records = pricelistMappingMap.get(pricelistMapping.getOfferId());
        }
        records.add(pricelistMapping);
        pricelistMappingMap.put(pricelistMapping.getOfferId(), records);
      });
      treeNode.setChildren(preparePiNodes(pricelistMappingMap.get(treeNode.getId())));
    }

    if (!CollectionUtils.isEmpty(productOffers)) {
      List<TreeNode> poNodes = new ArrayList<>();
      productOffers.forEach(productOffer -> {
        TreeNode poNode = createBaseNode(productOffer, treeNode.getId());
        if (pricelistMappingMap.get(productOffer.getOfferId()) != null) {
          poNode.setChildren(preparePiNodes(pricelistMappingMap.get(productOffer.getOfferId())));
        }
        poNodes.add(poNode);
      });

      treeNode.getChildren().addAll(0, poNodes);
    }

  }

  private List<TreeNode> preparePiNodes(Collection<PricelistMapping> records) {
    List<TreeNode> productOfferPis = new ArrayList<>();
    Map<Integer, List<TreeNode>> childPiMap = new HashMap<>();
    if (!CollectionUtils.isEmpty(records)) {
      records.forEach(pricelistMapping -> {
        if (Stream.of(pricelistMapping.getParamtableId(), pricelistMapping.getPiInstanceParentId())
            .allMatch(Objects::isNull)) {
          TreeNode parentPi =
              createPiTreeNode(pricelistMapping, pricelistMapping.getOfferId(), TreeNodeType.PI);
          LOGGER.info("Tree Navigation adding parent PI node :{}", parentPi.getId());
          productOfferPis.add(parentPi);
        } else if (pricelistMapping.getParamtableId() == null
            && pricelistMapping.getPiInstanceParentId() != null) {
          List<TreeNode> piList = null;
          if (childPiMap.get(pricelistMapping.getPiInstanceParentId()) == null) {
            piList = new ArrayList<>();
          } else {
            piList = childPiMap.get(pricelistMapping.getPiInstanceParentId());
          }
          LOGGER.info("Tree Navigation adding child PI node to list instance id:{}, parent id :{} ",
              pricelistMapping.getItemInstanceId(), pricelistMapping.getPiInstanceParentId());
          piList.add(createPiTreeNode(pricelistMapping, pricelistMapping.getPiInstanceParentId(),
              TreeNodeType.CHILD_PI));
          childPiMap.put(pricelistMapping.getPiInstanceParentId(), piList);
        }
      });
    }
    productOfferPis.forEach(treeNode -> addChildNode(treeNode, childPiMap));
    return productOfferPis;
  }

  private void addChildNode(TreeNode treeNode, Map<Integer, List<TreeNode>> childPiMap) {
    LOGGER.info("Tree Navigation processing child PI node to add to parent pi:{}",
        treeNode.getId());
    List<TreeNode> childPi = childPiMap.get(treeNode.getId());
    if (childPi == null) {
      childPi = new ArrayList<>();
    }
    treeNode.setChildren(childPi);
    if (!CollectionUtils.isEmpty(childPi)) {
      childPi.forEach(childPiNode -> {
        if (childPiMap.get(childPiNode.getId()) != null) {
          List<TreeNode> childPiNodeList = childPiMap.get(childPiNode.getId());
          childPiNode.setChildren(childPiNodeList);
          addChildNode(childPiNode, childPiMap);
        }
      });
    }
  }

  private Collection<PricelistMapping> getPricelistMapping(String query) throws EcbBaseException {
    LOGGER.info("Tree Navigation retriving priceable of product offer(s) query :{}", query);
    return pricelistMappingClient
        .findPricelistMapping(1, Integer.MAX_VALUE, null, query, null, null, null).getBody()
        .getRecords();
  }

  private TreeNode createBaseNode(ProductOffer productOffer, Integer parentId) {
    TreeNode treeNode = new TreeNode();
    treeNode.setId(productOffer.getOfferId());
    treeNode.setParentId(parentId);
    treeNode.setName(productOffer.getName());
    treeNode.setNameId(productOffer.getNameId());
    treeNode.setDisplayName(productOffer.getDisplayName());
    treeNode.setDisplayNameId(productOffer.getDisplayNameId());
    treeNode.setNodeType((productOffer.getBundle() != null && productOffer.getBundle())
        ? TreeNodeType.BUNDLE : TreeNodeType.PO);
    treeNode.setKind(productOffer.getKind());
    treeNode.setChildren(new ArrayList<TreeNode>());
    return treeNode;
  }

  private TreeNode createPiTreeNode(PricelistMapping pricelistMapping, Integer parentId,
      TreeNodeType nodeType) {
    TreeNode treeNode = new TreeNode();
    treeNode.setId(pricelistMapping.getItemInstanceId());
    treeNode.setName(pricelistMapping.getItemInstanceName());
    treeNode.setNameId(pricelistMapping.getItemInstanceNameId());
    treeNode.setDisplayName(pricelistMapping.getItemInstanceDisplayName());
    treeNode.setDisplayNameId(pricelistMapping.getItemInstanceDisplayNameId());
    treeNode.setParentId(parentId);
    treeNode.setNodeType(nodeType);
    treeNode.setChildren(new ArrayList<TreeNode>());
    treeNode.setKind(pricelistMapping.getItemInstanceKind());
    treeNode.setOfferId(pricelistMapping.getOfferId());
    return treeNode;
  }

}
