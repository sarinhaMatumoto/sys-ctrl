// Toggle Notifications
function toggleNotifications() {
  const panel = document.getElementById("notificationsPanel")
  if (panel) {
    panel.classList.toggle("active")
  }
}

// Close notifications when clicking outside
document.addEventListener("click", (event) => {
  const panel = document.getElementById("notificationsPanel")
  const btn = document.querySelector(".notification-btn")

  if (panel && btn && !panel.contains(event.target) && !btn.contains(event.target)) {
    panel.classList.remove("active")
  }
})

if (document.getElementById("statusChart")) {
  drawStatusChart()
}

if (document.getElementById("lucroChart")) {
  drawLucroChart()
}

function drawStatusChart() {
  const canvas = document.getElementById("statusChart")
  const ctx = canvas.getContext("2d")

  // Limpar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const data = [
    { label: "PAGO", value: 45, color: "#2563eb" }, // Azul escuro
    { label: "EM ATRASO", value: 30, color: "#3b82f6" }, // Azul médio
    { label: "PENDENTE", value: 25, color: "#60a5fa" }, // Azul claro
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 120

  let currentAngle = -Math.PI / 2

  // Desenhar cada fatia do gráfico
  data.forEach((item) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI

    // Desenhar fatia
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.closePath()
    ctx.fillStyle = item.color
    ctx.fill()

    // Adicionar borda branca entre fatias
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 3
    ctx.stroke()

    currentAngle += sliceAngle
  })

  // Adicionar círculo branco no centro para efeito donut
  ctx.beginPath()
  ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI)
  ctx.fillStyle = "#ffffff"
  ctx.fill()
}

function drawLucroChart() {
  const canvas = document.getElementById("lucroChart")
  if (!canvas) return

  const ctx = canvas.getContext("2d")

  // Limpar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Dados das empresas com valores de locação
  const companies = [
    { name: "DEZ EMERG.", value: 670 },
    { name: "ASSOC. HOSP.", value: 5208 },
    { name: "SANTA CASA", value: 1800 },
    { name: "ONKO", value: 652 },
    { name: "RADIOLOGIA", value: 670 },
    { name: "JOSUÉ LOLLI", value: 1600 },
    { name: "HOSP. 12 OUT.", value: 900 },
    { name: "DEZ EMERG. (2)", value: 19020 },
    { name: "BEATRIZ RIZZO", value: 1200 },
    { name: "A.L. MARQUES", value: 2500 },
  ]

  const padding = 60
  const chartWidth = canvas.width - padding * 2
  const chartHeight = canvas.height - padding * 2
  const maxValue = Math.max(...companies.map((c) => c.value))
  const barWidth = chartWidth / companies.length - 15

  // Desenhar barras
  companies.forEach((company, index) => {
    const barHeight = (company.value / maxValue) * chartHeight
    const x = padding + index * (chartWidth / companies.length) + 7
    const y = canvas.height - padding - barHeight

    // Desenhar barra com gradiente
    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
    gradient.addColorStop(0, "#3b82f6")
    gradient.addColorStop(1, "#2563eb")
    ctx.fillStyle = gradient
    ctx.fillRect(x, y, barWidth, barHeight)

    // Desenhar valor acima da barra
    ctx.fillStyle = "#1e293b"
    ctx.font = "bold 11px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`R$ ${company.value.toLocaleString("pt-BR")}`, x + barWidth / 2, y - 5)

    // Desenhar nome da empresa abaixo da barra (rotacionado)
    ctx.save()
    ctx.translate(x + barWidth / 2, canvas.height - padding + 15)
    ctx.rotate(-Math.PI / 4)
    ctx.font = "10px Arial"
    ctx.textAlign = "right"
    ctx.fillStyle = "#475569"
    ctx.fillText(company.name, 0, 0)
    ctx.restore()
  })

  // Desenhar linha base
  ctx.strokeStyle = "#cbd5e1"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(padding, canvas.height - padding)
  ctx.lineTo(canvas.width - padding, canvas.height - padding)
  ctx.stroke()

  // Desenhar linhas de grade horizontais
  const gridLines = 5
  for (let i = 0; i <= gridLines; i++) {
    const y = canvas.height - padding - (chartHeight / gridLines) * i
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(canvas.width - padding, y)
    ctx.stroke()

    // Desenhar valores no eixo Y
    const value = (maxValue / gridLines) * i
    ctx.fillStyle = "#64748b"
    ctx.font = "10px Arial"
    ctx.textAlign = "right"
    ctx.fillText(`R$ ${Math.round(value).toLocaleString("pt-BR")}`, padding - 10, y + 4)
  }
}

