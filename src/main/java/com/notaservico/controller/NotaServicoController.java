package com.notaservico.controller;

import com.notaservico.dto.NotaServicoDTO;
import com.notaservico.service.PdfGeracaoService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * Controller REST que expõe o endpoint de geração de PDF.
 * Mantém responsabilidade única: receber request, delegar ao service, retornar response.
 */
@RestController
@RequestMapping("/api/nota-servico")
@CrossOrigin(origins = "http://localhost:5173") // Vite dev server
public class NotaServicoController {

    private static final Logger log = LoggerFactory.getLogger(NotaServicoController.class);

    private final PdfGeracaoService pdfGeracaoService;

    public NotaServicoController(PdfGeracaoService pdfGeracaoService) {
        this.pdfGeracaoService = pdfGeracaoService;
    }

    /**
     * POST /api/nota-servico/gerar
     * Recebe o DTO validado e retorna o PDF como download.
     */
    @PostMapping("/gerar")
    public ResponseEntity<byte[]> gerarNotaServico(
            @Valid @RequestBody NotaServicoDTO dto) {

        log.info("Gerando nota de serviço nº {} para: {}", dto.getNumeroNota(), dto.getNomeEmpresa());

        try {
            byte[] pdfBytes = pdfGeracaoService.gerarPdf(dto);

            String nomeArquivo = String.format("nota-servico-%s.pdf",
                    String.format("%03d", parseNumero(dto.getNumeroNota())));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", nomeArquivo);
            headers.setContentLength(pdfBytes.length);

            log.info("PDF gerado com sucesso: {} bytes", pdfBytes.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (IOException e) {
            log.error("Erro ao gerar PDF da nota de serviço", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/nota-servico/ping
     * Health check simples para verificar se o backend está rodando.
     */
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Nota de Serviço API v1.0 - OK");
    }

    private int parseNumero(String numeroNota) {
        try { return Integer.parseInt(numeroNota); }
        catch (Exception e) { return 1; }
    }
}
