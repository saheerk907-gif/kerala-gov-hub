// src/hooks/usePdfEditor.js
'use client';
import { useState, useCallback } from 'react';

export const TOOLS = ['text','whiteout','rect','circle','line','draw','highlight','sign'];

export default function usePdfEditor() {
  const [annotations, setAnnotations] = useState(new Map()); // pageIndex -> Annotation[]
  const [undoStack,   setUndoStack]   = useState(new Map()); // pageIndex -> Annotation[][]
  const [redoStack,   setRedoStack]   = useState(new Map()); // pageIndex -> Annotation[][]
  const [activeTool,  setActiveTool]  = useState('text');
  const [currentPage, setCurrentPage] = useState(0);
  const [style, setStyle] = useState({ color: '#000000', fontSize: 14, opacity: 1 });

  const getPageAnnotations = useCallback((pageIndex) =>
    annotations.get(pageIndex) || [], [annotations]);

  const addAnnotation = useCallback((pageIndex, annotation) => {
    setAnnotations(prev => {
      const next = new Map(prev);
      const page = next.get(pageIndex) || [];
      next.set(pageIndex, [...page, { ...annotation, id: crypto.randomUUID() }]);
      return next;
    });
    // push snapshot to undo stack, clear redo
    setUndoStack(prev => {
      const next = new Map(prev);
      const stack = next.get(pageIndex) || [];
      next.set(pageIndex, [...stack, getPageAnnotations(pageIndex)]);
      return next;
    });
    setRedoStack(prev => { const n = new Map(prev); n.delete(pageIndex); return n; });
  }, [getPageAnnotations]);

  const undo = useCallback((pageIndex) => {
    setUndoStack(prev => {
      const stack = prev.get(pageIndex) || [];
      if (!stack.length) return prev;
      const snapshot = stack[stack.length - 1];
      const next = new Map(prev);
      next.set(pageIndex, stack.slice(0, -1));
      // save current to redo
      setRedoStack(r => {
        const rn = new Map(r);
        rn.set(pageIndex, [...(r.get(pageIndex) || []), getPageAnnotations(pageIndex)]);
        return rn;
      });
      setAnnotations(a => { const an = new Map(a); an.set(pageIndex, snapshot); return an; });
      return next;
    });
  }, [getPageAnnotations]);

  const redo = useCallback((pageIndex) => {
    setRedoStack(prev => {
      const stack = prev.get(pageIndex) || [];
      if (!stack.length) return prev;
      const snapshot = stack[stack.length - 1];
      const next = new Map(prev);
      next.set(pageIndex, stack.slice(0, -1));
      setUndoStack(u => {
        const un = new Map(u);
        un.set(pageIndex, [...(u.get(pageIndex) || []), getPageAnnotations(pageIndex)]);
        return un;
      });
      setAnnotations(a => { const an = new Map(a); an.set(pageIndex, snapshot); return an; });
      return next;
    });
  }, [getPageAnnotations]);

  const clearAll = useCallback(() => {
    setAnnotations(new Map());
    setUndoStack(new Map());
    setRedoStack(new Map());
    setCurrentPage(0);
  }, []);

  // Push current state to undo stack without adding an annotation (used before drag-move)
  const pushUndoSnapshot = useCallback((pageIndex) => {
    setUndoStack(prev => {
      const next = new Map(prev);
      const stack = next.get(pageIndex) || [];
      next.set(pageIndex, [...stack, getPageAnnotations(pageIndex)]);
      return next;
    });
    setRedoStack(prev => { const n = new Map(prev); n.delete(pageIndex); return n; });
  }, [getPageAnnotations]);

  // Update an existing annotation in place (used for drag-move)
  const updateAnnotation = useCallback((pageIndex, id, updates) => {
    setAnnotations(prev => {
      const next = new Map(prev);
      const page = next.get(pageIndex) || [];
      next.set(pageIndex, page.map(ann => ann.id === id ? { ...ann, ...updates } : ann));
      return next;
    });
  }, []);

  // Delete an annotation (undoable)
  const deleteAnnotation = useCallback((pageIndex, id) => {
    setUndoStack(prev => {
      const next = new Map(prev);
      const stack = next.get(pageIndex) || [];
      next.set(pageIndex, [...stack, getPageAnnotations(pageIndex)]);
      return next;
    });
    setRedoStack(prev => { const n = new Map(prev); n.delete(pageIndex); return n; });
    setAnnotations(prev => {
      const next = new Map(prev);
      const page = next.get(pageIndex) || [];
      next.set(pageIndex, page.filter(ann => ann.id !== id));
      return next;
    });
  }, [getPageAnnotations]);

  return {
    annotations, activeTool, setActiveTool,
    currentPage, setCurrentPage,
    style, setStyle,
    getPageAnnotations, addAnnotation,
    undo, redo, clearAll,
    pushUndoSnapshot, updateAnnotation, deleteAnnotation,
    canUndo: (pageIndex) => (undoStack.get(pageIndex) || []).length > 0,
    canRedo: (pageIndex) => (redoStack.get(pageIndex) || []).length > 0,
  };
}
