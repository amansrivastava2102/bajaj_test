const EDGE_PATTERN = /^([A-Z])->([A-Z])$/;

function parseValidEdge(trimmed) {
  const match = EDGE_PATTERN.exec(trimmed);
  if (!match) return null;
  const parent = match[1];
  const child = match[2];
  if (parent === child) return null;
  return { parent, child, key: `${parent}->${child}` };
}

class UnionFind {
  constructor() {
    this.parent = new Map();
  }

  find(node) {
    if (!this.parent.has(node)) {
      this.parent.set(node, node);
    }
    if (this.parent.get(node) !== node) {
      this.parent.set(node, this.find(this.parent.get(node)));
    }
    return this.parent.get(node);
  }

  union(a, b) {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) {
      this.parent.set(rootA, rootB);
    }
  }
}

function getComponents(nodes, activeEdges) {
  const uf = new UnionFind();
  for (const node of nodes) {
    uf.find(node);
  }
  for (const [parent, child] of activeEdges) {
    uf.union(parent, child);
  }

  const groups = new Map();
  for (const node of nodes) {
    const root = uf.find(node);
    if (!groups.has(root)) {
      groups.set(root, new Set());
    }
    groups.get(root).add(node);
  }
  return [...groups.values()];
}

function hasCycle(nodes, parentToChildren) {
  const UNVISITED = 0;
  const VISITING = 1;
  const VISITED = 2;
  const state = new Map();
  for (const node of nodes) {
    state.set(node, UNVISITED);
  }

  function dfs(node) {
    state.set(node, VISITING);
    for (const child of parentToChildren.get(node) || []) {
      if (!nodes.has(child)) continue;
      const childState = state.get(child);
      if (childState === VISITING) return true;
      if (childState === UNVISITED && dfs(child)) return true;
    }
    state.set(node, VISITED);
    return false;
  }

  for (const node of nodes) {
    if (state.get(node) === UNVISITED && dfs(node)) {
      return true;
    }
  }
  return false;
}

function buildChildTree(node, parentToChildren) {
  const children = parentToChildren.get(node) || [];
  if (children.length === 0) return {};
  const obj = {};
  for (const child of [...children].sort()) {
    obj[child] = buildChildTree(child, parentToChildren);
  }
  return obj;
}

function buildTree(root, parentToChildren) {
  return { [root]: buildChildTree(root, parentToChildren) };
}

function calculateDepth(root, parentToChildren) {
  function depth(node) {
    const children = parentToChildren.get(node) || [];
    if (children.length === 0) return 1;
    return 1 + Math.max(...children.map(depth));
  }
  return depth(root);
}

function findRoot(nodes, childrenInComponent) {
  const roots = [...nodes].filter((node) => !childrenInComponent.has(node));
  if (roots.length > 0) {
    return roots.sort()[0];
  }
  return [...nodes].sort()[0];
}

/**
 * Process graph edges and return hierarchy insights.
 * @param {string[]} edges
 * @returns {{ hierarchies: object[], invalid_entries: string[], duplicate_edges: string[], summary: object }}
 */
export function processGraph(edges) {
  const invalid_entries = [];
  const duplicate_edges = [];
  const seenEdges = new Set();
  const validEdgeList = [];

  if (!Array.isArray(edges)) {
    edges = [];
  }

  edges.forEach((entry, originalIndex) => {
    if (typeof entry !== "string") {
      invalid_entries.push(String(entry));
      return;
    }
    const trimmed = entry.trim();
    const parsed = parseValidEdge(trimmed);
    if (!parsed) {
      invalid_entries.push(entry);
      return;
    }
    if (seenEdges.has(parsed.key)) {
      duplicate_edges.push(parsed.key);
      return;
    }
    seenEdges.add(parsed.key);
    validEdgeList.push({ ...parsed, originalIndex });
  });

  const childToParent = new Map();
  const parentToChildren = new Map();
  const allNodes = new Set();

  for (const { parent, child } of validEdgeList) {
    allNodes.add(parent);
    allNodes.add(child);
    if (childToParent.has(child)) continue;
    childToParent.set(child, parent);
    if (!parentToChildren.has(parent)) {
      parentToChildren.set(parent, []);
    }
    parentToChildren.get(parent).push(child);
  }

  const activeEdges = [];
  for (const { parent, child } of validEdgeList) {
    if (childToParent.get(child) === parent) {
      activeEdges.push([parent, child]);
    }
  }

  const components = getComponents(allNodes, activeEdges);

  const nodeToComponent = new Map();
  components.forEach((component, index) => {
    for (const node of component) {
      nodeToComponent.set(node, index);
    }
  });

  const componentFirstSeen = new Map();
  for (const { parent, child, originalIndex } of validEdgeList) {
    const compIndex = nodeToComponent.get(parent);
    if (compIndex === undefined) continue;
    if (!componentFirstSeen.has(compIndex)) {
      componentFirstSeen.set(compIndex, originalIndex);
    }
  }

  const sortedComponents = components
    .map((component, index) => ({ component, index }))
    .sort(
      (a, b) =>
        (componentFirstSeen.get(a.index) ?? Infinity) -
        (componentFirstSeen.get(b.index) ?? Infinity)
    );

  const hierarchies = [];
  let total_trees = 0;
  let total_cycles = 0;
  let largest_tree_root = "";
  let largest_depth = 0;

  for (const { component } of sortedComponents) {
    const childrenInComponent = new Set();
    for (const [parent, child] of activeEdges) {
      if (component.has(parent) && component.has(child)) {
        childrenInComponent.add(child);
      }
    }

    const root = findRoot(component, childrenInComponent);
    const cyclic = hasCycle(component, parentToChildren);

    if (cyclic) {
      total_cycles += 1;
      hierarchies.push({
        root,
        tree: {},
        has_cycle: true,
      });
    } else {
      total_trees += 1;
      const depth = calculateDepth(root, parentToChildren);
      hierarchies.push({
        root,
        tree: buildTree(root, parentToChildren),
        depth,
      });

      if (
        depth > largest_depth ||
        (depth === largest_depth &&
          (largest_tree_root === "" || root < largest_tree_root))
      ) {
        largest_depth = depth;
        largest_tree_root = root;
      }
    }
  }

  return {
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root,
    },
  };
}
