"use client";

import { useState } from "react";
import styles from "./page.module.css";

const PLACEHOLDER = `A->B
A->C
B->D

Enter one edge per line`;

const SAMPLE_EDGES = `A->B
A->C
B->D
C->E
E->F
X->Y
Y->Z
Z->X
P->Q
Q->R
G->H
G->H
G->I
hello
1->2
A->`;

function TreeView({ tree, root }) {
  const children = tree[root];
  if (!children || Object.keys(children).length === 0) {
    return <span className={styles.treeLeaf}>{root}</span>;
  }

  return (
    <ul className={styles.treeList}>
      <li>
        <span className={styles.treeNode}>{root}</span>
        <ul className={styles.treeList}>
          {Object.keys(children).map((child) => (
            <li key={child}>
              <TreeBranch node={child} subtree={children[child]} />
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
}

function TreeBranch({ node, subtree }) {
  if (!subtree || Object.keys(subtree).length === 0) {
    return <span className={styles.treeLeaf}>{node}</span>;
  }

  return (
    <>
      <span className={styles.treeNode}>{node}</span>
      <ul className={styles.treeList}>
        {Object.keys(subtree).map((child) => (
          <li key={child}>
            <TreeBranch node={child} subtree={subtree[child]} />
          </li>
        ))}
      </ul>
    </>
  );
}

function HierarchyCard({ hierarchy }) {
  const isCycle = hierarchy.has_cycle;

  return (
    <article className={`${styles.card} ${isCycle ? styles.cardCycle : ""}`}>
      <header className={styles.cardHeader}>
        <h3>Root: {hierarchy.root}</h3>
        {isCycle ? (
          <span className={styles.badgeCycle}>Cycle detected</span>
        ) : (
          <span className={styles.badgeDepth}>Depth: {hierarchy.depth}</span>
        )}
      </header>
      <div className={styles.cardBody}>
        {isCycle ? (
          <p className={styles.cycleMessage}>
            This component contains a cycle. No tree structure available.
          </p>
        ) : (
          <div className={styles.treeContainer}>
            <TreeView tree={hierarchy.tree} root={hierarchy.root} />
          </div>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const parseInput = (text) => {
    return text
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const edges = parseInput(input);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/graph";

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edges }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to connect to the API. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => setInput(SAMPLE_EDGES);

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <h1>Graph Hierarchy Analyzer</h1>
        <p className={styles.subtitle}>
          Enter node relationships like <code>A-&gt;B</code> to build trees, detect
          cycles, and summarize your graph.
        </p>
      </header>

      <section className={styles.inputSection}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formHeader}>
            <label htmlFor="edges">Node edges</label>
            <button type="button" className={styles.secondaryBtn} onClick={loadSample}>
              Load Sample
            </button>
          </div>
          <textarea
            id="edges"
            className={styles.textarea}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={10}
          />
          <p className={styles.hint}>One edge per line or comma-separated</p>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Analyzing…" : "Analyze Graph"}
          </button>
        </form>
      </section>

      {error && (
        <div className={styles.errorBox} role="alert">
          <strong>Error</strong>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <section className={styles.results}>
          <div className={styles.identityBar}>
            <div>
              <span className={styles.label}>User ID</span>
              <span>{result.user_id}</span>
            </div>
            <div>
              <span className={styles.label}>Email</span>
              <span>{result.email_id}</span>
            </div>
            <div>
              <span className={styles.label}>Enrollment</span>
              <span>{result.enrollment_number}</span>
            </div>
          </div>

          <div className={styles.summaryGrid}>
            <div className={`${styles.statCard} ${styles.statCardTrees}`}>
              <span className={styles.statValue}>{result.summary.total_trees}</span>
              <span className={styles.statLabel}>Trees</span>
            </div>
            <div className={`${styles.statCard} ${styles.statCardCycles}`}>
              <span className={styles.statValue}>{result.summary.total_cycles}</span>
              <span className={styles.statLabel}>Cycles</span>
            </div>
            <div className={`${styles.statCard} ${styles.statCardLargest}`}>
              <span className={styles.statValue}>
                {result.summary.largest_tree_root || "—"}
              </span>
              <span className={styles.statLabel}>Largest tree root</span>
            </div>
          </div>

          {(result.invalid_entries?.length > 0 ||
            result.duplicate_edges?.length > 0) && (
            <div className={styles.issuesRow}>
              {result.invalid_entries?.length > 0 && (
                <div className={`${styles.issueBox} ${styles.issueBoxInvalid}`}>
                  <h4>Invalid entries</h4>
                  <ul>
                    {result.invalid_entries.map((entry) => (
                      <li key={entry}>
                        <code>{entry}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.duplicate_edges?.length > 0 && (
                <div className={`${styles.issueBox} ${styles.issueBoxDuplicate}`}>
                  <h4>Duplicate edges</h4>
                  <ul>
                    {result.duplicate_edges.map((entry) => (
                      <li key={entry}>
                        <code>{entry}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <h2 className={styles.sectionTitle}>Hierarchies</h2>
          <div className={styles.cardGrid}>
            {result.hierarchies.map((h) => (
              <HierarchyCard key={h.root + (h.has_cycle ? "-cycle" : "")} hierarchy={h} />
            ))}
          </div>

          <details className={styles.rawJson}>
            <summary>Raw JSON response</summary>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </details>
        </section>
      )}
    </main>
  );
}
