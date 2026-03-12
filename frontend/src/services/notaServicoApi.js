import { createElement } from 'react'

/**
 * Gera o PDF no navegador e força o download do arquivo retornado.
 * @param {Object} dadosNota - DTO com todos os campos do formulário
 * @param {string} nomeArquivo - nome sugerido para o download
 */
export async function gerarNotaServicoPdf(dadosNota, nomeArquivo) {
  const [{ pdf }, { NotaServicoPdfDocument }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('../pdf/NotaServicoPdf'),
  ])

  const blob = await pdf(
    createElement(NotaServicoPdfDocument, { dados: dadosNota })
  ).toBlob()

  // Cria link temporário e dispara o download
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = nomeArquivo || 'nota-servico.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
