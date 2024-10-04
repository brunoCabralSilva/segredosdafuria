import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  reconnectEdge,
  addEdge,
  Node,
  Edge,
  applyNodeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MdDelete } from 'react-icons/md';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import contexto from '@/context/context';
import { updateSession } from '@/firebase/sessions';
import { BiMenuAltLeft } from 'react-icons/bi';

interface Data {
  nodes: {
    id: number;
    data: { label: JSX.Element };
    position: { x: number; y: number };
    isInitial: boolean;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    label: string;
  }[];
}

export default function Relationship() {
  const { setShowRelationship, session, setShowMessage } = useContext(contexto);
  const [nodeCount, setNodeCount] = useState<number>(4);
  const [nodes, setNodes] = useNodesState<any>([
    { id: 0, data: { label: <span>Initial Node</span> }, position: { x: 0, y: 0 } },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [newNodeLabel, setNewNodeLabel] = useState<string>('');
  const [edgeLabel, setEdgeLabel] = useState<string>('');
  const [optionSelect, setOptionSelect] = useState('players');
  const [showMenu, setShowMenu] = useState(false);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: any) => setEdges((els) => reconnectEdge(oldEdge, newConnection, els)), [setEdges],
  );

  const onNodesChange = useCallback(
    (changes: any) => {
      setNodes((prevNodes) => {
        const updatedNodes = applyNodeChanges(changes, prevNodes);
        return updatedNodes;
      });
    }, [setNodes]
  );

  const onConnect = useCallback(
    (params: any) => {
      const edgeWithLabel = { ...params, label: edgeLabel || `Edge ${params.source}-${params.target}` };
      setEdges((els) => addEdge(edgeWithLabel, els));
      setEdgeLabel('');
    }, [setEdges, edgeLabel]
  );

  const addNewNode = () => {
    const newNodeId = (nodeCount + 1).toString();
    const newNode: any = {
      id: newNodeId,
      data: { label: <span>{newNodeLabel || `Node ${newNodeId}`}</span> },
      position: { x: 100 + (nodeCount % 2) * 200, y: nodeCount < 2 ? 100 : 300 },
      isInitial: false,
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setNodeCount((prevCount) => prevCount + 1);
    setNewNodeLabel('');
  };

  const removeNode = (id: string) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const editNode = (id: string, newLabel: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => node.id === id ? { ...node, data: { label: <span>{newLabel}</span> } } : node)
    );
  };

  const editEdge = (id: string, newLabel: string) => {
    setEdges((prevEdges) => prevEdges.map((edge) => (edge.id === id ? { ...edge, label: newLabel } : edge)));
  };

  const handleEdgeSelect = (edgeId: string) => {
    const edge: any = edges.find((e) => e.id === edgeId);
    if (edge) setEdgeLabel(edge.label);
  };

  useEffect(() => {
    const initialData: Data = {
      nodes: session.relationships.nodes.map((node: any) => ({
        id: `${node.id}`,
        data: { label: <span>{node.data}</span> },
        position: node.position,
        isInitial: node.isInitial,
      })),
      edges: session.relationships.edges.map((edge: any) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
      })),
    };
    setNodes(initialData.nodes);
    setEdges(initialData.edges);
  }, []);

  // useEffect(() => {
  //   const updatedData: Data = {
  //     nodes: nodes.map((node: any) => ({
  //       id: node.id,
  //       data: node.data,
  //       position: node.position,
  //       isInitial: node.isInitial,
  //     })),
  //     edges: edges.map((edge: any) => ({
  //       id: edge.id,
  //       source: edge.source,
  //       target: edge.target,
  //       label: edge.label,
  //     })),
  //   };
  //   }, [nodes, edges]);
    
    const saveChanges = async () => {  
      const newDataSession = session;
      const registerData: Data = {
        nodes: nodes.map((node: any) => ({
          id: node.id,
          data: node.data.label.props.children,
          position: { x: node.position.x, y: node.position.y },
          isInitial: node.isInitial,
        })),
        edges: edges.map((edge: any) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
        })),
      };
      newDataSession.relationships = registerData;
      await updateSession(newDataSession, setShowMessage);
    };

  return (
    <div className="w-screen h-screen z-80 fixed top-0 left-0 bg-black text-black">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        snapToGrid
        onReconnect={onReconnect}
        onConnect={onConnect}
        fitView
        attributionPosition="top-right"
        onEdgeClick={(event, edge) => handleEdgeSelect(edge.id)}
      >
        <Controls />
      </ReactFlow>
      <button
        onClick={() => setShowMenu(true)}
        className="rounded-full p-3 text-4xl text-white cursor-pointer mb-2 fixed top-2 right-1"
      >
        <BiMenuAltLeft />
      </button>
      {
        showMenu &&
        <div className="z-60 w-1/3 flex flex-col fixed right-0 top-0 h-screen overflow-y-auto border-2 border-transparent border-l-white p-4 bg-gray-whats-dark">
          <div className="w-full flex justify-between mb-5 items-center">
            <p className="w-full text-white font-bold text-xl text-left">Mapa de Relacionamentos</p>
            <BiMenuAltLeft
              className="text-4xl text-white cursor-pointer mb-2"
              onClick={() => setShowMenu(!showMenu)}
            />
          </div>
          <select
            value={optionSelect}
            onChange={(e) => {
              setOptionSelect(e.target.value);
            }}
            className="w-full mb-2 border border-white p-3 cursor-pointer bg-black text-white flex items-center justify-center font-bold text-center"
          >
            <option value={'players'}>Personagens</option>
            <option value={'relationships'}>Relacionamentos</option>
            <option value={'connections'}>Conexões</option>
          </select>
          <div className="flex flex-col justify-between w-full">
            {optionSelect === 'players' && (
              <div className="w-full">
                <h2 className="text-white py-2">Personagens:</h2>
                {nodes
                  .filter((node: any) => node.isInitial)
                  .map((node: any) => (
                    <div key={node.id} className="flex items-center mb-2 border border-white">
                      <span className="p-2 rounded w-full outline-none text-white">{node.data.label}</span>
                    </div>
                  ))}
              </div>
            )}
            {optionSelect === 'relationships' && (
              <div className="w-full mt-5">
                {edges.map((edge: any) => (
                  <div key={edge.id} className="flex flex-col items-center mb-2">
                    <p className="font-bold text-white text-left w-full">
                      {`Entre "${nodes.find((item: any) => item.id === edge.target).data.label.props.children}" e "${nodes.find((item: any) => item.id === edge.source).data.label.props.children}"` }
                    </p>
                    <input
                      type="text"
                      value={edge.label}
                      onChange={(e) => editEdge(edge.id, e.target.value)}
                      className="p-2 rounded w-full mb-1"
                      style={{ background: '#fff', color: '#000' }}
                    />
                  </div>
                ))}
              </div>
            )}
            {optionSelect === 'connections' && (
              <div className="w-full">
                <h2 className="text-white py-2">Adicionar Conexão:</h2>
                <div className="flex gap-1 pt-2">
                  <input
                    type="text"
                    value={newNodeLabel}
                    onChange={(e) => setNewNodeLabel(e.target.value)}
                    placeholder="Nome da Conexão"
                    className="p-2 rounded w-1/2"
                  />
                  <button
                    onClick={addNewNode}
                    className="p-2 bg-gray-700 text-white rounded w-1/2"
                  >
                    Adicionar
                  </button>
                </div>
                <div className="pt-2">
                  <h2 className="text-white py-2">Lista de Conexões:</h2>
                  {
                    nodes.filter((node: any) => !node.isInitial).map((node: any) => (
                    <div key={node.id} className="flex items-center mb-2 gap-1">
                      <input
                        type="text"
                        value={node.data.label.props.children}
                        onChange={(e) => editNode(node.id, e.target.value)}
                        placeholder="Editar rótulo do pilar"
                        className="p-2 rounded w-full"
                        style={{ background: '#fff', color: '#000' }}
                      />
                      <button onClick={() => removeNode(node.id)} className="py-2 px-1 bg-red-500 text-white rounded text-2xl">
                        <MdDelete />
                      </button>
                    </div>
                    ))
                  }
                </div>
              </div> 
            )}
            <button type="button" onClick={ saveChanges }>Salvar Alterações</button>
            <button type="button" onClick={() => setShowRelationship(false)}>Sair do Mapa de Relacionamentos</button>
           
          </div>
        </div>
      }
    </div>
  );
}
