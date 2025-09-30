import type { RootStackParamList } from './AppNavigator';

// Interface para cada opção de resposta
interface StepOption {
  label: string; // O que o usuário vê (ex: "Perder Peso")
  value: string; // O valor que será salvo (ex: "perder_peso")
}

// Interface atualizada para cada etapa
export interface Step {
  name: keyof RootStackParamList;
  title: string;
  dataKey: string; // Chave para salvar a resposta
  nextScreen: keyof RootStackParamList; // Próxima tela
  inputType: 'select' | 'text'; // Tipo de entrada: seleção ou texto
  options?: StepOption[]; // Opções de resposta (opcional)
}

// Array atualizado com as etapas e suas opções
export const questionarioSteps: Step[] = [
  {
    name: 'QuestionarioObjetivo',
    title: 'Qual é o seu objetivo principal?',
    dataKey: 'objetivo',
    nextScreen: 'QuestionarioGenero',
    inputType: 'select',
    options: [
      { label: 'Perder Peso', value: 'perder_peso' },
      { label: 'Manter o Peso', value: 'manter_peso' },
      { label: 'Ganhar Massa Muscular', value: 'ganhar_massa' },
    ],
  },
  {
    name: 'QuestionarioGenero',
    title: 'Qual é o seu gênero?',
    dataKey: 'genero',
    nextScreen: 'QuestionarioNascimento',
    inputType: 'select',
    options: [
      { label: 'Masculino', value: 'masculino' },
      { label: 'Feminino', value: 'feminino' },
      { label: 'Prefiro não informar', value: 'nao_informar' },
    ],
  },
  {
    name: 'QuestionarioNascimento',
    title: 'Qual é o seu ano de nascimento?',
    dataKey: 'anoNascimento',
    nextScreen: 'QuestionarioAltura',
    inputType: 'text', // Esta pergunta usa entrada de texto
  },
  {
    name: 'QuestionarioAltura',
    title: 'Qual é a sua altura (cm)?',
    dataKey: 'altura',
    nextScreen: 'QuestionarioPesoAtual',
    inputType: 'text',
  },
  {
    name: 'QuestionarioPesoAtual',
    title: 'Qual é o seu peso atual (kg)?',
    dataKey: 'pesoAtual',
    nextScreen: 'QuestionarioPesoAlvo',
    inputType: 'text',
  },
  {
    name: 'QuestionarioPesoAlvo',
    title: 'Qual é o seu peso alvo (kg)?',
    dataKey: 'pesoAlvo',
    nextScreen: 'Cadastro',
    inputType: 'text',
  },
];