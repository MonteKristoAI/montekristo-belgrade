import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

export interface NodeData extends SimulationNodeDatum {
  id: string;
  label: string;
  category: string;
  color: string;
  description: string;
  caseStudy?: string;
  impact?: string;
}

export interface LinkData extends SimulationLinkDatum<NodeData> {
  source: string | NodeData;
  target: string | NodeData;
  value?: number;
}

export interface GraphData {
  nodes: NodeData[];
  links: LinkData[];
}

export interface TooltipData {
  node: NodeData;
  x: number;
  y: number;
  visible: boolean;
}

export interface ExpandedViewData {
  node: NodeData | null;
  visible: boolean;
}