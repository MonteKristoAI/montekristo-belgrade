import { GraphData } from './types';

export const businessOSData: GraphData = {
  nodes: [
    {
      id: 'business-os',
      label: 'Business OS',
      category: 'core',
      color: 'hsl(248, 83%, 65%)',
      description: 'Central AI orchestration hub that coordinates all your business systems',
      impact: 'System integration efficiency: +340%'
    },
    {
      id: 'lead-qualifier',
      label: 'Lead Qualifier',
      category: 'sales',
      color: 'hsl(35, 91%, 48%)',
      description: 'AI agent that scores and routes leads automatically',
      caseStudy: 'Increased qualified lead conversion by 67% for SaaS company',
      impact: '+67% qualified leads'
    },
    {
      id: 'outreach-agent',
      label: 'Outreach Agent',
      category: 'sales',
      color: 'hsl(195, 93%, 48%)',
      description: 'Personalized outreach sequences with AI-generated content',
      caseStudy: 'Generated 240% higher reply rates for B2B agency',
      impact: '+240% reply rate'
    },
    {
      id: 'crm-sync',
      label: 'CRM Sync',
      category: 'operations',
      color: 'hsl(269, 87%, 65%)',
      description: 'Seamless data synchronization across all your tools',
      caseStudy: 'Eliminated 12 hours/week of manual data entry',
      impact: '+12 hrs saved/week'
    },
    {
      id: 'content-repurposer',
      label: 'Content Repurposer',
      category: 'marketing',
      color: 'hsl(158, 64%, 52%)',
      description: 'Transform content across formats and platforms automatically',
      caseStudy: 'Increased content output by 5x for marketing team',
      impact: '+5x content output'
    },
    {
      id: 'sales-trainer',
      label: 'Sales Trainer',
      category: 'training',
      color: 'hsl(327, 73%, 64%)',
      description: 'AI-powered coaching and performance optimization',
      caseStudy: 'Improved team close rate by 43% in 3 months',
      impact: '+43% close rate'
    }
  ],
  links: [
    { source: 'business-os', target: 'lead-qualifier' },
    { source: 'business-os', target: 'outreach-agent' },
    { source: 'business-os', target: 'crm-sync' },
    { source: 'business-os', target: 'content-repurposer' },
    { source: 'business-os', target: 'sales-trainer' }
  ]
};