import { useState, useEffect } from 'react'

const vscodeMarketplaceUrl =
  "https://marketplace.visualstudio.com/items?itemName=kobol-lang.kobol-language-support"

function VSCodeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
    </svg>
  )
}

const codeExamples = {
  hello: `PROGRAM Greeter
  VERSION "1.0"

PROCEDURE Main:
  LET name = "World"
  DISPLAY "Hello, {name}!"
END-PROCEDURE`,

  interop: `PROGRAM CustomerReport
  VERSION "1.0"

IMPORT java.time.LocalDate                          -- call any JVM class directly
IMPORT java.time.format.DateTimeFormatter AS DateFmt

DATA:
  today            : DATE
  report-date-str  : TEXT

PROCEDURE Main:
  CALL LocalDate.now GIVING today
  CALL DateFmt.ISO_LOCAL_DATE.format USING today GIVING report-date-str
  DISPLAY "Report generated: {report-date-str}"
END-PROCEDURE`,

  invoice: `PROGRAM InvoiceProcessor
  VERSION "1.0"

RECORD Invoice:
  invoice-id   : INTEGER
  customer     : TEXT(100)
  amount       : MONEY(12.2)
  paid         : BOOLEAN

DATA:
  current-invoice  : Invoice
  total-invoiced   : MONEY(14.2) = 0
  invoice-count    : INTEGER     = 0

DEFINE TAX-RATE : DECIMAL = 8.5

PROCEDURE Main:
  DISPLAY "=== Invoice Processor ==="
  DO ProcessInvoices
  DISPLAY "Processed {invoice-count} invoices"
END-PROCEDURE

PROCEDURE ProcessInvoices:
  FOR EACH inv IN InvoiceFile:
    MOVE inv TO current-invoice
    IF NOT current-invoice.paid:
      DO ApplyTax
      ADD 1 TO invoice-count
    END-IF
  END-FOR
END-PROCEDURE

PROCEDURE ApplyTax:
  LET tax = current-invoice.amount * TAX-RATE / 100
  ADD tax TO current-invoice.amount
END-PROCEDURE`,

  concurrent: `PROCEDURE FetchAllData:
  CONCURRENT:
    DO FetchCustomers
    DO FetchInvoices
    DO FetchPricingRules
  WAIT ALL
  DO BuildReport
END-PROCEDURE`,

  validation: `PROCEDURE ProcessPayment USING amount : MONEY(12,2):
  VALIDATE amount:
    MUST BE > 0
    MUST BE <= 1000000
    MUST BE POSITIVE-DECIMAL
  DISPLAY "Amount validated: {amount}"
END-PROCEDURE`,

  config: `CONFIG:
  db-url        : TEXT    FROM ENV "DB_URL"        REQUIRED
  batch-size    : INTEGER FROM ENV "BATCH_SIZE"    DEFAULT 500
  tax-rate      : DECIMAL FROM ENV "TAX_RATE"      DEFAULT 8.5
  debug-logging : BOOLEAN FROM ENV "DEBUG_LOG"     DEFAULT FALSE`,
}

