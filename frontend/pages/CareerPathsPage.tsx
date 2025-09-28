
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CAREER_PATHS } from '../constants';
import { CareerPathNode } from '../types';

// --- Helper function for highlighting search text ---
const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
        return <>{text}</>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={i} className="bg-marg-accent/30 rounded p-0 m-0">{part}</mark>
                ) : (
                    part
                )
            )}
        </>
    );
};


// --- Graph Visualization Components ---

// Renders the curved line (edge) between two nodes
const GraphEdge: React.FC<{ edge: { sourceX: number; sourceY: number; targetX: number; targetY: number; } }> = ({ edge }) => {
    const { sourceX, sourceY, targetX, targetY } = edge;
    // Create a smooth cubic bezier curve for the path
    const path = `M${sourceX},${sourceY} C${sourceX},${sourceY + 60} ${targetX},${targetY - 60} ${targetX},${targetY}`;
    return (
        <path d={path} stroke="#e2e8f0" strokeWidth="2" fill="none" className="transition-all" />
    );
};

// Renders an individual career stage (node) in the graph
const GraphNode: React.FC<{
    node: { x: number; y: number; data: CareerPathNode };
    onSelect: (node: CareerPathNode) => void;
    isSelected: boolean;
    isSearchResult: boolean;
    isFocusedResult: boolean;
    searchTerm: string;
}> = ({ node, onSelect, isSelected, isSearchResult, isFocusedResult, searchTerm }) => {
    const { x, y, data } = node;
    const NODE_WIDTH = 180;
    const NODE_HEIGHT = 60;

    const baseClasses = 'w-full h-full p-2 rounded-lg border-2 flex items-center justify-center text-center transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5';
    let stateClasses = '';
    if (isSelected) {
        stateClasses = 'bg-marg-secondary/10 border-marg-secondary shadow-lg';
    } else if (isFocusedResult) {
        stateClasses = 'bg-white border-marg-accent ring-4 ring-marg-accent/50 shadow-md';
    } else if (isSearchResult) {
        stateClasses = 'bg-white border-gray-200 ring-2 ring-marg-accent/70';
    } else {
        stateClasses = 'bg-white border-gray-200';
    }

    return (
        <g transform={`translate(${x}, ${y})`} className="cursor-pointer group" onClick={() => onSelect(data)}>
            <foreignObject width={NODE_WIDTH} height={NODE_HEIGHT}>
                {/* FIX: The 'xmlns' attribute is not a valid prop for a div in React's TypeScript definitions and is often not required by modern browsers for rendering HTML within a foreignObject. It has been removed to resolve the type error. */}
                <div
                    className={`${baseClasses} ${stateClasses}`}
                >
                    <h4 className="font-bold text-sm text-marg-primary">
                        {highlightText(data.name, searchTerm)}
                    </h4>
                </div>
            </foreignObject>
        </g>
    );
};

// Custom hook to calculate the positions of nodes and edges for the graph layout
const useGraphLayout = (rootNode: CareerPathNode | null) => {
    return useMemo(() => {
        if (!rootNode) return { nodes: [], edges: [], width: 0, height: 0 };

        const NODE_WIDTH = 180;
        const NODE_HEIGHT = 60;
        const X_SPACING = 50;
        const Y_SPACING = 120;

        const positionedNodes: { id: string; x: number; y: number; data: CareerPathNode }[] = [];
        const parentMap = new Map<string, string>();
        
        const nodesByDepth: CareerPathNode[][] = [];
        function traverseAndGroup(node: CareerPathNode, depth: number) {
            if (!nodesByDepth[depth]) nodesByDepth[depth] = [];
            nodesByDepth[depth].push(node);
            if (node.children) {
                node.children.forEach(child => {
                    parentMap.set(child.id, node.id);
                    traverseAndGroup(child, depth + 1);
                });
            }
        }
        traverseAndGroup(rootNode, 0);

        const maxLevelWidth = Math.max(1, ...nodesByDepth.map(level => level.length));
        const graphWidth = maxLevelWidth * (NODE_WIDTH + X_SPACING);
        const graphHeight = (nodesByDepth.length) * (NODE_HEIGHT + Y_SPACING) - Y_SPACING;

        const nodePositions = new Map<string, { x: number; y: number }>();
        nodesByDepth.forEach((level, depth) => {
            const levelNodeCount = level.length;
            level.forEach((node, i) => {
                const x = (graphWidth / (levelNodeCount + 1)) * (i + 1) - NODE_WIDTH / 2;
                const y = depth * (NODE_HEIGHT + Y_SPACING);
                positionedNodes.push({ id: node.id, x, y, data: node });
                nodePositions.set(node.id, { x, y });
            });
        });
        
        const edges: { id: string; sourceX: number; sourceY: number; targetX: number; targetY: number }[] = [];
        positionedNodes.forEach(node => {
            const parentId = parentMap.get(node.id);
            if (parentId) {
                const parentPos = nodePositions.get(parentId)!;
                const childPos = nodePositions.get(node.id)!;
                edges.push({
                    id: `${parentId}->${node.id}`,
                    sourceX: parentPos.x + NODE_WIDTH / 2,
                    sourceY: parentPos.y + NODE_HEIGHT,
                    targetX: childPos.x + NODE_WIDTH / 2,
                    targetY: childPos.y,
                });
            }
        });

        return { nodes: positionedNodes, edges, width: graphWidth, height: graphHeight };
    }, [rootNode]);
};