function showChart(type) {
  const statusContainer = document.getElementById("statusChartContainer")
  const lucroContainer = document.getElementById("lucroChartContainer")
  const statusBtn = document.getElementById("statusChartBtn")
  const lucroBtn = document.getElementById("lucroChartBtn")

  if (type === "status") {
    statusContainer.style.display = "flex"
    lucroContainer.style.display = "none"
    statusBtn.classList.add("active")
    lucroBtn.classList.remove("active")
  } else {
    statusContainer.style.display = "none"
    lucroContainer.style.display = "flex"
    statusBtn.classList.remove("active")
    lucroBtn.classList.add("active")
  }
}

function toggleLucroTable(type) {
  const section = document.getElementById("lucroTablesSection")
  const brutoTable = document.getElementById("lucroBrutoTable")
  const liquidoTable = document.getElementById("lucroLiquidoTable")

  if (!section) return

  // Se a seção está oculta, mostra ela
  if (section.style.display === "none") {
    section.style.display = "block"
  }

  // Mostra ambas as tabelas lado a lado
  brutoTable.style.display = "block"
  liquidoTable.style.display = "block"

  // Se clicar no mesmo card novamente, esconde as tabelas
  const isVisible = section.style.display === "block"
  if (isVisible) {
    // Scroll suave até as tabelas
    section.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }
}

// Filter functionality
const searchInput = document.getElementById("searchInput")
const statusFilter = document.getElementById("statusFilter")
const periodFilter = document.getElementById("periodFilter")
const tableBody = document.getElementById("rentalsTableBody")

if (searchInput && tableBody) {
  searchInput.addEventListener("input", filterTable)
}

if (statusFilter) {
  statusFilter.addEventListener("change", filterTable)
}

if (periodFilter) {
  periodFilter.addEventListener("change", filterTable)
}

function filterTable() {
  if (!tableBody) return

  const searchTerm = searchInput ? searchInput.value.toLowerCase() : ""
  const statusValue = statusFilter ? statusFilter.value.toLowerCase() : ""
  const rows = tableBody.getElementsByTagName("tr")

  Array.from(rows).forEach((row) => {
    const company = row.cells[0].textContent.toLowerCase()
    const status = row.cells[4].textContent.toLowerCase()

    const matchesSearch = company.includes(searchTerm)
    const matchesStatus = !statusValue || status.includes(statusValue)

    if (matchesSearch && matchesStatus) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  })
}

