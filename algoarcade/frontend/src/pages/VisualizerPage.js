// ============================================================
// VisualizerPage - Sorting Algorithm Animations (BONUS)
// ============================================================
import React, { useState, useRef, useCallback } from 'react';

const ALGOS = [
  { id: 'bubble',    name: 'Bubble Sort',    color: '#6366f1', complexity: 'O(n²)',     space: 'O(1)' },
  { id: 'selection', name: 'Selection Sort', color: '#8b5cf6', complexity: 'O(n²)',     space: 'O(1)' },
  { id: 'insertion', name: 'Insertion Sort', color: '#06b6d4', complexity: 'O(n²)',     space: 'O(1)' },
  { id: 'merge',     name: 'Merge Sort',     color: '#10b981', complexity: 'O(n log n)', space: 'O(n)' },
  { id: 'quick',     name: 'Quick Sort',     color: '#f59e0b', complexity: 'O(n log n)', space: 'O(log n)' },
];

const BAR_COUNT = 40;

function generateArray(n = BAR_COUNT) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
}

// ── Sorting algorithm generators (yield steps) ────────────────
function* bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      yield { array: [...a], comparing: [j, j+1], swapping: false };
      if (a[j] > a[j+1]) { [a[j], a[j+1]] = [a[j+1], a[j]]; yield { array: [...a], comparing: [j, j+1], swapping: true }; }
    }
  }
  yield { array: a, comparing: [], swapping: false, done: true };
}

function* selectionSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    for (let j = i+1; j < a.length; j++) {
      yield { array: [...a], comparing: [min, j], swapping: false };
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) { [a[i], a[min]] = [a[min], a[i]]; yield { array: [...a], comparing: [i, min], swapping: true }; }
  }
  yield { array: a, comparing: [], swapping: false, done: true };
}

function* insertionSort(arr) {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j] < a[j-1]) {
      yield { array: [...a], comparing: [j, j-1], swapping: true };
      [a[j], a[j-1]] = [a[j-1], a[j]];
      j--;
    }
    yield { array: [...a], comparing: [j], swapping: false };
  }
  yield { array: a, comparing: [], swapping: false, done: true };
}

function* quickSort(arr, low = 0, high = arr.length - 1, orig = null) {
  if (!orig) orig = [...arr];
  if (low < high) {
    const pivot = orig[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield { array: [...orig], comparing: [j, high], swapping: false };
      if (orig[j] <= pivot) { i++; [orig[i], orig[j]] = [orig[j], orig[i]]; yield { array: [...orig], comparing: [i, j], swapping: true }; }
    }
    [orig[i+1], orig[high]] = [orig[high], orig[i+1]];
    yield { array: [...orig], comparing: [i+1, high], swapping: true };
    const pi = i + 1;
    yield* quickSort(orig, low, pi - 1, orig);
    yield* quickSort(orig, pi + 1, high, orig);
  }
  if (low === 0 && high === arr.length - 1) yield { array: [...orig], comparing: [], swapping: false, done: true };
}

function* mergeSort(arr, l = 0, r = arr.length - 1, orig = null) {
  if (!orig) orig = [...arr];
  if (l < r) {
    const m = Math.floor((l + r) / 2);
    yield* mergeSort(arr, l, m, orig);
    yield* mergeSort(arr, m+1, r, orig);
    // merge
    const left = orig.slice(l, m+1), right = orig.slice(m+1, r+1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      yield { array: [...orig], comparing: [k, m+1+j], swapping: false };
      if (left[i] <= right[j]) orig[k++] = left[i++];
      else orig[k++] = right[j++];
      yield { array: [...orig], comparing: [k-1], swapping: true };
    }
    while (i < left.length) { orig[k++] = left[i++]; yield { array: [...orig], comparing: [k-1], swapping: false }; }
    while (j < right.length) { orig[k++] = right[j++]; yield { array: [...orig], comparing: [k-1], swapping: false }; }
  }
  if (l === 0 && r === arr.length - 1) yield { array: [...orig], comparing: [], swapping: false, done: true };
}

const GENERATORS = { bubble: bubbleSort, selection: selectionSort, insertion: insertionSort, quick: quickSort, merge: mergeSort };

