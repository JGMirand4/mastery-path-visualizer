import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Stack, StackStatus, Category, RoadmapViewMode } from '@/types';
import { toast } from "@/components/ui/use-toast";

interface RoadmapContextType {
  stacks: Stack[];
  categories: Category[];
  viewMode: RoadmapViewMode;
  isDarkMode: boolean;
  totalProgress: number;
  addStack: (stack: Omit<Stack, 'id' | 'lastUpdated'>) => void;
  updateStack: (stack: Stack) => void;
  deleteStack: (id: string) => void;
  moveStack: (id: string, direction: 'up' | 'down') => void;
  toggleStackStatus: (id: string) => void;
  toggleSubtopicStatus: (stackId: string, subtopicId: string) => void;
  setViewMode: (mode: RoadmapViewMode) => void;
  toggleDarkMode: () => void;
  filterStacks: (query: string, status?: StackStatus | 'all', category?: string) => Stack[];
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (context === undefined) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Fundamentos Avançados de Programação' },
  { id: '2', name: 'Desenvolvimento Back-End Profissional' },
  { id: '3', name: 'Infraestrutura e DevOps' },
  { id: '4', name: 'Observabilidade e Segurança' },
  { id: '5', name: 'MLOps e Machine Learning' },
  { id: '6', name: 'Diferenciais de Mercado' },
];

