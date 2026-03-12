package com.notaservico.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO que representa todos os dados necessários para gerar uma Nota de Serviço.
 * Utiliza Records seria uma opção moderna, mas Builder pattern facilita testes.
 */
public class NotaServicoDTO {

    // ── Identificação ──────────────────────────────────────────
    private String numeroNota;

    // ── Prestadora de Serviço ──────────────────────────────────
    @NotBlank(message = "Nome da prestadora é obrigatório")
    private String nomePrestadora;

    @NotBlank(message = "CPF/CNPJ da prestadora é obrigatório")
    private String cpfCnpjPrestadora;

    private String telefonePrestadora;
    private String emailPrestadora;

    // ── Cliente / Empresa ──────────────────────────────────────
    @NotBlank(message = "Nome da empresa cliente é obrigatório")
    private String nomeEmpresa;

    private String cnpjCliente;
    private String responsavelCliente;

    // ── Detalhamento do Serviço ────────────────────────────────
    private String periodoInicio;   // formato: dd/MM/yyyy
    private String periodoFim;      // formato: dd/MM/yyyy
    private String valor;           // ex: "1.500,00"

    // ── Resumo Financeiro ──────────────────────────────────────
    private String valorTotal;

    private boolean pagamentoPix;
    private boolean pagamentoTransferencia;
    private boolean pagamentoOutro;
    private String outroDescricao;

    private String chavePix;
    private String dataVencimento;  // formato: dd/MM/yyyy

    // ── Extras ────────────────────────────────────────────────
    private String observacoes;
    private String localData;       // ex: "Teresina, 12/03/2026"

    public NotaServicoDTO() {
    }

    public NotaServicoDTO(String numeroNota, String nomePrestadora, String cpfCnpjPrestadora,
                          String telefonePrestadora, String emailPrestadora, String nomeEmpresa,
                          String cnpjCliente, String responsavelCliente, String periodoInicio,
                          String periodoFim, String valor, String valorTotal, boolean pagamentoPix,
                          boolean pagamentoTransferencia, boolean pagamentoOutro,
                          String outroDescricao, String chavePix, String dataVencimento,
                          String observacoes, String localData) {
        this.numeroNota = numeroNota;
        this.nomePrestadora = nomePrestadora;
        this.cpfCnpjPrestadora = cpfCnpjPrestadora;
        this.telefonePrestadora = telefonePrestadora;
        this.emailPrestadora = emailPrestadora;
        this.nomeEmpresa = nomeEmpresa;
        this.cnpjCliente = cnpjCliente;
        this.responsavelCliente = responsavelCliente;
        this.periodoInicio = periodoInicio;
        this.periodoFim = periodoFim;
        this.valor = valor;
        this.valorTotal = valorTotal;
        this.pagamentoPix = pagamentoPix;
        this.pagamentoTransferencia = pagamentoTransferencia;
        this.pagamentoOutro = pagamentoOutro;
        this.outroDescricao = outroDescricao;
        this.chavePix = chavePix;
        this.dataVencimento = dataVencimento;
        this.observacoes = observacoes;
        this.localData = localData;
    }

    public String getNumeroNota() {
        return numeroNota;
    }

    public void setNumeroNota(String numeroNota) {
        this.numeroNota = numeroNota;
    }

    public String getNomePrestadora() {
        return nomePrestadora;
    }

    public void setNomePrestadora(String nomePrestadora) {
        this.nomePrestadora = nomePrestadora;
    }

    public String getCpfCnpjPrestadora() {
        return cpfCnpjPrestadora;
    }

    public void setCpfCnpjPrestadora(String cpfCnpjPrestadora) {
        this.cpfCnpjPrestadora = cpfCnpjPrestadora;
    }

    public String getTelefonePrestadora() {
        return telefonePrestadora;
    }

    public void setTelefonePrestadora(String telefonePrestadora) {
        this.telefonePrestadora = telefonePrestadora;
    }

    public String getEmailPrestadora() {
        return emailPrestadora;
    }

    public void setEmailPrestadora(String emailPrestadora) {
        this.emailPrestadora = emailPrestadora;
    }

    public String getNomeEmpresa() {
        return nomeEmpresa;
    }

    public void setNomeEmpresa(String nomeEmpresa) {
        this.nomeEmpresa = nomeEmpresa;
    }

    public String getCnpjCliente() {
        return cnpjCliente;
    }

    public void setCnpjCliente(String cnpjCliente) {
        this.cnpjCliente = cnpjCliente;
    }

    public String getResponsavelCliente() {
        return responsavelCliente;
    }

    public void setResponsavelCliente(String responsavelCliente) {
        this.responsavelCliente = responsavelCliente;
    }

    public String getPeriodoInicio() {
        return periodoInicio;
    }

    public void setPeriodoInicio(String periodoInicio) {
        this.periodoInicio = periodoInicio;
    }

    public String getPeriodoFim() {
        return periodoFim;
    }

    public void setPeriodoFim(String periodoFim) {
        this.periodoFim = periodoFim;
    }

    public String getValor() {
        return valor;
    }

    public void setValor(String valor) {
        this.valor = valor;
    }

    public String getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(String valorTotal) {
        this.valorTotal = valorTotal;
    }

    public boolean isPagamentoPix() {
        return pagamentoPix;
    }

    public void setPagamentoPix(boolean pagamentoPix) {
        this.pagamentoPix = pagamentoPix;
    }

    public boolean isPagamentoTransferencia() {
        return pagamentoTransferencia;
    }

    public void setPagamentoTransferencia(boolean pagamentoTransferencia) {
        this.pagamentoTransferencia = pagamentoTransferencia;
    }

    public boolean isPagamentoOutro() {
        return pagamentoOutro;
    }

    public void setPagamentoOutro(boolean pagamentoOutro) {
        this.pagamentoOutro = pagamentoOutro;
    }

    public String getOutroDescricao() {
        return outroDescricao;
    }

    public void setOutroDescricao(String outroDescricao) {
        this.outroDescricao = outroDescricao;
    }

    public String getChavePix() {
        return chavePix;
    }

    public void setChavePix(String chavePix) {
        this.chavePix = chavePix;
    }

    public String getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(String dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public String getLocalData() {
        return localData;
    }

    public void setLocalData(String localData) {
        this.localData = localData;
    }
}