const VisualizerPage = () => {
  const [array,       setArray]       = useState(generateArray);
  const [algoId,      setAlgoId]      = useState('bubble');
  const [running,     setRunning]     = useState(false);
  const [comparing,   setComparing]   = useState([]);
  const [swapping,    setSwapping]    = useState(false);
  const [done,        setDone]        = useState(false);
  const [speed,       setSpeed]       = useState(50);   // ms delay
  const [steps,       setSteps]       = useState(0);
  const rafRef   = useRef(null);
  const genRef   = useRef(null);
  const runRef   = useRef(false);

  const reset = useCallback(() => {
    runRef.current = false;
    clearTimeout(rafRef.current);
    setRunning(false);
    setComparing([]);
    setSwapping(false);
    setDone(false);
    setSteps(0);
    setArray(generateArray());
  }, []);

  const startSort = useCallback(() => {
    if (running) return;
    setRunning(true);
    setDone(false);
    setSteps(0);
    runRef.current = true;

    const gen = GENERATORS[algoId](array);
    genRef.current = gen;

    const step = () => {
      if (!runRef.current) return;
      const result = gen.next();
      if (result.done || result.value?.done) {
        setArray(result.value?.array || array);
        setComparing([]);
        setSwapping(false);
        setDone(true);
        setRunning(false);
        runRef.current = false;
        return;
      }
      const { array: a, comparing: c, swapping: s } = result.value;
      setArray(a);
      setComparing(c || []);
      setSwapping(s || false);
      setSteps(prev => prev + 1);
      rafRef.current = setTimeout(step, speed);
    };
    step();
  }, [running, algoId, array, speed]);

  const stopSort = () => {
    runRef.current = false;
    clearTimeout(rafRef.current);
    setRunning(false);
  };

  const currentAlgo = ALGOS.find(a => a.id === algoId);

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', padding:'90px 1rem 3rem' }}>
      <div style={{ maxWidth: 1000, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom:'2rem' }}>
          <h1 className="font-display" style={{ fontSize:'clamp(1.5rem,4vw,2.5rem)', fontWeight:900,
            background:'linear-gradient(135deg,#ffffff,#06b6d4)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            ALGORITHM VISUALIZER
          </h1>
          <p style={{ color:'#64748b', fontFamily:'Rajdhani', marginTop:4 }}>
            Watch sorting algorithms come to life in real-time
          </p>
        </div>

        {/* Algorithm selector */}
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
          {ALGOS.map(algo => (
            <button key={algo.id} onClick={() => { if (!running) { setAlgoId(algo.id); reset(); } }}
              disabled={running} style={{
                padding:'0.5rem 1rem', borderRadius:8, border:'none', cursor: running ? 'not-allowed' : 'pointer',
                fontFamily:'Orbitron, monospace', fontSize:'0.7rem', fontWeight:700, letterSpacing:1,
                background: algoId === algo.id ? `linear-gradient(135deg,${algo.color},#a855f7)` : 'rgba(255,255,255,0.05)',
                color: algoId === algo.id ? 'white' : '#64748b', transition:'all 0.2s',
                opacity: running && algoId !== algo.id ? 0.4 : 1
              }}>
              {algo.name.toUpperCase().split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'1.5rem', alignItems:'center' }}>
          <button onClick={startSort} disabled={running || done} className="btn-primary"
            style={{ opacity:(running || done) ? 0.5 : 1, cursor:(running || done) ? 'not-allowed' : 'pointer', padding:'0.75rem 1.5rem' }}>
            ▶ SORT
          </button>
          {running && (
            <button onClick={stopSort} className="btn-outline" style={{ padding:'0.75rem 1.5rem' }}>
              ⏸ PAUSE
            </button>
          )}
          <button onClick={reset} disabled={running} className="btn-outline"
            style={{ opacity:running ? 0.5 : 1, cursor:running ? 'not-allowed' : 'pointer', padding:'0.75rem 1.5rem' }}>
            🔄 RESET
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginLeft:'auto' }}>
            <span style={{ color:'#64748b', fontFamily:'Rajdhani', fontSize:'0.85rem' }}>Speed:</span>
            <input type="range" min={5} max={200} value={200 - speed + 5} onChange={e => setSpeed(200 - parseInt(e.target.value) + 5)}
              disabled={running} style={{ accentColor:'#6366f1', width:100 }} />
            <span style={{ color:'#6366f1', fontFamily:'Orbitron', fontSize:'0.75rem' }}>
              {speed < 30 ? 'FAST' : speed < 100 ? 'MED' : 'SLOW'}
            </span>
          </div>
        </div>

        {/* Info bar */}
        <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          {[
            { label:'Algorithm',   value: currentAlgo?.name },
            { label:'Time Complexity', value: currentAlgo?.complexity, color:'#f59e0b' },
            { label:'Space',       value: currentAlgo?.space,          color:'#10b981' },
            { label:'Steps',       value: steps,                       color:'#6366f1' },
            { label:'Status',      value: done ? '✅ SORTED' : running ? '⚡ SORTING...' : '⏸ READY',
              color: done ? '#10b981' : running ? '#6366f1' : '#64748b' },
          ].map(info => (
            <div key={info.label} style={{
              background:'#1a1a2e', border:'1px solid #2a2a4a', borderRadius:8, padding:'0.5rem 1rem', flex:1, minWidth:120
            }}>
              <div style={{ color:'#64748b', fontFamily:'Rajdhani', fontSize:'0.75rem', letterSpacing:1 }}>{info.label.toUpperCase()}</div>
              <div style={{ color: info.color || '#e2e8f0', fontFamily:'Orbitron', fontSize:'0.85rem', fontWeight:700 }}>
                {info.value}
              </div>
            </div>
          ))}
        </div>

        {/* Visualization */}
        <div className="arcade-card" style={{ padding:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:2, height:260, paddingBottom:4 }}>
            {array.map((val, i) => {
              const isComparing = comparing.includes(i);
              const color = done ? '#10b981'
                          : isComparing && swapping ? '#ef4444'
                          : isComparing ? '#f59e0b'
                          : currentAlgo?.color || '#6366f1';
              return (
                <div key={i} style={{
                  flex:1, height:`${val}%`, borderRadius:'3px 3px 0 0',
                  background: color,
                  boxShadow: isComparing ? `0 0 8px ${color}` : 'none',
                  transition: 'height 0.05s ease, background 0.1s ease',
                  minWidth:2
                }} />
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display:'flex', gap:'1.5rem', marginTop:'1rem', flexWrap:'wrap' }}>
            {[
              { color: currentAlgo?.color || '#6366f1', label:'Unsorted' },
              { color:'#f59e0b', label:'Comparing' },
              { color:'#ef4444', label:'Swapping' },
              { color:'#10b981', label:'Sorted' },
            ].map(item => (
              <div key={item.label} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:12, height:12, borderRadius:2, background:item.color }} />
                <span style={{ color:'#64748b', fontFamily:'Rajdhani', fontSize:'0.8rem' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="arcade-card" style={{ padding:'1.5rem', marginTop:'1.5rem' }}>
          <h3 className="font-display" style={{ color:'#e2e8f0', fontSize:'0.9rem', letterSpacing:1, marginBottom:'1rem' }}>
            💡 HOW {currentAlgo?.name?.toUpperCase()} WORKS
          </h3>
          <p style={{ color:'#94a3b8', fontFamily:'Rajdhani', lineHeight:1.7 }}>
            {algoId === 'bubble' && 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until no swaps are needed.'}
            {algoId === 'selection' && 'Selection Sort divides the array into a sorted and unsorted region. It repeatedly selects the minimum element from the unsorted region and moves it to the end of the sorted region.'}
            {algoId === 'insertion' && 'Insertion Sort builds the sorted array one element at a time. It takes each element and inserts it into its correct position among the already-sorted elements.'}
            {algoId === 'merge' && 'Merge Sort is a divide-and-conquer algorithm. It divides the array in half, recursively sorts each half, then merges them back together in sorted order. Guaranteed O(n log n).'}
            {algoId === 'quick' && 'Quick Sort picks a pivot element and partitions the array around it — smaller elements go left, larger go right. It recursively sorts both partitions. Average case is O(n log n).'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisualizerPage;
