import { useEffect, useState } from 'react'
import { gerarNotaServicoPdf } from './services/notaServicoApi'

// ── Paleta de cores ────────────────────────────────────────────
const C = {
  ouro:    '#b8963e',
  navy:    '#1a2340',
  bege:    '#f5f0eb',
  bgPag:   '#e8e0d5',
  header:  '#d9d0c4',
  borda:   '#c8bfb0',
  texto:   '#2d2d2d',
  cinza:   '#888',
  branco:  '#ffffff',
}

const EMPRESA_PRESETS = {
  cidadeSatelite: {
    nomeEmpresa: 'Pão de queijo Mania (Cidade Satélite)',
    cnpjCliente: '09.021.332.0003-/99',
    responsavelCliente: 'ELINE RODRIGUES QUEIROZ - LTDA',
  },
  cinturaoVerde: {
    nomeEmpresa: 'Pão de queijo Mania (Cinturão Verde)',
    cnpjCliente: '42.100.203/0001-08',
    responsavelCliente: 'O FINHESTAG LTDA.',
  },
  default: {
    nomeEmpresa: '',
    cnpjCliente: '',
    responsavelCliente: '',
  }
}

// ── Estado inicial do formulário ───────────────────────────────
const estadoInicial = {
  numeroNota:              '001',
  nomePrestadora:          'Amanda Gomes Wanderley',
  cpfCnpjPrestadora:       '788.090.292-91',
  telefonePrestadora:      '(95) 99153-8664',
  emailPrestadora:         'mandiwanderley@gmail.com',
  nomeEmpresa:             '',
  cnpjCliente:             '',
  responsavelCliente:      '',
  periodoInicio:           '',
  periodoFim:              '',
  valorTotal:              '',
  pagamentoPix:            false,
  pagamentoTransferencia:  false,
  pagamentoOutro:          false,
  outroDescricao:          '',
  chavePix:                'mandiwanderley@gmail.com',
  dataVencimento:          '',
  observacoes:             '',
}

const onlyDigits = (value) => value.replace(/\D/g, '')

