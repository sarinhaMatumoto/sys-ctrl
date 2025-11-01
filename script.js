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
  const ctx = canvas.getContext("2d")

  // Limpar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Dados de lucro mensal (exemplo)
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]
  const values = [4500, 5200, 4800, 6050, 5800, 6500]

  const padding = 40
  const chartWidth = canvas.width - padding * 2
  const chartHeight = canvas.height - padding * 2
  const maxValue = Math.max(...values)
  const barWidth = chartWidth / months.length - 20

  // Desenhar barras
  values.forEach((value, index) => {
    const barHeight = (value / maxValue) * chartHeight
    const x = padding + index * (chartWidth / months.length) + 10
    const y = canvas.height - padding - barHeight

    // Desenhar barra
    ctx.fillStyle = "#2563eb"
    ctx.fillRect(x, y, barWidth, barHeight)

    // Desenhar valor acima da barra
    ctx.fillStyle = "#1e293b"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`R$ ${value.toLocaleString("pt-BR")}`, x + barWidth / 2, y - 5)

    // Desenhar mês abaixo da barra
    ctx.fillText(months[index], x + barWidth / 2, canvas.height - padding + 20)
  })

  // Desenhar linha base
  ctx.strokeStyle = "#cbd5e1"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, canvas.height - padding)
  ctx.lineTo(canvas.width - padding, canvas.height - padding)
  ctx.stroke()
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
function selectCompany(id) {
  const items = document.querySelectorAll(".company-item")
  items.forEach((item) => item.classList.remove("active"))
  event.currentTarget.classList.add("active")
}

// Delete company
function deleteCompany(id) {
  event.stopPropagation()
  if (confirm("Tem certeza que deseja excluir esta empresa?")) {
    event.currentTarget.closest(".company-item").remove()
    alert("Empresa excluída com sucesso!")
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
    const statusCell = row.cells[3].textContent.toLowerCase()

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
  const status = document.getElementById("equipmentStatus").value
  const expiry = document.getElementById("equipmentExpiry").value
  const certificate = document.getElementById("equipmentCertificate").value
  const value = document.getElementById("equipmentValue").value

  // Validar campos obrigatórios
  if (!name || !id || !patrimony || !value) {
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
    const newRow = tbody.insertRow(0) // Adiciona no início da tabela
    newRow.innerHTML = `
      <td>${id}</td>
      <td>${patrimony}</td>
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
  // Verificar se há equipamentos selecionados (futura implementação com checkboxes)
  alert(
    "Funcionalidade de envio de locação será implementada. Selecione os equipamentos desejados e a empresa destinatária.",
  )
}
