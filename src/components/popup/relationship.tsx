import React, { useContext, useEffect, useRef, useState } from 'react';
import * as go from 'gojs';
import contexto from '@/context/context';
import { updateSession } from '@/firebase/sessions';

export default function Relationship() {
  const diagramRef = useRef<any>(null); // Ref para armazenar o diagrama
  const { setShowRelationship, setShowMessage, session } = useContext(contexto);
  const [isLinking, setIsLinking] = useState(false);
  const [nodeDataArray, setNodeDataArray] = useState(session.relationships.nodes);
  const [linkDataArray, setLinkDataArray] = useState(session.relationships.links);

  useEffect(() => {
    // Inicializa o diagrama apenas uma vez
    if (!diagramRef.current && diagramRef.current !== null) {
      const $ = go.GraphObject.make;
      const diagram: any = $(go.Diagram, diagramRef.current, {
        'undoManager.isEnabled': true,
        'toolManager.mouseWheelBehavior': go.ToolManager.WheelScroll,
        'scrollsPageOnFocus': false,
      });
      diagram.toolManager.linkingTool.isEnabled = isLinking;
      diagram.toolManager.relinkingTool.isEnabled = isLinking;

      // Configura o template do nó
      diagram.nodeTemplate = $(go.Node, 'Auto',
        {
          fromLinkable: true,
          toLinkable: true,
          cursor: 'move',
          deletable: true,
          resizable: false,
          movable: true,
          locationSpot: go.Spot.Center,
          doubleClick: (e: any, obj: any) => editNode(obj),
        },
        $(go.Panel, 'Auto',
          $(go.Shape, 'RoundedRectangle', { strokeWidth: 0 }, new go.Binding('fill', 'color')),
          $(go.TextBlock, { margin: 8 }, new go.Binding('text', 'name').makeTwoWay())
        ),
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify)
      );

      // Configura o template do link
      diagram.linkTemplate = $(go.Link,
        {
          curve: go.Link.Bezier,
          adjusting: go.Link.Stretch,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          selectable: true,
        },
        $(go.Shape, { strokeWidth: 2, stroke: 'white' }),
        $(go.Shape, { toArrow: 'Standard', stroke: 'white', fill: 'white' }),
        $(go.Panel, 'Auto',
          $(go.Shape, 'RoundedRectangle', { fill: '#F8F8F8' }),
          $(go.TextBlock, 'Label', { margin: 4, editable: true }, new go.Binding('text', 'label').makeTwoWay())
        )
      );

      // Define o modelo inicial do diagrama
      diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

      // Ouve alterações no modelo
      diagram.addModelChangedListener((e: any) => {
        if (e.isTransactionFinished) {
          setNodeDataArray(diagram.model.nodeDataArray);
          setLinkDataArray(diagram.model.linkDataArray);
          saveChanges();
        }
      });

      // Armazena o diagrama na ref
      diagramRef.current = diagram;
    }
  }, []); // Rodar apenas na montagem do componente

  // Atualiza o modelo do diagrama quando nodeDataArray ou linkDataArray mudam
  useEffect(() => {
    if (diagramRef.current) {
      diagramRef.current.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    }
  }, [nodeDataArray, linkDataArray]); // Atualiza apenas os dados do diagrama

  const createNode = () => {
    const newNode = {
      key: nodeDataArray.length + 1,
      name: `Novo Relacionamento ${nodeDataArray.length + 1}`,
      color: 'yellow',
      loc: '0 0',
    };
    setNodeDataArray([...nodeDataArray, newNode]);
  };

  const editNode = (obj: any) => {
    const node = obj.part.data;
    const newName = prompt("Editar nome do nó:", node.name);
    if (newName !== null) {
      node.name = newName;
      setNodeDataArray([...nodeDataArray]);
    }
  };

  const saveChanges = async () => {
    const dataSession = { ...session };
    dataSession.relationships = { nodes: nodeDataArray, links: linkDataArray };
    await updateSession(dataSession, setShowMessage);
  };

  return (
    <div className="w-screen h-screen z-80 fixed top-0 left-0 bg-ritual bg-cover bg-top text-black">
      <div className="bg-black/80 absolute w-full h-full" />
      <div
        ref={diagramRef}
        style={{ width: '100%', height: '600px', border: '1px solid black' }}
      />
      <div className="flex flex-col justify-between fixed z-80 bottom-2 right-2">
        <button
          type="button"
          onClick={() => setIsLinking(!isLinking)}
          className="rounded-lg border-2 bg-black border-white text-white p-2 hover:bg-white hover:text-black mb-2 flex items-center justify-center"
        >
          {isLinking ? 'Clique para Mover' : 'Clique para Linkar'}
        </button>
        <button
          type="button"
          onClick={() => createNode()}
          className="rounded-lg border-2 bg-black border-white text-white p-2 hover:bg-white hover:text-black mb-2"
        >
          Novo Personagem
        </button>
        <button
          type="button"
          onClick={() => setShowRelationship(false)}
          className="rounded-lg border-2 bg-black border-white text-white p-2 hover:bg-white hover:text-black mb-2"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
