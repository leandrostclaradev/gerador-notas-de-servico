import React from 'react'
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

const colors = {
  ouro: '#b8963e',
  navy: '#1a2340',
  bgPag: '#f5f0eb',
  header: '#d9d0c4',
  borda: '#c8bfb0',
  texto: '#2d2d2d',
  branco: '#ffffff',
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.bgPag,
    padding: 18,
    fontSize: 9,
    color: colors.texto,
    fontFamily: 'Helvetica',
  },
  card: {
    backgroundColor: colors.branco,
    border: `1 solid ${colors.borda}`,
    padding: 18,
  },
  row: {
    flexDirection: 'row',
  },
  between: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: colors.ouro,
    fontSize: 16,
    fontFamily: 'Times-Bold',
  },
  noteLabel: {
    color: colors.navy,
    fontSize: 8,
  },
  separatorGold: {
    borderBottom: `2 solid ${colors.ouro}`,
    marginTop: 8,
    marginBottom: 10,
  },
  separator: {
    borderBottom: `1 solid ${colors.borda}`,
    marginVertical: 10,
  },
  titleWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  preTitle: {
    color: colors.ouro,
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: colors.navy,
    fontSize: 24,
    fontFamily: 'Times-Bold',
    marginBottom: 2,
  },
  subtitle: {
    color: colors.navy,
    fontSize: 10,
    fontFamily: 'Times-Italic',
  },
  twoCols: {
    flexDirection: 'row',
    gap: 16,
  },
  col: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: colors.header,
    color: colors.navy,
    fontFamily: 'Times-Bold',
    fontSize: 11,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  field: {
    marginBottom: 6,
  },
  fieldLabel: {
    color: colors.navy,
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 9,
  },
  serviceTable: {
    border: `1 solid ${colors.borda}`,
    marginBottom: 10,
  },
  serviceHeader: {
    backgroundColor: colors.header,
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  serviceBody: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  serviceDescriptionCol: {
    flex: 2,
    paddingRight: 12,
  },
  servicePeriodCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeaderText: {
    color: colors.navy,
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
  },
  bulletList: {
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletDot: {
    color: colors.ouro,
    width: 10,
    fontSize: 11,
  },
  paymentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 8,
  },
  paymentText: {
    fontSize: 9,
  },
  observations: {
    minHeight: 42,
    marginBottom: 6,
  },
  footerTop: {
    flexDirection: 'row',
    gap: 20,
  },
  signatureLine: {
    borderBottom: `1 solid ${colors.navy}`,
    marginTop: 24,
  },
})

const serviceItems = [
  'Planejamento de conteúdo para redes sociais',
  'Criação de artes e posts',
  'Publicação e gerenciamento de postagens',
  'Monitoramento de comentários e mensagens',
  'Estratégia de crescimento e engajamento',
]

const displayValue = (value, fallback = ' ') => {
  if (!value || String(value).trim() === '') {
    return fallback
  }

  return value
}

const checkbox = (checked) => (checked ? '[X]' : '[ ]')

export function NotaServicoPdfDocument({ dados }) {
  return (
    <Document title={`Nota de Servico ${displayValue(dados.numeroNota, '001')}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <View style={[styles.row, styles.between]}>
            <Text style={styles.logo}>AMANDA GOMES WANDERLEY</Text>
            <Text style={styles.noteLabel}>
              Nota de Servico No {displayValue(dados.numeroNota, '001').padStart(3, '0')}
            </Text>
          </View>

          <View style={styles.separatorGold} />

          <View style={styles.titleWrap}>
            <Text style={styles.preTitle}>Gerador de</Text>
            <Text style={styles.title}>NOTA DE SERVICO</Text>
            <Text style={styles.subtitle}>Social Media & Gestao de Redes Sociais</Text>
          </View>

          <View style={styles.twoCols}>
            <View style={styles.col}>
              <Text style={styles.sectionHeader}>Prestadora de Servico</Text>
              <Field label="Nome" value={dados.nomePrestadora} />
              <Field label="CPF/CNPJ" value={dados.cpfCnpjPrestadora} />
              <Field label="Telefone" value={dados.telefonePrestadora} />
              <Field label="E-mail" value={dados.emailPrestadora} />
            </View>
            <View style={styles.col}>
              <Text style={styles.sectionHeader}>Cliente / Empresa</Text>
              <Field label="Nome da Empresa" value={dados.nomeEmpresa} />
              <Field label="CNPJ" value={dados.cnpjCliente} />
              <Field label="Responsavel" value={dados.responsavelCliente} />
            </View>
          </View>

          <View style={styles.separator} />

          <Text style={styles.sectionHeader}>Detalhamento do Servico</Text>
          <View style={styles.serviceTable}>
            <View style={styles.serviceHeader}>
              <View style={styles.serviceDescriptionCol}>
                <Text style={styles.tableHeaderText}>Descricao do Servico</Text>
              </View>
              <View style={styles.servicePeriodCol}>
                <Text style={styles.tableHeaderText}>Periodo</Text>
              </View>
            </View>
            <View style={styles.serviceBody}>
              <View style={styles.serviceDescriptionCol}>
                <Text>Gestao de redes sociais (Social Media)</Text>
              </View>
              <View style={styles.servicePeriodCol}>
                <Text>{displayValue(formatPeriod(dados.periodoInicio, dados.periodoFim), ' ')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.bulletList}>
            {serviceItems.map((item) => (
              <View key={item} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.separator} />

          <Text style={styles.sectionHeader}>Resumo Financeiro</Text>
          <Field label="Valor total do servico" value={dados.valorTotal ? `R$ ${dados.valorTotal}` : ''} />

          <Text style={[styles.fieldLabel, { marginTop: 4 }]}>Forma de pagamento</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentText}>{checkbox(dados.pagamentoPix)} PIX</Text>
            <Text style={styles.paymentText}>{checkbox(dados.pagamentoTransferencia)} Transferencia</Text>
            <Text style={styles.paymentText}>
              {checkbox(dados.pagamentoOutro)} Outro: {displayValue(dados.outroDescricao, '_______________')}
            </Text>
          </View>

          <View style={styles.twoCols}>
            <View style={styles.col}>
              <Field label="Chave PIX" value={dados.chavePix} />
            </View>
            <View style={styles.col}>
              <Field label="Data de vencimento" value={dados.dataVencimento} />
            </View>
          </View>

          <View style={styles.separator} />

          <Text style={styles.sectionHeader}>Observacoes</Text>
          <View style={styles.observations}>
            <Text>{displayValue(dados.observacoes, ' ')}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.footerTop}>
            <View style={styles.col}>
              <Field label="Local e Data" value={dados.localData} />
            </View>
            <View style={styles.col}>
              <Text style={styles.fieldLabel}>Assinatura da Prestadora</Text>
              <View style={styles.signatureLine} />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

function Field({ label, value }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{displayValue(value)}</Text>
    </View>
  )
}

function formatPeriod(inicio, fim) {
  const hasStart = inicio && inicio.trim()
  const hasEnd = fim && fim.trim()

  if (hasStart && hasEnd) {
    return `${inicio} a ${fim}`
  }

  if (hasStart) {
    return `${inicio} a __/__/____`
  }

  return '__/__/____ a __/__/____'
}
