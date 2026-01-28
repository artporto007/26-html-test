import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { JSDOM } from 'jsdom';

describe('Validação do arquivo HTML do aluno', () => {
  const respostasDir = join(process.cwd(), 'respostas');

  it('deve ter a pasta "respostas"', () => {
    expect(existsSync(respostasDir)).toBe(true);
  });

  it('deve conter apenas um arquivo HTML na pasta respostas', () => {
    const arquivos = readdirSync(respostasDir);
    const arquivosHtml = arquivos.filter(file => file.endsWith('.html'));

    expect(arquivosHtml.length).toBe(1);
  });

  it('deve validar a estrutura completa do HTML', () => {
    const arquivos = readdirSync(respostasDir);
    const arquivoHtml = arquivos.find(file => file.endsWith('.html'));

    expect(arquivoHtml).toBeDefined();

    const caminhoArquivo = join(respostasDir, arquivoHtml);
    const conteudo = readFileSync(caminhoArquivo, 'utf-8');

    // Valida estrutura básica HTML
    expect(conteudo).toMatch(/<!DOCTYPE html>/i);
    expect(conteudo).toMatch(/<html[\s>]/i);
    expect(conteudo).toMatch(/<head[\s>]/i);
    expect(conteudo).toMatch(/<\/head>/i);
    expect(conteudo).toMatch(/<body[\s>]/i);
    expect(conteudo).toMatch(/<\/body>/i);
    expect(conteudo).toMatch(/<\/html>/i);

    // Parse do HTML
    const dom = new JSDOM(conteudo);
    const document = dom.window.document;

    // Valida elementos no body
    const body = document.querySelector('body');
    expect(body).not.toBeNull();

    const h1Elements = body.querySelectorAll('h1');
    const pElements = body.querySelectorAll('p');

    // Deve ter exatamente 1 H1
    expect(h1Elements.length).toBeGreaterThanOrEqual(1);

    // Deve ter exatamente 1 P
    expect(pElements.length).toBeGreaterThanOrEqual(1);

    // Verifica se H1 e P são filhos diretos ou descendentes do body
    const bodyChildren = Array.from(body.children);
    const hasH1 = bodyChildren.some(child => child.tagName === 'H1') || body.querySelector('h1');
    const hasP = bodyChildren.some(child => child.tagName === 'P') || body.querySelector('p');

    expect(hasH1).toBe(true);
    expect(hasP).toBe(true);
  });

  it('deve ter um HTML válido e bem formatado', () => {
    const arquivos = readdirSync(respostasDir);
    const arquivoHtml = arquivos.find(file => file.endsWith('.html'));
    const caminhoArquivo = join(respostasDir, arquivoHtml);
    const conteudo = readFileSync(caminhoArquivo, 'utf-8');

    const dom = new JSDOM(conteudo);
    const document = dom.window.document;

    // Verifica se o parse foi bem-sucedido
    expect(document.documentElement.tagName).toBe('HTML');
    expect(document.head).not.toBeNull();
    expect(document.body).not.toBeNull();
  });
});