function CodeBlock({ code, lang = "kobol" }: { code: string; lang?: string }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-clay-300 to-clay-400 rounded-xl opacity-40 blur" />
      <pre className="relative rounded-xl bg-clay-950 p-5 overflow-x-auto text-sm leading-relaxed">
        <code className={`language-${lang} text-clay-100`}>{code}</code>
      </pre>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl sm:text-4xl font-bold text-clay-900 mb-4">
      {children}
    </h2>
  )
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-warm-bg/90 backdrop-blur-md border-b border-clay-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <img src="./logo.svg" alt="Kobol" className="w-8 h-8" />
          <span className="font-bold text-xl text-clay-800" style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.02em' }}>Kobol</span>
        </a>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-6">
            <a href="#why" className="text-clay-700 hover:text-clay-500 transition-colors text-sm font-medium">Why</a>
            <a href="#principles" className="text-clay-700 hover:text-clay-500 transition-colors text-sm font-medium">Principles</a>
            <a href="#install" className="text-clay-700 hover:text-clay-500 transition-colors text-sm font-medium">Install</a>
            <a href="#syntax" className="text-clay-700 hover:text-clay-500 transition-colors text-sm font-medium">Syntax</a>
            <a href="#features" className="text-clay-700 hover:text-clay-500 transition-colors text-sm font-medium">Features</a>
            <a href="#specs" className="text-clay-700 hover:text-clay-500 transition-colors text-sm font-medium">Specs</a>
            <a
              href={vscodeMarketplaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-clay-700 hover:text-clay-500 transition-colors text-sm font-medium"
            >
              VS Code
            </a>
          </div>
          <a
            href="https://github.com/kobol-lang/kobol"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Kobol on GitHub"
            title="View on GitHub"
            className="text-clay-700 hover:text-clay-500 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="text-center max-w-3xl">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-clay-400 rounded-full blur-3xl opacity-20" />
            <img src="./logo.svg" alt="Kobol" className="w-28 h-28 sm:w-36 sm:h-36 relative" />
          </div>
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-clay-900 mb-4" style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.03em' }}>
          Kobol
        </h1>
        <p className="text-xl sm:text-2xl text-clay-600 mb-3 font-medium">
          A Modern COBOL-Inspired Language for the JVM
        </p>
        <p className="text-base sm:text-lg text-clay-500 mb-10 max-w-xl mx-auto">
          English-like readability, decimal precision, JVM-native performance.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#install" className="inline-flex items-center gap-2 bg-clay-500 hover:bg-clay-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-clay-500/25">
            Get Started
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </a>
          <a
            href={vscodeMarketplaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-clay-800 hover:bg-clay-900 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-clay-800/20"
          >
            <VSCodeIcon className="w-5 h-5" />
            VS Code Extension
          </a>
          <a href="#why" className="inline-flex items-center gap-2 border-2 border-clay-300 hover:border-clay-400 text-clay-700 px-6 py-3 rounded-xl font-medium transition-colors">
            Learn More
          </a>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div>
            <div className="text-2xl font-bold text-clay-600">365+</div>
            <div className="text-sm text-clay-400">Tests Passing</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-clay-600">14</div>
            <div className="text-sm text-clay-400">Phases Done</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-clay-600">JVM</div>
            <div className="text-sm text-clay-400">Bytecode Native</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section id="why" className="py-20 sm:py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionTitle>Why Kobol?</SectionTitle>
        <p className="text-clay-600 text-lg leading-relaxed mb-6">
          COBOL's enduring contribution to software is profound — English-like readability,
          data-first structure, and exact decimal arithmetic made business programming accessible
          and reliable. Kobol honors that legacy while bringing those ideas to the modern JVM.
        </p>
        <div className="border-l-4 border-clay-400 bg-clay-50/70 rounded-r-lg px-5 py-4 mb-6 text-sm text-clay-700 leading-relaxed">
          <strong className="text-clay-800">Kobol (with a K) is inspired by COBOL — it is not COBOL.</strong>{" "}
          It is a new, independent language with its own syntax, compiler, and runtime. It is not a
          COBOL dialect, is not source-compatible with COBOL, and is not affiliated with or endorsed
          by any COBOL vendor or standards body. Existing COBOL programs don't run as-is — they need
          to be refitted and rewritten. But because Kobol keeps COBOL's familiar English-like,
          readable style, moving from COBOL to Kobol is far gentler than rewriting in a terse,
          symbol-heavy language.
        </div>
        <p className="text-clay-600 text-lg leading-relaxed mb-6">
          Kobol is a programming language designed for the JVM that values <strong className="text-clay-800">readability
          over brevity</strong>, <strong className="text-clay-800">exact arithmetic</strong>, and
          <strong className="text-clay-800"> data-first structure</strong>. It takes the proven
          ergonomics of COBOL — named conditions, record-oriented I/O, business-prose syntax —
          and rebuilds them on Java 21's virtual threads, sealed classes, and pattern matching.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-warm-panel border border-clay-200 rounded-xl p-6">
            <div className="text-lg font-bold text-clay-600 mb-1">Business-first</div>
            <div className="text-sm text-clay-500">Code reads like specifications, not machinery</div>
          </div>
          <div className="bg-warm-panel border border-clay-200 rounded-xl p-6">
            <div className="text-lg font-bold text-clay-600 mb-1">JVM-native</div>
            <div className="text-sm text-clay-500">Runs anywhere Java runs, full interop</div>
          </div>
          <div className="bg-warm-panel border border-clay-200 rounded-xl p-6">
            <div className="text-lg font-bold text-clay-600 mb-1">Exact by default</div>
            <div className="text-sm text-clay-500">Decimal arithmetic with no silent rounding</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PrinciplesSection() {
  const principles = [
    { title: "Readability over brevity", desc: "Programs should read like business specifications" },
    { title: "Data-first", desc: "Data structures are declared separately from logic" },
    { title: "Exact arithmetic", desc: "Decimal math is the default; no silent float rounding" },
    { title: "Batch-native", desc: "Record-by-record file processing is a first-class pattern" },
    { title: "JVM citizen", desc: "Full Java interoperability; runs anywhere Java runs" },
    { title: "No magic defaults", desc: "Every behavior is explicit and predictable" },
    { title: "Secure by design", desc: "Validation, sensitive-data types, and parameterised SQL" },
    { title: "Concurrency-ready", desc: "CONCURRENT blocks backed by JVM virtual threads" },
    { title: "Built-in testing", desc: "TEST blocks as first-class constructs" },
  ]

  return (
    <section id="principles" className="py-20 sm:py-28 px-4 bg-clay-50/70">
      <div className="max-w-4xl mx-auto">
        <SectionTitle>Core Design Principles</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {principles.map((p) => (
            <div key={p.title} className="bg-warm-panel border border-clay-200 rounded-xl p-5 hover:border-clay-400 transition-colors">
              <div className="font-semibold text-clay-800 mb-1">{p.title}</div>
              <div className="text-sm text-clay-500 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const syntaxTabs = [
  { id: "hello", label: "Hello World", code: codeExamples.hello },
  { id: "interop", label: "Java Interop", code: codeExamples.interop },
  { id: "invoice", label: "Invoice Processor", code: codeExamples.invoice },
] as const

function SyntaxSection() {
  const [active, setActive] = useState<(typeof syntaxTabs)[number]["id"]>("hello")
  const current = syntaxTabs.find((t) => t.id === active) ?? syntaxTabs[0]

  return (
    <section id="syntax" className="py-20 sm:py-28 px-4 bg-clay-50/70">
      <div className="max-w-4xl mx-auto">
        <SectionTitle>Quick Syntax Preview</SectionTitle>
        <p className="text-clay-600 mb-8">
          Programs read like business prose — not like source code. And because Kobol compiles to
          JVM bytecode, any Java class is one <code className="font-mono text-clay-700">IMPORT</code> away.
        </p>

        <div
          role="tablist"
          aria-label="Syntax examples"
          className="flex flex-wrap gap-2 mb-4"
        >
          {syntaxTabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors " +
                (active === tab.id
                  ? "bg-clay-500 text-white shadow-sm shadow-clay-500/25"
                  : "bg-warm-panel border border-clay-200 text-clay-700 hover:border-clay-400")
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
        >
          <CodeBlock code={current.code} />
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionTitle>Key Features</SectionTitle>
        <div className="space-y-12">
          <div>
            <h3 className="text-xl font-semibold text-clay-800 mb-3">Concurrency</h3>
            <p className="text-clay-600 mb-4">Backed by JVM virtual threads — programs look synchronous, run in parallel.</p>
            <CodeBlock code={codeExamples.concurrent} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-clay-800 mb-3">Validation</h3>
            <p className="text-clay-600 mb-4">Declarative constraints with clear error messages.</p>
            <CodeBlock code={codeExamples.validation} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-clay-800 mb-3">Config Section</h3>
            <p className="text-clay-600 mb-4">Separate deployment config from program logic.</p>
            <CodeBlock code={codeExamples.config} />
          </div>
        </div>
      </div>
    </section>
  )
}

function SpecsSection() {
  return (
    <section id="specs" className="py-20 sm:py-28 px-4 bg-clay-50/70">
      <div className="max-w-4xl mx-auto">
        <SectionTitle>Language Specification</SectionTitle>
        <p className="text-clay-600 text-lg mb-8">
          Kobol is a fully-specified language with a complete grammar, type system, and compiler pipeline.
          Here are the core types and structures:
        </p>

        <div className="overflow-hidden rounded-xl border border-clay-200 mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-clay-100 text-clay-800 text-left">
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Default</th>
                <th className="px-5 py-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clay-200 text-clay-600">
              {[
                ["INTEGER, SMALLINT", "0", "Integer types"],
                ["DECIMAL, MONEY", "0", "Exact fixed-point arithmetic (BigDecimal)"],
                ["TEXT, TEXT(n)", '""', "UTF-8 string types"],
                ["BOOLEAN", "FALSE", "Boolean values"],
                ["DATE, TIME, DATETIME", "Current/zero", "Temporal types"],
                ["LIST OF T", "[]", "Generic list"],
                ["MAP OF K TO V", "{}", "Key-value map"],
                ["UUID", "Nil UUID", "RFC 4122 UUID"],
              ].map(([type, def, desc]) => (
                <tr key={type} className="hover:bg-clay-50">
                  <td className="px-5 py-3 font-mono text-clay-800 whitespace-nowrap">{type}</td>
                  <td className="px-5 py-3 font-mono text-clay-500 whitespace-nowrap">{def}</td>
                  <td className="px-5 py-3">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-warm-panel border border-clay-200 rounded-xl p-6">
          <h3 className="font-semibold text-clay-800 mb-2">Script Mode</h3>
          <p className="text-clay-600 text-sm mb-3">No PROGRAM header needed for quick scripts:</p>
          <CodeBlock code={`-- hello.kbl
LET name = "World"
DISPLAY "Hello, {name}!"`} />
        </div>
      </div>
    </section>
  )
}

type OS = "mac" | "windows" | "linux" | "unknown"

function detectOS(): OS {
  if (typeof navigator === "undefined") return "unknown"
  // Prefer the modern, spoofing-resistant hint when present.
  const uaData = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData
  const platform = (uaData?.platform || navigator.platform || "").toLowerCase()
  const ua = navigator.userAgent.toLowerCase()
  if (platform.includes("mac") || ua.includes("mac os")) return "mac"
  if (platform.includes("win") || ua.includes("windows")) return "windows"
  if (platform.includes("linux") || ua.includes("linux")) return "linux"
  return "unknown"
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        })
      }}
      className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-md bg-clay-800/80 text-clay-100 hover:bg-clay-700 transition-colors"
      aria-label="Copy command to clipboard"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

function CommandBlock({ code }: { code: string }) {
  return (
    <div className="relative">
      <pre className="rounded-xl bg-clay-950 p-5 pr-20 overflow-x-auto text-sm leading-relaxed">
        <code className="text-clay-100 font-mono">{code}</code>
      </pre>
      <CopyButton text={code} />
    </div>
  )
}

const installOptions = {
  mac: {
    label: "macOS",
    note: "Install with Homebrew (native binary — no JVM needed to run):",
    code: "brew tap kobol-lang/tap\nbrew install kobol",
    ready: true,
  },
  linux: {
    label: "Linux",
    note: "Install with Homebrew (native binary — no JVM needed to run):",
    code: "brew tap kobol-lang/tap\nbrew install kobol",
    ready: true,
  },
  windows: {
    label: "Windows",
    note: "The winget package is coming soon. Until then, build from source (requires JDK 21+):",
    code: "winget install kobol-lang.kobol   # coming soon",
    ready: false,
  },
} as const

function DownloadSection() {
  const [os, setOs] = useState<OS>("unknown")
  useEffect(() => setOs(detectOS()), [])

  const primaryKey: keyof typeof installOptions =
    os === "windows" ? "windows" : os === "linux" ? "linux" : "mac"
  const primary = installOptions[primaryKey]

  return (
    <section id="install" className="py-20 sm:py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionTitle>Install Kobol</SectionTitle>
        <p className="text-clay-600 text-lg mb-8">
          {os === "unknown"
            ? "Choose your platform below."
            : `Detected ${primary.label} — here's the quickest way to get started.`}
        </p>

        <div className="bg-warm-panel border border-clay-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-semibold text-clay-800">{primary.label}</span>
            {!primary.ready && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-clay-100 text-clay-600">
                coming soon
              </span>
            )}
          </div>
          <p className="text-sm text-clay-600 mb-4">{primary.note}</p>
          <CommandBlock code={primary.ready ? primary.code : installFromSource} />
        </div>

        <div className="bg-warm-panel border border-clay-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-clay-800 mb-2">Build from source</h3>
          <p className="text-sm text-clay-600 mb-4">
            Works on any platform with JDK 21+. Builds the <code className="font-mono">kobol</code> CLI
            and adds it to your PATH:
          </p>
          <CommandBlock code={installFromSource} />
        </div>

        <div className="bg-warm-panel border border-clay-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <VSCodeIcon className="w-5 h-5 text-clay-700" />
            <h3 className="font-semibold text-clay-800">VS Code extension</h3>
          </div>
          <p className="text-sm text-clay-600 mb-4">
            Syntax highlighting and language support for Kobol. Install from the{" "}
            <a
              href={vscodeMarketplaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-clay-600 hover:text-clay-500 underline"
            >
              Visual Studio Marketplace
            </a>
            , or from the Quick Open bar (<code className="font-mono">Ctrl+P</code>):
          </p>
          <CommandBlock code="ext install kobol-lang.kobol-language-support" />
        </div>
      </div>
    </section>
  )
}

const installFromSource =
  "./gradlew :compiler:installLocal   # installs to ~/.kobol/bin\nkobol --version"

function Footer() {
  return (
    <footer className="border-t border-clay-200 bg-clay-50 py-8 px-4">
      <div className="max-w-4xl mx-auto text-center text-clay-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src="./logo.svg" alt="Kobol" className="w-6 h-6" />
          <span className="font-semibold text-clay-700" style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.02em' }}>Kobol</span>
        </div>
        <p>A Modern COBOL-Inspired Language for the JVM</p>
        <p className="mt-1">
          See the full{" "}
          <a href="https://github.com/kobol-lang/kobol" className="text-clay-600 hover:text-clay-500 underline">source code</a>{" "}
          and{" "}
          <a href="https://github.com/kobol-lang/kobol/blob/main/docs/LANGUAGE_SPEC.md" className="text-clay-600 hover:text-clay-500 underline">language spec</a>
          {" "}on GitHub.
        </p>
      </div>
    </footer>
  )
}

function App() {
  return (
    <div className="bg-warm-bg text-clay-800 min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <WhySection />
        <PrinciplesSection />
        <DownloadSection />
        <SyntaxSection />
        <FeaturesSection />
        <SpecsSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
