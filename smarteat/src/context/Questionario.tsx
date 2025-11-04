import React, { createContext, useContext, useState, useMemo } from "react";

// Define a estrutura de dados para as respostas do questionário
interface QuestionarioData {
  objetivo?: string;
  genero?: string;
  anoNascimento?: string;
  altura?: string;
  pesoAtual?: string;
  pesoAlvo?: string;
  resumoObjetivo?: string;
  nivelAtividade?: string;
  refeicoesPorDia?: string;
  listaPositiva?: string;
}

// Define o que o nosso contexto irá fornecer
interface QuestionarioContextValue {
  data: QuestionarioData;
  setData: (data: QuestionarioData) => void;
  updateData: (field: keyof QuestionarioData, value: string) => void;
}

const QuestionarioContext = createContext<QuestionarioContextValue | undefined>(
  undefined
);

export const QuestionarioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<QuestionarioData>({});

  // Função para atualizar um campo específico do formulário
  const updateData = (field: keyof QuestionarioData, value: string) => {
    setData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Memoiza o valor para evitar re-renderizações desnecessárias
  const value = useMemo(() => ({ data, setData, updateData }), [data]);

  return (
    <QuestionarioContext.Provider value={value}>
      {children}
    </QuestionarioContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export function useQuestionario() {
  const context = useContext(QuestionarioContext);
  if (!context) {
    throw new Error(
      "useQuestionario must be used within a QuestionarioProvider"
    );
  }
  return context;
}