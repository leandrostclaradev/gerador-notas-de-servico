package com.notaservico.service;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.*;
import com.notaservico.dto.NotaServicoDTO;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

/**
 * Service responsável por gerar o PDF da Nota de Serviço.
 * Toda a lógica de layout fica aqui, mantendo o Controller limpo.
 */
@Service
public class PdfGeracaoService {

    // ── Paleta de cores fiel ao modelo ─────────────────────────
    private static final DeviceRgb COR_OURO        = new DeviceRgb(184, 150, 62);
    private static final DeviceRgb COR_NAVY        = new DeviceRgb(26,  35,  64);
    private static final DeviceRgb COR_FUNDO_PAG   = new DeviceRgb(245, 240, 235);
    private static final DeviceRgb COR_FUNDO_CAIXA = new DeviceRgb(217, 208, 196);
    private static final DeviceRgb COR_BORDA       = new DeviceRgb(200, 191, 176);
    private static final DeviceRgb COR_TEXTO       = new DeviceRgb(50,  50,  50);
    private static final DeviceRgb COR_BRANCO      = new DeviceRgb(255, 255, 255);

    /**
     * Ponto de entrada: recebe o DTO e devolve os bytes do PDF gerado.
     */
    public byte[] gerarPdf(NotaServicoDTO dto) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PdfWriter  writer  = new PdfWriter(baos);
            PdfDocument pdf    = new PdfDocument(writer);
            Document   doc     = new Document(pdf, PageSize.A4);

            // Margens da página
            doc.setMargins(20, 20, 20, 20);

            PdfFont fontSerif  = PdfFontFactory.createFont(StandardFonts.TIMES_ROMAN);
            PdfFont fontBold   = PdfFontFactory.createFont(StandardFonts.TIMES_BOLD);
            PdfFont fontItalic = PdfFontFactory.createFont(StandardFonts.TIMES_ITALIC);
            PdfFont fontHelv   = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont fontHelvB  = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            // Fundo bege da página inteira via canvas
            PdfCanvas canvas = new PdfCanvas(pdf.addNewPage());
            canvas.setFillColor(COR_FUNDO_PAG)
                  .rectangle(0, 0, PageSize.A4.getWidth(), PageSize.A4.getHeight())
                  .fill();
            // Área branca central
            canvas.setFillColor(COR_BRANCO)
                  .rectangle(15, 15, PageSize.A4.getWidth() - 30, PageSize.A4.getHeight() - 30)
                  .fill()
                  .release();

            // ── Cabeçalho ──────────────────────────────────────
            adicionarCabecalho(doc, dto, fontBold, fontItalic, fontHelv);

            // ── Bloco Prestadora + Cliente ──────────────────────
            adicionarBlocoPrestadoraCliente(doc, dto, fontHelvB, fontHelv);

            // ── Detalhamento do Serviço ─────────────────────────
            adicionarDetalhamento(doc, dto, fontHelvB, fontHelv, fontBold);

            // ── Resumo Financeiro ───────────────────────────────
            adicionarResumoFinanceiro(doc, dto, fontHelvB, fontHelv, fontBold);

            // ── Observações ─────────────────────────────────────
            adicionarObservacoes(doc, dto, fontHelvB, fontHelv, fontBold);

            // ── Rodapé / Assinatura ─────────────────────────────
            adicionarRodape(doc, dto, fontHelvB, fontHelv);

