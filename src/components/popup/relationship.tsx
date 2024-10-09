import React, { useContext, useEffect, useRef, useState } from 'react';
import * as go from 'gojs';
import contexto from '@/context/context';
import { updateSession } from '@/firebase/sessions';

export default function Relationship() {
  const diagramRef = useRef<HTMLDivElement | null>(null);
  const { setShowRelationship, setShowMessage, session } = useContext(contexto);
  const [isLinking, setIsLinking] = useState(false);
  const [nodeDataArray, setNodeDataArray] = useState(session.relationships.nodes);
  const [linkDataArray, setLinkDataArray] = useState(session.relationships.links.map((link: any) => ({ ...link, points: link.points ? link.points.split(', ').map((p: any) => p.split(' ').map(Number)) : [] })));

  useEffect(() => {
    setNodeDataArray(session.relationships.nodes);
    setLinkDataArray(session.relationships.links.map((link: any) => ({ ...link, points: link.points ? link.points.split(', ').map((p: any) => p.split(' ').map(Number)) : [] })));
    if (!diagramRef.current) return;
    const $ = go.GraphObject.make;
    const diagram: any = $(go.Diagram, diagramRef.current, {
      'undoManager.isEnabled': true,
      'toolManager.mouseWheelBehavior': go.ToolManager.WheelScroll,
      'scrollsPageOnFocus': false,
    });
    diagram.toolManager.linkingTool.isEnabled = isLinking;
    diagram.toolManager.relinkingTool.isEnabled = isLinking;
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
    diagram.linkTemplate = $(go.Link,
      {
        curve: go.Link.Bezier,
        adjusting: go.Link.Stretch,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        selectable: true,
      },
      $(go.Shape, { strokeWidth: 2, stroke: 'lightblue' }),
      $(go.Shape, { toArrow: 'Standard', stroke: 'lightgreen', fill: 'lightgreen' }),
      $(go.Panel, 'Auto',
        $(go.Shape, 'RoundedRectangle', { fill: '#F8F8F8' }),
        $(go.TextBlock, 'Label', { margin: 4, editable: true }, new go.Binding('text', 'label').makeTwoWay())
      )
    );
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    diagram.addModelChangedListener((e: any) => {
      if (e.isTransactionFinished) {
        setNodeDataArray(diagram.model.nodeDataArray);
        setLinkDataArray(diagram.model.linkDataArray);
        diagram.links.each((link: any) => {
          const linkData = link.data;
          if (linkData.points) {
            link.points = linkData.points.map((point: any) => new go.Point(point[0], point[1]));
          }
        });
        saveChanges();
      }
    });
    diagram.addDiagramListener("LinkReshaped", (e: any) => {
      const link = e.subject;
      const linkData = link.data;
      const linkIndex = linkDataArray.findIndex((l: any) => l.key === linkData.key);
      if (linkIndex !== -1) {
        linkData.points = link.points.toArray().map((point: any) => [point.x, point.y]);
        const updatedLinkDataArray = [...linkDataArray];
        updatedLinkDataArray[linkIndex] = {
          ...updatedLinkDataArray[linkIndex],
          points: linkData.points
        }; 
        setLinkDataArray(updatedLinkDataArray);
      }
    });
    return () => { diagram.div = null };
  }, [isLinking, nodeDataArray, linkDataArray, session]);

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
    const dataSession = session;
    session.relationships = { nodes: nodeDataArray, links: linkDataArray.map((link: any) => ({ ...link, points: link.points.map((point: any) => `${point[0]} ${point[1]}`).join(', ') })) };
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
          { isLinking ? 'Clique para Mover' : 'Clique para Linkar' }
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