const initialStacks: Stack[] = [
  {
    id: '1',
    icon: '🧠',
    title: 'Lógica e algoritmos avançados',
    description: 'Dominar lógica e algoritmos avançados para resolver problemas complexos',
    status: 'in-progress',
    category: 'Fundamentos Avançados de Programação',
    subtopics: [
      { id: 's1-1', title: 'Algoritmos de ordenação e busca', isCompleted: true },
      { id: 's1-2', title: 'Recursividade e backtracking', isCompleted: true },
      { id: 's1-3', title: 'Algoritmos gulosos', isCompleted: false },
      { id: 's1-4', title: 'Programação dinâmica', isCompleted: false }
    ],
    resources: ['Cracking the Coding Interview', 'LeetCode', 'HackerRank'],
    lastUpdated: new Date().toISOString(),
    notes: 'Praticar exercícios semanalmente para melhorar'
  },
  {
    id: '2',
    icon: '🧱',
    title: 'Estruturas de dados e complexidade',
    description: 'Dominar estruturas de dados eficientes e análise de complexidade (Big-O)',
    status: 'not-started',
    category: 'Fundamentos Avançados de Programação',
    subtopics: [
      { id: 's2-1', title: 'Arrays, listas encadeadas, sets', isCompleted: false },
      { id: 's2-2', title: 'Árvores (binária, AVL, B-tree)', isCompleted: false },
      { id: 's2-3', title: 'Grafos e algoritmos de grafos', isCompleted: false },
      { id: 's2-4', title: 'Análise de complexidade Big-O', isCompleted: false }
    ],
    resources: ['Data Structures & Algorithms in Python', 'GeeksForGeeks'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    icon: '🔁',
    title: 'OOP, funcional e assíncrono',
    description: 'Dominar paradigmas de programação: orientação a objetos, funcional e assíncrono',
    status: 'not-started',
    category: 'Fundamentos Avançados de Programação',
    subtopics: [
      { id: 's3-1', title: 'Classes, herança, polimorfismo', isCompleted: false },
      { id: 's3-2', title: 'Programação funcional em Python', isCompleted: false },
      { id: 's3-3', title: 'Async/await e concorrência', isCompleted: false },
      { id: 's3-4', title: 'Generators e decorators avançados', isCompleted: false }
    ],
    resources: ['Fluent Python', 'Python Cookbook'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    icon: '📦',
    title: 'Manipulação de arquivos',
    description: 'Dominar manipulação de arquivos e formatos diversos (JSON, XML, CSV)',
    status: 'not-started',
    category: 'Fundamentos Avançados de Programação',
    subtopics: [
      { id: 's4-1', title: 'Manipulação de JSON e YAML', isCompleted: false },
      { id: 's4-2', title: 'Processamento de CSV e Excel', isCompleted: false },
      { id: 's4-3', title: 'Manipulação de XML', isCompleted: false },
      { id: 's4-4', title: 'Streaming de arquivos grandes', isCompleted: false }
    ],
    resources: ['pandas docs', 'Python Standard Library'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '5',
    icon: '🧪',
    title: 'Testes e TDD',
    description: 'Dominar testes unitários e integração usando pytest e unittest',
    status: 'not-started',
    category: 'Fundamentos Avançados de Programação',
    subtopics: [
      { id: 's5-1', title: 'Testes unitários com pytest', isCompleted: false },
      { id: 's5-2', title: 'Mocks e fixtures', isCompleted: false },
      { id: 's5-3', title: 'Test-driven development', isCompleted: false },
      { id: 's5-4', title: 'Testes de cobertura', isCompleted: false }
    ],
    resources: ['pytest docs', 'Test-Driven Development with Python'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '6',
    icon: '🔍',
    title: 'Debugging profissional',
    description: 'Dominar ferramentas de debugging como PDB, VS Code e IPython',
    status: 'not-started',
    category: 'Fundamentos Avançados de Programação',
    subtopics: [
      { id: 's6-1', title: 'Debugging com PDB', isCompleted: false },
      { id: 's6-2', title: 'Debugging no VS Code', isCompleted: false },
      { id: 's6-3', title: 'Debugging com IPython', isCompleted: false },
      { id: 's6-4', title: 'Profiling e otimização', isCompleted: false }
    ],
    resources: ['Python Debugging With Pdb', 'VS Code debugging docs'],
    lastUpdated: new Date().toISOString()
  },

  {
    id: '7',
    icon: '🏗️',
    title: 'Django Rest Framework',
    description: 'Desenvolver APIs robustas com Django e Django Rest Framework',
    status: 'not-started',
    category: 'Desenvolvimento Back-End Profissional',
    subtopics: [
      { id: 's7-1', title: 'Models, views, serializers', isCompleted: false },
      { id: 's7-2', title: 'Autenticação e permissões', isCompleted: false },
      { id: 's7-3', title: 'Paginação e filtragem', isCompleted: false },
      { id: 's7-4', title: 'Django ORM avançado', isCompleted: false }
    ],
    resources: ['Django Rest Framework docs', 'Django for APIs book'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '8',
    icon: '⚡',
    title: 'FastAPI',
    description: 'Desenvolver APIs assíncronas, rápidas e tipo-seguras com FastAPI',
    status: 'not-started',
    category: 'Desenvolvimento Back-End Profissional',
    subtopics: [
      { id: 's8-1', title: 'Rotas, parâmetros e tipos', isCompleted: false },
      { id: 's8-2', title: 'Validação com Pydantic', isCompleted: false },
      { id: 's8-3', title: 'Dependency Injection', isCompleted: false },
      { id: 's8-4', title: 'Autenticação e OAuth2', isCompleted: false }
    ],
    resources: ['FastAPI docs', 'FastAPI courses on TestDriven.io'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '9',
    icon: '🔧',
    title: 'Flask',
    description: 'Desenvolver aplicações web com Flask para maior controle',
    status: 'not-started',
    category: 'Desenvolvimento Back-End Profissional',
    subtopics: [
      { id: 's9-1', title: 'Rotas e blueprints', isCompleted: false },
      { id: 's9-2', title: 'Flask extensions', isCompleted: false },
      { id: 's9-3', title: 'Templates com Jinja2', isCompleted: false },
      { id: 's9-4', title: 'RESTful APIs com Flask', isCompleted: false }
    ],
    resources: ['Flask docs', 'Flask Web Development book'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '10',
    icon: '🧩',
    title: 'Arquitetura de Software',
    description: 'Dominar padrões arquiteturais como Clean Architecture e DDD',
    status: 'not-started',
    category: 'Desenvolvimento Back-End Profissional',
    subtopics: [
      { id: 's10-1', title: 'Clean Architecture', isCompleted: false },
      { id: 's10-2', title: 'Domain-Driven Design', isCompleted: false },
      { id: 's10-3', title: 'Hexagonal Architecture', isCompleted: false },
      { id: 's10-4', title: 'SOLID e princípios de design', isCompleted: false }
    ],
    resources: ['Clean Architecture book', 'Domain-Driven Design book'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '11',
    icon: '📊',
    title: 'PostgreSQL Avançado',
    description: 'Dominar PostgreSQL: índices, transações, CTEs, views e procedures',
    status: 'not-started',
    category: 'Desenvolvimento Back-End Profissional',
    subtopics: [
      { id: 's11-1', title: 'Índices e otimização', isCompleted: false },
      { id: 's11-2', title: 'Transações e locks', isCompleted: false },
      { id: 's11-3', title: 'Common Table Expressions', isCompleted: false },
      { id: 's11-4', title: 'Stored procedures e triggers', isCompleted: false }
    ],
    resources: ['PostgreSQL docs', 'SQL Performance Explained book'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '12',
    icon: '🔁',
    title: 'ORM com SQLAlchemy',
    description: 'Dominar SQLAlchemy para mapeamento objeto-relacional',
    status: 'not-started',
    category: 'Desenvolvimento Back-End Profissional',
    subtopics: [
      { id: 's12-1', title: 'Models e relacionamentos', isCompleted: false },
      { id: 's12-2', title: 'Queries complexas', isCompleted: false },
      { id: 's12-3', title: 'Sessions e transações', isCompleted: false },
      { id: 's12-4', title: 'SQLAlchemy com async', isCompleted: false }
    ],
    resources: ['SQLAlchemy docs', 'Essential SQLAlchemy book'],
    lastUpdated: new Date().toISOString()
  },

  {
    id: '13',
    icon: '🐳',
    title: 'Docker',
    description: 'Dominar Docker para containerização de aplicações',
    status: 'not-started',
    category: 'Infraestrutura e DevOps',
    subtopics: [
      { id: 's13-1', title: 'Dockerfiles multistage', isCompleted: false },
      { id: 's13-2', title: 'Docker Compose', isCompleted: false },
      { id: 's13-3', title: 'Networks e volumes', isCompleted: false },
      { id: 's13-4', title: 'Healthchecks e boas práticas', isCompleted: false }
    ],
    resources: ['Docker docs', 'Docker Deep Dive book'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '14',
    icon: '☸️',
    title: 'Kubernetes',
    description: 'Aprender orquestração de containers com Kubernetes',
    status: 'not-started',
    category: 'Infraestrutura e DevOps',
    subtopics: [
      { id: 's14-1', title: 'Pods e deployments', isCompleted: false },
      { id: 's14-2', title: 'Services e ingress', isCompleted: false },
      { id: 's14-3', title: 'ConfigMaps e secrets', isCompleted: false },
      { id: 's14-4', title: 'Helm charts', isCompleted: false }
    ],
    resources: ['Kubernetes docs', 'Kubernetes in Action book'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '15',
    icon: '🔧',
    title: 'CI/CD Profissional',
    description: 'Dominar pipelines de CI/CD para automação de deploys',
    status: 'not-started',
    category: 'Infraestrutura e DevOps',
    subtopics: [
      { id: 's15-1', title: 'GitHub Actions', isCompleted: false },
      { id: 's15-2', title: 'GitLab CI', isCompleted: false },
      { id: 's15-3', title: 'Estratégias de deploy', isCompleted: false },
      { id: 's15-4', title: 'Automação de testes de segurança', isCompleted: false }
    ],
    resources: ['GitHub Actions docs', 'GitLab CI docs'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '16',
    icon: '☁️',
    title: 'AWS',
    description: 'Dominar AWS para deploy de aplicações em produção',
    status: 'not-started',
    category: 'Infraestrutura e DevOps',
    subtopics: [
      { id: 's16-1', title: 'EC2, S3, RDS', isCompleted: false },
      { id: 's16-2', title: 'VPC e segurança', isCompleted: false },
      { id: 's16-3', title: 'CloudWatch e monitoramento', isCompleted: false },
      { id: 's16-4', title: 'IAM e permissões', isCompleted: false }
    ],
    resources: ['AWS docs', 'AWS Certified Developer guide'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '17',
    icon: '⚡',
    title: 'Serverless',
    description: 'Dominar arquitetura serverless com Lambda e API Gateway',
    status: 'not-started',
    category: 'Infraestrutura e DevOps',
    subtopics: [
      { id: 's17-1', title: 'AWS Lambda', isCompleted: false },
      { id: 's17-2', title: 'API Gateway', isCompleted: false },
      { id: 's17-3', title: 'DynamoDB para serverless', isCompleted: false },
      { id: 's17-4', title: 'Serverless Framework', isCompleted: false }
    ],
    resources: ['AWS Lambda docs', 'Serverless Framework docs'],
    lastUpdated: new Date().toISOString()
  },

  {
    id: '18',
    icon: '🔍',
    title: 'Prometheus e Grafana',
    description: 'Dominar monitoramento com Prometheus e Grafana',
    status: 'not-started',
    category: 'Observabilidade e Segurança',
    subtopics: [
      { id: 's18-1', title: 'Configuração do Prometheus', isCompleted: false },
      { id: 's18-2', title: 'Métricas e alertas', isCompleted: false },
      { id: 's18-3', title: 'Dashboards no Grafana', isCompleted: false },
      { id: 's18-4', title: 'Exporters e instrumentação', isCompleted: false }
    ],
    resources: ['Prometheus docs', 'Grafana docs'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '19',
    icon: '📜',
    title: 'ELK Stack',
    description: 'Dominar coleta e análise de logs com ELK Stack',
    status: 'not-started',
    category: 'Observabilidade e Segurança',
    subtopics: [
      { id: 's19-1', title: 'Elasticsearch', isCompleted: false },
      { id: 's19-2', title: 'Logstash', isCompleted: false },
      { id: 's19-3', title: 'Kibana', isCompleted: false },
      { id: 's19-4', title: 'Filebeat e Metricbeat', isCompleted: false }
    ],
    resources: ['Elastic docs', 'Logging and Monitoring book'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '20',
    icon: '🛡️',
    title: 'Segurança em APIs',
    description: 'Dominar segurança em APIs: autenticação e autorização',
    status: 'not-started',
    category: 'Observabilidade e Segurança',
    subtopics: [
      { id: 's20-1', title: 'JWT e OAuth2', isCompleted: false },
      { id: 's20-2', title: 'TLS e HTTPS', isCompleted: false },
      { id: 's20-3', title: 'Headers de segurança', isCompleted: false },
      { id: 's20-4', title: 'Autenticação em APIs', isCompleted: false }
    ],
    resources: ['OWASP API Security', 'Web API Security book'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '21',
    icon: '🔥',
    title: 'Proteções e prevenções',
    description: 'Dominar proteções contra ataques comuns em aplicações web',
    status: 'not-started',
    category: 'Observabilidade e Segurança',
    subtopics: [
      { id: 's21-1', title: 'Rate limiting', isCompleted: false },
      { id: 's21-2', title: 'CSRF e XSS', isCompleted: false },
      { id: 's21-3', title: 'CORS e política de origem', isCompleted: false },
      { id: 's21-4', title: 'SQL Injection', isCompleted: false }
    ],
    resources: ['OWASP Top 10', 'Web Application Security book'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '22',
    icon: '🧰',
    title: 'OpenTelemetry',
    description: 'Dominar tracing e logs distribuídos com OpenTelemetry',
    status: 'not-started',
    category: 'Observabilidade e Segurança',
    subtopics: [
      { id: 's22-1', title: 'Instrumentação automática', isCompleted: false },
      { id: 's22-2', title: 'Instrumentação manual', isCompleted: false },
      { id: 's22-3', title: 'Spans e traces', isCompleted: false },
      { id: 's22-4', title: 'Exporters', isCompleted: false }
    ],
    resources: ['OpenTelemetry docs', 'Distributed tracing guide'],
    lastUpdated: new Date().toISOString()
  },

  {
    id: '23',
    icon: '📈',
    title: 'Base de ML',
    description: 'Dominar as bibliotecas fundamentais de ML: Pandas, NumPy, Scikit-learn',
    status: 'completed',
    category: 'MLOps e Machine Learning',
    subtopics: [
      { id: 's23-1', title: 'Pandas para manipulação de dados', isCompleted: true },
      { id: 's23-2', title: 'NumPy para operações numéricas', isCompleted: true },
      { id: 's23-3', title: 'Scikit-learn para modelos', isCompleted: true },
      { id: 's23-4', title: 'Visualização com Matplotlib/Seaborn', isCompleted: true }
    ],
    resources: ['Python Data Science Handbook', 'Hands-On ML with Scikit-Learn'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '24',
    icon: '🧪',
    title: 'Pré-processamento de dados',
    description: 'Dominar técnicas de pré-processamento e feature engineering',
    status: 'in-progress',
    category: 'MLOps e Machine Learning',
    subtopics: [
      { id: 's24-1', title: 'Limpeza e tratamento de dados', isCompleted: true },
      { id: 's24-2', title: 'Feature engineering', isCompleted: true },
      { id: 's24-3', title: 'Normalização e encoding', isCompleted: false },
      { id: 's24-4', title: 'Validação cruzada', isCompleted: false }
    ],
    resources: ['Feature Engineering for ML book', 'Kaggle kernels'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '25',
    icon: '🧬',
    title: 'Deploy de modelos',
    description: 'Dominar técnicas de deploy de modelos de ML em produção',
    status: 'not-started',
    category: 'MLOps e Machine Learning',
    subtopics: [
      { id: 's25-1', title: 'FastAPI para serving', isCompleted: false },
      { id: 's25-2', title: 'MLflow para gestão', isCompleted: false },
      { id: 's25-3', title: 'BentoML para produção', isCompleted: false },
      { id: 's25-4', title: 'Monitoramento de modelos', isCompleted: false }
    ],
    resources: ['MLflow docs', 'BentoML docs'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '26',
    icon: '🔁',
    title: 'Pipeline de ML',
    description: 'Dominar pipelines de ML automatizados com Airflow ou Dagster',
    status: 'not-started',
    category: 'MLOps e Machine Learning',
    subtopics: [
      { id: 's26-1', title: 'Apache Airflow para orquestração', isCompleted: false },
      { id: 's26-2', title: 'Dagster para pipelines', isCompleted: false },
      { id: 's26-3', title: 'Scheduling de retraining', isCompleted: false },
      { id: 's26-4', title: 'Testes em pipelines de ML', isCompleted: false }
    ],
    resources: ['Airflow docs', 'Dagster docs'],
    lastUpdated: new Date().toISOString()
  },

  {
    id: '27',
    icon: '🧠',
    title: 'Inglês técnico',
    description: 'Desenvolver inglês técnico fluente para leitura e comunicação',
    status: 'in-progress',
    category: 'Diferenciais de Mercado',
    subtopics: [
      { id: 's27-1', title: 'Leitura de documentações', isCompleted: true },
      { id: 's27-2', title: 'Escrita técnica em inglês', isCompleted: true },
      { id: 's27-3', title: 'Comunicação em reuniões técnicas', isCompleted: false },
      { id: 's27-4', title: 'Entrevistas técnicas em inglês', isCompleted: false }
    ],
    resources: ['Technical Writing books', 'Exercism.io'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '28',
    icon: '🌍',
    title: 'Open Source',
    description: 'Contribuir para projetos open source e ter presença no GitHub',
    status: 'not-started',
    category: 'Diferenciais de Mercado',
    subtopics: [
      { id: 's28-1', title: 'Pull requests em projetos', isCompleted: false },
      { id: 's28-2', title: 'Criação de projetos próprios', isCompleted: false },
      { id: 's28-3', title: 'Documentação de qualidade', isCompleted: false },
      { id: 's28-4', title: 'Participação em comunidades', isCompleted: false }
    ],
    resources: ['GitHub guides', 'Open Source Guide'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '29',
    icon: '🛠️',
    title: 'Soluções arquiteturais',
    description: 'Documentar soluções arquiteturais e design de sistemas',
    status: 'not-started',
    category: 'Diferenciais de Mercado',
    subtopics: [
      { id: 's29-1', title: 'Diagramas de arquitetura', isCompleted: false },
      { id: 's29-2', title: 'Documentação técnica', isCompleted: false },
      { id: 's29-3', title: 'ADRs (Architecture Decision Records)', isCompleted: false },
      { id: 's29-4', title: 'Documentação visual', isCompleted: false }
    ],
    resources: ['C4 Model', 'Arc42 template'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '30',
    title: 'Soft Skills técnicas',
    icon: '💬',
    description: 'Desenvolver habilidades de comunicação técnica e documentação',
    status: 'not-started',
    category: 'Diferenciais de Mercado',
    subtopics: [
      { id: 's30-1', title: 'Apresentações técnicas', isCompleted: false },
      { id: 's30-2', title: 'Artigos técnicos', isCompleted: false },
      { id: 's30-3', title: 'Mentoria e ensino', isCompleted: false },
      { id: 's30-4', title: 'Comunicação multidisciplinar', isCompleted: false }
    ],
    resources: ['Technical Presentation books', 'Medium', 'dev.to'],
    lastUpdated: new Date().toISOString()
  }
];

const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const saved = localStorage.getItem(key);
  if (saved === null) return defaultValue;
  return JSON.parse(saved) as T;
};

const saveToLocalStorage = <T,>(key: string, value: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

interface RoadmapProviderProps {
  children: ReactNode;
}

export const RoadmapProvider = ({ children }: RoadmapProviderProps) => {
  const [stacks, setStacks] = useState<Stack[]>(() => 
    loadFromLocalStorage('roadmapStacks', initialStacks)
  );
  
  const [categories, setCategories] = useState<Category[]>(() => 
    loadFromLocalStorage('roadmapCategories', defaultCategories)
  );
  
  const [viewMode, setViewMode] = useState<RoadmapViewMode>(() => 
    loadFromLocalStorage('roadmapViewMode', 'line')
  );
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => 
    loadFromLocalStorage('darkMode', true)
  );

  const totalProgress = stacks.length > 0
    ? Math.round((stacks.filter(s => s.status === 'completed').length / stacks.length) * 100)
    : 0;

  useEffect(() => {
    saveToLocalStorage('roadmapStacks', stacks);
    saveToLocalStorage('roadmapCategories', categories);
    saveToLocalStorage('roadmapViewMode', viewMode);
    saveToLocalStorage('darkMode', isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [stacks, categories, viewMode, isDarkMode]);

  const addStack = (stackData: Omit<Stack, 'id' | 'lastUpdated'>) => {
    const newStack: Stack = {
      ...stackData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    };
    setStacks([...stacks, newStack]);
    toast({
      title: "Stack Added",
      description: `${stackData.title} has been added to your roadmap.`,
    });
  };

  const updateStack = (updatedStack: Stack) => {
    setStacks(stacks.map(stack => 
      stack.id === updatedStack.id 
        ? { ...updatedStack, lastUpdated: new Date().toISOString() } 
        : stack
    ));
    toast({
      title: "Stack Updated",
      description: `${updatedStack.title} has been updated.`,
    });
  };

  const deleteStack = (id: string) => {
    const stackToDelete = stacks.find(stack => stack.id === id);
    setStacks(stacks.filter(stack => stack.id !== id));
    if (stackToDelete) {
      toast({
        title: "Stack Deleted",
        description: `${stackToDelete.title} has been removed from your roadmap.`,
        variant: "destructive",
      });
    }
  };

  const moveStack = (id: string, direction: 'up' | 'down') => {
    const index = stacks.findIndex(stack => stack.id === id);
    if (index === -1) return;

    const newStacks = [...stacks];
    if (direction === 'up' && index > 0) {
      [newStacks[index], newStacks[index - 1]] = [newStacks[index - 1], newStacks[index]];
      setStacks(newStacks);
    } else if (direction === 'down' && index < stacks.length - 1) {
      [newStacks[index], newStacks[index + 1]] = [newStacks[index + 1], newStacks[index]];
      setStacks(newStacks);
    }
  };

  const toggleStackStatus = (id: string) => {
    setStacks(stacks.map(stack => {
      if (stack.id !== id) return stack;

      let newStatus: StackStatus;
      switch (stack.status) {
        case 'not-started':
          newStatus = 'in-progress';
          break;
        case 'in-progress':
          newStatus = 'completed';
          break;
        case 'completed':
          newStatus = 'not-started';
          break;
        default:
          newStatus = 'not-started';
      }

      return { ...stack, status: newStatus, lastUpdated: new Date().toISOString() };
    }));
  };

  const toggleSubtopicStatus = (stackId: string, subtopicId: string) => {
    setStacks(stacks.map(stack => {
      if (stack.id !== stackId) return stack;

      const updatedSubtopics = stack.subtopics.map(subtopic => {
        if (subtopic.id !== subtopicId) return subtopic;
        return { ...subtopic, isCompleted: !subtopic.isCompleted };
      });

      const allCompleted = updatedSubtopics.every(subtopic => subtopic.isCompleted);
      const someCompleted = updatedSubtopics.some(subtopic => subtopic.isCompleted);
      
      let newStatus = stack.status;
      if (allCompleted) {
        newStatus = 'completed';
      } else if (someCompleted) {
        newStatus = 'in-progress';
      }

      return { 
        ...stack, 
        subtopics: updatedSubtopics,
        status: newStatus,
        lastUpdated: new Date().toISOString()
      };
    }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const filterStacks = (query: string, status?: StackStatus | 'all', category?: string): Stack[] => {
    return stacks.filter(stack => {
      const matchesQuery = query === '' || 
        stack.title.toLowerCase().includes(query.toLowerCase()) ||
        stack.description.toLowerCase().includes(query.toLowerCase());
        
      const matchesStatus = !status || status === 'all' || stack.status === status;
      const matchesCategory = !category || category === 'all' || stack.category === category;

      return matchesQuery && matchesStatus && matchesCategory;
    });
  };

  const value = {
    stacks,
    categories,
    viewMode,
    isDarkMode,
    totalProgress,
    addStack,
    updateStack,
    deleteStack,
    moveStack,
    toggleStackStatus,
    toggleSubtopicStatus,
    setViewMode,
    toggleDarkMode,
    filterStacks,
  };

  return (
    <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>
  );
};