const formatCpf = (value) => {
  const digits = onlyDigits(value).slice(0, 11)

  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

const formatCnpj = (value) => {
  const digits = onlyDigits(value).slice(0, 14)

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

const formatCpfCnpj = (value) => {
  const digits = onlyDigits(value)
  return digits.length <= 11 ? formatCpf(digits) : formatCnpj(digits)
}

const formatPhone = (value) => {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

const formatCurrency = (value) => {
  const digits = onlyDigits(value).slice(0, 12)

  if (!digits) {
    return ''
  }

  const number = Number(digits) / 100
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}

const formatDateToApi = (value) => {
  if (!value) {
    return ''
  }

  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

const formatCurrentLocationDate = () => {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()

  return `Boa Vista, ${day}/${month}/${year}`
}

export default function App() {
  const [form, setForm]       = useState(estadoInicial)
  const [loading, setLoading] = useState(false)
  const [erros, setErros]     = useState({})
  const [toast, setToast]     = useState(null)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768)
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Atualiza campo texto
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const setMasked = (key, formatter) => e => {
    setForm(f => ({ ...f, [key]: formatter(e.target.value) }))
  }

  // Atualiza checkbox
  const setCheck = key => e => setForm(f => ({ ...f, [key]: e.target.checked }))

  const setEmpresaPreset = (e) => {
    const presetKey = e.target.value
    setEmpresaSelecionada(presetKey)

    if (!presetKey || !EMPRESA_PRESETS[presetKey]) {
      return
    }

    const preset = EMPRESA_PRESETS[presetKey]
    setForm((f) => ({
      ...f,
      nomeEmpresa: preset.nomeEmpresa,
      cnpjCliente: formatCnpj(preset.cnpjCliente),
      responsavelCliente: preset.responsavelCliente,
    }))
  }

  // Exibe toast temporário
  const mostrarToast = (msg, tipo = 'sucesso') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 4000)
  }

  const handleGerar = async () => {
    const novosErros = {}
    if (!form.nomePrestadora.trim())   novosErros.nomePrestadora   = 'Campo obrigatório'
    if (!form.cpfCnpjPrestadora.trim()) novosErros.cpfCnpjPrestadora = 'Campo obrigatório'
    if (!form.nomeEmpresa.trim())      novosErros.nomeEmpresa      = 'Campo obrigatório'

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      mostrarToast('Preencha os campos obrigatórios.', 'erro')
      return
    }

    setErros({})
    setLoading(true)

    try {
      const localDataAtual = formatCurrentLocationDate()
      const payload = {
        ...form,
        periodoInicio: formatDateToApi(form.periodoInicio),
        periodoFim: formatDateToApi(form.periodoFim),
        dataVencimento: formatDateToApi(form.dataVencimento),
        localData: localDataAtual,
      }
      const nomeArquivo = `Nota de Serviço ${form.numeroNota.padStart(3, '0')} - ${form.nomeEmpresa}.pdf`
      await gerarNotaServicoPdf(payload, nomeArquivo)
      mostrarToast('✓ PDF gerado e baixado com sucesso!')
    } catch (err) {
      console.error(err)
      mostrarToast('Erro ao gerar PDF. Tente novamente.', 'erro')
    } finally {
      setLoading(false)
    }
  }

  // ── Estilos reutilizáveis ──────────────────────────────────
  const inputCss = (campo) => ({
    border: 'none',
    borderBottom: `1.5px solid ${erros[campo] ? '#c0392b' : C.borda}`,
    background: 'transparent',
    outline: 'none',
    width: '100%',
    fontSize: 13,
    color: C.texto,
    padding: '4px 2px',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.2s',
  })

  const labelCss = {
    fontSize: 11,
    fontWeight: '600',
    color: C.navy,
    marginBottom: 2,
    display: 'block',
    fontFamily: "'Inter', sans-serif",
  }

  const secaoHeader = (titulo) => (
    <div style={{
      background: C.header,
      padding: '6px 12px',
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: '700',
      fontSize: 15,
      color: C.navy,
      marginBottom: 12,
      marginTop: 6,
    }}>
      {titulo}
    </div>
  )

  const campo = (label, chave, placeholder = '', tipo = 'text') => (
    <div style={{ marginBottom: 10 }}>
      <label style={labelCss}>{label}</label>
      <input
        type={tipo}
        value={form[chave]}
        onChange={set(chave)}
        placeholder={placeholder}
        style={inputCss(chave)}
      />
      {erros[chave] && (
        <span style={{ fontSize: 10, color: '#c0392b', marginTop: 2 }}>
          {erros[chave]}
        </span>
      )}
    </div>
  )

  const localDataAtual = formatCurrentLocationDate()

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      background: C.bgPag,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 16px 80px',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: isMobile ? 12 : 20,
          left: isMobile ? 12 : 'auto',
          background: toast.tipo === 'erro' ? '#c0392b' : C.navy,
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 4,
          fontSize: 13,
          zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          fontFamily: "'Inter', sans-serif",
          borderLeft: `4px solid ${toast.tipo === 'erro' ? '#e74c3c' : C.ouro}`,
          animation: 'fadeIn 0.3s ease',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Título da página */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ color: C.ouro, fontWeight: '600', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
          Gerador de
        </div>
        <h1 style={{
          margin: 0,
          color: C.navy,
          fontSize: 32,
          letterSpacing: 2,
          fontWeight: '700',
          fontFamily: "'Cormorant Garamond', serif",
        }}>
          NOTA DE SERVIÇO
        </h1>
        <div style={{ color: C.cinza, fontSize: 13, fontStyle: 'italic', marginTop: 4, fontFamily: "'Cormorant Garamond', serif" }}>
          Social Media & Gestão de Redes Sociais
        </div>
        <div style={{ width: 60, height: 2, background: C.ouro, margin: '12px auto 0' }} />
      </div>

      {/* Card principal */}
      <div style={{
        background: C.branco,
        width: '100%',
        maxWidth: 780,
        borderRadius: 3,
        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        padding: isMobile ? '24px 18px' : '36px 40px',
        border: `1px solid ${C.borda}`,
      }}>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 12 : 0,
          marginBottom: 8,
        }}>
          <span style={{ color: C.ouro, fontWeight: '700', fontSize: 18, fontFamily: "'Cormorant Garamond', serif", letterSpacing: 1 }}>
            AMANDA GOMES WANDERLEY
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: isMobile ? '100%' : 'auto' }}>
            <span style={{ ...labelCss, margin: 0 }}>Nota de Serviço Nº</span>
            <input
              value={form.numeroNota}
              onChange={e => setForm(f => ({ ...f, numeroNota: onlyDigits(e.target.value).slice(0, 3) }))}
              style={{ ...inputCss(''), width: 60, textAlign: 'center', fontWeight: '700', fontSize: 14 }}
            />
          </div>
        </div>
        <div style={{ borderTop: `2px solid ${C.ouro}`, marginBottom: 24 }} />

        {/* ── Prestadora + Cliente (2 colunas) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 18 : 28,
          marginBottom: 8,
        }}>
          <div>
            {secaoHeader('Prestadora de Serviço:')}
            {campo('Nome *', 'nomePrestadora', 'Seu nome completo', 'Amanda Gomes Wanderley')}
            <div style={{ marginBottom: 10 }}>
              <label style={labelCss}>CPF/CNPJ *</label>
              <input
                value={form.cpfCnpjPrestadora}
                onChange={setMasked('cpfCnpjPrestadora', formatCpfCnpj)}
                placeholder="000.000.000-00"
                inputMode="numeric"
                style={inputCss('cpfCnpjPrestadora')}
              />
              {erros.cpfCnpjPrestadora && (
                <span style={{ fontSize: 10, color: '#c0392b', marginTop: 2 }}>
                  {erros.cpfCnpjPrestadora}
                </span>
              )}
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelCss}>Telefone</label>
              <input
                value={form.telefonePrestadora}
                onChange={setMasked('telefonePrestadora', formatPhone)}
                placeholder="(00) 00000-0000"
                inputMode="numeric"
                style={inputCss('telefonePrestadora')}
              />
            </div>
            {campo('E-mail', 'emailPrestadora', 'email@exemplo.com', 'email')}
          </div>
          <div>
            {secaoHeader('Cliente / Empresa:')}
            <div style={{ marginBottom: 10 }}>
              <label style={labelCss}>Empresa cadastrada</label>
              <select
                value={empresaSelecionada}
                onChange={setEmpresaPreset}
                style={inputCss('nomeEmpresa')}
              >
                <option value="default">Selecione uma empresa</option>
                <option value="cidadeSatelite">{EMPRESA_PRESETS.cidadeSatelite.nomeEmpresa}</option>
                <option value="cinturaoVerde">{EMPRESA_PRESETS.cinturaoVerde.nomeEmpresa}</option>
              </select>
            </div>
            {campo('Nome da Empresa *', 'nomeEmpresa', 'Nome da empresa')}
            <div style={{ marginBottom: 10 }}>
              <label style={labelCss}>CNPJ</label>
              <input
                value={form.cnpjCliente}
                onChange={setMasked('cnpjCliente', formatCnpj)}
                placeholder="00.000.000/0001-00"
                inputMode="numeric"
                style={inputCss('cnpjCliente')}
              />
            </div>
            {campo('Responsável', 'responsavelCliente', 'Nome do responsável')}
          </div>
        </div>

        {secaoHeader('Detalhamento do Serviço')}

        <div style={{
          border: `1px solid ${C.borda}`,
          borderRadius: 2,
          overflow: 'hidden',
          marginBottom: 14,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            background: C.header,
            padding: '7px 14px',
          }}>
            {['Descrição do Serviço', 'Período'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: '700', color: C.navy }}>{h}</span>
            ))}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '2fr 2fr',
            padding: '10px 14px',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ fontSize: 13, color: C.texto }}>
              Gestão de redes sociais (Social Media)
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isMobile ? 'space-between' : 'flex-start',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              gap: 6,
            }}>
              <input type="date" value={form.periodoInicio} onChange={set('periodoInicio')}
                style={{ ...inputCss(''), width: isMobile ? '100%' : 140, fontSize: 11, minWidth: 0 }} />
              <span style={{ color: C.cinza, fontSize: 11 }}>a</span>
              <input type="date" value={form.periodoFim} onChange={set('periodoFim')}
                style={{ ...inputCss(''), width: isMobile ? '100%' : 140, fontSize: 11, minWidth: 0 }} />
            </div>
          </div>
        </div>

        {/* Bullets */}
        <ul style={{ margin: '0 0 16px 0', padding: '0 0 0 4px', listStyle: 'none' }}>
          {[
            'Planejamento de conteúdo para redes sociais',
            'Criação de artes e posts',
            'Publicação e gerenciamento de postagens',
            'Monitoramento de comentários e mensagens',
            'Estratégia de crescimento e engajamento',
          ].map(b => (
            <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, fontSize: 13, color: C.texto }}>
              <span style={{ color: C.ouro, fontSize: 18, lineHeight: 1 }}>•</span>
              {b}
            </li>
          ))}
        </ul>

        <hr style={{ borderColor: C.borda, borderWidth: '0 0 1px', margin: '16px 0' }} />

        {/* ── Resumo Financeiro ── */}
        {secaoHeader('Resumo Financeiro')}

        <div style={{
          display: 'flex',
          alignItems: isMobile ? 'stretch' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 8 : 12,
          marginBottom: 14,
        }}>
          <span style={{ ...labelCss, margin: 0, whiteSpace: 'nowrap' }}>Valor total do serviço:</span>
          <span style={{ fontSize: 13, alignSelf: isMobile ? 'flex-start' : 'auto' }}>R$</span>
          <input value={form.valorTotal} onChange={setMasked('valorTotal', formatCurrency)}
            inputMode="numeric" placeholder="0,00" style={{ ...inputCss(''), maxWidth: isMobile ? '100%' : 140 }} />
        </div>

        <hr style={{ borderColor: C.borda, borderWidth: '0 0 1px', margin: '0 0 14px' }} />

        <div style={{ ...labelCss, marginBottom: 10 }}>Forma de pagamento:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 12 : 24, marginBottom: 14 }}>
          {[
            { key: 'pagamentoPix',           label: 'PIX' },
            { key: 'pagamentoTransferencia', label: 'Transferência' },
          ].map(({ key, label }) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, color: C.texto }}>
              <input type="checkbox" checked={form[key]} onChange={setCheck(key)}
                style={{ accentColor: C.navy, width: 15, height: 15 }} />
              {label}
            </label>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, color: C.texto }}>
            <input type="checkbox" checked={form.pagamentoOutro} onChange={setCheck('pagamentoOutro')}
              style={{ accentColor: C.navy, width: 15, height: 15 }} />
            Outro:
            <input value={form.outroDescricao} onChange={set('outroDescricao')}
              placeholder="especifique" style={{ ...inputCss(''), width: isMobile ? '100%' : 130 }} />
          </label>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 20,
          marginBottom: 8,
        }}>
          {campo('Chave PIX', 'chavePix', 'CPF, e-mail, telefone ou chave aleatória')}
          <div style={{ marginBottom: 10 }}>
            <label style={labelCss}>Data de vencimento</label>
            <input
              type="date"
              value={form.dataVencimento}
              onChange={set('dataVencimento')}
              style={inputCss('dataVencimento')}
            />
          </div>
        </div>

        <hr style={{ borderColor: C.borda, borderWidth: '0 0 1px', margin: '16px 0' }} />

        {/* ── Observações ── */}
        {secaoHeader('Observações')}
        <textarea
          value={form.observacoes}
          onChange={set('observacoes')}
          placeholder="Observações adicionais..."
          rows={3}
          style={{
            width: '100%',
            border: 'none',
            borderBottom: `1.5px solid ${C.borda}`,
            background: 'transparent',
            outline: 'none',
            resize: 'vertical',
            fontSize: 13,
            fontFamily: "'Inter', sans-serif",
            color: C.texto,
            padding: '4px 2px',
            boxSizing: 'border-box',
          }}
        />

        <hr style={{ borderColor: C.borda, borderWidth: '0 0 1px', margin: '20px 0 16px' }} />

        {/* ── Rodapé ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 28,
        }}>
          <div style={{ marginBottom: 10 }}>
            <label style={labelCss}>Local e Data</label>
            <input
              value={localDataAtual}
              readOnly
              style={{ ...inputCss(''), color: C.cinza, cursor: 'default', padding: '8px 0' }}
            />
          </div>
          <div>
            <label style={labelCss}>Assinatura da Prestadora:</label>
            <div style={{ height: 32 }} />
            <div style={{ borderBottom: `1.5px solid ${C.navy}` }} />
          </div>
        </div>

        {/* ── Botão Gerar ── */}
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <button
            onClick={handleGerar}
            disabled={loading}
            style={{
              background: loading ? C.cinza : C.navy,
              color: '#fff',
              border: 'none',
              padding: isMobile ? '15px 24px' : '15px 56px',
              fontSize: 13,
              fontFamily: "'Inter', sans-serif",
              fontWeight: '700',
              letterSpacing: 2,
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              borderRadius: 3,
              boxShadow: loading ? 'none' : '0 4px 20px rgba(26,35,64,0.3)',
              transition: 'all 0.25s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              width: isMobile ? '100%' : 'auto',
              justifyContent: 'center',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = C.ouro }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = C.navy }}
          >
            {loading
              ? <><Spinner /> Gerando PDF...</>
              : <>📄 Gerar Nota de Serviço</>
            }
          </button>
          <div style={{ marginTop: 10, fontSize: 11, color: C.cinza, fontStyle: 'italic' }}>
            * Campos obrigatórios.
          </div>
        </div>
      </div>
    </div>
  )
}

// Spinner simples
function Spinner() {
  return (
    <span style={{
      width: 14, height: 14,
      border: '2px solid rgba(255,255,255,0.4)',
      borderTop: '2px solid #fff',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'spin 0.8s linear infinite',
    }} />
  )
}