// Company selection
function selectCompany(event) {
  const items = document.querySelectorAll(".company-item")
  items.forEach((item) => {
    item.classList.remove("active")
    const deleteBtn = item.querySelector(".btn-delete")
    if (deleteBtn) {
      deleteBtn.style.display = "none"
    }
  })

  event.currentTarget.classList.add("active")
  const deleteBtn = event.currentTarget.querySelector(".btn-delete")
  if (deleteBtn) {
    deleteBtn.style.display = "inline"
  }

  const companyItem = event.currentTarget

  // Atualizar detalhes da empresa
  document.getElementById("detailName").textContent = companyItem.getAttribute("data-name")
  document.getElementById("detailAddress").textContent = companyItem.getAttribute("data-address")
  document.getElementById("detailContact").textContent = companyItem.getAttribute("data-contact")
  document.getElementById("detailPhone").textContent = companyItem.getAttribute("data-phone")
  document.getElementById("detailEmail").textContent = companyItem.getAttribute("data-email")
  document.getElementById("detailContract").textContent = companyItem.getAttribute("data-contract")

  // Atualizar itens alocados
  const itemsList = document.getElementById("itemsList")
  const itemsData = JSON.parse(companyItem.getAttribute("data-items") || "[]")

  itemsList.innerHTML = ""
  let total = 0

  itemsData.forEach((item) => {
    const itemRow = document.createElement("div")
    itemRow.className = "item-row"

    const itemName = document.createElement("span")
    itemName.textContent = item.name

    const itemValue = document.createElement("span")
    itemValue.className = "item-value"
    const value = Number.parseFloat(item.value)
    itemValue.textContent = `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    itemRow.appendChild(itemName)
    itemRow.appendChild(itemValue)
    itemsList.appendChild(itemRow)

    total += value
  })

  // Atualizar valor total
  document.getElementById("totalValue").textContent =
    `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Delete company
function deleteCompany(event) {
  event.stopPropagation()
  if (confirm("Tem certeza que deseja deletar esta locação?")) {
    event.currentTarget.closest(".company-item").remove()
    alert("Locação deletada com sucesso!")
  }
}

const equipmentSearch = document.getElementById("equipmentSearch")
const equipmentStatusFilter = document.getElementById("equipmentStatusFilter")
const equipmentsTableBody = document.getElementById("equipmentsTableBody")

if (equipmentStatusFilter && equipmentsTableBody) {
  equipmentStatusFilter.addEventListener("change", filterEquipments)
}

if (equipmentSearch && equipmentsTableBody) {
  equipmentSearch.addEventListener("input", filterEquipments)
}

function filterEquipments() {
  if (!equipmentsTableBody) return

  const searchTerm = equipmentSearch ? equipmentSearch.value.toLowerCase() : ""
  const statusValue = equipmentStatusFilter ? equipmentStatusFilter.value.toLowerCase() : ""
  const rows = equipmentsTableBody.getElementsByTagName("tr")

  Array.from(rows).forEach((row) => {
    const patrimony = row.cells[1].textContent.toLowerCase()
    const equipment = row.cells[2].textContent.toLowerCase()
    const statusCell = row.cells[4].textContent.toLowerCase()

    const normalizeText = (text) => {
      return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
    }

    const normalizedStatus = normalizeText(statusCell)
    const normalizedFilter = normalizeText(statusValue)

    const matchesSearch = patrimony.includes(searchTerm) || equipment.includes(searchTerm)
    const matchesStatus = !statusValue || normalizedStatus.includes(normalizedFilter)

    if (matchesSearch && matchesStatus) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  })
}

// Equipment Modal
function openEquipmentModal() {
  const modal = document.getElementById("equipmentModal")
  if (modal) {
    modal.classList.add("active")
    // Limpar campos do formulário
    document.getElementById("equipmentName").value = ""
    document.getElementById("equipmentId").value = ""
    document.getElementById("equipmentPatrimony").value = ""
    document.getElementById("equipmentExpiry").value = ""
    document.getElementById("equipmentCertificate").value = ""
    document.getElementById("equipmentValue").value = ""
  }
}

function closeEquipmentModal() {
  const modal = document.getElementById("equipmentModal")
  if (modal) {
    modal.classList.remove("active")
  }
}

function saveEquipment() {
  const name = document.getElementById("equipmentName").value
  const id = document.getElementById("equipmentId").value
  const patrimony = document.getElementById("equipmentPatrimony").value
  const serial = document.getElementById("equipmentSerial").value
  const status = document.getElementById("equipmentStatus").value
  const expiry = document.getElementById("equipmentExpiry").value
  const certificate = document.getElementById("equipmentCertificate").value
  const value = document.getElementById("equipmentValue").value

  // Validar campos obrigatórios
  if (!name || !id || !patrimony || !serial || !value) {
    alert("Por favor, preencha todos os campos obrigatórios!")
    return
  }

  // Formatar data de vencimento
  let formattedExpiry = "00/00/0000"
  if (expiry) {
    const date = new Date(expiry)
    formattedExpiry = date.toLocaleDateString("pt-BR")
  }

  // Formatar certificado ou usar N/A
  const formattedCertificate = certificate || "N/A"

  // Mapear status para classe CSS
  const statusClass = `status-${status}`
  const statusText = status.charAt(0).toUpperCase() + status.slice(1)

  // Adicionar nova linha na tabela
  const tbody = document.getElementById("equipmentsTableBody")
  if (tbody) {
    const newRow = tbody.insertRow(0)
    newRow.innerHTML = `
      <td>${id}</td>
      <td>${patrimony}</td>
      <td>${serial}</td>
      <td>${name}</td>
      <td><span class="status-badge ${statusClass}">${statusText}</span></td>
      <td>${formattedExpiry}</td>
      <td>${formattedCertificate}</td>
      <td>${value}</td>
    `

    // Destacar nova linha temporariamente
    newRow.style.backgroundColor = "#dbeafe"
    setTimeout(() => {
      newRow.style.backgroundColor = ""
    }, 2000)
  }

  alert("Equipamento salvo com sucesso!")
  closeEquipmentModal()
}

// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("active")
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove("active")
  }
}

// Close modal when clicking outside
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.classList.remove("active")
  }
})

// Company search
const companySearch = document.getElementById("companySearch")
if (companySearch) {
  companySearch.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase()
    const companies = document.querySelectorAll(".company-item")

    companies.forEach((company) => {
      const name = company.querySelector(".company-name").textContent.toLowerCase()
      if (name.includes(searchTerm)) {
        company.style.display = ""
      } else {
        company.style.display = "none"
      }
    })
  })
}

function sendRental() {
  alert(
    "Funcionalidade de envio de locação será implementada. Selecione os equipamentos desejados e a empresa destinatária.",
  )
}