// Custom hook to manage all interactive SVG logic (pan, zoom, focus)
const useInteractiveSVG = (
    svgRef: React.RefObject<SVGSVGElement>,
    graphWidth: number,
    graphHeight: number,
    searchTerm: string,
    focusedNodeId: string | null,
    nodes: { id: string; x: number; y: number; }[]
) => {
    const [viewBox, setViewBox] = useState('0 0 1 1');
    const [isPanning, setIsPanning] = useState(false);
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

    const resetView = useMemo(() => {
        if (graphWidth === 0 || graphHeight === 0) return '0 0 1 1';
        const padding = 50;
        return `${-padding} ${-padding} ${graphWidth + padding * 2} ${graphHeight + padding * 2}`;
    }, [graphWidth, graphHeight]);

    useEffect(() => {
        setViewBox(resetView);
    }, [resetView]);

    useEffect(() => {
        if (focusedNodeId && nodes.length > 0) {
            const targetNode = nodes.find(n => n.id === focusedNodeId);
            if (targetNode) {
                const NODE_WIDTH = 180;
                const NODE_HEIGHT = 60;
                const [, , vw, vh] = viewBox.split(' ').map(Number);
                const targetX = targetNode.x + NODE_WIDTH / 2 - vw / 2;
                const targetY = targetNode.y + NODE_HEIGHT / 2 - vh / 2;
                setViewBox(`${targetX} ${targetY} ${vw} ${vh}`);
            }
        } else if (!searchTerm) {
             setViewBox(resetView);
        }
    }, [focusedNodeId, nodes, searchTerm, resetView, viewBox]);

    const getSVGPoint = (clientX: number, clientY: number) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const pt = svgRef.current.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
        return { x: svgP.x, y: svgP.y };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('g.group')) return;
        setIsPanning(true);
        setStartPoint({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isPanning || !svgRef.current) return;
        e.preventDefault();
        const [vx, vy, vw, vh] = viewBox.split(' ').map(Number);
        const dx = (startPoint.x - e.clientX) * (vw / svgRef.current.clientWidth);
        const dy = (startPoint.y - e.clientY) * (vh / svgRef.current.clientHeight);
        setViewBox(`${vx + dx} ${vy + dy} ${vw} ${vh}`);
        setStartPoint({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUpOrLeave = () => setIsPanning(false);

    const handleWheel = (e: React.WheelEvent) => {
        if (!svgRef.current) return;
        e.preventDefault();
        const [vx, vy, vw, vh] = viewBox.split(' ').map(Number);
        const zoomFactor = 1.1;
        const mousePoint = getSVGPoint(e.clientX, e.clientY);
        const newWidth = e.deltaY > 0 ? vw * zoomFactor : vw / zoomFactor;
        const newHeight = e.deltaY > 0 ? vh * zoomFactor : vh / zoomFactor;
        const newX = mousePoint.x - (mousePoint.x - vx) * (newWidth / vw);
        const newY = mousePoint.y - (mousePoint.y - vy) * (newHeight / vh);
        setViewBox(`${newX} ${newY} ${newWidth} ${newHeight}`);
    };

    return {
        viewBox,
        isPanning,
        eventHandlers: {
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUpOrLeave,
            onMouseLeave: handleMouseUpOrLeave,
            onWheel: handleWheel,
        },
    };
};


// The main component that renders the SVG canvas
const CareerPathGraph: React.FC<{
    rootNode: CareerPathNode | null;
    onSelectNode: (node: CareerPathNode) => void;
    selectedNodeId: string | null;
    searchTerm: string;
    searchResults: CareerPathNode[];
    focusedNodeId: string | null;
}> = ({ rootNode, onSelectNode, selectedNodeId, searchTerm, searchResults, focusedNodeId }) => {
    const { nodes, edges, width, height } = useGraphLayout(rootNode);
    const svgRef = useRef<SVGSVGElement>(null);

    const { viewBox, isPanning, eventHandlers } = useInteractiveSVG(svgRef, width, height, searchTerm, focusedNodeId, nodes);

    if (!rootNode) return null;

    return (
        <div className="w-full h-full bg-gray-50/50 rounded-lg border border-gray-200 overflow-hidden relative">
            <svg
                ref={svgRef} width="100%" height="100%" viewBox={viewBox}
                {...eventHandlers}
                className={isPanning ? 'cursor-grabbing' : 'cursor-grab'}
            >
                <g>
                    {edges.map(edge => <GraphEdge key={edge.id} edge={edge} />)}
                    {nodes.map(node => (
                        <GraphNode
                            key={node.id} node={node} onSelect={onSelectNode}
                            isSelected={node.id === selectedNodeId}
                            isSearchResult={searchResults.some(r => r.id === node.id)}
                            isFocusedResult={node.id === focusedNodeId}
                            searchTerm={searchTerm}
                        />
                    ))}
                </g>
            </svg>
             <div className="absolute bottom-2 right-2 bg-white/70 backdrop-blur-sm p-2 rounded-lg text-xs text-marg-text-secondary shadow-md">
                Scroll to zoom, drag to pan.
            </div>
        </div>
    );
};


// --- Main Page Component ---
const CareerPathsPage: React.FC = () => {
    const [activePathKey, setActivePathKey] = useState(Object.keys(CAREER_PATHS)[0]);
    const [selectedNode, setSelectedNode] = useState<CareerPathNode | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<CareerPathNode[]>([]);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);

    const activePath = CAREER_PATHS[activePathKey].data;

    useEffect(() => {
        const findMatches = (node: CareerPathNode, term: string): CareerPathNode[] => {
            let matches: CareerPathNode[] = [];
            const lowerCaseTerm = term.toLowerCase();
            const isMatch = node.name.toLowerCase().includes(lowerCaseTerm) ||
                            node.description.toLowerCase().includes(lowerCaseTerm) ||
                            node.skills.some(skill => skill.toLowerCase().includes(lowerCaseTerm));
            if (isMatch) { matches.push(node); }
            if (node.children) {
                node.children.forEach(child => { matches = matches.concat(findMatches(child, term)); });
            }
            return matches;
        };

        if (!searchTerm.trim()) {
            setSearchResults([]);
            setCurrentMatchIndex(-1);
            return;
        }
        const results = findMatches(activePath, searchTerm);
        setSearchResults(results);
        setCurrentMatchIndex(results.length > 0 ? 0 : -1);
    }, [searchTerm, activePath]);

    useEffect(() => {
        // When the active path changes, reset search and selection
        setSearchTerm('');
        setSelectedNode(CAREER_PATHS[activePathKey].data);
    }, [activePathKey]);

    const handleNextMatch = () => {
        setCurrentMatchIndex(prev => (prev + 1) % searchResults.length);
    };
    const handlePrevMatch = () => {
        setCurrentMatchIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
    };

    const focusedNodeId = currentMatchIndex > -1 ? searchResults[currentMatchIndex]?.id : null;

    return (
        <div className="bg-marg-bg min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-marg-primary mb-2">Explore Career Paths</h1>
                        <p className="text-lg text-marg-text-secondary">Visualize the journey from start to specialization.</p>
                    </div>
                    <div className="w-full md:w-64">
                        <select onChange={e => setActivePathKey(e.target.value)} value={activePathKey} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marg-accent focus:outline-none bg-white" aria-label="Select a career path">
                            {Object.keys(CAREER_PATHS).map(key => (
                                <option key={key} value={key}>{CAREER_PATHS[key].name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-7 lg:col-span-8 h-[75vh] flex flex-col">
                        <div className="relative mb-4 z-10">
                             <input
                                type="text"
                                placeholder="Search by name, skill, etc..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-4 pr-32 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marg-accent focus:outline-none"
                              />
                              {searchResults.length > 0 && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
                                    <span className="text-sm text-gray-500">{currentMatchIndex + 1} of {searchResults.length}</span>
                                    <button onClick={handlePrevMatch} aria-label="Previous match" className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg></button>
                                    <button onClick={handleNextMatch} aria-label="Next match" className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></button>
                                </div>
                              )}
                        </div>
                        <CareerPathGraph
                            rootNode={activePath}
                            onSelectNode={setSelectedNode}
                            selectedNodeId={selectedNode?.id || null}
                            searchTerm={searchTerm}
                            searchResults={searchResults}
                            focusedNodeId={focusedNodeId}
                        />
                    </div>

                    <div className="md:col-span-5 lg:col-span-4 sticky top-24">
                        {selectedNode ? (
                            <div className="bg-white p-6 rounded-lg border border-gray-200 transition-all duration-300 animate-fade-in max-h-[75vh] overflow-y-auto">
                                <h2 className="text-2xl font-bold text-marg-primary mb-3">{highlightText(selectedNode.name, searchTerm)}</h2>
                                <p className="text-marg-text-secondary mb-6">{highlightText(selectedNode.description, searchTerm)}</p>
                                <div className="mb-6">
                                    <h3 className="font-semibold text-marg-primary mb-3">Required Skills</h3>
                                    <div>
                                        {selectedNode.skills.length > 0 ? selectedNode.skills.map(skill => (
                                            <span key={skill} className="inline-block bg-marg-bg-light text-marg-secondary text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full">
                                                {highlightText(skill, searchTerm)}
                                            </span>
                                        )) : <p className="text-sm text-gray-500">None specified.</p>}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-marg-primary mb-3">Educational Path</h3>
                                    <ul className="list-disc list-inside text-marg-text-secondary space-y-1">
                                        {selectedNode.education.length > 0 ? selectedNode.education.map(edu => <li key={edu}>{edu}</li>) : <p className="text-sm text-gray-500">Primarily based on experience.</p>}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                                <p className="text-marg-text-secondary">Select a node from the graph to see details.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerPathsPage;
