
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ImageFile } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeBrand = async (
  url: string,
  images: ImageFile[]
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const domain = url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname : "assets-locais";
  
  const systemInstruction = `Você é uma IA Arquiteta Digital e Analista Técnica Sênior. Sua missão é realizar uma auditoria estrutural profunda e gerar um Blueprint Técnico Operacional.

MODO DE OPERAÇÃO OBRIGATÓRIO:
1. FASE 1 - ANÁLISE TÉCNICA (LOGS REAIS):
Gere logs técnicos granulares que reflitam o mapeamento REAL feito na URL (${url}) e imagens anexadas.
Os logs DEVEM ser específicos para o site analisado. Mencione seções reais, cabeçalhos, tecnologias detectadas e scripts de rastreamento.
Exemplo realista: "[SCAN] Script Check: Detectado integração com WhatsApp Business e rastreadores de conversão (Pixel/GTM) em ${domain}".
Não use logs genéricos. Seja técnico e preciso.
Formato: [INIT], [INPUT], [SCAN], [OK].

2. FASE 2 - BLUEPRINT FINAL (PROMPT TÉCNICO):
Gere um prompt final estruturado exatamente em 7 seções:
────────────────────────
1️⃣ CONTEXTO DO SITE
2️⃣ OBJETIVO OPERACIONAL
3️⃣ REGRAS RÍGIDAS DE EXECUÇÃO (Manter layout/identidade analisada)
4️⃣ ESTRUTURA COMPLETA DE SEÇÕES (Detalhamento funcional de cada área)
5️⃣ FUNCIONALIDADES REAIS DO SITE (Agendamento, Área do Usuário, Status)
6️⃣ EXPERIÊNCIA DO USUÁRIO (UX)
7️⃣ PADRÃO DE QUALIDADE EXIGIDO
────────────────────────

REGRAS CRÍTICAS:
- PROIBIDO sugerir redesign ou alterar paleta de cores/identidade.
- O blueprint deve ser fiel ao site analisado, injetando apenas inteligência operacional.
- Use linguagem técnica, profissional e sem marketing vazio.`;

  const prompt = `INICIAR AUDITORIA TÉCNICA COMPLETA PARA: ${domain}
ENTRADA: ${url || "Assets visuais/Prints"}
DETALHE: Analise a estrutura semântica e visual para reconstrução sistêmica.`;

  const imageParts = images.map(img => ({
    inlineData: {
      mimeType: img.file.type,
      data: img.base64
    }
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: prompt },
        ...imageParts
      ]
    },
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brandName: { type: Type.STRING },
          visualIdentity: { type: Type.STRING },
          colors: { type: Type.ARRAY, items: { type: Type.STRING } },
          targetAudience: { type: Type.STRING },
          positioning: { type: Type.STRING },
          suggestedStructure: { type: Type.ARRAY, items: { type: Type.STRING } },
          analysisLogs: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }, 
            description: "Logs técnicos reais e específicos para o domínio analisado." 
          },
          missingFeatures: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                feature: { type: Type.STRING },
                impact: { type: Type.STRING }
              },
              required: ["feature", "impact"]
            }
          },
          conversionBottlenecks: { type: Type.ARRAY, items: { type: Type.STRING } },
          analyzedHtmlPreview: { type: Type.STRING },
          finalPrompt: { type: Type.STRING }
        },
        required: ["brandName", "visualIdentity", "colors", "targetAudience", "positioning", "suggestedStructure", "analysisLogs", "missingFeatures", "conversionBottlenecks", "analyzedHtmlPreview", "finalPrompt"]
      }
    }
  });

  if (!response.text) throw new Error("A auditoria falhou.");
  return JSON.parse(response.text) as AnalysisResult;
};