            doc.close();
            return baos.toByteArray();
        }
    }

    // ────────────────────────────────────────────────────────────
    // SEÇÕES PRIVADAS
    // ────────────────────────────────────────────────────────────

    private void adicionarCabecalho(Document doc, NotaServicoDTO dto,
                                     PdfFont fontBold, PdfFont fontItalic, PdfFont fontHelv) {

        // Linha: SEU LOGO (esq) | Nota Nº (dir)
        Table headerTop = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .useAllAvailableWidth();

        Paragraph logo = new Paragraph("AMANDA GOMES WANDERLEY")
                .setFont(fontBold).setFontSize(12).setFontColor(COR_OURO)
                .setTextAlignment(TextAlignment.LEFT);

        String numeroFormatado = "Nota de Serviço Nº " +
                String.format("%03d", parseNumero(dto.getNumeroNota()));

        Paragraph numero = new Paragraph(numeroFormatado)
                .setFont(fontHelv).setFontSize(8).setFontColor(COR_NAVY)
                .setTextAlignment(TextAlignment.RIGHT);

        headerTop.addCell(celulaSemBorda(logo));
        headerTop.addCell(celulaSemBorda(numero));
        doc.add(headerTop);

        // Linha dourada
        doc.add(linhaHorizontal(COR_OURO, 1f));

        // Título
        doc.add(new Paragraph("NOTA DE SERVIÇO")
                .setFont(fontBold).setFontSize(24).setFontColor(COR_NAVY)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(4).setMarginBottom(2));

        // Subtítulo itálico com tracinhos decorativos
        Paragraph subtitulo = new Paragraph()
                .add(new Text("─────  ").setFontColor(COR_OURO))
                .add(new Text("Social Media & Gestão de Redes Sociais")
                        .setFont(fontItalic)
                        .setFontSize(10).setFontColor(COR_NAVY))
                .add(new Text("  ─────").setFontColor(COR_OURO))
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(6);
        doc.add(subtitulo);

        doc.add(linhaHorizontal(COR_BORDA, 0.5f));
    }

    private void adicionarBlocoPrestadoraCliente(Document doc, NotaServicoDTO dto,
                                                  PdfFont fontBold, PdfFont fontHelv) {
        // Dois blocos lado a lado
        Table tabela = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .useAllAvailableWidth().setMarginTop(4);

        // Cabeçalho esquerdo
        Cell hdrEsq = cabecalhoSecao("Prestadora de Serviço:", fontBold);
        Cell hdrDir = cabecalhoSecao("Cliente / Empresa:", fontBold);

        tabela.addCell(hdrEsq);
        tabela.addCell(hdrDir);

        // Campos esquerda
        Cell camposEsq = new Cell().setBorder(Border.NO_BORDER)
                .setPaddingLeft(4).setPaddingRight(4).setPaddingBottom(6);
        camposEsq.add(campoTexto("Nome:", dto.getNomePrestadora(), fontBold, fontHelv));
        camposEsq.add(campoTexto("CPF/CNPJ:", dto.getCpfCnpjPrestadora(), fontBold, fontHelv));
        camposEsq.add(campoTexto("Telefone:", dto.getTelefonePrestadora(), fontBold, fontHelv));
        camposEsq.add(campoTexto("E-mail:", dto.getEmailPrestadora(), fontBold, fontHelv));

        // Campos direita
        Cell camposDir = new Cell().setBorder(Border.NO_BORDER)
                .setPaddingLeft(4).setPaddingRight(4).setPaddingBottom(6);
        camposDir.add(campoTexto("Nome da Empresa:", dto.getNomeEmpresa(), fontBold, fontHelv));
        camposDir.add(campoTexto("CNPJ:", dto.getCnpjCliente(), fontBold, fontHelv));
        camposDir.add(campoTexto("Responsável:", dto.getResponsavelCliente(), fontBold, fontHelv));

        tabela.addCell(camposEsq);
        tabela.addCell(camposDir);

        doc.add(tabela);
        doc.add(linhaHorizontal(COR_BORDA, 0.5f));
    }

    private void adicionarDetalhamento(Document doc, NotaServicoDTO dto,
                                        PdfFont fontHelvB, PdfFont fontHelv, PdfFont fontBold) {
        // Título da seção
        doc.add(tituloSecao("Detalhamento do Serviço", fontBold));

        // Tabela de serviços
        Table tabServico = new Table(UnitValue.createPercentArray(new float[]{3, 3}))
                .useAllAvailableWidth().setMarginBottom(6);

        // Header da tabela
        tabServico.addHeaderCell(celulaTabela("Descrição do Serviço", fontHelvB, true));
        tabServico.addHeaderCell(celulaTabela("Período", fontHelvB, true, TextAlignment.CENTER));
//        tabServico.addHeaderCell(celulaTabela("Valor", fontHelvB, true));

        // Linha de dados
        String periodo = formatarPeriodo(dto.getPeriodoInicio(), dto.getPeriodoFim());
//        String valor   = dto.getValor() != null && !dto.getValor().isBlank()
//                ? "R$ " + dto.getValor()
//                : "R$ ___________";

        tabServico.addCell(celulaTabela("Gestão de redes sociais (Social Media)", fontHelv, false));
        tabServico.addCell(celulaTabela(periodo, fontHelv, false, TextAlignment.CENTER));
//        tabServico.addCell(celulaTabela(valor, fontHelv, false));

        doc.add(tabServico);

        // Bullets dos serviços incluídos
        List<String> servicos = List.of(
                "Planejamento de conteúdo para redes sociais",
                "Criação de artes e posts",
                "Publicação e gerenciamento de postagens",
                "Monitoramento de comentários e mensagens",
                "Estratégia de crescimento e engajamento"
        );

        for (String item : servicos) {
            Paragraph bullet = new Paragraph()
                    .add(new Text("• ").setFontColor(COR_OURO).setFontSize(12))
                    .add(new Text(item).setFont(fontHelv).setFontSize(9).setFontColor(COR_TEXTO))
                    .setMarginLeft(10).setMarginBottom(2);
            doc.add(bullet);
        }

        doc.add(linhaHorizontal(COR_BORDA, 0.5f));
    }

    private void adicionarResumoFinanceiro(Document doc, NotaServicoDTO dto,
                                            PdfFont fontHelvB, PdfFont fontHelv, PdfFont fontBold) {
        doc.add(tituloSecao("Resumo Financeiro", fontBold));

        // Valor total
        String vt = dto.getValorTotal() != null && !dto.getValorTotal().isBlank()
                ? "R$ " + dto.getValorTotal()
                : "R$ ___________";
        doc.add(new Paragraph()
                .add(new Text("Valor total do serviço:  ").setFont(fontHelvB).setFontSize(9).setFontColor(COR_NAVY))
                .add(new Text(vt).setFont(fontHelv).setFontSize(9).setFontColor(COR_TEXTO))
                .setMarginBottom(4));

        doc.add(linhaHorizontal(COR_BORDA, 0.3f));

        doc.add(new Paragraph("Forma de pagamento:")
                .setFont(fontHelvB).setFontSize(9).setFontColor(COR_NAVY)
                .setMarginTop(4).setMarginBottom(4));

        // Checkboxes
        Paragraph checks = new Paragraph()
                .add(checkbox(dto.isPagamentoPix()) + "  PIX          ")
                .add(checkbox(dto.isPagamentoTransferencia()) + "  Transferência          ")
                .add(checkbox(dto.isPagamentoOutro()) + "  Outro: " +
                        nvl(dto.getOutroDescricao(), "_______________"))
                .setFont(fontHelv).setFontSize(9).setFontColor(COR_TEXTO)
                .setMarginBottom(6);
        doc.add(checks);

        // Chave PIX + Vencimento
        Table finTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .useAllAvailableWidth().setMarginBottom(4);
        finTable.addCell(celulaSemBorda(
                campoTexto("Chave PIX:", dto.getChavePix(), fontHelvB, fontHelv)));
        finTable.addCell(celulaSemBorda(
                campoTexto("Data de vencimento:", dto.getDataVencimento(), fontHelvB, fontHelv)));
        doc.add(finTable);

        doc.add(linhaHorizontal(COR_BORDA, 0.5f));
    }

    private void adicionarObservacoes(Document doc, NotaServicoDTO dto,
                                       PdfFont fontHelvB, PdfFont fontHelv, PdfFont fontBold) {
        doc.add(tituloSecao("Observações", fontBold));

        String obs = dto.getObservacoes() != null && !dto.getObservacoes().isBlank()
                ? dto.getObservacoes()
                : " ";

        doc.add(new Paragraph(obs)
                .setFont(fontHelv).setFontSize(9).setFontColor(COR_TEXTO)
                .setMinHeight(36)
                .setBorderBottom(new SolidBorder(COR_BORDA, 0.5f))
                .setMarginBottom(4));

        doc.add(linhaHorizontal(COR_BORDA, 0.5f));
    }

    private void adicionarRodape(Document doc, NotaServicoDTO dto,
                                  PdfFont fontHelvB, PdfFont fontHelv) {
        Table rodape = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .useAllAvailableWidth().setMarginTop(6);

        // Local e Data
        Cell localCell = new Cell().setBorder(Border.NO_BORDER);
        localCell.add(campoTexto("Local e Data:", dto.getLocalData(), fontHelvB, fontHelv));

        // Assinatura
        Cell assCell = new Cell().setBorder(Border.NO_BORDER);
        assCell.add(new Paragraph("Assinatura da Prestadora:")
                .setFont(fontHelvB).setFontSize(9).setFontColor(COR_NAVY)
                .setMarginBottom(20));
        assCell.add(new Paragraph(" ")
                .setBorderBottom(new SolidBorder(COR_NAVY, 0.8f))
                .setWidth(UnitValue.createPercentValue(80)));

        rodape.addCell(localCell);
        rodape.addCell(assCell);

        doc.add(rodape);
    }

    // ────────────────────────────────────────────────────────────
    // HELPERS DE LAYOUT
    // ────────────────────────────────────────────────────────────

    /** Linha horizontal colorida como separador. */
    private IBlockElement linhaHorizontal(DeviceRgb cor, float espessura) {
        return new Paragraph(" ")
                .setMarginTop(2).setMarginBottom(2)
                .setBorderBottom(new SolidBorder(cor, espessura));
    }

    /** Título de seção com fundo bege. */
    private Paragraph tituloSecao(String texto, PdfFont font) {
        return new Paragraph(texto)
                .setFont(font).setFontSize(10).setFontColor(COR_NAVY)
                .setBackgroundColor(COR_FUNDO_CAIXA)
                .setPadding(4).setMarginTop(6).setMarginBottom(4);
    }

    /** Célula de cabeçalho de seção (duas colunas). */
    private Cell cabecalhoSecao(String texto, PdfFont font) {
        return new Cell()
                .add(new Paragraph(texto)
                        .setFont(font).setFontSize(9).setFontColor(COR_NAVY))
                .setBackgroundColor(COR_FUNDO_CAIXA)
                .setBorder(Border.NO_BORDER)
                .setPadding(5);
    }

    /** Parágrafo com label em negrito e valor sublinhado. */
    private Paragraph campoTexto(String label, String valor, PdfFont fontB, PdfFont font) {
        String val = nvl(valor, "").isBlank() ? "  " : valor;
        return new Paragraph()
                .add(new Text(label + " ").setFont(fontB).setFontSize(8.5f).setFontColor(COR_NAVY))
                .add(new Text(val).setFont(font).setFontSize(8.5f).setFontColor(COR_TEXTO))
                .setMarginBottom(5);
    }

    /** Célula de tabela com fundo de header ou sem. */
    private Cell celulaTabela(String texto, PdfFont font, boolean isHeader) {
        return celulaTabela(texto, font, isHeader, TextAlignment.LEFT);
    }

    private Cell celulaTabela(String texto, PdfFont font, boolean isHeader, TextAlignment alinhamento) {
        Cell cell = new Cell()
                .add(new Paragraph(texto)
                        .setFont(font)
                        .setFontSize(8.5f)
                        .setFontColor(COR_NAVY)
                        .setTextAlignment(alinhamento))
                .setPadding(5)
                .setTextAlignment(alinhamento)
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setBorder(new SolidBorder(COR_BORDA, 0.4f));
        if (isHeader) cell.setBackgroundColor(COR_FUNDO_CAIXA);
        return cell;
    }

    /** Célula transparente sem bordas. */
    private Cell celulaSemBorda(IBlockElement content) {
        return new Cell().add(content).setBorder(Border.NO_BORDER);
    }

    /** Símbolo de checkbox marcado ou vazio. */
    private String checkbox(boolean marcado) {
        return marcado ? "[X]" : "[ ]";
    }

    /** Null-safe: retorna fallback se valor for null ou blank. */
    private String nvl(String valor, String fallback) {
        return (valor == null || valor.isBlank()) ? fallback : valor;
    }

    /** Formata período início–fim. */
    private String formatarPeriodo(String inicio, String fim) {
        boolean temInicio = inicio != null && !inicio.isBlank();
        boolean temFim    = fim    != null && !fim.isBlank();
        if (temInicio && temFim) return inicio + "  a  " + fim;
        if (temInicio)           return inicio + "  a  ___/___/______";
        return "___/___/______  a  ___/___/______";
    }

    /** Parseia número da nota com fallback para 1. */
    private int parseNumero(String numeroNota) {
        try { return Integer.parseInt(numeroNota); }
        catch (Exception e) { return 1; }
    }
}
